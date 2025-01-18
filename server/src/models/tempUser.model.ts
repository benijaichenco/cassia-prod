import { model, Schema } from "mongoose";

const tempUserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
});

export const TempUserModel = model("TempUserModel", tempUserSchema);
