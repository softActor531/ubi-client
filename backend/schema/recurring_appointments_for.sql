-- recurring_appointments_for
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
$BODY$;
