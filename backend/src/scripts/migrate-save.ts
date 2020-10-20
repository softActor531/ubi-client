import {MigrationInterface, QueryRunner} from "typeorm";

const days_in_month = `-- days_in_month
CREATE OR REPLACE FUNCTION  days_in_month(
  check_date DATE
)
  RETURNS INT
  LANGUAGE plpgsql IMMUTABLE
  AS $BODY$
DECLARE
  first_of_month DATE := check_date - ((extract(day from check_date) - 1)||' days')::interval;
BEGIN
  RETURN extract(day from first_of_month + '1 month'::interval - first_of_month);
END;
$BODY$;`

const generate_recurrences = `-- generate_recurrences
CREATE OR REPLACE FUNCTION  generate_recurrences(
  duration INTERVAL,
  original_start_date DATE,
  original_end_date DATE,
  range_start DATE,
  range_end DATE,
  repeat_month INT,
  repeat_week INT,
  repeat_day INT
)
  RETURNS setof DATE
  LANGUAGE plpgsql IMMUTABLE
  AS $BODY$
DECLARE
  start_date DATE := original_start_date;
  next_date DATE;
  intervals INT := FLOOR(intervals_between(original_start_date, range_start, duration));
  current_month INT;
  current_week INT;
BEGIN
  IF repeat_month IS NOT NULL THEN
    start_date := start_date + (((12 + repeat_month - cast(extract(month from start_date) as int)) % 12) || ' months')::interval;
  END IF;
  IF repeat_week IS NULL AND repeat_day IS NOT NULL THEN
    IF duration = '7 days'::interval THEN
      start_date := start_date + (((7 + repeat_day - cast(extract(dow from start_date) as int)) % 7) || ' days')::interval;
    ELSE
      start_date := start_date + (repeat_day - extract(day from start_date) || ' days')::interval;
    END IF;
  END IF;
  LOOP
    next_date := start_date + duration * intervals;
    IF repeat_week IS NOT NULL AND repeat_day IS NOT NULL THEN
      current_month := extract(month from next_date);
      next_date := next_date + (((7 + repeat_day - cast(extract(dow from next_date) as int)) % 7) || ' days')::interval;
      IF extract(month from next_date) != current_month THEN
        next_date := next_date - '7 days'::interval;
      END IF;
      IF repeat_week > 0 THEN
        current_week := CEIL(extract(day from next_date) / 7);
      ELSE
        current_week := -CEIL((1 + days_in_month(next_date) - extract(day from next_date)) / 7);
      END IF;
      next_date := next_date + (repeat_week - current_week) * '7 days'::interval;
    END IF;
    EXIT WHEN next_date > range_end;

    IF next_date >= range_start AND next_date >= original_start_date THEN
      RETURN NEXT next_date;
    END IF;

    if original_end_date IS NOT NULL AND range_start >= original_start_date + (duration*intervals) AND range_start <= original_end_date + (duration*intervals) THEN
      RETURN NEXT next_date;
    END IF;
    intervals := intervals + 1;
  END LOOP;
END;
$BODY$;`

const interval_for = `-- interval_for
CREATE OR REPLACE FUNCTION  interval_for(
  recurs appointment_frequency_enum
)
  RETURNS INTERVAL
  LANGUAGE plpgsql IMMUTABLE
  AS $BODY$
BEGIN
  IF recurs = 'daily' THEN
    RETURN '1 day'::interval;
  ELSIF recurs = 'weekly' THEN
    RETURN '7 days'::interval;
  ELSIF recurs = 'monthly' THEN
    RETURN '1 month'::interval;
  ELSIF recurs = 'yearly' THEN
    RETURN '1 year'::interval;
  ELSE
    RAISE EXCEPTION 'Recurrence % not supported by generate_recurrences()', recurs;
  END IF;
END;
$BODY$;`

const intervals_between = `-- intervals_between
CREATE OR REPLACE FUNCTION  intervals_between(
  start_date DATE,
  end_date DATE,
  duration INTERVAL
)
  RETURNS FLOAT
  LANGUAGE plpgsql IMMUTABLE
  AS $BODY$
DECLARE
  count FLOAT := 0;
  multiplier INT := 512;
BEGIN
  IF start_date > end_date THEN
    RETURN 0;
  END IF;
  LOOP
    WHILE start_date + (count + multiplier) * duration < end_date LOOP
      count := count + multiplier;
    END LOOP;
    EXIT WHEN multiplier = 1;
    multiplier := multiplier / 2;
  END LOOP;
  count := count + (extract(epoch from end_date) - extract(epoch from (start_date + count * duration))) / (extract(epoch from end_date + duration) - extract(epoch from end_date))::int;
  RETURN count;
END
$BODY$;`

const recurrences_for = `-- recurrences_for
CREATE OR REPLACE FUNCTION recurrences_for(
  evt appointment,
  range_start TIMESTAMP,
  range_end  TIMESTAMP
)
  RETURNS SETOF DATE
  LANGUAGE plpgsql STABLE
  AS $BODY$
DECLARE
  recurrence appointment_recurrence;
  recurrences_start DATE := COALESCE(evt.starts_at::date, evt.starts_on);
  recurrences_end DATE := range_end;
  duration INTERVAL := interval_for(evt.frequency) * evt.separation;
  next_date DATE;
BEGIN
  IF evt.until IS NOT NULL AND evt.until < recurrences_end THEN
    recurrences_end := evt.until;
  END IF;
  IF evt.count IS NOT NULL AND recurrences_start + (evt.count - 1) * duration < recurrences_end THEN
    recurrences_end := recurrences_start + (evt.count - 1) * duration;
  END IF;

  FOR recurrence IN
    SELECT appointment_recurrence.*
      FROM (SELECT NULL) AS foo
      LEFT JOIN appointment_recurrence
        ON appointmentId = evt.id
  LOOP
    FOR next_date IN
      SELECT *
        FROM generate_recurrences(
          evt.frequency,
          duration,
          recurrences_start,
          COALESCE(evt.ends_at::date, evt.ends_on),
          range_start::date,
          recurrences_end,
          recurrence.month,
          recurrence.week,
          recurrence.day
        )
    LOOP
      RETURN NEXT next_date;
    END LOOP;
  END LOOP;
  RETURN;
END;
$BODY$;`

const recurring_appointments_for = `-- recurring_appointments_for
CREATE OR REPLACE FUNCTION recurring_appointments_for(
  range_start TIMESTAMP,
  range_end  TIMESTAMP,
  time_zone CHARACTER VARYING,
  appointments_limit INT
)
  RETURNS SETOF appointment
  LANGUAGE plpgsql STABLE
  AS $BODY$
DECLARE
  evt appointment;
  original_date DATE;
  original_date_in_zone DATE;
  start_time TIME;
  start_time_in_zone TIME;
  next_date DATE;
  next_time_in_zone TIME;
  duration INTERVAL;
  time_offset INTERVAL;
  recurrences_start DATE := CASE WHEN (timezone('UTC', range_start) AT TIME ZONE time_zone) < range_start THEN (timezone('UTC', range_start) AT TIME ZONE time_zone)::date ELSE range_start END;
  recurrences_end DATE := CASE WHEN (timezone('UTC', range_end) AT TIME ZONE time_zone) > range_end THEN (timezone('UTC', range_end) AT TIME ZONE time_zone)::date ELSE range_end END;
BEGIN
  FOR evt IN
    SELECT *
      FROM appointment
      WHERE
        frequency <> 'once' OR
        (frequency = 'once' AND
          ((starts_on IS NOT NULL AND ends_on IS NOT NULL AND starts_on <= (timezone('UTC', range_end) AT TIME ZONE time_zone)::date AND ends_on >= (timezone('UTC', range_start) AT TIME ZONE time_zone)::date) OR
           (starts_on IS NOT NULL AND starts_on <= (timezone('UTC', range_end) AT TIME ZONE time_zone)::date AND starts_on >= (timezone('UTC', range_start) AT TIME ZONE time_zone)::date) OR
           (starts_at <= range_end AND ends_at >= range_start)))
  LOOP
    IF evt.frequency = 'once' THEN
      RETURN NEXT evt;
      CONTINUE;
    END IF;

    -- All-day evt
    IF evt.starts_on IS NOT NULL AND evt.ends_on IS NULL THEN
      original_date := evt.starts_on;
      duration := '1 day'::interval;
    -- Multi-day evt
    ELSIF evt.starts_on IS NOT NULL AND evt.ends_on IS NOT NULL THEN
      original_date := evt.starts_on;
      duration := timezone(time_zone, evt.ends_on) - timezone(time_zone, evt.starts_on);
    -- Timespan evt
    ELSE
      original_date := evt.starts_at::date;
      original_date_in_zone := (timezone('UTC', evt.starts_at) AT TIME ZONE evt.timezone)::date;
      start_time := evt.starts_at::time;
      start_time_in_zone := (timezone('UTC', evt.starts_at) AT time ZONE evt.timezone)::time;
      duration := evt.ends_at - evt.starts_at;
    END IF;

    IF evt.count IS NOT NULL THEN
      recurrences_start := original_date;
    END IF;

    FOR next_date IN
      SELECT occurrence
        FROM (
          SELECT * FROM recurrences_for(evt, recurrences_start, recurrences_end) AS occurrence
          UNION SELECT original_date
          ORDER BY occurrence
          LIMIT evt.count
        ) AS occurrences
        WHERE
          occurrence::date <= recurrences_end AND
          (occurrence + duration)::date >= recurrences_start AND
          occurrence NOT IN (SELECT date FROM appointment_cancellation WHERE appointmentId = evt.id)
        LIMIT appointments_limit
    LOOP
      -- All-day evt
      IF evt.starts_on IS NOT NULL AND evt.ends_on IS NULL THEN
        CONTINUE WHEN next_date < (timezone('UTC', range_start) AT TIME ZONE time_zone)::date OR next_date > (timezone('UTC', range_end) AT TIME ZONE time_zone)::date;
        evt.starts_on := next_date;

      -- Multi-day evt
      ELSIF evt.starts_on IS NOT NULL AND evt.ends_on IS NOT NULL THEN
        evt.starts_on := next_date;
        CONTINUE WHEN evt.starts_on > (timezone('UTC', range_end) AT TIME ZONE time_zone)::date;
        evt.ends_on := next_date + duration;
        CONTINUE WHEN evt.ends_on < (timezone('UTC', range_start) AT TIME ZONE time_zone)::date;

      -- Timespan evt
      ELSE
        next_time_in_zone := (timezone('UTC', (next_date + start_time)) at time zone evt.timezone)::time;
        time_offset := (original_date_in_zone + next_time_in_zone) - (original_date_in_zone + start_time_in_zone);
        evt.starts_at := next_date + start_time - time_offset;

        CONTINUE WHEN evt.starts_at > range_end;
        evt.ends_at := evt.starts_at + duration;
        CONTINUE WHEN evt.ends_at < range_start;
      END IF;

      RETURN NEXT evt;
    END LOOP;
  END LOOP;
  RETURN;
END;
$BODY$;`

export class recurringScripts1594962448045 implements MigrationInterface {
    name = 'recurringScripts1594962448045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(days_in_month, undefined);
        await queryRunner.query(generate_recurrences, undefined);
        await queryRunner.query(interval_for, undefined);
        await queryRunner.query(intervals_between, undefined);
        await queryRunner.query(recurrences_for, undefined);
        await queryRunner.query(recurring_appointments_for, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION recurring_appointments_for(range_start TIMESTAMP, range_end TIMESTAMP, time_zone CHARACTER VARYING, appointments_limit INT)`, undefined);
        await queryRunner.query(`DROP FUNCTION recurrences_for(evt appointment, range_start TIMESTAMP, range_end TIMESTAMP)`, undefined);
        await queryRunner.query(`DROP FUNCTION intervals_between(start_date DATE, end_date DATE, duration INTERVAL)`, undefined);
        await queryRunner.query(`DROP FUNCTION interval_for(recurs appointment_frequency_enum)`, undefined);
        await queryRunner.query(`DROP FUNCTION generate_recurrences(frequency VARCHAR, duration INTERVAL, original_start_date DATE, original_end_date DATE, range_start DATE, range_end DATE, repeat_month INT, repeat_week INT, repeat_day INT)`, undefined);
        await queryRunner.query(`DROP FUNCTION days_in_month(check_date DATE)`, undefined);
    }
}
