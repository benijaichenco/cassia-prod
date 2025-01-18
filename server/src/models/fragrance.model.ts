import { model, Schema } from "mongoose";

const fragranceSchema = new Schema({
  fragranceId: { type: String },
  name: { type: String },
  brand: { type: String },
  longevity: { type: String },
  sillage: { type: String },
  type1: { type: String },
  type2: { type: String },
  type3: { type: String },
  price: { type: String },
  scentgn: { type: String },
  combined_types: { type: String },
  year: { type: Number },
  concentration: { type: String },
  notes_base: { type: String },
  notes_middle: { type: String },
  notes_top: { type: String },
  image_name: { type: String },
  dom_color: { type: String },
  season: { type: String },
  likeCount: { type: Number },
  likes: [{ type: String }],
  dislikeCount: { type: Number },
  dislikes: [{ type: String }],
});

const FragranceModel = model("FragranceModel", fragranceSchema);
export default FragranceModel;
