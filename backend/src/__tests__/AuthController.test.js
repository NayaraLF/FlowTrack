'use strict';

jest.mock('../utils/prismaClient');

const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Re-require after mocking so the controller uses the mocked prisma
const authController = require('../controllers/AuthController');

// ─── Helpers ────────────────────────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ────────────────────────────────────────────────────────────────────────────
// register
// ────────────────────────────────────────────────────────────────────────────
describe('AuthController.register', () => {
  it('deve retornar 400 se email ou senha estiverem ausentes', async () => {
    const req = { body: { name: 'Teste' } }; // sem email e senha
    const res = mockRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
  });

  it('deve retornar 400 se o usuário já existir', async () => {
    const req = { body: { name: 'Nayara', email: 'nayara@test.com', password: '123456' } };
    const res = mockRes();

    prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'nayara@test.com' });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
  });

  it('deve criar usuário e retornar token com status 201', async () => {
    const req = { body: { name: 'Nayara', email: 'nayara@test.com', password: '123456' } };
    const res = mockRes();

    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      name: 'Nayara',
      email: 'nayara@test.com',
      profileCompleted: false,
      gender: null,
      weight: null,
      targetWeight: null,
      height: null,
      age: null,
      trainingType: null,
    });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg).toHaveProperty('token');
    expect(jsonArg.user).toMatchObject({ email: 'nayara@test.com', name: 'Nayara' });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// login
// ────────────────────────────────────────────────────────────────────────────
describe('AuthController.login', () => {
  it('deve retornar 400 se o usuário não for encontrado', async () => {
    const req = { body: { email: 'noexist@test.com', password: '123456' } };
    const res = mockRes();

    prisma.user.findUnique.mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  it('deve retornar 400 se a senha estiver incorreta', async () => {
    const req = { body: { email: 'nayara@test.com', password: 'wrong_pass' } };
    const res = mockRes();

    const hashedPassword = await bcrypt.hash('correct_pass', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'nayara@test.com',
      password: hashedPassword,
    });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  it('deve retornar token com status 200 para credenciais válidas', async () => {
    const plainPassword = 'correct_pass';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const req = { body: { email: 'nayara@test.com', password: plainPassword } };
    const res = mockRes();

    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Nayara',
      email: 'nayara@test.com',
      password: hashedPassword,
      profileCompleted: true,
      gender: 'Feminino',
      weight: 65,
      targetWeight: 60,
      height: 165,
      age: 28,
      trainingType: 'gym',
    });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg).toHaveProperty('token');
    expect(jwt.verify(jsonArg.token, process.env.JWT_SECRET || 'super-secret-flowtrack-dev-key')).toMatchObject({
      id: 'user-1',
      email: 'nayara@test.com',
    });
  });
});
