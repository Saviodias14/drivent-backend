import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const activities = await activitiesService.getActivities(userId);

    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postActivitie(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const activities = await activitiesService.postActivitie(userId, Number(roomId));

    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "CannotBookingError") return res.sendStatus(httpStatus.FORBIDDEN);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
