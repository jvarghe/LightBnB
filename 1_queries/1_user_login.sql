-- When a user logs in, we will need to get all of their details to compare
-- their email and password, and to show them a customized home page. Get
-- details about a single user.
SELECT
  id, name, email, password
FROM users
WHERE email = 'tristanjacobs@gmail.com';