import { model, Schema, Types } from "mongoose";

const commentSchema = new Schema({
  commentId: { type: String },
  fragranceId: { type: String },
  user: { type: Types.ObjectId, ref: "UserModel" },
  userId: { type: String },
  createdAt: { type: Number },
  content: { type: String },
  likeCount: { type: Number },
  likes: [{ type: String }],
});

const CommentModel = model("CommentModel", commentSchema);

export default CommentModel;
