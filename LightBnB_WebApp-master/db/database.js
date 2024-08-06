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
  const inputValuesArray = [email];

  // Pass in the query and the input values as an array.
  return pool.query(

    `
    SELECT name, password FROM users
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
 * You are supposed to test if this function works properly like this: While
 * the user is logged in, if you refresh the page and user is still logged in,
 * then the page is working properly.
 *
 * However, this function DOES NOT WORK PROPERLY. Refreshing the page makes
 * the user log out.
 *
 * Let's look at what's happening: When the page is refreshed, it seems that
 * the `getMyDetails()` function in `network.js` calls the `POST /me` endpoint
 * in `userRoutes.js`. This endpoint calls the `getUserWithId()` function in
 * `database.js`.
 *
 * I've confirmed that the session cookie is being created properly and is
 * being sent back to the server. However, once the request gets to the
 * `GET /me` endpoint, it doesn't find a `req.session` object, and therefore,
 * no `req.session.userId` value. The request body exists and contains
 * references to the session cookie, but there is no `userId` value in it.
 *
 * The `GET /me` endpoint fails and so, this query function doesn't work.
 * I don't know how to fix this, but the rest of the project seems to work
 * without it.
 *
 * Compass says this query function is the same as the `getUserWithEmail`
 * function, which demands the user's name and password, so I've made this
 * one similar.
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
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
};


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
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
 */
const getAllProperties = function(options, limit = 10) {

  // ORIGINAL CODE; CALLS THE JSON DATABASE
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);


  // NEW CODE; CALLS THE DATABASE

  // Pass in the query and the input values as an array.
  const inputValuesArray = [limit];


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

  return pool.query(
    `SELECT * FROM properties LIMIT $1;`,
    inputValuesArray
  )
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
