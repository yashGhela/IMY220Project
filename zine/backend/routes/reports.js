import { Router } from "express";
import * as Reports from "../models/reports.js";
import * as Posts from "../models/posts.js";
import { isStr, isValidId } from "../utils/validate.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, post_id, reason } = req.body;

    if (!isStr(user_id) || !isStr(reason) || !isValidId(post_id)) {
      return res.status(400).json({ error: "Missing fields." });
    }

    if (reason.trim().length > 300) {
      return res.status(400).json({ error: "Reason must be 300 characters or fewer." });
    }

    const post = await Posts.getPostById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.user_id === user_id) {
      return res.status(400).json({ error: "You can't report your own post." });
    }

    const existing = await Reports.getReportByUserAndPost(user_id, post_id);

    if (existing) {
      return res.status(409).json({ error: "You have already reported this post." });
    }

    const result = await Reports.createReport({
      user_id,
      post_id,
      reason: reason.trim(),
      createdAt: new Date(),
    });

    res.status(201).json({ _id: result.insertedId });
  } catch (error) {
    console.error("Error adding report:", error);
    res.status(500).json({ error: "Failed to add report." });
  }
});

// { post_id: count }, used by the feed to hide heavily reported posts
router.get("/counts", async (req, res) => {
  try {
    const rows = await Reports.getReportCounts();

    res.status(200).json(Object.fromEntries(rows.map((r) => [r._id, r.count])));
  } catch (error) {
    console.error("Error getting report counts:", error);
    res.status(500).json({ error: "Failed to get report counts." });
  }
});

router.get("/", async (req, res) => {
  try {
    const reports = await Reports.getAllReports();

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error getting reports:", error);
    res.status(500).json({ error: "Failed to get reports." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid report id." });
    }

    const result = await Reports.deleteReport(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Report not found." });
    }

    res.status(200).json({ message: "Report deleted" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: "Failed to delete report." });
  }
});

export default router;