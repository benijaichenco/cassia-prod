import express from "express";
import { createComment, deleteComment, getComments } from "../controllers/comments.contoller";
import { authMiddleware } from "../middleware/auth.middleware";
import CommentModel from "../models/comment.model";

const commentsRouter = express.Router();

commentsRouter.get("/:fragranceId", getComments);
commentsRouter.put("/create", authMiddleware, createComment);
commentsRouter.delete("/delete", authMiddleware, deleteComment);

export default commentsRouter;
