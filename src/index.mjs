import express from "express";

const app = express()

const PORT = process.env.PORT || 3000

const mockUsers = [
    {id: 1, name: "anson", displayName: "Anson"},
    {id: 1, name: "jack", displayName: "Jack"},
    {id: 1, name: "adam", displayName: "Adam"}
]

app.get("/", (request, response) => {
    response.status(201).send({msg: 'Hello!'})
})

app.get("/api/users", (request, response) => {
    response.send(mockUsers)
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

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})