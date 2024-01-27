import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

// Verification with Persistent Data (Mongodb Database)
passport.serializeUser((user, done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log(`Inside Deserializer`);
    console.log(`Deserializing User ID: ${id}`);

    try {
        const findUser = await DiscordUser.findById(id);
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new Strategy(
        {
            clientID: "1200351307010150510",
            clientSecret: "f9UP4HD0EtsihRV-b0Cr-1VrtdIlgLOS",
            callbackURL: "http://localhost:3000/api/auth/discord/redirect",
            scope: ["identify", "guilds", "email"],
        }, 
        async (accessToken, refreshToken, profile, done) => {
            let findUser;
            try {
                findUser = await DiscordUser.findOne({ discordId: profile.id});
            } catch (error) {
                return done(err, null);
            }
            
            try {
                if(!findUser) {
                    const newUser = new DiscordUser({
                        username: profile.username,
                        discordId: profile.id,
                    });
                    const newSavedUser = await newUser.save();
                    return done(null, newSavedUser);
                }
                return done(null, findUser);
            } catch (error) {
                console.log(err);
                return done(err, null);
            }
        }
    )
)