import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import friendRoutes from "./routes/friends.js";
import albumRoutes from "./routes/albums.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


//SERVER CHECK
app.get("/api/get", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is working",
  });
});


//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/albums", albumRoutes);


// multer / general error handler, must come after the routes
app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message });
  next();
});


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });