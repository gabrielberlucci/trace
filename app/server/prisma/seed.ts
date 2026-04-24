import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { faker } from '@faker-js/faker';
import { typePerson } from '../generated/prisma/client';
import { getCitiesInformation } from '@/clients/cities.clients';

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

const customer = faker.helpers.multiple(createRandomCustomer, {
  count: 100,
});

const seed = async () => {
  // await prisma.customer.createMany({
  //   data: customer,
  // });
  // const mapped = await getCitiesInformation();
  // await prisma.city.createMany({
  //   data: mapped,
  // });
};

seed();
