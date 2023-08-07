import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivities, postActivitie } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("", getActivities)
  .post("", postActivitie);

export { activitiesRouter };
