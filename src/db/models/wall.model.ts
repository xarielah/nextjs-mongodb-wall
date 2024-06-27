import { Schema, model, models } from "mongoose";

const WallSchema = new Schema(
  {
    user: {
      unique: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    privacy: {
      shareWithAll: {
        type: Boolean,
        default: false,
      },
      sharedWith: {
        type: [String],
        default: [],
      },
    },
    preferences: {
      defaultRTL: {
        type: Boolean,
        default: false,
      },
      defaultPublic: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

export const Wall = models.Wall || model("Wall", WallSchema);
