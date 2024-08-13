

# LightBnB

LightBnB is a PostgreSQL-based property rental website. The frontend is unpolished by design as the focus is somewhere else: creating a database access layer and writing query functions that can talk to the PostgreSQL database.

Without logging in, you can browse or search available properties for rent. If you login, you gain the ability to check your property reservations and create listings to rent out your own properties.

## Primary Skills and Technologies

LightBnB is intended to serve as a learning platform for database and data access layer skills:

* Designing the ERD and Schema of the Project's Database. See the `ERDs` folder

* Populating the Database With Seed Files.

* Connecting to a PostgreSQL Database From a JavaScript Project Using the node-postgres Library.

* Using Express Routers to Re-route Incoming Requests to Sub-Routes (such as API and Server routes to avoid having a giant routes file).

* Re-Routing Endpoint Calls (Business Logic Layer) to Database Query Functions (Database Access Layer).

* Writing Query Functions That Query the Database With SQL (Using SQL commands like JOIN, INSERT, DELETE, GROUP BY, ORDER BY and LIMIT).

* Sanitizing User Inputs From the Website by Using Parameterized Queries. Embedding These Parameterized Queries Into SQL Queries to Prevent SQL Injection Attacks.

## Tech Stack

* NodeJS
* ExpressJS
* Main Libraries: node-postgres and pg
* PostgreSQL


## Getting Started
Install dependencies with npm install in the root of the project and in the LightBnB_WebApp-master sub-project.

### Running the Program

```
cd LightBnB_WebApp-master
npm run local
```

Go to http://localhost.com:3000 to see the LightBnB home page.
