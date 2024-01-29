import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";

//Test suite for authentication end points
describe("/api/passport/auth", () => {
    let app;

    //before all tests are run, connect to the database and create
    // an instance of the express app
    beforeAll(() => {
        //create connection to mongodb
        mongoose
        .connect("mongodb://localhost/express_backend_app_test")
        .then(() => console.log("Connected to Test Database"))
        .catch((err) => console.log(`Error: ${err}`))

        //create an instance of our express app with all our defined
        //endpoints
        app = createApp();
    });

    //test to see that if the get end point ("/api/passport/auth/status")
    //is visited with an unauthenticated user, it returns status code 401
    it("should return 401 when not logged in", async () => {
        const response = await request(app).get("/api/passport/auth/status");
        expect(response.statusCode).toBe(401);
    });

    //after all tests are run, drop the test database
    //and close our database connection
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});


/** Hello World Example */
// app.get("/hello", (req, res) => res.status(200).send({}));

// //Test suite for our integration and End to End Tests
// describe("hello endpoint", () => {
//    //first test closure of our test suite
//    it("get /hello and expect 200 status", async () => {
//     const response = await request(app).get("/hello");
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toStrictEqual({});
//    }) 
// })