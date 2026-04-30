import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { faker } from '@faker-js/faker';
import { typePerson } from '../generated/prisma/client';
import { getCitiesInformation } from '@/clients/cities.clients';
import { Prisma } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const createRandomCustomer = () => ({
  document: faker.string.numeric(11),
  name: faker.person.fullName(),
  birthdate: faker.date.birthdate(),
  email: faker.internet.email(),
  typePerson: typePerson.PF,
});

/**
 * !TODO:
 * refactor ALL this seed file, because this is probably the worst
 * piece of code in all this codebase xP
 */

const customer = faker.helpers.multiple(createRandomCustomer, {
  count: 100,
});

const tableDatas: Prisma.TotalCountCreateManyInput[] = [
  {
    tableName: 'Customer',
    total: await prisma.customer.count(),
  },

  {
    tableName: 'Product',
    total: await prisma.product.count(),
  },

  {
    tableName: 'Supplier',
    total: await prisma.supplier.count(),
  },

  {
    tableName: 'User',
    total: await prisma.user.count(),
  },
];

const seed = async () => {
  // await prisma.customer.createMany({
  //   data: customer,
  // });
  // const mapped = await getCitiesInformation();
  // await prisma.city.createMany({
  //   data: mapped,
  // });

  await prisma.totalCount.createMany({
    data: tableDatas,
  });
};

seed();
