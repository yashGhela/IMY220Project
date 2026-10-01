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

function getDB() {
    return db;
}

export { connectDB, getDB };