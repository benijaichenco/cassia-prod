import express from "express";
import CommentModel from "../models/comment.model";
import { UserDataType } from "../types/types";
import { UserModel } from "../models/user.model";

export const getComments = async (req: express.Request, res: express.Response) => {
  const { fragranceId } = req.params;
  try {
    const comments = await CommentModel.find({ fragranceId }).populate({
      path: "user",
      select: "userId username firstName",
    });
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

export const createComment = async (req: express.Request, res: express.Response) => {
  const user: UserDataType = req.user as UserDataType;
  const { commentId, fragranceId, content } = req.body;
  const foundUser = await UserModel.findOne({ userId: user.userId });
  if (!foundUser) {
    res.status(404).send("User not found");
    return;
  }
  try {
    const newComment = new CommentModel({
      commentId,
      fragranceId,
      createdAt: Date.now(),
      user: foundUser._id,
      userId: user.userId,
      content: content.trim(),
      likeCount: 0,
      likes: [],
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Failed to create comment." });
  }
};

export const deleteComment = async (req: express.Request, res: express.Response) => {
  const { commentId } = req.body;
  try {
    const comment = await CommentModel.findOneAndDelete({ commentId });
    res.json({ message: "Comment deleted!", comment });
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
};
