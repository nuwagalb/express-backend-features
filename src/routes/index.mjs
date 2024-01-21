import { Router } from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";
import authenticationRouter from "./authentication.mjs"
import cartRouter from "./carts.mjs"
import baseRouter from "./base.mjs"

const router = Router();

router.use(usersRouter);

router.use(productsRouter);

router.use(authenticationRouter);

router.use(cartRouter);

router.use(baseRouter);

export default router;