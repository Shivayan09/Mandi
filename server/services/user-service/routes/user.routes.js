import express from 'express'
import { createUser, getUserByEmail, getUserById } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.get("/email/:email", getUserByEmail);
userRouter.get("/:userId", getUserById);

export default userRouter;
