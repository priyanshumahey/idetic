import { v } from "convex/values";
import { query } from "./_generated/server";

export const listUserVideos = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("author"), args.userId))
      .collect();

    return Promise.all(
      videos.map(async (video) => ({
        ...video,
        ...(video.format === "video"
          ? { url: await ctx.storage.getUrl(video.body) }
          : {}),
      }))
    );
  },
});

export const listAllUserVideos = query({
  handler: async (ctx) => {
    const videos = await ctx.db
      .query("videos")
      .collect();

    return Promise.all(
      videos.map(async (video) => ({
        ...video,
        ...(video.format === "video"
          ? { url: await ctx.storage.getUrl(video.body) }
          : {}),
      }))
    );
  },
});
