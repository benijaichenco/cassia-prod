import express from "express";
import FragranceModel from "../models/fragrance.model";
import { checkFetchFragranceQueries, has24HoursPassed } from "../utils";
import { resetFotd } from "../services/fotd.service";
import FotdModel from "../models/fotd.model";

export const getFragrances = async (req: express.Request, res: express.Response) => {
  const { index, sortField, sortOrder, search } = req.query;

  const limit = 24;

  try {
    const { indexNum, fieldString, orderString, searchString } = checkFetchFragranceQueries(
      index,
      sortField,
      sortOrder,
      search
    );
    const maxIndices = 25;
    if (indexNum >= maxIndices) {
      res.status(400).send(`Index must be less than ${maxIndices}`);
      return;
    }
    const skip = indexNum * 24;
    const query = searchString
      ? {
          $or: [
            { name: { $regex: searchString, $options: "i" } },
            { brand: { $regex: searchString, $options: "i" } },
          ],
        }
      : {};
    const fragrances = await FragranceModel.find(query)
      .sort({ [fieldString]: orderString == "asc" ? 1 : -1, fragranceId: 1 })
      .skip(skip)
      .limit(limit);
    res.json({
      fragrances,
      maxIndices,
    });
  } catch (err) {
    res.status(400).send("Could not fetch fragrances.");
  }
};

export const getSingleFragrance = async (req: express.Request, res: express.Response) => {
  const { fragranceId } = req.params;
  try {
    const fragrance = await FragranceModel.findOne({ fragranceId });
    if (!fragrance) {
      res.status(404).send("Fragrance not found.");
      return;
    }
    if (!fragrance) {
      res.status(404).send("Fragrance not found!");
      return;
    }
    res.json(fragrance);
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
};

export const getFotd = async (req: express.Request, res: express.Response) => {
  try {
    let fotd = await FotdModel.findOne().populate("fragrance");
    if (!fotd) {
      await resetFotd();
      fotd = await FotdModel.findOne().populate("fragrance");
      res.status(200).json({ fotd });
      return;
    }
    if (has24HoursPassed(Date.now(), fotd.lastReset)) {
      await resetFotd();
      fotd = await FotdModel.findOne().populate("fragrance");
    }
    res.status(200).json({ fotd });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while trying to fetch fotd:",
      error: err,
    });
  }
};
