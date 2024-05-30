const { Router } = require("express");
const { User } = require("../db");

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, gender, birthdate } = req.body;
    const newUser = await User.create({
      username,
      email,
      password,
      gender,
      birthdate,
    });

    res.json({ result: true, docId: newUser._id });
  } catch (error) {
    res
      .status(500)
      .json({ result: false, error: error.message, stack: error.stack });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  res.json({ result: Boolean(user), user });
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const data = await User.deleteOne({ _id: userId });

  res.json({ result: true, ...data });
});
module.exports = router;
