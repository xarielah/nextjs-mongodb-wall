import { Schema, model, models } from "mongoose";

const WallSchema = new Schema(
  {
    user: {
      unique: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    shareWithAll: {
      type: Boolean,
      default: false,
    },
    sharedWith: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Wall = models.Wall || model("Wall", WallSchema);
