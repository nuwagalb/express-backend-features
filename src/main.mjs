import express from "express";
import routes from "./routes/index.mjs";
import cookieParser, { signedCookie } from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 3000;

//Global MiddleWare
app.use(express.json());

//cookie
app.use(cookieParser("uvwxyz"));

//users router
app.use(routes)

app.get("/", (request, response) => {
        response.cookie("hello", "world", { maxAge: 60000 * 60 * 2, signed: true}) //1 minute = 60,000 milliseconds
        response.status(201).send({msg: 'Hello!'});
    }
);

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

// Cookies: unique pieces of data that the server sends to the web browser
// http is stateless that's why cookies are important so that they can
// keep track of important data that the server and clients who use http
// stateless protocol might want to maintain 


