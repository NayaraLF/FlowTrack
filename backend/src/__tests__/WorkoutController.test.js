'use strict';

jest.mock('../utils/prismaClient');
// GoogleCalendarService não é usado nos testes, mas o controller importa o módulo.
// Criamos um mock simples para evitar que tente conectar.
jest.mock('../services/GoogleCalendarService', () => ({
  setCredentials: jest.fn(),
  createWorkoutEvent: jest.fn().mockResolvedValue(null),
}));

const prisma = require('../utils/prismaClient');
const workoutController = require('../controllers/WorkoutController');

// ─── Helpers ────────────────────────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

// ────────────────────────────────────────────────────────────────────────────
// createWorkout
// ────────────────────────────────────────────────────────────────────────────
describe('WorkoutController.createWorkout', () => {
  it('deve retornar 401 se userId estiver ausente', async () => {
    const req = { body: {}, userId: undefined };
    const res = mockRes();

    await workoutController.createWorkout(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('deve retornar 404 se o usuário não existir no banco', async () => {
    const req = {
      userId: 'user-999',
      body: { title: 'Treino A', type: 'gym', date: new Date().toISOString(), notes: '', exercises: [] },
    };
    const res = mockRes();

    prisma.user.findUnique.mockResolvedValue(null);

    await workoutController.createWorkout(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('deve criar um workout e retornar 201', async () => {
    const req = {
      userId: 'user-1',
      body: {
        title: 'Treino A',
        type: 'gym',
        date: '2025-04-23T10:00:00.000Z',
        notes: 'Foco em pernas',
        exercises: [{ name: 'Agachamento', sets: 3, reps: 12 }],
      },
    };
    const res = mockRes();

    const fakeUser = { id: 'user-1', name: 'Nayara', email: 'nayara@test.com' };
    const fakeWorkout = {
      id: 'workout-1',
      title: 'Treino A',
      type: 'gym',
      date: new Date('2025-04-23T10:00:00.000Z'),
      notes: 'Foco em pernas',
      userId: 'user-1',
      exercises: [{ id: 'ex-1', name: 'Agachamento', sets: 3, reps: 12 }],
    };

    prisma.user.findUnique.mockResolvedValue(fakeUser);
    prisma.workout.create.mockResolvedValue(fakeWorkout);

    await workoutController.createWorkout(req, res);

    expect(prisma.workout.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeWorkout);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// getAllWorkouts
// ────────────────────────────────────────────────────────────────────────────
describe('WorkoutController.getAllWorkouts', () => {
  it('deve retornar 401 sem userId', async () => {
    const req = { userId: undefined };
    const res = mockRes();

    await workoutController.getAllWorkouts(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('deve retornar lista de workouts com status 200', async () => {
    const req = { userId: 'user-1' };
    const res = mockRes();

    const fakeWorkouts = [
      { id: 'w1', title: 'Treino A', exercises: [] },
      { id: 'w2', title: 'Treino B', exercises: [] },
    ];
    prisma.workout.findMany.mockResolvedValue(fakeWorkouts);

    await workoutController.getAllWorkouts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeWorkouts);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// getWorkoutById
// ────────────────────────────────────────────────────────────────────────────
describe('WorkoutController.getWorkoutById', () => {
  it('deve retornar 404 se o workout não existir', async () => {
    const req = { params: { id: 'workout-999' } };
    const res = mockRes();

    prisma.workout.findUnique.mockResolvedValue(null);

    await workoutController.getWorkoutById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Workout not found' });
  });

  it('deve retornar o workout com status 200', async () => {
    const fakeWorkout = { id: 'workout-1', title: 'Treino A', exercises: [] };
    const req = { params: { id: 'workout-1' } };
    const res = mockRes();

    prisma.workout.findUnique.mockResolvedValue(fakeWorkout);

    await workoutController.getWorkoutById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeWorkout);
  });
});
