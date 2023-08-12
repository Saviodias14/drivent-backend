import { singInPost, gitSignIn } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInSchema } from "@/schemas";
import { Router } from "express";
// import { validateToken } from "@/middlewares";

const authenticationRouter = Router();

authenticationRouter
    .post("/sign-in", validateBody(signInSchema), singInPost)
    .post("/git-sign-in", gitSignIn);

export { authenticationRouter };
