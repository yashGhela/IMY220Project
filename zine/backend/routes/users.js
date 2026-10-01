import { Router } from "express";
import * as Users from "../models/users.js";
import { isValidId, pick } from "../utils/validate.js";

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

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid user id." });
    }

    // only these fields can be changed
    const updates = pick(req.body, ["name", "email", "bio"]);
    if (updates.email) updates.email = updates.email.toLowerCase();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    const result = await Users.updateUser(id, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update User." });
  }
});

export default router;