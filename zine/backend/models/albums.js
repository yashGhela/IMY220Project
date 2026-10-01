import { ObjectId } from "mongodb";
import { collections } from "../db.js";

export const createAlbum = (album) => collections.albums.insertOne(album);

export const getAllAlbums = () => collections.albums.find().toArray();

export const getAlbumsByUser = (user_id) =>
  collections.albums.find({ user_id }).toArray();

export const getAlbumById = (id) =>
  collections.albums.findOne({ _id: new ObjectId(id) });

export const deleteAlbum = (id) =>
  collections.albums.deleteOne({ _id: new ObjectId(id) });

export const updateAlbum = (id, updates) =>
  collections.albums.updateOne({ _id: new ObjectId(id) }, { $set: updates });