import express from "express";

const app = express()

const PORT = process.env.PORT || 3000

app.get("/", (request, response) => {
    response.status(201).send({msg: 'Hello!'})
})

app.get("/api/users", (request, response) => {
    response.send([
        {id: 1, name: "anson", displayName: "Anson"},
        {id: 1, name: "jack", displayName: "Jack"},
        {id: 1, name: "adam", displayName: "Adam"}
    ])
})

app.get("/api/products", (request, response) => {
    response.send([{id: 123, name: "Chicken Breast", price: 123.9}])
})

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`)
})