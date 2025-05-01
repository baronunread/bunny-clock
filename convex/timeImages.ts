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
    // Try to find the exact image first
    let imageDoc = await ctx.db
      .query("timeImages")
      .withIndex("by_hour_and_minute", (q) =>
        q.eq("hour", args.hour).eq("minute", args.minute)
      )
      .unique();

    // If not found, search for the previous 10-minute mark only
    if ((!imageDoc || imageDoc.previewKey !== undefined) && (args.minute % 10 !== 0)) {
      const prevTen = Math.floor(args.minute / 10) * 10;
      if (prevTen !== args.minute) {
        imageDoc = await ctx.db
          .query("timeImages")
          .withIndex("by_hour_and_minute", (q) =>
            q.eq("hour", args.hour).eq("minute", prevTen)
          )
          .unique();
        if (imageDoc && imageDoc.previewKey !== undefined) {
          imageDoc = null;
        }
      }
    }

    if (!imageDoc || imageDoc.previewKey !== undefined) {
      return null; // No live image found for this time or previous 10-min mark, or it was a preview image
    }

    // Ensure imageUrl is treated correctly
    const imageUrl = imageDoc.imageUrl ?? null;

    return {
      ...imageDoc,
      imageUrl: imageUrl,
    };
  },
});
