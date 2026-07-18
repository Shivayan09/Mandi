import express from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", me);

export default authRouter;
