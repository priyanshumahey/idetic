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
});

export default schema;