import { Schema, model, InferSchemaType } from "mongoose";

/**
 * Admin-manageable catalogue entry for the /services page. Mirrors the shape
 * of the (now-fallback-only) static list in the client's lib/services.ts —
 * `icon` is a string key matched against the shared ICONS map on the client
 * rather than a component reference, since it has to travel over JSON.
 */
const serviceSchema = new Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, enum: ["stay", "event"], required: true },
    icon: { type: String, required: true },
    /** Rupees. Omitted/null renders as "Included" on the client. */
    priceFrom: { type: Number, default: null },
    /** Suffix shown after the price, e.g. "per guest". */
    unit: { type: String },
    image: { type: String, required: true },
    /** Optional promotional blurb shown alongside the image. */
    promoText: { type: String },
    /** Shows a "Coming Soon" banner + blurs the image on the client. */
    comingSoon: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type Service = InferSchemaType<typeof serviceSchema>;
export const ServiceModel = model("Service", serviceSchema);
