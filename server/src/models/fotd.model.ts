import { model, Schema, Types } from "mongoose";

const fotdSchema = new Schema({
  fragrance: { type: Types.ObjectId, ref: "FragranceModel" },
  title: { type: String },
  text: { type: String },
  lastReset: { type: Number },
});

const FotdModel = model("FotdModel", fotdSchema);
export default FotdModel;
