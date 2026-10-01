import { Router } from "express";
import * as Users from "../models/users.js";
import { isValidId, pick } from "../utils/validate.js";
import fs from "fs";
import path from "path";
import { upload } from "../middleware/upload.js";

const router = Router();

// (adding a user is handled by POST /api/auth/signup)

router.get("/", async (req, res) => {
  try {
    const users = await Users.getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to get users." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid user id." });
    }

    const user = await Users.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid user id." });
    }

    const result = await Users.deleteUser(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

router.patch("/:id/profile-pic", upload.single("profile_pic"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "An image is required." });
    }

    if (!isValidId(id)) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: "Invalid user id." });
    }

    const user = await Users.getUserById(id);

    if (!user) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ error: "User not found." });
    }

    const profile_pic = `/uploads/${req.file.filename}`;
    await Users.updateUser(id, { profile_pic });

    // delete the old picture file
    if (user.profile_pic) {
      fs.unlink(path.join("uploads", path.basename(user.profile_pic)), () => {});
    }

    res.status(200).json({ message: "Profile picture updated", profile_pic });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture." });
  }
});
export default router;