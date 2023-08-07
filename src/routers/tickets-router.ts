import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, getTickets, createTicket } from "@/controllers";
import { validateBody } from "@/middlewares";
import { createTicketSchema } from "@/schemas/ticket-schema";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("", getTickets)
  .get("/ticket-summary")
  .post("", validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
