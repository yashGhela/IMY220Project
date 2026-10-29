import { ObjectId } from "mongodb";
import { collections } from "../db.js";

export const createReport = (report) => collections.reports.insertOne(report);

export const getAllReports = () => collections.reports.find().toArray();

export const getReportsByPost = (post_id) =>
  collections.reports.find({ post_id }).toArray();

export const getReportById = (id) =>
  collections.reports.findOne({ _id: new ObjectId(id) });

export const deleteReport = (id) =>
  collections.reports.deleteOne({ _id: new ObjectId(id) });


export const deleteReportsByPost = (post_id) =>
  collections.reports.deleteMany({ post_id });


export const getReportByUserAndPost = (user_id, post_id) =>
  collections.reports.findOne({ user_id, post_id });