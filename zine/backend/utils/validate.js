import { ObjectId } from "mongodb";

export const isStr = (v) => typeof v === "string" && v.trim().length > 0;

export const isValidId = (id) => typeof id === "string" && ObjectId.isValid(id);

// Copies only the allowed, non-empty string fields from the body (used for PATCH)
export const pick = (body, allowed) => {
  const out = {};
  for (const key of allowed) {
    if (isStr(body[key])) out[key] = body[key].trim();
  }
  return out;
};