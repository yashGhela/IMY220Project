import { Router } from "express";
import * as Friends from "../models/friends.js";
import { isStr, isValidId, pick } from "../utils/validate.js";

const router = Router();

// sends a friend request (status "pending"), user_id = sender, friend_id = receiver
router.post("/", async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;

    if (!isStr(friend_id) || !isStr(user_id)) {
      return res.status(400).json({ error: "Missing fields." });
    }

    if (user_id === friend_id) {
      return res.status(400).json({ error: "You can't friend yourself." });
    }

    const existing = await Friends.getFriendship(user_id, friend_id);
    if (existing) {
      return res.status(409).json({ error: "Friend request already exists." });
    }

    const newFriend = {
      user_id: user_id,
      friend_id: friend_id,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await Friends.createFriend(newFriend);

    res.status(201).json({
      _id: result.insertedId,
      status: newFriend.status,
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ error: "Failed to add friend." });
  }
});

router.get("/", async (req, res) => {
  try {
    const friends = await Friends.getAllFriends();

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error getting friends:", error);
    res.status(500).json({ error: "Failed to get friends." });
  }
});

// all friendships / requests involving a user, must come before "/:id"
router.get("/u/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const friends = await Friends.getFriendsByUser(user_id);

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error getting user friends:", error);
    res.status(500).json({ error: "Failed to get user friends." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid friend id." });
    }

    const friend = await Friends.getFriendById(id);

    if (!friend) {
      return res.status(404).json({ error: "Friend record not found." });
    }

    res.status(200).json(friend);
  } catch (error) {
    console.error("Error getting friend:", error);
    res.status(500).json({ error: "Failed to get friend." });
  }
});

// unfriend or cancel / decline a request
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid friend id." });
    }

    const result = await Friends.deleteFriend(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Friend record not found." });
    }

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    console.error("Error deleting friend:", error);
    res.status(500).json({ error: "Failed to delete friend." });
  }
});

// accept a request: PATCH { status: "accepted" }
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid friend id." });
    }

    const updates = pick(req.body, ["status"]);

    if (!["pending", "accepted"].includes(updates.status)) {
      return res.status(400).json({ error: "Status must be 'pending' or 'accepted'." });
    }

    const result = await Friends.updateFriend(id, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Friend record not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating friend:", error);
    res.status(500).json({ error: "Failed to update friend." });
  }
});

export default router;