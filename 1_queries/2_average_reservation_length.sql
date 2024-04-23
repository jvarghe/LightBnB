-- Our product managers want a query to see the average duration of a
-- reservation. Get the average duration of all reservations.
SELECT
  AVG(reservations.end_date - reservations.start_date)
  AS average_reservation_duration
FROM reservations;