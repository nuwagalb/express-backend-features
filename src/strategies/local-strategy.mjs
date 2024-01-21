import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

//this user is the user that was returned by passport.use() verification process
passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user)
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    console.log(`Inside Deserializer`);
    console.log(`Deserializing User ID: ${id}`);
    try {
        const findUser = mockUsers.find((user) => user.id = id);
        if(!findUser) throw new Error("User Not Found");
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
})

export default passport.use(
    new Strategy((username, password, done) => {
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        try {
            //find if the user with the given username exists
            //if user exists, check if passwords match
            const findUser = mockUsers.find((user) => user.username === username);
            if(!findUser) throw new Error("Invalid Username");
            if(findUser.password !== password) throw new Error("Invalid Password");
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    })
);