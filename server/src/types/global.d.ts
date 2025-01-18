import express from "express";
import { UserDataType } from "./types";

declare global {
  namespace Express {
    interface Request {
      user?: UserDataType;
    }
  }
}
