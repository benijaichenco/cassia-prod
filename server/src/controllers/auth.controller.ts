import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../models/user.model";
import { TempUserModel } from "../models/tempUser.model";
import { TempUserType, UserDataType } from "../types/types";
import {
  capitalizeFirstLetters,
  emailPatternValidation,
  pwdPatternValidation,
  sendEmail,
} from "../utils";
import { ActiveUsersSessionModel } from "../models/onlineUsersSession.model";

export const register = async (req: express.Request, res: express.Response) => {
  if (!(req.body.fName && req.body.lName && req.body.email && req.body.username && req.body.pwd)) {
    res.status(400).send("One of the required inputs is missing!");
    return;
  }
  const pwdIsValid = pwdPatternValidation(req.body.pwd);
  if (!pwdIsValid) {
    res.status(400).send("Password invalid.");
    return;
  }
  const emailIsValid = emailPatternValidation(req.body.email);
  if (!emailIsValid) {
    res.status(400).send("Email invalid.");
    return;
  }
  const created = new Date();
  const expiresAt = new Date(created.getTime() + 5 * 60 * 1000);
  const hashedPwd = await bcrypt.hash(req.body.pwd, 10);
  const user = {
    firstName: capitalizeFirstLetters(req.body.fName),
    lastName: capitalizeFirstLetters(req.body.lName),
    email: req.body.email.toLowerCase(),
    username: req.body.username.toLowerCase(),
    password: hashedPwd,
    expiresAt,
  };
  const username = user.username.toLowerCase();
  const usernameExists = await UserModel.findOne({ username });
  if (usernameExists) {
    res.status(400).send("Username already exists.");
    return;
  }
  const email = user.email.toLowerCase();
  const emailExists = await UserModel.findOne({ email: email });
  if (emailExists) {
    res.status(201).send("ok");
    return;
  }
  const tempUser = new TempUserModel({
    ...user,
  });
  await tempUser.save();
  const token = jwt.sign({ email, username }, process.env.EMAIL_SECRET_KEY as string, {
    expiresIn: "5m",
  });
  const currentYear = new Date().getFullYear();
  const link =
    "<a href='" +
    process.env.BACKEND_BASE_URL +
    "/api/auth/verify-account?token=" +
    token +
    "' class='button' style='color: #000000'>Confirm Registration</a>";
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirm Registration</title>
        <style>
        * {
          color: #000000;
        }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          a {
            color: #000000
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #000000;
            text-align: center;
            padding: 20px;
          }
          .button {
            display: inline-block;
            margin: 20px 0;
            padding: 12px 24px;
            color: #000000;
            border: 1px solid #000000;
            text-decoration: none;
            font-size: 16px;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Confrim Your Account</h1>
          <p>Hi <strong>${user.firstName}</strong>,</p>
          <p>Thank you for registering! Please confirm your email address by clicking the button below.</p>
          ${link}
          <div class="footer">
            &copy; 2024 - ${currentYear} CASSIA. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
  try {
    await sendEmail(email, "Verify Account", html);
    res.status(201).send("ok");
  } catch (err) {
    res.status(500).send("Failed sending verification link");
  }
};

export const verifyAccount = async (req: express.Request, res: express.Response) => {
  const token = req.query.token as string;
  if (!token) {
    res.status(400).send("Token is missing!");
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.EMAIL_SECRET_KEY as string) as TempUserType;
    const email = payload.email;
    const foundTempUser = await TempUserModel.findOne({ email });
    if (!foundTempUser) {
      const err = new Error("Expiration Error");
      err.name == "TokenExpiredError";
      throw err;
    }
    const { firstName, lastName, username, password } = foundTempUser;
    const newUser = new UserModel({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      username,
      password,
    });
    await newUser.save();
    await TempUserModel.deleteOne({ email });
    res.redirect(302, process.env.FRONTEND_LOGIN_URL as string);
    const currentYear = new Date().getFullYear();
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Confirm Registration</title>
          <style>
          * {
            color: #000000;
          }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            a {
              color: #000000
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border: 1px solid #000000;
              text-align: center;
              padding: 20px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome To CASSIA</h1>
            <p>Hi <strong>${firstName}</strong>, congratulations!</p>
            <p>Your registration is confirmed!</p>
            <p>You can now use all features CASSIA provides and embark on your fragrance journey!</p>
            <p>If you have any questions or concerns, feel free to contact us at <a href="mailto:cassiafragrances@gmail.com">cassiafragrances@gmail.com</a>.</p>
            <div class="footer">
              &copy; 2024 - ${currentYear} CASSIA. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
    await sendEmail(email, "Welcome to CASSIA", html);
  } catch (err) {
    if (typeof err == "object" && (err as Error).name == "TokenExpiredError") {
      res.status(401).send("Verification link has expired. Please try registering again.");
      return;
    }
    res.status(401).send("Verification failed. Please try registering again.");
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    res.status(401).send("Invalid login credentials");
    return;
  }
  try {
    let user;
    if (usernameOrEmail.includes("@")) {
      user = await UserModel.findOne({ email: usernameOrEmail.toLowerCase() });
    } else {
      user = await UserModel.findOne({ username: usernameOrEmail.toLowerCase() });
    }
    if (!user) {
      res.status(401).send("Invalid login credentials");
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send("Invalid login credentials");
      return;
    }
    const payload = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username.toLowerCase(),
      email: user.email,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY as string);
    const tokens = { accessToken, refreshToken };
    const existingSession = await ActiveUsersSessionModel.findOne({ userId: user.userId });
    if (existingSession) {
      existingSession.session = {
        at: accessToken,
        lastActivity: Date.now(),
      };
      await existingSession.save();
    } else {
      const newSession = new ActiveUsersSessionModel({
        userId: user.userId,
        session: {
          at: accessToken,
          lastActivity: Date.now(),
        },
      });
      await newSession.save();
    }
    res.json(tokens);
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  const user = req.user;
  try {
    await ActiveUsersSessionModel.findOneAndDelete({ userId: user.userId });
    res.send("Logged out successfully.");
  } catch (err) {
    res.status(500).json({ message: "Failed deleting user session.", error: err });
  }
};

export const refreshToken = async (req: express.Request, res: express.Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const rt = authHeader.split(" ")?.[1];
    if (rt) {
      try {
        const userData = jwt.verify(rt, process.env.REFRESH_SECRET_KEY as string);
        const at = jwt.sign(userData, process.env.SECRET_KEY as string);
        const userSession = await ActiveUsersSessionModel.findOne({
          userId: (userData as UserDataType).userId,
        });
        if (userSession && userSession) {
          userSession.session.at = at;
          userSession.session.lastActivity = Date.now();
          await userSession.save();
          res.json({ at });
          return;
        }
      } catch (err) {}
      res.status(401).send("Unauthorized! Please log in.");
    }
  }
};
