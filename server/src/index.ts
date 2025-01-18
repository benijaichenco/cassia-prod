import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import commentsRouter from "./routers/comments.router";
import authRouter from "./routers/auth.router";
import { fragrancesRouter } from "./routers/fragrances.router";
import { likesRouter } from "./routers/likes.router";
import { userRouter } from "./routers/user.router";
import { limiter } from "./middleware/rateLimiter.middleware";

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
  })
);

const CONNECTION_URL = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("MongoDB is connected!");
  })
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.listen(PORT, () => {
  console.log("Server is listening on port" + " " + PORT);
});

app.use(limiter);

app.use("/api/fragrances", fragrancesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/auth", authRouter);
app.use("/api/likes", likesRouter);
app.use("/api/user", userRouter);

export default app;
