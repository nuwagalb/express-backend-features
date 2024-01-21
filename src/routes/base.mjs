import { Router } from "express";

const router = Router();

router.get("/", (request, response) => {
    console.log(request.session.id)
    request.session.visited = true;
    response.cookie("hello", "world", { maxAge: 60000 * 60 * 2, signed: true}) //1 minute = 60,000 milliseconds
    response.status(201).send({msg: 'Hello!'});
}
);

export default router;

