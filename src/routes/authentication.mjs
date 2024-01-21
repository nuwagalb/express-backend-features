import { Router } from "express";
import { mockUsers } from "../utils/constants.mjs";
import passport from "passport";

const router = Router();

// Authentication using only sessions
router.post("/api/session/auth", (request, response) => {
    const { 
        body: { username, password } 
    } = request;

    const findUser = mockUsers.find((user) => user.username === username);
    if(!findUser || findUser.password !== password)
        return response.status(401).send({ msg: "BAD CREDENTIALS" });
    
    request.session.user = findUser;
    return response.status(200).send(findUser);
});

router.get("/api/session/auth/status", (request, response) => {
    request.sessionStore.get(request.sessionID, (err, session) => {
        console.log(session)
    });
    return request.session.user 
        ? response.status(200).send(request.session.user)
        : response.status(401).send({ msg: "Not Authenticated" })
})

//Authentication using Passport and Sessions
router.post(
    "/api/passport/auth",
    passport.authenticate('local'),
    (request, response) => {
        response.sendStatus(200);
    }
);

router.get("/api/passport/auth/status", (request, response) => {
    console.log(`Inside /api/passport/auth/status`);
    console.log(request.user);
    return request.user ? response.send(request.user) : response.sendStatus(401)
});

router.post("/api/passport/auth/logout", (request, response) => {
    if(!request.user) return response.sendStatus(401);
    request.logout((err) => {
        if(err) return response.sendStatus(400);
        response.send(200);
    });
});

export default router;
