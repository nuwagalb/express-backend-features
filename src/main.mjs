import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

const app = express();

const PORT = process.env.PORT || 3000;

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

//users router
app.use(routes)

app.get("/", (request, response) => {
        console.log(request.session.id)
        request.session.visited = true;
        response.cookie("hello", "world", { maxAge: 60000 * 60 * 2, signed: true}) //1 minute = 60,000 milliseconds
        response.status(201).send({msg: 'Hello!'});
    }
);

app.post("/api/auth", (request, response) => {
    const { 
        body: { username, password } 
    } = request;

    const findUser = mockUsers.find((user) => user.username === username);
    if(!findUser || findUser.password !== password)
        return response.status(401).send({ msg: "BAD CREDENTIALS" });
    
    request.session.user = findUser;
    return response.status(200).send(findUser)
});

app.get("/api/auth/status", (request, response) => {
    request.sessionStore.get(request.sessionID, (err, session) => {
        console.log(session)
    });
    return request.session.user 
        ? response.status(200).send(request.session.user)
        : response.status(401).send({ msg: "Not Authenticated" })
})

app.post("/api/cart", (request, response) => {
    if (!request.session.user) return response.sendStatus(401);
    const { body: item } = request;
    const { cart } = request.session;

    if (cart) {
        cart.push(item)
    } else {
        request.session.cart = [item];
    }
    return response.status(201).send(item);

})

app.get("/api/cart", (request, response)=> {
    if (!request.session.user) return response.sendStatus(401)
    return response.send(request.session.cart ?? [])
});

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

/* 
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


