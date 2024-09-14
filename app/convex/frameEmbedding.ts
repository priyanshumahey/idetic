import { v } from "convex/values";
import { action, mutation } from "./_generated/server";

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

    return results;
  },
});

export const uploadEmbedding = mutation({
  args: {
    embedding: v.array(v.float64()),
    isText: v.boolean(),
    videoId: v.id("_storage"),
    timeStamp: v.int64(),
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

// export const uploadEmbeddings = mutation({
//   args: {
//     embeddingList: v.array({
//       embedding: v.array(v.float64()),
//       isText: v.boolean(),
//       videoId: v.id("_storage"),
//       timeStamp: v.int64(),
//     }),
//   },
//   handler: async (ctx, args) => {
//     // await ctx.db.insert("frameEmbeddings", {
//     //   embedding,
//     //   isText,
//     //   videoId,
//     //   timeStamp,
//     // });
//   },
// });
