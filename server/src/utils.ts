import nodemailer from "nodemailer";
import { FragranceDataType } from "./types/types";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const response = await transporter.sendMail({
    from: `"CASSIA" <${process.env.EMAIL_ADDRESS}>`,
    to,
    subject,
    html,
  });
  return response;
};

export const pwdPatternValidation = (pwd: string) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
  return pwd.length >= 8 && regex.test(pwd);
};

export const emailPatternValidation = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const capitalizeFirstLetters = (str: string) => {
  return str
    .split(" ")
    .map((str: string) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
};

export const checkFetchFragranceQueries = (index: any, field: any, order: any, search: any) => {
  const indexNum = parseInt(index as string, 10);
  if (isNaN(indexNum) || indexNum < 0) {
    throw new Error("Invalid 'index': must be a non-negative number.");
  }

  if (typeof field !== "string" || field.trim() == "") {
    throw new Error("Invalid 'field': must be a non-empty string.");
  }
  const fieldString = field;

  if (typeof order !== "string" || (order !== "asc" && order !== "desc")) {
    throw new Error("Invalid 'order': must be either 'asc' or 'desc'.");
  }
  const orderString = order;

  if (typeof search !== "string") {
    throw new Error("Invalid 'search': must be a string!");
  }
  const searchString = search;

  return {
    indexNum,
    fieldString,
    orderString,
    searchString,
  };
};

export const generateDesc = (fragrance: FragranceDataType) => {
  const typeList = `${fragrance.type1.toLowerCase()}, ${fragrance.type2.toLowerCase()}, and ${fragrance.type3.toLowerCase()}`;
  switch (fragrance.season) {
    case "winter":
      return {
        title: "Chilled Refinement",
        text: `${fragrance.name} by ${fragrance.brand} is perfect for cozy winter days, blending warm and inviting ${typeList} tones to keep you feeling elegant and comforted.`,
      };

    case "summer":
      return {
        title: "Vibrant Serenity",
        text: `${fragrance.name} by ${fragrance.brand} is the ideal companion for sunny summer days, offering a refreshing and invigorating mix of ${typeList} notes that brighten any warm afternoon.`,
      };

    case "both (winter-leaning)":
      return {
        title: "Cool Sophistication",
        text: `${fragrance.name} by ${fragrance.brand} is a versatile choice for cooler days, combining enchanting ${typeList} notes that wrap you in a cozy yet sophisticated allure.`,
      };

    case "both (summer-leaning)":
      return {
        title: "Radiant Essence",
        text: `${fragrance.name} by ${fragrance.brand} is your go-to for breezy, summer-leaning weather, with its vibrant and airy ${typeList} character that feels effortlessly fresh.`,
      };

    default:
      return {
        title: "Effortless Elegance",
        text: `${fragrance.name} by ${fragrance.brand} is a delightful fragrance, featuring a balanced blend of ${typeList} notes suitable for any occasion.`,
      };
  }
};

export const getSeason = (temp: number) => {
  if (temp < 16) {
    return "winter";
  } else if (temp >= 16 && temp <= 23) {
    return "both (winter-leaning)";
  } else if (temp > 23 && temp <= 27) {
    return "both (summer-leaning)";
  } else {
    return "summer";
  }
};

export const has24HoursPassed = (newTimestamp: number, oldTimestamp: number) => {
  const differenceInMs = newTimestamp - oldTimestamp;
  const hours24InMs = 24 * 60 * 60 * 1000;
  return differenceInMs >= hours24InMs;
};
