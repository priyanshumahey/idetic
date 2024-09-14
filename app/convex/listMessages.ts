import { query } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const videos = await ctx.db.query("videos").collect();  // Changed "messages" to "videos"
        return Promise.all(
            videos.map(async (video) => ({
                ...video,
                // If the video is stored in a similar manner as images, retrieve the URL
                ...(video.format === "video"
                    ? { url: await ctx.storage.getUrl(video.body) }  // Handle videos similarly to images
                    : {}),
            })),
        );
    },
});
