import express from "express";

const app = express();

//Middle Ware
app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
    {id: 1, username: "anson", displayName: "Anson"},
    {id: 2, username: "jack", displayName: "Jack"},
    {id: 3, username: "adam", displayName: "Adam"}
];

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
    response.status(201).send({msg: 'Hello!'});
});

// Query parameter
app.get("/api/users", (request, response) => {
    console.log(request.query); //localhost/api/users?filter=username&value='an'
    //destructure the query parameters
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

// Post Request with pay load
app.post("/api/users", (request, response) => {
    const { body } = request;
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return response.status(201).send(newUser); // 201 - resource created
})

// Route Parameter - get
app.get("/api/users/:id", (request, response) => {
    console.log(request.params);
    const parsedId = parseInt(request.params.id);
    if(isNaN(parsedId))
        return response.status(400).send({msg: "Bad Request. Invalid ID."});
    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return response.sendStatus(400)
    return response.send(findUser);
})

app.get("/api/products", (request, response) => {
    response.send([{id: 123, name: "Chicken Breast", price: 123.9}]);
})

//PUT Request- update entire record
app.put("/api/users/:id", (request, response) => {
    const { 
        body, 
        params: {id}
    } = request
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400) //400 - Bad Request
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return response.sendStatus(404) //404 - Not Found
    mockUsers[findUserIndex] = {id: parsedId, ...body}
    return response.sendStatus(200)
})

// PATCH Request - update record partially
app.patch("/api/users/:id", (request, response) => {
    const { 
        body, 
        params: {id}
    } = request
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400) //400 - Bad Request
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return response.sendStatus(404) //404 - Not Found
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
    return response.sendStatus(200)
})

// DELETE Request - delete record
app.delete("/api/users/:id", (request, response) => {
    const {
        params: {id}
    } = request;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400)
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
    if (findUserIndex === -1) return response.sendStatus(404);
    mockUsers.splice(findUserIndex)
    return response.sendStatus(200)
})

