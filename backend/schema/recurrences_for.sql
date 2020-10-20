-- recurrences_for
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
  recurrences_start DATE := COALESCE(evt.startsAt::date, evt.startsOn);
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
          COALESCE(evt.ends_at::date, evt.endsOn),
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
$BODY$;
