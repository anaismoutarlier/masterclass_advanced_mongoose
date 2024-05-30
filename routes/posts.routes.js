const { Router } = require("express");
const { Post } = require("../db");

const router = Router();

router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json({ result: true, posts });
});

module.exports = router;
