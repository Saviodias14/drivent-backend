import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";

async function getTicketTypes() {
  const ticketTypes = await ticketRepository.findTicketTypes();

  if (!ticketTypes) {
    throw notFoundError();
  }
  return ticketTypes;
}

async function getTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticketType = await ticketRepository.findTicketTypeById(ticketTypeId);
  if (!enrollment || !ticketType) {
    throw notFoundError();
  }

  const ticketData = {
    ticketTypeId,
    enrollmentId: enrollment.id,
    status: TicketStatus.RESERVED
  };
  
  await ticketRepository.createTicket(ticketData);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  return ticket;
}

async function getTicketSummary(userId: number){
  const checkEnrollment = await enrollmentRepository.findWithAddressByUserId(userId)
  if(!checkEnrollment) throw notFoundError()

  const result =  await ticketRepository.getTicketSummary(userId)

  return result
}

const ticketService = {
  getTicketTypes,
  getTicketByUserId,
  createTicket,
  getTicketSummary
};

export default ticketService;
