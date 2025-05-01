import { query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel"; // Use Doc from the generated data model

// Type alias for the potentially extended document structure
type TimeImageDoc = Doc<"timeImages"> & { imageUrl: string | null };


export const getPreviewImage = query({
  args: { previewKey: v.string() },
  handler: async (ctx, args): Promise<TimeImageDoc | null> => {
    // Query the merged 'timeImages' table using the 'by_previewKey' index
    const previewDoc = await ctx.db
      .query("timeImages") // Query the merged table
      .withIndex("by_previewKey", (q) => q.eq("previewKey", args.previewKey))
      .unique(); // Expecting only one preview per key

    if (!previewDoc) {
      return null; // No preview found for this key
    }

    // Ensure imageUrl is treated correctly
    const imageUrl = previewDoc.imageUrl ?? null;

    return {
      ...previewDoc,
      imageUrl: imageUrl,
    };
  },
});
