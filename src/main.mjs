import express from "express";
import routes from "./routes/index.mjs"

const app = express();

const PORT = process.env.PORT || 3000;

//Global MiddleWare
app.use(express.json());

//users router
app.use(routes)

app.get("/", (request, response) => {
        response.status(201).send({msg: 'Hello!'});
    }
);

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});


