import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db.query("videos").collect();
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
