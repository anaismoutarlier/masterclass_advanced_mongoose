const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    //   comments: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  {
    timestamps: true,
  }
);

PostSchema.pre("find", function (next) {
  // this = request / query
  this.populate("user");
  next();
});

PostSchema.pre("findOne", function (next) {
  // this = request / query
  this.populate("user");
  next();
});

const Post = mongoose.model("posts", PostSchema);

const Comment = mongoose.model(
  "comments",
  mongoose.Schema(
    {
      content: String,
      post: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = { Post, Comment };
