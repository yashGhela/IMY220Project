import { Router } from "express";
import * as Albums from "../models/albums.js";
import { isStr, isValidId, pick } from "../utils/validate.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, album_name, description } = req.body;

    if (!isStr(album_name) || !isStr(description) || !isStr(user_id)) {
      return res.status(400).json({ error: "Missing fields." });
    }

    const newAlbum = {
      user_id: user_id,
      album_name: album_name.trim(),
      description: description.trim(),
      createdAt: new Date(),
    };

    const result = await Albums.createAlbum(newAlbum);

    res.status(201).json({
      _id: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding album:", error);
    res.status(500).json({ error: "Failed to add album." });
  }
});

router.get("/", async (req, res) => {
  try {
    const albums = await Albums.getAllAlbums();

    res.status(200).json(albums);
  } catch (error) {
    console.error("Error getting albums:", error);
    res.status(500).json({ error: "Failed to get albums." });
  }
});

// must come before "/:id"
router.get("/u/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const albums = await Albums.getAlbumsByUser(user_id);

    res.status(200).json(albums);
  } catch (error) {
    console.error("Error getting user albums:", error);
    res.status(500).json({ error: "Failed to get user albums." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid album id." });
    }

    const album = await Albums.getAlbumById(id);

    if (!album) {
      return res.status(404).json({ error: "Album not found." });
    }

    res.status(200).json(album);
  } catch (error) {
    console.error("Error getting album:", error);
    res.status(500).json({ error: "Failed to get album." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid album id." });
    }

    const result = await Albums.deleteAlbum(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Album not found." });
    }

    res.status(200).json({ message: "Album deleted" });
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ error: "Failed to delete album." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid album id." });
    }

    // only these fields can be changed
    const updates = pick(req.body, ["album_name", "description"]);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    const result = await Albums.updateAlbum(id, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error updating Album:", error);
    res.status(500).json({ error: "Failed to update Album." });
  }
});

export default router;