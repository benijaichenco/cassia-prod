import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getLikedFragrances } from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.post("/liked-fragrances", authMiddleware, getLikedFragrances);
