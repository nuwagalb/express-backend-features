import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";

describe("create user and login", () => {
    let app;
    beforeAll(() => {
        mongoose
        .connect("mongodb://localhost/express_backend_app_test")
        .then(() => console.log("Connected to Test Database"))
        .catch((err) => console.log(`Error: ${err}`))

        app = createApp();
    });

    //this is an example of an integration test. It focuses on ensuring that
    //when the api/db/user endpoint is called, a 201 status code must be
    //returned
    it("should create the user", async () => {
        //make request to the create user api endpoint
        const response = await request(app).post("/api/db/users").send({
            username: "albo253",
            password: "password",
            displayName: "Albo the Dev",
        });
        expect(response.statusCode).toBe(201);
    });

    //this is an example of an end-to-end test. It focuses on ensuring that the
    //entire procedure from authentication of the user is working properly. Once a user is
    //authenticated, then the application should be able to give the status of the currently
    //logged in user
    it("should log user in, visit /api/passport/auth/status and return authenticated user", async () => {
        //make request to the user authentication endpoint
        const response = await request(app)
            .post("/api/passport/auth")
            .send({ username: "albo253", password: "password" })
            .then((res) => {
                return request(app)
                    .get("/api/passport/auth/status")
                    .set("Cookie", res.headers["set-cookie"]);
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe("albo253");
        expect(response.body.displayName).toBe("Albo the Dev");
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })
});