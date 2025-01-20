import express from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ActiveUsersSessionModel } from "../models/onlineUsersSession.model";
import { UserDataType } from "../types/types";

export const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Authorization header missing" });
    return;
  }

  const token = authHeader.split(" ")?.[1];
  if (!token) {
    res.status(401).json({ error: "Token is missing" });
    return;
  }

  try {
    const userData = jwt.verify(token, process.env.SECRET_KEY as string);
    req.user = userData as UserDataType;
    const userSession = await ActiveUsersSessionModel.findOne({ userId: req.user.userId });
    if (userSession.session.at !== token) {
      res.status(403).send("Token is invalid!");
      return;
    }
    if (userSession && userSession.session) {
      userSession.session.lastActivity = Date.now();
    }
    await userSession?.save();
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
    } else if (err instanceof JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
    return;
  }
};
