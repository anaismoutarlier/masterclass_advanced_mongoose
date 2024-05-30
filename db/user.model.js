const mongoose = require("mongoose");
const moment = require("moment");
const { Post, Comment } = require("./post.model");
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      select: false,
      trim: true,
      validate: {
        validator: val =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            val
          ),
        message: ({ value }) => `${value} is not a valid email.`,
      },
    },
    password: {
      type: String,
      select: false,
      // this = document
      required: () => this.status !== "pending",
    },
    type: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
    birthdate: Date,
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("age").get(function () {
  // this = document
  if (!this.birthdate) return null;

  return moment().diff(this.birthdate, "years");
});

UserSchema.post("deleteOne", async function () {
  // this = request / query

  const userId = this.getFilter()._id;
  console.log("Post middleware", userId);
  await Post.deleteMany({ user: userId });
  await Comment.deleteMany({ user: userId });
});

module.exports = mongoose.model("users", UserSchema);
