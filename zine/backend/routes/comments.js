import { Router } from "express";
import * as Comments from "../models/comments.js";
import { isStr, isValidId, pick } from "../utils/validate.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, post_id, comment } = req.body;

    if (!isStr(comment) || !isStr(post_id) || !isStr(user_id)) {
      return res.status(400).json({ error: "Missing fields." });
    }

    const newComment = {
      user_id: user_id,
      post_id: post_id,
      comment: comment.trim(),
      timestamp: new Date(), // set by the server
    };

    const result = await Comments.createComment(newComment);

    res.status(201).json({
      _id: result.insertedId,
      timestamp: newComment.timestamp,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

router.get("/", async (req, res) => {
  try {
    const comments = await Comments.getAllComments();

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Failed to get comments." });
  }
});

// all comments on one post, must come before "/:id"
router.get("/post/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    const comments = await Comments.getCommentsByPost(post_id);

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting post comments:", error);
    res.status(500).json({ error: "Failed to get post comments." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid comment id." });
    }

    const comment = await Comments.getCommentById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error getting comment:", error);
    res.status(500).json({ error: "Failed to get comment." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid comment id." });
    }

    const result = await Comments.deleteComment(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid comment id." });
    }

    // only the text can be changed
    const updates = pick(req.body, ["comment"]);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    const result = await Comments.updateComment(id, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment." });
  }
});

export default router;