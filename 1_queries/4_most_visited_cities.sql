-- MOST VISITED CITIES
--
-- Our product managers want a query to see a list of the most visited cities.
--
--    Get a list of the most visited cities.
--
-- * Select the name of the city and the number of reservations for that city.
-- * Order the results from highest number of reservations to lowest number
-- * of reservations.
--
-- Expected result:
--
--
--        city        | total_reservations
-- -------------------+--------------------
--  Carcross          |                405
--  Town of Hay River |                379
--  Whitehorse        |                376
--  Town of Inuvik    |                298
--  Yellowknife       |                257
--  (251 rows)

SELECT
  properties.city,
  COUNT(reservations.*) AS total_reservations
FROM reservations
  JOIN properties ON reservations.property_id = properties.id
GROUP BY properties.city
ORDER BY total_reservations DESC;