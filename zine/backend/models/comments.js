import { ObjectId } from "mongodb";
import { collections } from "../db.js";

export const createComment = (comment) => collections.comments.insertOne(comment);

export const getAllComments = () => collections.comments.find().toArray();

export const getCommentsByPost = (post_id) =>
  collections.comments.find({ post_id }).toArray();

export const getCommentById = (id) =>
  collections.comments.findOne({ _id: new ObjectId(id) });

export const deleteComment = (id) =>
  collections.comments.deleteOne({ _id: new ObjectId(id) });

export const updateComment = (id, updates) =>
  collections.comments.updateOne({ _id: new ObjectId(id) }, { $set: updates });