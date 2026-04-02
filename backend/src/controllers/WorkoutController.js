const prisma = require('../utils/prismaClient');
const GoogleCalendarService = require('../services/GoogleCalendarService');

class WorkoutController {
  async createWorkout(req, res) {
    try {
      const { userId, title, type, date, notes, exercises } = req.body;

      // Note: for a real app, user creation would happen during auth.
      // Here we will lazily create or fetch a mock user since we don't have full auth wired.
      let user = await prisma.user.findFirst({ where: { id: userId } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: userId || undefined,
            email: 'test@example.com',
            name: 'Test User'
          }
        });
      }

      // Create workout with nested exercises
      const workout = await prisma.workout.create({
        data: {
          title,
          type,
          date: new Date(date),
          notes,
          user: { connect: { id: user.id } },
          exercises: {
            create: exercises // Assuming exercises is an array of objects correctly shaped
          }
        },
        include: {
          exercises: true
        }
      });

      // Google Calendar Logic (commented out by default to not crash if no creds)
      // GoogleCalendarService.setCredentials(user.googleTokens);
      // const eventId = await GoogleCalendarService.createWorkoutEvent(workout);
      // if (eventId) {
      //   await prisma.workout.update({
      //     where: { id: workout.id },
      //     data: { calendarEventId: eventId }
      //   });
      // }

      return res.status(201).json(workout);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create workout' });
    }
  }

  async getAllWorkouts(req, res) {
    try {
      const workouts = await prisma.workout.findMany({
        include: { exercises: true },
        orderBy: { date: 'desc' }
      });
      return res.status(200).json(workouts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch workouts' });
    }
  }

  async getWorkoutById(req, res) {
    try {
      const workout = await prisma.workout.findUnique({
        where: { id: req.params.id },
        include: { exercises: true }
      });
      if (!workout) return res.status(404).json({ error: 'Workout not found' });
      return res.status(200).json(workout);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch workout' });
    }
  }
}

module.exports = new WorkoutController();
