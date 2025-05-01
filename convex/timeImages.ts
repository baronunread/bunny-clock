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
    // Always round down to the previous 10-minute mark
    const prevTen = Math.floor(args.minute / 10) * 10;
    const imageDoc = await ctx.db
      .query("timeImages")
      .withIndex("by_hour_and_minute", (q) =>
        q.eq("hour", args.hour).eq("minute", prevTen)
      )
      .unique();

    if (!imageDoc || imageDoc.previewKey !== undefined) {
      return null; // No live image found for this time or it was a preview image
    }

    // Ensure imageUrl is treated correctly
    const imageUrl = imageDoc.imageUrl ?? null;

    return {
      ...imageDoc,
      imageUrl: imageUrl,
    };
  },
});
