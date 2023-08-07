import { prisma } from "@/config";

async function getActivities() {
  // Atividades são divididas por dias e espaços.
  // atividade tem um número limitado de vagas
  // esgotada, novos integrantes não podem se cadastrar
  return prisma.hotel.findMany();
}

async function postActivitie(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

const activitiesRepository = {
  getActivities,
  postActivitie,
};

export default activitiesRepository;