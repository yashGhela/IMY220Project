import { ObjectId } from "mongodb";
import { collections } from "../db.js";



// never send the password hash back by default
const safe = { projection: { password: 0 } };



export const createUser = (user) => collections.users.insertOne(user);

export const getAllUsers = () => collections.users.find({}, safe).toArray();

export const getUserById = (id) =>
  collections.users.findOne({ _id: new ObjectId(id) }, safe);

// includes the password hash, only use for signing in
export const getUserByUsername = (username) =>
  collections.users.findOne({ username });

export const getUserByUsernameOrEmail = (username, email) =>
  collections.users.findOne({ $or: [{ username }, { email }] });

export const deleteUser = (id) =>
  collections.users.deleteOne({ _id: new ObjectId(id) });

export const updateUser = (id, updates) =>
  collections.users.updateOne({ _id: new ObjectId(id) }, { $set: updates });