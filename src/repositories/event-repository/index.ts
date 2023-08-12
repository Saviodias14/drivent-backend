import { prisma } from "@/config";
import redis, { DEFAULT_EXP } from "@/config/redis";
import { Event } from "@prisma/client";


async function findFirst():Promise<Event> {
  const cacheEvent = 'event'
  const event = await redis.get(cacheEvent)

  if (event) return JSON.parse(event)
  else {
    const PrismaEvent = await prisma.event.findFirst();
    if(PrismaEvent) await redis.setEx(cacheEvent, DEFAULT_EXP, JSON.stringify(PrismaEvent))
    return PrismaEvent
  }
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
