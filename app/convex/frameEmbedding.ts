import { v } from "convex/values";
import { action, mutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const fetchResults = internalQuery({
  args: { ids: v.array(v.id("frameEmbeddings")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc === null) {
        continue;
      }
      results.push(doc);
    }
    return results;
  },
});

export const search = action({
  args: {
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const embedding = args.embedding;
    const results = await ctx.vectorSearch("frameEmbeddings", "by_embedding", {
      vector: embedding,
      limit: 16,
    });

    const frames: Array<Doc<"frameEmbeddings">> = await ctx.runQuery(
      internal.frameEmbedding.fetchResults,
      {
        ids: results.map((result) => result._id),
      }
    );
    return frames;
    // return results;
  },
});

export const uploadEmbedding = mutation({
  args: {
    embedding: v.array(v.float64()),
    isText: v.boolean(),
    videoId: v.id("_storage"),
    timeStamp: v.float64(),
  },
  handler: async (ctx, args) => {
    const { embedding, isText, videoId, timeStamp } = args;
    await ctx.db.insert("frameEmbeddings", {
      embedding,
      isText,
      videoId,
      timeStamp,
    });
  },
});

export const uploadEmbeddings = mutation({
  args: {
    embeddingList: v.array(
      v.object({
        embedding: v.array(v.float64()),
        isText: v.boolean(),
        videoId: v.id("_storage"),
        timeStamp: v.float64(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.embeddingList) {
      const { embedding, isText, videoId, timeStamp } = item;

      await ctx.db.insert("frameEmbeddings", {
        embedding,
        isText,
        videoId,
        timeStamp,
      });
    }
  },
});
