import activitiesRepository from "@/repositories/activities-repository";

async function checks(userId: number) {
  // 1 - Após usuário terminar a inscrição
  // 2 - Pagar e escolher o hotel (se for o caso). Não sendo o caso : mostrar tela “Atividades - Não Disponível”
  // 3 - Se o ingresso não inclui hospedagem. Mostrar tela “Atividades - Tudo Incluído”
  //Tem enrollment?
  return true;
}

async function getActivities(userId: number) {
  await checks(userId);

  const activities = await activitiesRepository.getActivities();
  return activities;
}

async function postActivitie(userId: number, hotelId: number) {
  // Usuário não pode se cadastrar em dois eventos que acontecem simultaneamente.
  // Não é possível desfazer reserva de evento !!!
  await checks(userId);

  const activities = await activitiesRepository.postActivitie(hotelId);
  return activities;
}

const activitiesService = {
  getActivities,
  postActivitie,
};

export default activitiesService;
