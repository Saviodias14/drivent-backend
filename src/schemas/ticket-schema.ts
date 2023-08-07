import Joi from "joi";

type CreateTicket = {
    ticketTypeId: number
};

export const createTicketSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().integer().required()
});
