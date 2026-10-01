import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// always backend/uploads, no matter where `npm start` is run from
export const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// turns "/uploads/abc.jpg" into the file's real location on disk
export const uploadPath = (link) => path.join(UPLOADS_DIR, path.basename(link));