import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import "./strategies/local-strategy.mjs";
//import "./strategies/discord-strategy.mjs";

export function createApp() {
    const app = express();

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
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        })
    }))

    //passport middleware for authentication
    app.use(passport.initialize());
    app.use(passport.session());

    //users router
    app.use(routes);

    return app;
}