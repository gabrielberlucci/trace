import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === 'development') {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter, log: ['query', 'error'] });
  } else {
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
  }
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export { prisma };
