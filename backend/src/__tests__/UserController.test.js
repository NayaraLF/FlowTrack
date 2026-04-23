'use strict';

jest.mock('../utils/prismaClient');

const prisma = require('../utils/prismaClient');
const userController = require('../controllers/UserController');

// ─── Helpers ────────────────────────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

// ────────────────────────────────────────────────────────────────────────────
// updateProfile
// ────────────────────────────────────────────────────────────────────────────
describe('UserController.updateProfile', () => {
  it('deve retornar 401 se userId estiver ausente', async () => {
    const req = { userId: undefined, body: {} };
    const res = mockRes();

    await userController.updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('deve atualizar o perfil e retornar status 200 com os dados do usuário', async () => {
    const req = {
      userId: 'user-1',
      body: {
        age: '28',
        gender: 'Feminino',
        weight: '65.5',
        targetWeight: '60.0',
        height: '165.0',
        trainingType: 'gym',
      },
    };
    const res = mockRes();

    const updatedUser = {
      id: 'user-1',
      name: 'Nayara',
      email: 'nayara@test.com',
      age: 28,
      gender: 'Feminino',
      weight: 65.5,
      targetWeight: 60.0,
      height: 165.0,
      trainingType: 'gym',
      profileCompleted: true,
    };

    prisma.user.update.mockResolvedValue(updatedUser);

    await userController.updateProfile(req, res);

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          profileCompleted: true,
          gender: 'Feminino',
        }),
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg.message).toBe('Profile updated successfully');
    expect(jsonArg.user).toMatchObject({
      id: 'user-1',
      profileCompleted: true,
      gender: 'Feminino',
      age: 28,
    });
  });

  it('deve passar null para campos não informados', async () => {
    const req = {
      userId: 'user-1',
      body: {
        age: '',       // campo vazio deve virar null
        gender: '',
        weight: '',
        targetWeight: '',
        height: '',
        trainingType: '',
      },
    };
    const res = mockRes();

    const updatedUser = {
      id: 'user-1', name: 'Nayara', email: 'nayara@test.com',
      age: null, gender: null, weight: null, targetWeight: null,
      height: null, trainingType: null, profileCompleted: true,
    };
    prisma.user.update.mockResolvedValue(updatedUser);

    await userController.updateProfile(req, res);

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          age: null,
          gender: null,
          weight: null,
          targetWeight: null,
          height: null,
          trainingType: null,
        }),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
