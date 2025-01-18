import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 25,
  message: "Too many requests from this IP, please try again in 1 minute.",
});
