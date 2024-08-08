// JSON "DATABASE"
// The project started out with these JSON files simulating a database. But
// they will be replaced with queries to an actual database.
const properties = require("./json/properties.json");
const users = require("./json/users.json");


// CONNECTING TO THE POSTGRESQL DATABASE
const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb2024"
});


/* TESTING THE CONNECTION TO THE DATABASE
 *
 * To test if the database connection is working, execute `npm run local` in
 * a terminal and de-comment the line below. The terminal should return this
 * message:
 *
 *    Result {
 *      command: 'SELECT',
 *      rowCount: 10,
 *      oid: null,
 *      rows:
 *      [ { title: 'Daily every' },
 *        { title: 'Magic familiar' },
 *        { title: 'List least' },
 *        { title: 'Done game' },
 *        { title: 'Prepare if' },
 *        { title: 'Roll stranger' },
 *        { title: 'Rhyme other' },
 *        { title: 'Remarkable date' },
 *        { title: 'Student least' },
 *        { title: 'Political every' } ],
 *   ...
 *   }
 *
 * The property titles may be different, but you should see 10 titles returned
 * as required by the query. If you get this response in the terminal, the
 * connection to the database has been properly established.
 */
// pool.query(`SELECT title FROM properties LIMIT 10;`)
//   .then(response => {console.log(response)});


// USERS

/**
 * Get a single user from the database given their email.
 *
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 *
 * The "POST /login" endpoint will call this function; it is expecting the
 * user's name and password. Test it by logging into the application.
 */
const getUserWithEmail = function(email) {

  // ORIGINAL CODE; CALLS THE JSON DATABASE

  // let resolvedUser = null;
  // for (const userId in users) {
  //   const user = users[userId];
  //   if (user && user.email.toLowerCase() === email.toLowerCase()) {
  //     resolvedUser = user;
  //   }
  // }
  // return Promise.resolve(resolvedUser);


  // NEW CODE; CALLS THE DATABASE
  // Array to hold untrusted input.
  const inputValuesArray = [email.toLowerCase()];

  // Pass in the query and the input values as an array.
  return pool.query(

    `
    SELECT * FROM users
    WHERE email = $1;
    `,
    inputValuesArray
  )
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0];
    })
    .catch(error => {
      console.log(error.message);
    });

};


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 *
 * Compass says this query function is the same as the `getUserWithEmail`
 * function, which demands the user's name and password, so I've made this
 * one similar.
 *
 * Let's look at what's happening: When the page is refreshed, it seems that
 * the `getMyDetails()` function in `network.js` calls the `POST /me` endpoint
 * in `userRoutes.js`. This endpoint calls the `getUserWithId()` query function
 * in `database.js`.
 *
 * You are supposed to test if this function works properly like this: While
 * the user is logged in, if you refresh the page and user is still logged in,
 * then the page is working properly.
 */
const getUserWithId = function(id) {

  // ORIGINAL CODE; CALLS THE JSON DATABASE
  // return Promise.resolve(users[id]);


  // NEW CODE; CALLS THE DATABASE.
  // The query string.
  const query = `SELECT * FROM users WHERE id = $1;`;

  // Pass in the query and the input values as an array (to sanitize the
  // latter).
  return pool.query(query, [id])
    .then((result) => { return result.rows; })
    .catch(error => { console.log(error.message); });

};


/**
 * Add a new user to the database.
 *
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 *
 * This query function accepts a `user` object that will have `name`, `email`,
 * and `password` properties. This function should create and insert a new
 * user into the `users` table using the information from this object.
 *
 * To confirm that the user was inserted into the `users` table, this function
 * will return a promise that resolves to the new user object. This object
 * should contain the new user's object, including its id after it's been
 * added to the database.
 */
const addUser = function(user) {

  // ORIGINAL CODE; CALLS THE JSON DATABASE
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);


  // NEW CODE; CALLS THE DATABASE
  const inputValuesArray = [user.name, user.email, user.password];

  return pool.query(

    // The `RETURNING *;` clause is added to the end of a query to return
    // the object(s) that were inserted into the database. This new object
    // should contain the `id` property of the newly inserted user (which
    // should have been added by the database).
    `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING * ;
    `,
    inputValuesArray
  )
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0];
    })
    .catch((error) => {
      console.log(error.message);
    });

};


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 *
 * Test this page by going to the `Reservations` page. It should show only
 * two reservations if loading data from the the JSON database, but many
 * more if drawing from the real one.
 */
const getAllReservations = function(guest_id, limit = 10) {

  // ORIGINAL CODE
  // return getAllProperties(null, 2);


  // NEW CODE; CALLS THE DATABASE
  const inputValuesArray = [guest_id, limit];

  // Note: Instead of specifying the columns you need by hand, you could make
  // a shorter query by doing this: `SELECT table_name.*`.
  const query =
    `
    SELECT
      properties.thumbnail_photo_url,
      reservations.id,
      properties.title,
      properties.number_of_bedrooms,
      properties.number_of_bathrooms,
      properties.parking_spaces,
      reservations.start_date,
      reservations.end_date,
      avg(rating) as average_rating,
      properties.cost_per_night
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;


  return pool.query(query, inputValuesArray)
    .then((result) => { return result.rows; })
    .catch((error) => { console.log(error.message); });

};


// PROPERTIES

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 *
 * This query function is invoked by `GET /properties` in `apiRoutes.js`.
 * Test this function by loading the front page. If frontpage populates itself
 * (image links may be outdated and dead), then it works.
 *
 * This query function is invoked by the `Home`, `Search`, and `My Listings`
 * page.
 */
const getAllProperties = function(options, limit = 10) {

  // ORIGINAL CODE; CALLS THE JSON DATABASE
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);


  // NEW CODE; CALLS THE DATABASE
  // Pass arguments for the query as an array. This will sanitize user input
  // and prevent SQL injection attacks.
  const queryArguments = [];


  // QUERY STRING
  // Basic Query Template
  let query =
    `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews ON properties.id = property_id
  `;

  // Print the `options` object to the console for debugging purposes.
  console.log(options);


  // `WHERE` & `HAVING` CLAUSES
  let whereConditions = ``;
  let havingConditions = ``;

  // Add the owner ID to the query. The `Search` page and `Home` page don't
  // need it, but the `My Listings` page does.
  if (options.owner_id) {
    queryArguments.push(`${options.owner_id}`);
    whereConditions += `owner_id = $${queryArguments.length}`;
  }


  // The rest of these `WHERE` clauses are used on the `Search` page.
  // If the user has specified a city, add it to the query.
  if (options.city) {
    if (queryArguments.length > 0) {
      whereConditions += ` AND `;
    }

    queryArguments.push(`%${options.city}%`);
    whereConditions += `city LIKE $${queryArguments.length}`;
  }


  // If the user has specified a minimum price, add it to the query.
  if (options.minimum_price_per_night) {
    if (queryArguments.length > 0) {
      whereConditions += ` AND `;
    }

    // Recall that the database stores prices in cents; this requires dollar
    // values to be multiplied by 100.
    queryArguments.push(`${options.minimum_price_per_night * 100}`);
    whereConditions += `properties.cost_per_night >= $${queryArguments.length}`;
  }


  // If the user has specified a maximum price, add it to the query.
  if (options.maximum_price_per_night) {
    if (queryArguments.length > 0) {
      whereConditions += ` AND `;
    }

    queryArguments.push(`${options.maximum_price_per_night * 100}`);
    whereConditions += `properties.cost_per_night <= $${queryArguments.length}`;
  }


  // If the user has specified a minimum rating, add it to the query.
  if (options.minimum_rating) {
    queryArguments.push(`${options.minimum_rating}`);
    havingConditions +=
      `AVG(property_reviews.rating) >= $${queryArguments.length}`;
  }


  // COMPILING THE FINAL QUERY
  // If there are any query arguments, add their conditions to the WHERE clause.
  // (You won't need this for the `Home` page or the `My Listings` page, only
  // the `Search` page.)
  if (whereConditions.length > 0) {

    // Adding double spaces before the `WHERE` clause to align with the first
    // half of the query. Makes it look much better when you print the query
    // to the terminal.
    query += "  " + "WHERE " + whereConditions;
  }

  // After that, add the GROUP BY clause to the query. You will need this for
  // all queries.
  query += "\n    " + "GROUP BY properties.id";


  // Add the `HAVING` conditions to the query. (You won't need this for the
  // `Home` page or the `My Listings` page, only the `Search` page.)
  if (havingConditions.length > 0) {
    query += "\n    " + `HAVING ` + havingConditions;
  }


  // Add the `ORDER BY` clause to the query. You will need this for
  // all queries.
  query += "\n    " + "ORDER BY properties.cost_per_night";


  // Add the `LIMIT` clause to the query. You will need this for
  // all queries.
  queryArguments.push(limit);
  query += "\n    " + `LIMIT $${queryArguments.length};`;


  // PRINTING THE QUERY AND ARGUMENTS TO THE TERMINAL (for debugging purposes)
  console.log(query + `\n   `, queryArguments);



  /* WHY DO WE RETURN A PROMISE FROM `getAllProperties()`?
   *
   * Note that this query requires two `return` statements. One at the start
   * and one in the `.then` statement.
   *
   * From Compass:
   *
   *     This works because `.then` always returns a promise. Even though we
   *     wrote the line return `result.rows` (where `result.rows` is an array
   *     of objects), `.then` automatically places that value in a promise.
   *     `.then` returns a promise, which is returned as a result of the
   *     entire `getAllProperties()` function.
   *
   *     Why do we have to return a promise from `getAllProperties`? Couldn't
   *     we refactor to return `result.rows` an array of objects?
   *
   *     It has to do with where `getAllProperties` is being used elsewhere in
   *     the project. When `getAllProperties` is called in the `apiRoutes.js`
   *     file, it is chained to `.then`, which can only consume a promise.
   */

  return pool.query(query, queryArguments)
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    })
    .catch((error) => {
      console.log(error.message);
    });

};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};


// EXPORTS
module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
