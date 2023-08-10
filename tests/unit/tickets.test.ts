import ticketService from "../../src/services/tickets-service";
import ticketRepository from "../../src/repositories/ticket-repository";
import enrollmentRepository from "../../src/repositories/enrollment-repository";
import faker from "@faker-js/faker";

beforeEach(() => {
});
describe('GET tickets type service test', () => {
    it('should respond with status 404', async () => {
        jest.spyOn(ticketRepository, "findTicketTypes").mockImplementationOnce((): any => {
            return null;
        });
        const promise = ticketService.getTicketTypes();

        expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!', });
    });
});

describe('POST tickets service test', () => {
    it('should respond with status 404 if the user does not have a record', async () => {
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return null;
        });
        jest.spyOn(ticketRepository, "findTicketTypeById").mockImplementationOnce((): any => {
            return true;
        });

        const promise = ticketService.createTicket(5, 1);

        expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!', });
    });

    it('should respond with status 404 if the ticket does not exist', async () => {
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return true;
        });
        jest.spyOn(ticketRepository, "findTicketTypeById").mockImplementationOnce((): any => {
            return false;
        });

        const promise = ticketService.createTicket(5, 1);

        expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!', });
    });

});