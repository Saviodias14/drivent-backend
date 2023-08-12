import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import redis, { DEFAULT_EXP } from "@/config/redis";
import { Hotel, Room } from "@prisma/client";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getHotels(userId: number): Promise<Hotel[]> {
  await listHotels(userId);
  const cacheKey = 'hotels'
  const hotelsCache = await redis.get(cacheKey)
  if (hotelsCache) return JSON.parse(hotelsCache)
  else {
    const hotels = await hotelRepository.findHotels();
    await redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(hotels))
    return hotels;
  }
}

async function getHotelsWithRooms(userId: number, hotelId: number): Promise<Hotel & {Rooms: Room[]}> {
  await listHotels(userId);
  const cacheKey = `hotelId=${hotelId}`
  const hotelCache = await redis.get(cacheKey)
  if (hotelCache) return JSON.parse(hotelCache)
  else {
    const hotel = await hotelRepository.findRoomsByHotelId(hotelId);
    if (!hotel) {
      throw notFoundError();
    }
    await redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(hotel))
    return hotel;
  }
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
