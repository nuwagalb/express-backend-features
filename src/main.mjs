import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";

//create connection to mongodb
mongoose
    .connect("mongodb://localhost/express_backend_app")
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`))

//create app with all it's functionalities
const app = createApp();

//serve app so that it can be accessed
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});


/**
 * General Development Flow
 * 
 * 1. Receive request when endpoint is visited
 * 2. Extract data from request
 * 3. Perform operations (like data validation) on extracted data from 
 *    request or perform operations on the request itself (like checking if it has a session
 *    attached to it)
 * 4. Return a response for the the visited endpoint
 * 
 */

/* 
   Express Tool Used: cookie-parser
   Cookies: unique pieces of data that the server sends to the web browser
   -> http is stateless that's why cookies are important so that they can
      keep track of important data that the server and clients who use http
      stateless protocol might want to maintain
   -> cookie is a key - value pair

    COOKIE CONCEPT
    client                                          server
    (2) cookie stored by web browser      <-----    (1) cookie set on the server. cookie is sent
                                                        to web browser using a response to a given
                                                        endpoint that was requested for
    (3) web browser sends back cookie
    to server when client visits the      ------>   (4) the server retrieves the cookie
    server using any route associated                   sent from the browser
    with the server 
*/

/*
  -> Express tool used: express-session
  -> Sessions represent the duration of the user on the website/server
  -> By default http is stateless, we don't know who is making requests to our server so we
     need to be able to track requests and know where they are coming from
  -> One common usage of sessions is to manage user authentication
  -> Sessions are created on the server by generating an object with a session id
  -> When an http request is sent to the server from the web browser, the server's response
     can return with instructions to set a cookie with a session's id so that it can be 
     saved in the browser. This allows the browser to send the cookie back on subsequent
     requests to the server. The server can then parse the cookies from text to json and then
     verify the session id that was sent from the client and determine who the request was
     sent from. Whenever the browser sends the cookies on each request, the server can look
     up whick user pertains to the session as the server maintains in mapping of each session
     id to the user.
  -> When the session object is modified, it maintains the same session id every time a request
     is made from that route 
     
  SESSION CONCEPT
  client                                    server
  (2) the web browser sends back the        (1) a session is created on the server. This session
      cookie that contains the session          contains instructions to set a cookie that will be
      id                                        sent to the web browser using a specified endpoint

*/

/**
 * Express Tool Used: passport, passport-local, passport-facebook
 * 
 * Steps
 * 1. install passport, pasport-local, passport-facebook package
 * 2. import passport
 * 3. If using passport and sessions, then ensure session middleware has
 *    already been installed
 * 4. initialize passport as a middleware for the application
 * 5. assign available session to passport
 * 6. configure a passport strategy
 *    -> serialize passport user using unique value like user_id to add them to the session
 *    -> deserialize passport user using unique value that was passed (user_id) to add
 *       user that was added to session using seriaalize onto the request object itself
 * 7. define endpoints that will use passport
 * 8. on this endpoint, add passport authentication strategy as a middleware
 * 
 * Notes:
 * -> Don't forget to hash passwords
 * -> install encrypting/decrypting package (bcrypt)
 * -> create file to use for the hashing process
 * -> import bcrypt
 *    - create SaltRounds
 * -> create function to hash the password using the bcrypt
 *    - generate a salt and pass it saltRounds
 *    - use bcrypt to hash the password (use async version)
 * 
 * 
 */

/**
 * Databases: MongoDB, Node: Mongoose
 * 
 * 1. install mongodb on local/cloud
 * 2. install mongoose node module
 * 3. import mongoose
 * 4. connect to mongoose db(host:port:db_name)
 * 5. set up a mongoose schema for your entities
 * 6. compile the schema into a model
 * 7. perform database operations like (findOne, findById, etc) on the 
 *    model to query for different documents within your given collection
 * 
 * By default, express-session stores session data in memory so if you need
 * your session data to persist such that even if the server goes down at some
 * point then you still have your sessions availabe, you'll need to use a session
 * Store in order to save your session data in the database
 * - install connect-mongo module (an express-session module with different sessionStores)
 * - import Mongostore from connect-mongo
 * - create a session store in the session middleware (
 *   add it as a property to options object that is passed to our session)
 * - create a db connection between the store and mongodb 
 */

/**
 * OAUTH2 Authentication using passport.js
 * -> use third party providers to log into your application
 * -> you can use different third party's such as Discord, Facebook, Github, etc
 * -> figure out from developer documentation how to create an actual oauth application
 * -> Discord Details
 *    - client Secret: f9UP4HD0EtsihRV-b0Cr-1VrtdIlgLOS
 *    - client ID: 1200351307010150510
 *    - Discord redirect url: http://localhost:3000/api/auth/discord/redirect
 * -> Install passport strategy that matches your authentication app (passport-discord)
 * -> Import it into our app
 * -> Create a file to implement the discord strategy using passport
 * 
 * Flow of App
 * - (1)click route on our express app -> (2)express app redirects us to discord for
 *                                           authorization 
 *                                               |
 *   (3)we click discord authorization       <----
 *      and are redirected to our express
 *      app using this specific route that
 *      is in our app but also defined in
 *      discord itself
 */

/**
 *  UNIT TESTING: using JEST (a testing framework for javascript made by meta)
 *  -> use bable transpiler to transpile es6 javascript code to older versions of javascript
 *  -> install devedependencies @babel/core, @babel/node @babel/preset-env and jest as well
 *  -> create a .babelrc file and add configuration for the present env for babel
 *  -> set up a jest config file (npm init jest@latest)
 *     - Edit the default transform property inside the jest.config.mjs file and pass it an
 *       object. The transform property looks for the source files that match a regular expression
 *       and transforms them into a form that jest can actually run.babel-jest is the tool
 *       used for transformation of .mjs files to older javascript files
 *     - Edit the moduleFileExtensions property as well: 
 *  -> Ensure that the test script in package.json file is running the "jest" command
 *  -> Create a __tests__ folder for our test files: this is a standard naming convention
 *  -> Name test files with similar names as the code they'll be testing: i.e if you have a
 *     users.mjs file that will be tested, name your file: users.test.js or users.spec.js
 *  -> configure jest globally
 *     - install jest types (npm i -D @types/jest)
 *     - create a jsconfig.json file
 *     - set typeAcquisition: {
 *          include: ["jest"]
 *       }     
 */

/**
 *  INTEGRATION AND END TO END TESTS: using supertest (Node.js library for integration testing 
 *  purposes)
 *  -> install supertest (npm i -D supertest) //supertest works well with jest
 *  -> add a new test script to the package.json file: (test:e2e) for end to end
 *     integration purposes
 *     - "test:e2e": "jest --testPathPattern=src/e2e"
 *  -> export our main express application (app) so that all the endpoints and middlewares
 *     registered on it can be accessible for testing
 * 
 *  Note: In summary, integration tests focus on the collaboration between components, while 
 *  end-to-end tests focus on the entire application flow from the user's perspective. Both 
 *  types of tests are valuable and serve different purposes in ensuring the quality and 
 *  reliability of a software application   
 */




