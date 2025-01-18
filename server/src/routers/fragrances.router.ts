import express from "express";
import { getFotd, getFragrances, getSingleFragrance } from "../controllers/fragrances.controller";

export const fragrancesRouter = express.Router();

fragrancesRouter.get("/", getFragrances);
fragrancesRouter.get("/single/:fragranceId", getSingleFragrance);
fragrancesRouter.get("/fotd", getFotd);
