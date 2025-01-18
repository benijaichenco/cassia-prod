import express from "express";
import CommentModel from "../models/comment.model";
import FragranceModel from "../models/fragrance.model";
import { UserModel } from "../models/user.model";

export const postLike = async (req: express.Request, res: express.Response) => {
  const { likeType, targetType, targetId, userId } = req.body;
  if (!likeType || !targetType || !targetId || !userId) {
    res.status(400).send("Invalid inputs.");
    return;
  }
  try {
    let target;
    if (targetType == "comment") {
      target = await CommentModel.findOne({ commentId: targetId });
    } else if (targetType == "fragrance") {
      target = await FragranceModel.findOne({ fragranceId: targetId });
    }
    if (!target) {
      res.status(404).send(`Target of targetType ${targetType} was not found.`);
      return;
    }
    const user = await UserModel.findOne({ userId });
    if (!user) {
      res.status(404).send("User was not found.");
      return;
    }

    const TARGET_ID = target._id;

    if (likeType == "like") {
      if (targetType == "fragrance") {
        const incrementLike = await FragranceModel.updateOne(
          { _id: TARGET_ID, likes: { $ne: userId } },
          { $inc: { likeCount: 1 }, $push: { likes: userId } }
        );
        if (incrementLike.modifiedCount !== 0) {
          await UserModel.updateOne({ userId }, { $push: { likedFragrances: target.fragranceId } });
          res.send("Liked.");
        } else {
          await FragranceModel.updateOne(
            { _id: TARGET_ID, likes: userId },
            { $inc: { likeCount: -1 }, $pull: { likes: userId } }
          );
          await UserModel.updateOne({ userId }, { $pull: { likedFragrances: target.fragranceId } });
          res.send("Unliked.");
        }
        await FragranceModel.updateOne(
          { _id: TARGET_ID, dislikes: userId },
          { $inc: { dislikeCount: -1 }, $pull: { dislikes: userId } }
        );
      } else if (targetType == "comment") {
        const incrementLike = await CommentModel.updateOne(
          { _id: TARGET_ID, likes: { $ne: userId } },
          { $inc: { likeCount: 1 }, $push: { likes: userId } }
        );
        if (incrementLike.modifiedCount == 0) {
          await CommentModel.updateOne(
            { _id: TARGET_ID, likes: userId },
            { $inc: { likeCount: -1 }, $pull: { likes: userId } }
          );
        }
        res.send("Unliked.");
      }
    } else if (likeType == "dislike") {
      if (targetType == "fragrance") {
        const incrementDislike = await FragranceModel.updateOne(
          { _id: TARGET_ID, dislikes: { $ne: userId } },
          { $inc: { dislikeCount: 1 }, $push: { dislikes: userId } }
        );
        if (incrementDislike.modifiedCount !== 0) {
          await UserModel.updateOne(
            { userId },
            { $push: { dislikedFragrances: target.fragranceId } }
          );
          res.send("Disiked.");
        } else {
          await FragranceModel.updateOne(
            { _id: TARGET_ID, dislikes: userId },
            { $inc: { dislikeCount: -1 }, $pull: { dislikes: userId } }
          );
          await UserModel.updateOne(
            { userId },
            { $pull: { dislikedFragrances: target.fragranceId } }
          );
          res.send("Undisliked.");
        }
        await FragranceModel.updateOne(
          { _id: TARGET_ID, likes: userId },
          { $inc: { likeCount: -1 }, $pull: { likes: userId } }
        );
      } else if (targetType == "comment") {
        const decrementDislike = await CommentModel.updateOne(
          { _id: TARGET_ID, dislikes: { $ne: userId } },
          { $inc: { dislikeCount: 1 }, $push: { dislikes: userId } }
        );
        if (decrementDislike.modifiedCount == 0) {
          await CommentModel.updateOne(
            { _id: TARGET_ID, dislikes: userId },
            { $inc: { dislikeCount: -1 }, $pull: { dislikes: userId } }
          );
        }
        res.send("Disliked.");
      }
    }
    return;
  } catch (err) {
    res
      .status(500)
      .json({ message: `Something went wrong while trying to like a ${targetType}:`, error: err });
  }
};
