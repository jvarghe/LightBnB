-- ALL MY RESERVATIONS
--
-- When a user is logged in, they will have an option to view all of their
-- reservations. This page will show details about a reservation and details
-- about the property associated with the reservation.
--
--
-- Note
-- Although users will need to see a lot of data from the reservations table
-- on the website, for now, we're going to build this query by selecting just
-- a few columns. That way it's easy to see in the terminal. Later we'll use
-- this query in our app and alter it slightly to select more columns.
--
--
-- Instruction
-- Show all reservations for a user.
--
--
-- * Select the reservation id, property title, reservation start_date, property
--   cost_per_night and the average rating of the property. You'll need data
--   from both the reservations and properties tables.
--
-- * The reservations will be for a single user, so just use 1 for the user_id.
-- * Order the results from the earliest start_date to the most recent
--   start_date.
-- * Limit the results to 10.
--
--
-- Below is the expected result for our user with the id of 1 in our dataset.
-- (It's the user with the email address tristanjacobs@gmail.com in our
-- database). Remember that your results may differ if you added your own
-- reservations that are associated with a different user whose id is 1):
--
--
--     id   |      title      | cost_per_night | start_date |   average_rating
-- ---------+-----------------+----------------+------------+--------------------
--  1017016 | Apple barn      |          79787 | 2014-05-17 | 4.1666666666666667
--  1010127 | Piano principle |          16669 | 2014-08-17 | 3.7777777777777778
--  1012625 | Bow forest      |          13562 | 2015-07-30 | 4.2727272727272727
--  1013921 | Down observe    |          36117 | 2016-05-11 | 4.2857142857142857
--  1010623 | Like arrow      |          92451 | 2016-07-08 | 4.1666666666666667
--  1011691 | You weight      |          11459 | 2017-07-01 | 3.8333333333333333
--  1015180 | Bank rest       |          32800 | 2019-07-23 | 4.0000000000000000
--  1019776 | Also additional |          44391 | 2019-12-20 | 4.4666666666666667
--  1014540 | Boat list       |          75355 | 2020-11-28 | 3.4285714285714286
--  1016099 | Series cow      |          13497 | 2021-02-22 | 3.3333333333333333
-- (10 rows)



-- OFFICIAL ANSWER
-- This answer returns the expected result.
--
--
-- SELECT reservations.id,
--   properties.title,
--   properties.cost_per_night,
--   reservations.start_date,
--   avg(rating) as average_rating
-- FROM reservations
--   JOIN properties ON reservations.property_id = properties.id
--   JOIN property_reviews ON properties.id = property_reviews.property_id
-- WHERE reservations.guest_id = 1
-- GROUP BY properties.id,
--   reservations.id
-- ORDER BY reservations.start_date
-- LIMIT 10;



-- MY ORIGINAL ANSWER
-- This one joins tables in a different order than the official answer or my
-- modified answer, but the results are different. See below. I don't understand
-- why an almost identical query returns totally different results based on
-- table join order.
--
--    id    |      title      | cost_per_night | start_date | average_property_rating
-- ---------+-----------------+----------------+------------+-------------------------
--  1017016 | Apple barn      |          79787 | 2014-05-17 |      4.0000000000000000
--  1010127 | Piano principle |          16669 | 2014-08-17 |      4.0000000000000000
--  1013921 | Down observe    |          36117 | 2016-05-11 |      5.0000000000000000
--  1011691 | You weight      |          11459 | 2017-07-01 |      3.0000000000000000
--  1019776 | Also additional |          44391 | 2019-12-20 |      4.6666666666666667
--  1016099 | Series cow      |          13497 | 2021-02-22 |      3.0000000000000000
--  1019822 | Herself cow     |          82362 | 2022-09-15 |      4.2500000000000000
-- (7 rows)

-- SELECT
--   reservations.id,
--   properties.title,
--   properties.cost_per_night,
--   reservations.start_date,
--   AVG(property_reviews.rating) AS average_property_rating
-- FROM properties
--   JOIN reservations ON reservations.property_id = properties.id
--   JOIN property_reviews ON property_reviews.reservation_id = reservations.id
-- WHERE reservations.guest_id = 1
-- GROUP BY properties.id, reservations.id
-- ORDER BY reservations.start_date
-- LIMIT 10;



-- MY MODIFIED ANSWER
--
-- This one also seems to return the expected result.
--
SELECT
  reservations.id,
  properties.title,
  properties.cost_per_night,
  reservations.start_date,
  AVG(property_reviews.rating) AS average_property_rating
FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;