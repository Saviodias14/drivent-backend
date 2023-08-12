import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { gitHubUser } from "../services/users-service";

export async function validateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.body.headers.Authorization;
  if (!authHeader) return res.sendStatus(httpStatus.UNAUTHORIZED);
  try {
    const token = authHeader.split(' ')[1];
    const userGitHub = await gitHubUser(token);
    res.locals.user = userGitHub;
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}