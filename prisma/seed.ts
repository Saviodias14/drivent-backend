import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  let ticketType = await prisma.ticketType.findMany();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  if (ticketType.length===0) {
    await prisma.ticketType.createMany({
      data: [
        {
          name: "Ticket 1",
          price: 235,
          isRemote: false,
          includesHotel: true
        },
        {
          name: "Ticket 2",
          price: 235,
          isRemote: false,
          includesHotel: false
        },
        {
          name: "Ticket 3",
          price: 135,
          isRemote: true,
          includesHotel: false
        }]
    });
  }

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
