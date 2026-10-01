import express from "express";
import cors from "cors";

import { connectDB, getDB } from "./db.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


//SERVER CHECK
app.get("/api/get", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is working",
  });
});


//AUTH
app.post("/api/auth/signup", (req, res) => {
  console.log("Signing up");

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: {
      id: 1,
      username,
    },
  });
});

app.post("/api/auth/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  res.json({
    success: true,
    message: "Signed in successfully",
    user: {
      id: 1,
      username,
    },
  });
});


//DB ACTIONS

const db = getDB();
//DB USERS

const usercol = db.collection("Users")

const postscol = db.collection("Posts")

const commentscol = db.collection("Comments")

const albumscol = db.collection("Albums")

const friendscol = db.collection("Friends")


//add user

app.post("api/users", async(req,res)=>{
  try{
    const{username, name, email, password} = req.body

    if (!username || !username.trim() || !name || !name.trim() || !email || !email.trim() || !password || !password.trim()) {
            return res
                .status(400)
                .json({ error: "Missing fields." });
        }
    
    const newUser = {
      username:username, 
      name:name,
      email:email,
      password:passwordd
    }

    const result = await usercol.insertOne(newUser)

    res.status(201).json({
      _id: result.insertedId,
      username: newPost.username,
    })
  }catch(error){
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user." });
  }
})


app.get("api/users", async(req,res)=>{
  try{
    const users = await usercol.find().toArray()
    

    res.status(201).json(users)
  }catch(error){
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Failed to get users." });
  }
})


app.get("api/users/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const user = await usercol.findOne(id);
    

    res.status(201).json(user)
  }catch(error){
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user." });
  }
})

app.delete("api/users/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await usercol.deleteOne(id);
    

    res.status(result.acknowledged)
  }catch(error){
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
})


app.patch("api/users/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const updates = req.body

    delete updates._id
    delete updates.createdAt;

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

   
    const result = await userscol.updateOne(
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



app.post("api/posts", async(req,res)=>{
  try{
    const{user_id, caption, img_link, album_id} = req.body

    if (!caption || !caption.trim() || !img_link || !img_link.trim() || !user_id || !user_id.trim()) {
            return res
                .status(400)
                .json({ error: "Missing fields." });
        }
    
    const newPost = {
      user_id:user_id, 
      caption:caption,
      img_link:img_link,
      album_id:album_id
    }

    const result = await postscol.insertOne(newPost)

    res.status(201).json({
      _id: result.insertedId,
      
    })
  }catch(error){
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to add post." });
  }
})


app.get("api/posts", async(req,res)=>{
  try{
    const posts = await postscol.find().toArray()
    

    res.status(201).json(posts)
  }catch(error){
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to get posts." });
  }
})


app.get("api/posts/u/:user_id", async(req,res)=>{
  try{
    const {id} = req.params
    const posts = await postscol.findMany(id);
    

    res.status(201).json(posts)
  }catch(error){
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Failed to get user posts." });
  }
})

app.get("api/posts/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const post = await postscol.findOne(id);
    

    res.status(201).json(post)
  }catch(error){
    console.error("Error getting post:", error);
    res.status(500).json({ error: "Failed to get post." });
  }
})

app.delete("api/posts/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await postscol.deleteOne(id);
    

    res.status(result.acknowledged)
  }catch(error){
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post." });
  }
})


app.patch("api/posts/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const updates = req.body

    delete updates._id
    delete updates.createdAt;

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

   
    const result = await userscol.updateOne(
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




app.post("api/comments", async(req,res)=>{
  try{
    const{user_id, post_id, comment, timestamp} = req.body

    if (!comment || !comment.trim() || !post_id || !post.trim() || !user_id || !user_id.trim() || !timestamp || !timestamp.trim()) {
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


app.get("api/comments", async(req,res)=>{
  try{
    const comments = await commentscol.find().toArray()
    

    res.status(201).json(comments)
  }catch(error){
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Failed to get comments." });
  }
})



app.get("api/comments/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const comment = await commentscol.findOne(id);
    

    res.status(201).json(comment)
  }catch(error){
    console.error("Error getting comment:", error);
    res.status(500).json({ error: "Failed to get comment." });
  }
})

app.delete("api/comments/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await commentscol.deleteOne(id);
    

    res.status(result.acknowledged)
  }catch(error){
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
})


app.patch("api/comments/:id", async(req,res)=>{
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




app.post("api/friends", async(req,res)=>{
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


app.get("api/friends", async(req,res)=>{
  try{
    const friends = await friendscol.find().toArray()
    

    res.status(201).json(friends)
  }catch(error){
    console.error("Error getting friends:", error);
    res.status(500).json({ error: "Failed to get friends." });
  }
})


app.get("api/friends/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const friends = await friendscol.findMany(id);
    

    res.status(201).json(friends)
  }catch(error){
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Failed to get user posts." });
  }
})



app.delete("api/friends/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await friendscol.deleteOne(id);
    

    res.status(result.acknowledged)
  }catch(error){
    console.error("Error deleting friend:", error);
    res.status(500).json({ error: "Failed to delete friend." });
  }
})


app.patch("api/friends/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const updates = req.body

    delete updates._id
    delete updates.createdAt;

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

   
    const result = await userscol.updateOne(
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




app.post("api/albums", async(req,res)=>{
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


app.get("api/albums", async(req,res)=>{
  try{
    const albums = await albumscol.find().toArray()
    

    res.status(201).json(albums)
  }catch(error){
    console.error("Error adding albums:", error);
    res.status(500).json({ error: "Failed to get albums." });
  }
})




app.get("api/albums/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const album = await albumscol.findOne(id);
    

    res.status(201).json(album)
  }catch(error){
    console.error("Error getting album:", error);
    res.status(500).json({ error: "Failed to get album." });
  }
})

app.delete("api/albums/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await albumscol.deleteOne(id);
    

    res.status(result.acknowledged)
  }catch(error){
    console.error("Error deleting album:", error);
    res.status(500).json({ error: "Failed to delete album." });
  }
})


app.patch("api/albums/:id", async(req,res)=>{
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





connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });