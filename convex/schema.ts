import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  // Merged table for both live and preview images
  timeImages: defineTable({
    // Fields for live clock lookup
    hour: v.number(), // 0-23
    minute: v.number(), // 0-59

    // Field for preview lookup
    previewKey: v.optional(v.string()), // Unique key for previews
    // 'second' field removed

    // Common fields
    imageUrl: v.string(), // URL to the image
    scale: v.number(), // e.g., 0.8 for 80% size
    offsetX: v.number(), // Horizontal offset from center in pixels
    offsetY: v.number(), // Vertical offset from center in pixels
    credits: v.string(), // Text credits for the image
  })
  .index("by_hour_and_minute", ["hour", "minute"]) // Index for live clock lookup
  .index("by_previewKey", ["previewKey"]), // Index for preview lookup
};

export default defineSchema({
  ...applicationTables,
});
