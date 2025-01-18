import express from "express";
import FragranceModel from "../models/fragrance.model";
import { UserModel } from "../models/user.model";

export const getLikedFragrances = async (req: express.Request, res: express.Response) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).send("No user id.");
    return;
  }
  try {
    const user = await UserModel.findOne({ userId: userId });
    if (user) {
      const likedFragrances = await FragranceModel.find({
        fragranceId: { $in: user.likedFragrances },
      });
      res.json(likedFragrances);
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong.",
      error: err,
    });
  }
};
