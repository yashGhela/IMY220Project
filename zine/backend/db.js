import "dotenv/config";
import { MongoClient } from "mongodb";
// Student Number: u25161360

let client;
let db;

async function connectDB() {
    const uri = process.env.MONGO_URI;

    client = new MongoClient(uri);

    await client.connect();
    
    db = client.db("Zine");

    console.log("Connected to MongoDB");
}


export const collections = {
  get users()    { return getDB().collection("Users"); },
  get posts()    { return getDB().collection("Posts"); },
  get comments() { return getDB().collection("Comments"); },
  get albums()   { return getDB().collection("Albums"); },
  get friends()  { return getDB().collection("Friends"); },
};

function getDB() {
    return db;
}

export { connectDB, getDB };