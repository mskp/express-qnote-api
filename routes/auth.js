import { Router } from "express";
import bcrypt from "bcryptjs";
import { validateLogin, validateSignup } from "../utils/validation.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { error } = validateSignup(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const [emailExists, usernameExists] = await Promise.all([
      User.findOne({ email: req.body.email }),
      User.findOne({ username: req.body.username }),
    ]);

    if (emailExists) return res.status(400).send("Email already exists");
    if (usernameExists) return res.status(400).send("Username already exists");

    let salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(req.body.password, salt);

    let user = new User({ ...req.body, password });
    await user.save();
    return res.status(200).send({ user: user._id });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, username, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) return res.status(400).send("Account doesn't exist");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send("Invalid password");

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
    return res.header("auth-token", token).send(token);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
