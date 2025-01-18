import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
  verifyAccount,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const authRouter = express.Router();

authRouter.get("/verify-account", verifyAccount);
authRouter.get("/refresh-token", refreshToken);
authRouter.put("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
