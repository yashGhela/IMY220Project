import { ObjectId } from "mongodb";
import { collections } from "../db.js";

export const createPost = (post) => collections.posts.insertOne(post);

export const getAllPosts = () => collections.posts.find().toArray();

export const getPostsByUser = (user_id) =>
  collections.posts.find({ user_id }).toArray();

export const getPostById = (id) =>
  collections.posts.findOne({ _id: new ObjectId(id) });

export const deletePost = (id) =>
  collections.posts.deleteOne({ _id: new ObjectId(id) });

export const updatePost = (id, updates) =>
  collections.posts.updateOne({ _id: new ObjectId(id) }, { $set: updates });

export const removeAlbumFromPosts = (album_id) =>
  collections.posts.updateMany({ album_id }, { $set: { album_id: null } });