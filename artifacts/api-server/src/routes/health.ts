import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function respondHealth(_req: Parameters<typeof router.get>[1] extends (...args: infer Args) => any ? Args[0] : never, res: Parameters<typeof router.get>[1] extends (...args: infer Args) => any ? Args[1] : never) {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
}

router.get("/health", respondHealth);
router.get("/healthz", respondHealth);

export default router;
