import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async ({ db }) => {
    return await db.query("videos").collect();
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.id("_storage"), author: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("videos", {
      body: args.storageId,
      author: args.author,
      format: "video",
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db.query("videos").collect();
    return Promise.all(
      videos.map(async (video) => ({
        ...video,
        ...{ url: await ctx.storage.getUrl(video.body) },
      }))
    );
  },
});

export const getVideoUrl = query({
  args: { videoId: v.id("_storage") },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("body"), args.videoId))
      .collect();

    return Promise.all(
      videos.map(async (video) => ({
        ...video,
        ...{ url: await ctx.storage.getUrl(video.body) },
      }))
    );
  },
});
