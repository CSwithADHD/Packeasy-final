import { Router, type IRouter } from "express";

import { attachUser } from "../middlewares/auth";
import authRouter from "./auth";
import healthRouter from "./health";
import oauthRouter from "./oauth";
import tripsRouter from "./trips";

const router: IRouter = Router();

router.use(healthRouter);
router.use(attachUser);
router.use(authRouter);
router.use(oauthRouter);
router.use(tripsRouter);

export default router;
