-- When the users come to our home page, they are going to see a list of
-- properties. They will be able to view the properties and filter them by
-- location. They will be able to see all data about the property, including
-- the average rating.
--
--
-- Note: Although users will need to see a lot of data from the properties
-- table on the website, for now, we're going to build this query by selecting
-- just a few columns. That way it's easy to see in the terminal. Later we'll
-- use this query in our app and alter it slightly to select more columns.
--
--
-- Show specific details about properties located in Vancouver including their
-- average rating.
--
-- * Select the id, title, cost_per_night, and an average_rating from the
--   properties table for properties located in Vancouver.
-- * Order the results from lowest cost_per_night to highest cost_per_night.
-- * Limit the number of results to 10.
-- * Only show listings that have a rating >= 4 stars.
--
--
-- Tips:
-- To build this incrementally, you can start by getting all properties without
-- the average rating first.
--
-- You may get the following message when trying to build this query:
--
--     ERROR: column reference "id" is ambiguous
--
-- If so, you'll need to specify from which table you want the id.
--
--
-- Expected result (Again, your id numbers may differ, and you may have more
-- than 4 rows if you added your own data where the city is equal to Vancouver):
--
--  id  |       title        | cost_per_night |   average_rating
-- -----+--------------------+----------------+--------------------
--  224 | Nature bite        |          10526 | 4.1000000000000000
--  197 | Build they         |          34822 | 4.1000000000000000
--   47 | Aside age          |          35421 | 4.2500000000000000
--  149 | Present television |          53062 | 4.2222222222222222
-- (4 rows)


SELECT
  properties.id,
  title,
  cost_per_night,
  AVG(property_reviews.rating) AS average_rating
FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE city LIKE '%ancouver'
GROUP BY properties.id
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;