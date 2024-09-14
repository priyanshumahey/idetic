import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  videos: defineTable({
    body: v.id("_storage"),
    author: v.string(),
    format: v.string(),
  }),
  frameEmbeddings: defineTable({
    embedding: v.array(v.float64()),
    videoId: v.id("_storage"),
    timeStamp: v.int64(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
  }),
});

export default schema;
