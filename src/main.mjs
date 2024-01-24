import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";

const app = express();

mongoose
    .connect("mongodb://localhost/express_backend_app")
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`))

//Global MiddleWare
app.use(express.json());

//cookie
app.use(cookieParser("uvwxyz"));

//session
app.use(session({
    secret: "current session password",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 2
    }
}))

//passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

//users router
app.use(routes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

/* 
   Express Tool Used: cookie-parser
   Cookies: unique pieces of data that the server sends to the web browser
   -> http is stateless that's why cookies are important so that they can
      keep track of important data that the server and clients who use http
      stateless protocol might want to maintain
   -> cookie is a key - value pair

    COOKIE CONCEPT
    client                                          server
    (2) cookie stored by web browser      <-----    (1) cookie set on the server when a 
                                                      given route is visited
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
      id                                        sent to the web browser

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
 * 2. install mongoose node package
 * 3. import mongoose
 * 4. connect to mongoose db(host:port:db_name)
 * 5. set up a mongoose schema for your entities
 * 6. compile the schema into a model
 * 7. perform database operations like (findOne, findById, etc) on the 
 *    model to query for different documents within your given collection 
 */

/**
 * General Development Flow
 * 
 * 1. Receive request when endpoint is visited
 * 2. Extract data from request
 * 3. Perform operations (like data validation) on extracted data from 
 *    request or perform operations on the request itself (like checking if it has a session
 *    attached to it)
 * 4. Return a response for the the visited endpoint
 */


