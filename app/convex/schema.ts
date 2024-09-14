import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    tasks: defineTable({
        text: v.string(),
        isCompleted: v.boolean(),
    }),
    videos: defineTable({
        storageId: v.id("_storage"),
        name: v.string(),
        size: v.number(),
        type: v.string(),
        userId: v.string(),
        uploadedAt: v.string(),
        description: v.optional(v.string()),
        duration: v.optional(v.number()),
        thumbnail: v.optional(v.id("_storage")),
        tags: v.optional(v.array(v.string())),
      })
        .index("by_user", ["userId"])
        .index("by_upload_date", ["uploadedAt"]),
    messages: defineTable({
        body: v.id("_storage"),
        author: v.string(),
        format: v.string(),
    }),
});

export default schema;