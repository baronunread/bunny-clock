import { query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

// Type alias for the potentially extended document structure
type TimeImageDoc = Doc<"timeImages"> & { imageUrl: string | null };

export const getImageForTime = query({
  args: {
    hour: v.number(), // Expecting 0-23
    minute: v.number(), // Expecting 0-59
  },
  handler: async (ctx, args): Promise<TimeImageDoc | null> => {
    const imageDoc = await ctx.db
      .query("timeImages")
      .withIndex("by_hour_and_minute", (q) =>
        q.eq("hour", args.hour).eq("minute", args.minute)
      )
      // Fetch potential matches (could include preview images at the same hour/minute)
      // We filter *after* fetching the unique one based on time.
      .unique();

    // IMPORTANT: Only return the image if it's NOT a preview image (previewKey is null/undefined)
    if (!imageDoc || imageDoc.previewKey !== undefined) {
      return null; // No live image found for this specific time, or it was a preview image
    }

    // Ensure imageUrl is treated correctly
    const imageUrl = imageDoc.imageUrl ?? null;

    return {
      ...imageDoc,
      imageUrl: imageUrl,
    };
  },
});

// getStorageUrl helper remains unchanged if needed for other purposes
export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
