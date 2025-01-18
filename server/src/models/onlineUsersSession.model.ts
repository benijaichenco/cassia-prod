import { model, Schema } from "mongoose";

const activeUsersSessionSchema = new Schema({
  userId: { type: String, required: true },
  session: {
    at: { type: String, required: true },
    lastActivity: { type: Number, required: true },
  },
});

export const ActiveUsersSessionModel = model("ActiveUsersSessionModel", activeUsersSessionSchema);
