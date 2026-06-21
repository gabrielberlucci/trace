import { getStatesController } from "@/controllers";
import { authMiddleware } from "@/middlewares";
import { Router } from "express";

const localizationRouter: Router = Router();

localizationRouter.get("/state", authMiddleware, getStatesController);

export { localizationRouter };
