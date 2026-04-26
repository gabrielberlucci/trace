import request from 'supertest';
import { describe, it, afterAll, beforeEach } from 'vitest';
import { app } from '../app';
import { prisma } from '../../lib/prisma';
import { StatusCodes } from 'http-status-codes';

describe('Customer', () => {
  const apiRoute = '/api/v1/customers';
  const validCnpj = '60.342.789/0001-90';
  const validCpf = '480.053.150-07';
  const invalidCnpj = '30.142.681/0001-19';
  const invalidCpf = '381.253.130-11';

  const payloadWithoutDocument = {
    name: 'Customer Teste',
  };
  const payloadWithoutName = {
    document: validCpf,
  };
  const payloadWithBodyNotSpecified = {
    potato: '888=.121312',
  };
  const payload = {
    document: '71.295.179/0001-08',
    name: 'Gabriel',
    phone: '11111111111',
    email: 'teste@gmail.com',
    address: 'Rua teste',
    addressNumber: 1220,
    birthdate: '2005-04-21T22:55:18+00:00',
  };

  beforeEach(async () => {
    await prisma.$queryRawUnsafe(`
                DELETE FROM "Customer"
                WHERE id NOT IN (1, 3)`);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for customer creation with no body`, async () => {
    await request(app).post(apiRoute).send({}).expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for customer creation when sending body without name`, async () => {
    await request(app)
      .post(apiRoute)
      .send(payloadWithoutName)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for customer creation when sending body without document`, async () => {
    await request(app)
      .post(apiRoute)
      .send(payloadWithoutDocument)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for customer creation when sending body with a not mapped camp from JSON`, async () => {
    await request(app)
      .post(apiRoute)
      .send(payloadWithBodyNotSpecified)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for customer creation with invalid document(CPF)`, async () => {
    await request(app)
      .post(apiRoute)
      .send({
        document: invalidCpf,
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for customer creation with invalid document(CNPJ)`, async () => {
    await request(app)
      .post(apiRoute)
      .send({
        document: invalidCnpj,
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for customer creation with invalid personType`, async () => {
    await request(app)
      .post(apiRoute)
      .send({
        document: '778.076.340-49',
        name: 'Test',
        typePerson: 'BAD',
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for customer creation with invalid email`, async () => {
    await request(app)
      .post(apiRoute)
      .send({
        document: '778.076.340-49',
        name: 'Test',
        email: 'notanemail.com',
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.CREATED} for customer creation with valid data`, async () => {
    await request(app).post(apiRoute).send(payload).expect(StatusCodes.CREATED);
  });

  it(`Expect it returns ${StatusCodes.CONFLICT} for customer creation with valid data`, async () => {
    await request(app)
      .post(apiRoute)
      .send({
        document: '05172639000178',
        name: 'Test',
      })
      .expect(StatusCodes.CONFLICT);
  });

  it(`Expect it returns ${StatusCodes.CONFLICT} for customer creation with valid data`, async () => {
    await request(app)
      .post(apiRoute)
      .send({
        document: '07.545.018/0001-18',
        name: 'Test',
        email: 'testepj@gmail.com',
      })
      .expect(StatusCodes.CONFLICT);
  });

  afterAll(async () => {
    await prisma.$queryRawUnsafe(`
        DELETE FROM "Customer"
        WHERE id NOT IN (1, 3)`);
  });
});
