import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import { UPLOADS_DIR } from "../utils/paths.js";

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// inside multer.diskStorage({ ... })


export const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) =>
      cb(null, crypto.randomUUID() + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});