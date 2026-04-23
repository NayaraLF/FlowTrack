// Manual mock for Prisma Client – Jest will use this automatically when
// jest.mock('../utils/prismaClient') is called inside test files.
const prisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  workout: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  trainingPlan: {
    findMany: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
};

module.exports = prisma;
