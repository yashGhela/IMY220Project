import { Router } from "express";
import fs from "fs";
import path from "path";
import * as Posts from "../models/posts.js";
import { upload } from "../middleware/upload.js";
import { isStr, isValidId } from "../utils/validate.js";

const router = Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { user_id, caption, album_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "An image is required." });
    }

    if (!isStr(caption) || !isStr(user_id)) {
      fs.unlink(req.file.path, () => {}); // remove the uploaded file if validation fails
      return res.status(400).json({ error: "Missing fields." });
    }

    const newPost = {
      user_id: user_id,
      caption: caption.trim(),
      img_link: `/uploads/${req.file.filename}`,
      album_id: album_id || null,
      createdAt: new Date(),
    };

    const result = await Posts.createPost(newPost);

    res.status(201).json({
      _id: result.insertedId,
      img_link: newPost.img_link,
    });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to add post." });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.getAllPosts();

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ error: "Failed to get posts." });
  }
});

// must come before "/:id"
router.get("/u/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const posts = await Posts.getPostsByUser(user_id);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Failed to get user posts." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid post id." });
    }

    const post = await Posts.getPostById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({ error: "Failed to get post." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid post id." });
    }

    const post = await Posts.getPostById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    await Posts.deletePost(id);

    // delete the image file too
    fs.unlink(path.join("uploads", path.basename(post.img_link)), () => {});

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post." });
  }
});


router.patch("/:id", upload.single("image"), async (req, res) => {
  const cleanup = () => {
    if (req.file) fs.unlink(req.file.path, () => {});
  };

  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      cleanup();
      return res.status(400).json({ error: "Invalid post id." });
    }

    const post = await Posts.getPostById(id);

    if (!post) {
      cleanup();
      return res.status(404).json({ error: "Post not found." });
    }

    // only these fields can be changed
    const updates = {};
    if (isStr(req.body.caption)) {
      updates.caption = req.body.caption.trim();
    }
    if (req.body.album_id !== undefined) {
      updates.album_id = req.body.album_id || null;
    }
    if (req.file) {
      updates.img_link = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    await Posts.updatePost(id, updates);

    
    if (req.file) {
      fs.unlink(path.join("uploads", path.basename(post.img_link)), () => {});
    }

    res.status(200).json({
      message: "Update successful",
      caption: updates.caption ?? post.caption,
      img_link: updates.img_link ?? post.img_link,
    });
  } catch (error) {
    cleanup();
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update Post." });
  }
});

export default router;