import express from "express";
import cors from "cors";

import { connectDB, getDB } from "./db.js";

import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";


import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { ObjectId } from "mongodb";

fs.mkdirSync("uploads", { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) =>
      cb(null, crypto.randomUUID() + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const app = express();
const PORT = 3001;


app.use("/uploads", express.static("uploads"));

app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json());



const SALT_ROUNDS = 10;


export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}


export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}


//SERVER CHECK
app.get("/api/get", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is working",
  });
});




//DB ACTIONS

const db = getDB();
//DB USERS


//add user

// SIGN UP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, name, email, password, bio } = req.body;

    if (![username, name, email, password].every(isStr)) {
      return res.status(400).json({ success: false, message: "Username, name, email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const existing = await usercol.findOne({
      $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }],
    });
    if (existing) {
      return res.status(409).json({ success: false, message: "Username or email already in use" });
    }

    const newUser = {
      username: username.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: await hashPassword(password),
      bio: isStr(bio) ? bio.trim() : "",
      friends: [],
      createdAt: new Date(),
    };

    const result = await usercol.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: { _id: result.insertedId, username: newUser.username, name: newUser.name, email: newUser.email, bio: newUser.bio },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Failed to create account" });
  }
});

// LOG IN
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!isStr(username) || !isStr(password)) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    const user = await usercol.findOne({ username: username.trim() });

    // Same message for "no user" and "wrong password" so you don't leak which usernames exist
    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: { _id: user._id, username: user.username, name: user.name, email: user.email, bio: user.bio },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ success: false, message: "Failed to sign in" });
  }
});


app.get("/api/users", async(req,res)=>{
  try{
    const users = await usercol.find().toArray()
    

    res.status(201).json(users)
  }catch(error){
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to get users." });
  }
})


app.get("/api/users/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const user = await usercol.findOne({ _id: new ObjectId(id) });
    

    res.status(201).json(user)
  }catch(error){
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user." });
  }
})

app.delete("/api/users/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await usercol.deleteOne({ _id: new ObjectId(id) });
    

    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
res.status(200).json({ message: "Deleted" });
  }catch(error){
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
})


app.patch("/api/users/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const updates = req.body

    delete updates._id
    delete updates.createdAt;

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

   
    const result = await usercol.updateOne(
      {"_id": new ObjectId(id) },
      { "$set": updates } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  }catch(error){
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update User." });
  }
})


//Posts


app.post("/api/posts", upload.single("image"), async (req, res) => {
  try {
    const { user_id, caption, album_id } = req.body

    if (!req.file) {
      return res.status(400).json({ error: "An image is required." });
    }

    if (!caption || !caption.trim() || !user_id || !user_id.trim()) {
      fs.unlink(req.file.path, () => {}); 
      return res.status(400).json({ error: "Missing fields." });
    }

    const newPost = {
      user_id: user_id,
      caption: caption,
      img_link: `/uploads/${req.file.filename}`,
      album_id: album_id || null,
    }

    const result = await postscol.insertOne(newPost)

    res.status(201).json({
      _id: result.insertedId,
      img_link: newPost.img_link,
    })
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to add post." });
  }
})

app.get("/api/posts", async(req,res)=>{
  try{
    const posts = await postscol.find().toArray()
    

    res.status(201).json(posts)
  }catch(error){
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to get posts." });
  }
})


app.get("/api/posts/u/:user_id", async(req,res)=>{
  try{
    const {id} = req.params
    const posts = await postscol.find({id}).toArray();
    

    res.status(201).json(posts)
  }catch(error){
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Failed to get user posts." });
  }
})

app.get("/api/posts/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const post = await postscol.findOne({ _id: new ObjectId(id) });
    

    res.status(201).json(post)
  }catch(error){
    console.error("Error getting post:", error);
    res.status(500).json({ error: "Failed to get post." });
  }
})

app.delete("/api/posts/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await postscol.deleteOne({ _id: new ObjectId(id) });
    

    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
res.status(200).json({ message: "Deleted" });
  }catch(error){
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post." });
  }
})


app.patch("/api/posts/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const updates = req.body

    delete updates._id
    delete updates.createdAt;

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

   
    const result = await postscol.updateOne(
      {"_id": new ObjectId(id) },
      { "$set": updates } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  }catch(error){
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update Post." });
  }
})


//Comments




app.post("/api/comments", async(req,res)=>{
  try{
    const{user_id, post_id, comment, timestamp} = req.body

    if (!comment || !comment.trim() || !post_id || !post_id.trim() || !user_id || !user_id.trim() || !timestamp || !timestamp.trim()) {
            return res
                .status(400)
                .json({ error: "Missing fields." });
        }
    
    const newComment = {
      user_id:user_id, 
      post_id:post_id,
      comment:comment,
      timestamp:timestamp
    }

    const result = await commentscol.insertOne(newComment)

    res.status(201).json({
      _id: result.insertedId,
      
    })
  }catch(error){
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
})


app.get("/api/comments", async(req,res)=>{
  try{
    const comments = await commentscol.find().toArray()
    

    res.status(201).json(comments)
  }catch(error){
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Failed to get comments." });
  }
})



app.get("/api/comments/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const comment = await commentscol.findOne({ _id: new ObjectId(id) });
    

    res.status(201).json(comment)
  }catch(error){
    console.error("Error getting comment:", error);
    res.status(500).json({ error: "Failed to get comment." });
  }
})

app.delete("/api/comments/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await commentscol.deleteOne({ _id: new ObjectId(id) });
    

    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
res.status(200).json({ message: "Deleted" });
  }catch(error){
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
})


app.patch("/api/comments/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const updates = req.body

    delete updates._id
    delete updates.createdAt;

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

   
    const result = await commentscol.updateOne(
      {"_id": new ObjectId(id) },
      { "$set": updates } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "comment not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  }catch(error){
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment." });
  }
})


//Friends




app.post("/api/friends", async(req,res)=>{
  try{
    const{user_id, friend_id} = req.body

    if (!friend_id || !friend_id.trim() || !user_id || !user_id.trim()) {
            return res
                .status(400)
                .json({ error: "Missing fields." });
        }
    
    const newFriend = {
      user_id:user_id, 
      friend_id:friend_id,
    }

    const result = await friendscol.insertOne(newFriend)

    res.status(201).json({
      _id: result.insertedId,
      
    })
  }catch(error){
    console.error("Error adding friend:", error);
    res.status(500).json({ error: "Failed to add friend." });
  }
})


app.get("/api/friends", async(req,res)=>{
  try{
    const friends = await friendscol.find().toArray()
    

    res.status(201).json(friends)
  }catch(error){
    console.error("Error getting friends:", error);
    res.status(500).json({ error: "Failed to get friends." });
  }
})


app.get("/api/friends/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const friends = await friendscol.find({id}).toArray();
    

    res.status(201).json(friends)
  }catch(error){
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Failed to get user posts." });
  }
})



app.delete("/api/friends/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await friendscol.deleteOne({ _id: new ObjectId(id) });
    

    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
res.status(200).json({ message: "Deleted" });
  }catch(error){
    console.error("Error deleting friend:", error);
    res.status(500).json({ error: "Failed to delete friend." });
  }
})


app.patch("/api/friends/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const updates = req.body

    delete updates._id
    delete updates.createdAt;

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

   
    const result = await friendscol.updateOne(
      {"_id": new ObjectId(id) },
      { "$set": updates } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  }catch(error){
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update Post." });
  }
})


//Albums




app.post("/api/albums", async(req,res)=>{
  try{
    const{user_id, album_name, description} = req.body

    if (!album_name || !album_name.trim() || !description || !description.trim() || !user_id || !user_id.trim()) {
            return res
                .status(400)
                .json({ error: "Missing fields." });
        }
    
    const newAlbum = {
      user_id:user_id, 
      album_name:album_name,
      description:description,
    
    }

    const result = await albumscol.insertOne(newAlbum)

    res.status(201).json({
      _id: result.insertedId,
      
    })
  }catch(error){
    console.error("Error adding album:", error);
    res.status(500).json({ error: "Failed to add album." });
  }
})


app.get("/api/albums", async(req,res)=>{
  try{
    const albums = await albumscol.find().toArray()
    

    res.status(201).json(albums)
  }catch(error){
    console.error("Error adding albums:", error);
    res.status(500).json({ error: "Failed to get albums." });
  }
})




app.get("/api/albums/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const album = await albumscol.findOne({ _id: new ObjectId(id) });
    

    res.status(201).json(album)
  }catch(error){
    console.error("Error getting album:", error);
    res.status(500).json({ error: "Failed to get album." });
  }
})

app.delete("/api/albums/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await albumscol.deleteOne({ _id: new ObjectId(id) });
    

    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
res.status(200).json({ message: "Deleted" });
  }catch(error){
    console.error("Error deleting album:", error);
    res.status(500).json({ error: "Failed to delete album." });
  }
})


app.patch("/api/albums/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const updates = req.body

    delete updates._id
    delete updates.createdAt;

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

   
    const result = await albumscol.updateOne(
      {"_id": new ObjectId(id) },
      { "$set": updates } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(200).json({ message: "Update successful", modifiedCount: result.modifiedCount });
  }catch(error){
    console.error("Error updating Album:", error);
    res.status(500).json({ error: "Failed to update Album." });
  }
})





let usercol, postscol, commentscol, albumscol, friendscol;

connectDB().then(() => {
  const db = getDB();
  usercol = db.collection("Users");
  postscol = db.collection("Posts");
  commentscol = db.collection("Comments");
  albumscol = db.collection("Albums");
  friendscol = db.collection("Friends");

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch((err) => console.error("Failed to connect to MongoDB:", err));