import express from "express";
import { postLike } from "../controllers/likes.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const likesRouter = express.Router();

likesRouter.post("/post-like", authMiddleware, postLike);
