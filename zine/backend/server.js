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
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to add user." });
  }
})


app.get("api/users", async(req,res)=>{
  try{
    const users = await usercol.find().toArray()
    

    res.status(201).json(users)
  }catch(error){
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to get users." });
  }
})


app.get("api/users/:id", async(req,res)=>{
  try{
    const {id} = req.body
    const user = await usercol.findOne(id);
    

    res.status(201).json(user)
  }catch(error){
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to get user." });
  }
})

app.delete("api/users/:id", async(req,res)=>{
  try{
    const {id} = req.params
    const result = await usercol.deleteOne(id);
    

    res.status(result.acknowledged)
  }catch(error){
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to get user." });
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
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to update User." });
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