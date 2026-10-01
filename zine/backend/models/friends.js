import { ObjectId } from "mongodb";
import { collections } from "../db.js";

export const createFriend = (friend) => collections.friends.insertOne(friend);

export const getAllFriends = () => collections.friends.find().toArray();

// every friendship/request where this user is on either side
export const getFriendsByUser = (user_id) =>
  collections.friends
    .find({ $or: [{ user_id }, { friend_id: user_id }] })
    .toArray();

// checks both directions so you can't send a duplicate request
export const getFriendship = (a, b) =>
  collections.friends.findOne({
    $or: [
      { user_id: a, friend_id: b },
      { user_id: b, friend_id: a },
    ],
  });

export const getFriendById = (id) =>
  collections.friends.findOne({ _id: new ObjectId(id) });

export const deleteFriend = (id) =>
  collections.friends.deleteOne({ _id: new ObjectId(id) });

export const updateFriend = (id, updates) =>
  collections.friends.updateOne({ _id: new ObjectId(id) }, { $set: updates });