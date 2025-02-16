import { model, Schema } from "mongoose";

const userSchema = new Schema({
  userId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  likedFragrances: { type: [String] },
  dislikedFragrances: { type: [String] },
});

export const UserModel = model("UserModel", userSchema);
