import { Router } from "express";
import { createUser, login } from "../controllers/users.controllers.js";

export const userRouter = Router();

userRouter.post("/registro", createUser);
userRouter.post("/login", login);
