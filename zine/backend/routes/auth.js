import { Router } from "express";
import * as Users from "../models/users.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { isStr } from "../utils/validate.js";

const router = Router();

//SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { username, name, email, password, bio } = req.body;

    if (![username, name, email, password].every(isStr)) {
      return res.status(400).json({
        success: false,
        message: "Username, name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existing = await Users.getUserByUsernameOrEmail(
      username.trim(),
      email.trim().toLowerCase()
    );
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Username or email already in use",
      });
    }

    const newUser = {
      username: username.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await hashPassword(password),
      bio: isStr(bio) ? bio.trim() : "",
      createdAt: new Date(),
    };

    const result = await Users.createUser(newUser);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: result.insertedId,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Failed to create account" });
  }
});

//SIGN IN
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!isStr(username) || !isStr(password)) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await Users.getUserByUsername(username.trim());

    // same message for "no user" and "wrong password"
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ success: false, message: "Failed to sign in" });
  }
});

export default router;