import { healthCheckRouter } from "@/api/healthCheck/healthCheck.router";
import { userRouter } from "@/api/user/user.router";

// routes.ts
import { Router } from "express";

const router = Router();
router.use("/health-check", healthCheckRouter);
router.use(userRouter);

export default router;
