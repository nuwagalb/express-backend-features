import express from "express";
// query - validates endpoint query parameters on requests
// validationResults - function that returns validation results
// body - validates request body
// matchedData - this gives you all the validated data
// checkSchema - gives a validation schema
import { query, validationResult, body, matchedData, checkSchema } from "express-validator"
import { createUserValidationSchema, getUsersValidationSchema } from "./utils/validationSchema.mjs" 

const app = express();

//Global Middle Ware
app.use(express.json());

//More Middle Ware
const loggingMiddleWare = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

const resolveIndexByUserId = (request, response, next) => {
    const { 
        params: {id}
    } = request
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400) //400 - Bad Request
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return response.sendStatus(404) //404 - Not Found
    request.findUserIndex = findUserIndex
    next()
}

//Add Middle Ware for all Routes/globally
//where you place the middleware matters. If you want it to register
// on all routes, place it before the all the routes. If you want it to
//register for specific routes, jump those routes that are not needed and
// then place it above those that will need the middleware

//app.use(loggingMiddleWare);

//You can chain multiple middlewares together
app.use(loggingMiddleWare, (request, response, next) => {
   console.log("Finished Logging...")
   next();
})


const PORT = process.env.PORT || 3000;

const mockUsers = [
    {id: 1, username: "anson", displayName: "Anson"},
    {id: 2, username: "jack", displayName: "Jack"},
    {id: 3, username: "adam", displayName: "Adam"}
];

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get(
    "/", 
    //Adding multiple middleware functions
    (request, response, next) => {
        console.log('Base URL 1');
        next();
    },
    (request, response, next) => {
        console.log('Base URL 2');
        next()
    },
    (request, response, next) => {
        console.log('Base URL 3');
        next();
    },
    (request, response) => {
        response.status(201).send({msg: 'Hello!'});
    }
);

// Query parameter
// query is a middleware from express-validator
app.get(
    "/api/users",
    //Handling validation of query parameters
    checkSchema(getUsersValidationSchema), 
    (request, response) => {
    // Handling Validation Results
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
})

//Add Middle Ware for all Routes/globally
//where you place the middleware matters. If you want it to register
// on all routes, place it before the all the routes. If you want it to
//register for specific routes, jump those routes that are not needed and
// then place it above those that will need the middleware

//app.use(loggingMiddleWare);

//You can chain multiple middlewares together
app.use(loggingMiddleWare, (request, response, next) => {
    console.log("Finished Logging...")
    next();
 })

// Post Request with pay load
app.post(
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
})

// Route Parameter - GET
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404)
    return response.send(findUser);
})

//PUT Request- update entire record
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex} = request //findUserIndex is supplied by the resolveIndexByUserId middleware
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}
    return response.sendStatus(200)
})

// PATCH Request - update record partially
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex} = request
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
    return response.sendStatus(200)
})

// DELETE Request - delete record
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex)
    return response.sendStatus(200)
})

app.get("/api/products", (request, response) => {
    response.send([{id: 123, name: "Chicken Breast", price: 123.9}]);
})



