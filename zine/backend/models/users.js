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

// escapes regex characters so "a.b" or "(" in the search can't break the query
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchUsers = (term) => {
  const regex = new RegExp(escapeRegex(term), "i"); // case-insensitive, matches anywhere
  return collections.users
    .find({ $or: [{ username: regex }, { name: regex }] }, safe)
    .limit(20)
    .toArray();
};