import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    comment: {
      trype: Schema.Types.ObjectId,
      ref: "Comment",
    },
    video: {
      trype: Schema.Types.ObjectId,
      ref: "Video",
    },
    likedBy: {
      trype: Schema.Types.ObjectId,
      ref: "User",
    },
    tweet: {
      trype: Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true },
);

const Like = mongoose.model("Like", likeSchema);
