import { Router } from "express";
import { z } from "zod";
import { ServiceModel } from "../models/Service";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireAdmin } from "../middleware/auth";
import { ApiError } from "../middleware/errors";

const router = Router();

const serviceSchema = z.object({
  title: z.string().min(2),
  desc: z.string().min(2),
  category: z.enum(["stay", "event"]),
  icon: z.string().min(1),
  priceFrom: z.number().positive().nullable().optional(),
  unit: z.string().optional(),
  image: z.string().min(1),
  promoText: z.string().optional(),
  comingSoon: z.boolean().optional(),
  order: z.number().optional(),
});

// Public — powers the /services page. Anyone can read; only admins write.
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const services = await ServiceModel.find().sort({ order: 1, createdAt: 1 });
    res.json({ services });
  })
);

router.post(
  "/",
  requireAdmin,
  validateBody(serviceSchema),
  asyncHandler(async (req, res) => {
    const service = await ServiceModel.create(req.body);
    res.status(201).json({ service });
  })
);

router.put(
  "/:id",
  requireAdmin,
  validateBody(serviceSchema.partial()),
  asyncHandler(async (req, res) => {
    const service = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) throw new ApiError(404, "Service not found");
    res.json({ service });
  })
);

router.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const service = await ServiceModel.findByIdAndDelete(req.params.id);
    if (!service) throw new ApiError(404, "Service not found");
    res.status(204).send();
  })
);

export default router;
