import { Router } from "express";
import { mockUsers } from "../utils/constants.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema, getUsersValidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId} from "../utils/middlewares.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

//the router is a some sort of mini app within express,
//you can register various routes on it
//it also needs to be registred to express as well after
//registering routes on it
//it is helpful in grouping our routes
const router = Router();

//ROUTES WITH PERSISTENT DATA (DATABASES)
router.post(
    "/api/db/users",
    checkSchema(createUserValidationSchema),
    async (request, response) => {
    // Handling validation results
    const results = validationResult(request);

    if (!results.isEmpty()) 
        return response.status(400).send(results.array());
    
    const data = matchedData(request);
    console.log(data);
    data.password = await hashPassword(data.password);
    console.log(data);
    
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return response.status(201).send(savedUser);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});

// ROUTES WITH NON PERSISTENT DATA (IN MEMORY OPERATIONS)
// Query parameter
// query is a middleware from express-validator
router.get(
    "/api/users",
    //Handling validation of query parameters
    checkSchema(getUsersValidationSchema), 
    (request, response) => {
    // Handling Validation Results
    console.log(request.session.id)
    request.sessionStore.get(request.session.id, (err, sessionData) => {
        if(err) {
            console.log(err);
            throw err
        }
        console.log(sessionData);
    })
    const result = validationResult(request); //get the validation results from the given request
    console.log(result);

    //console.log(request.query); //localhost/api/users?filter=username&value='an'
    //destructure the query parameters of the url address
    const {
        query: {filter, value},
    } = request;

    //if filter and value are defined
    if (filter && value)
        return response.send(
            mockUsers.find((user) => user[filter].includes(value))
        );
    return response.send(mockUsers);
});

// Route Parameter - GET
router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404)
    return response.send(findUser);
});

// Post Request with pay load
router.post(
    "/api/users",
    // Handling Validation for more than one body field
    checkSchema(createUserValidationSchema),
    (request, response) => {
    //Handling validation results
    const result = validationResult(request)
    console.log(result)

    if(!result.isEmpty())
        return response.status(400).send({ errors: result.array()})
    
    //this is data returned after validating body fields
    const data = matchedData(request)
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser); // 201 - resource created
});

//PUT Request- update entire record
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex} = request //findUserIndex is supplied by the resolveIndexByUserId middleware
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}
    return response.sendStatus(200)
});

// PATCH Request - update record partially
router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex} = request
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
    return response.sendStatus(200)
});

// DELETE Request - delete record
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex)
    return response.sendStatus(200)
});


export default router;

/** Notes from the Tutorial */

//import { query, validationResult, body, matchedData, checkSchema } from "express-validator"
// query - validates endpoint query parameters on requests
// validationResults - function that returns validation results
// body - validates request body
// matchedData - this gives you all the validated data
// checkSchema - gives a validation schema


//Add Middle Ware for all Routes/globally
//where you place the middleware matters. If you want it to register
// on all routes, place it before the all the routes. If you want it to
//register for specific routes, jump those routes that are not needed and
// then place it above those that will need the middleware
//app.use(loggingMiddleWare);