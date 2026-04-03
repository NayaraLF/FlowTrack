const prisma = require('../utils/prismaClient');

class TrainingPlanController {
  async getPlan(req, res) {
    try {
      const userId = req.userId;
      const plans = await prisma.trainingPlan.findMany({
        where: { userId },
        include: {
          routines: {
            include: {
              exercises: {
                orderBy: { order: 'asc' }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Se houver planos, retorna o mais recente, senão nulo
      return res.status(200).json(plans.length > 0 ? plans[0] : null);
    } catch (error) {
      console.error('Error fetching training plan:', error);
      return res.status(500).json({ error: 'Erro ao buscar plano de treino.' });
    }
  }

  async createOrUpdatePlan(req, res) {
    try {
      const userId = req.userId;
      const { title, routines } = req.body;

      // Por simplicidade: apaga plano anterior e cria um novo inteiro.
      // Em um app completo, faríamos upsert.
      await prisma.trainingPlan.deleteMany({
        where: { userId }
      });

      const newPlan = await prisma.trainingPlan.create({
        data: {
          userId,
          title: title || 'Meu Plano de Treino',
          routines: {
            create: routines.map((routine) => ({
              name: routine.name,
              targetGroup: routine.targetGroup,
              exercises: {
                create: routine.exercises.map((ex, index) => ({
                  exercise: ex.exercise,
                  sets: ex.sets,
                  reps: ex.reps,
                  load: ex.load || '',
                  observation: ex.observation || '',
                  order: index
                }))
              }
            }))
          }
        },
        include: {
          routines: {
            include: {
              exercises: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      return res.status(200).json(newPlan);
    } catch (error) {
      console.error('Error saving training plan:', error);
      return res.status(500).json({ error: error.message || 'Erro ao salvar plano de treino.' });
    }
  }
}

module.exports = new TrainingPlanController();
