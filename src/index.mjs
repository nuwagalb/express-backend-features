import express from "express";

const app = express()

const PORT = process.env.PORT || 3000

const mockUsers = [
    {id: 1, username: "anson", displayName: "Anson"},
    {id: 2, username: "jack", displayName: "Jack"},
    {id: 3, username: "adam", displayName: "Adam"}
]

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})

app.get("/", (request, response) => {
    response.status(201).send({msg: 'Hello!'})
})

app.get("/api/users", (request, response) => {
    console.log(request.query) //localhost/api/users?filter=username&value='an'
    //destructure the query parameters
    const {
        query: {filter, value},
    } = request

    //if filter and value are defined
    if (filter && value)
        return response.send(
            mockUsers.find((user) => user[filter].includes(value))
        )

    return response.send(mockUsers)
})

app.get("/api/users/:id", (request, response) => {
    console.log(request.params)
    const parsedId = parseInt(request.params.id)
    if(isNaN(parsedId))
        return response.status(400).send({msg: "Bad Request. Invalid ID."})

    const findUser = mockUsers.find((user) => user.id === parsedId)

    if (!findUser) return response.sendStatus(400)

    return response.send(findUser)
})

app.get("/api/products", (request, response) => {
    response.send([{id: 123, name: "Chicken Breast", price: 123.9}])
})

