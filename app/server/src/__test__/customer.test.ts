import request from 'supertest';
import { describe, it, afterAll, beforeEach } from 'vitest';
import { app } from '../app';
import { prisma } from '../../lib/prisma';
import { StatusCodes } from 'http-status-codes';

describe('Customer route Tests', () => {
  beforeEach(async () => {
    await prisma.$queryRawUnsafe(`
                DELETE FROM "Customer"
                WHERE id > 104`);
  });

  it(`Expect it returns ${StatusCodes.CREATED} for Customer creation`, async () => {
    await request(app)
      .post('/api/v1/customers')
      .send({
        document: '869.469.410-71',
        name: 'Supertest user',
      })
      .expect(StatusCodes.CREATED);
  });

  it(`Expect it returns ${StatusCodes.OK} when changing customer info`, async () => {
    await request(app)
      .patch('/api/v1/customers/103')
      .send({
        address: 'Rua Teste Customer',
        addressNumber: 120,
      })
      .expect(StatusCodes.OK);
  });

  it(`Expect it returns ${StatusCodes.OK} when getting customers`, async () => {
    await request(app).get('/api/v1/customers').expect(StatusCodes.OK);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} when trying to change document`, async () => {
    await request(app)
      .patch('/api/v1/customers/103')
      .send({
        document: '869.469.410-71',
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for Customer creation with no body`, async () => {
    await request(app)
      .post('/api/v1/customers')
      .send({})
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for Customer creation with no document`, async () => {
    await request(app)
      .post('/api/v1/customers')
      .send({
        name: 'teste@gmail.com',
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for Customer creation with no name`, async () => {
    await request(app)
      .post('/api/v1/customers')
      .send({
        document: '293.101.380-33',
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for Customer creation with invalid document`, async () => {
    await request(app)
      .post('/api/v1/customers')
      .send({
        document: '861.469.410-71',
        name: 'Supertest user',
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.NOT_FOUND} for Customer not founded`, async () => {
    await request(app)
      .post('/api/v1/customers/234')
      .send({
        document: '861.469.410-71',
        name: 'Supertest user',
      })
      .expect(StatusCodes.NOT_FOUND);
  });

  it(`Expect it returns ${StatusCodes.CONFLICT} for Customer creation with same document`, async () => {
    await request(app)
      .post('/api/v1/customers')
      .send({
        document: '83557663000139',
        name: 'Supertest user',
      })
      .expect(StatusCodes.CONFLICT);
  });

  it(`Expect it returns ${StatusCodes.CONFLICT} for Customer creation with same email`, async () => {
    await request(app)
      .post('/api/v1/customers')
      .send({
        document: '83557663000139',
        name: 'teste@gmail.com',
      })
      .expect(StatusCodes.CONFLICT);
  });

  afterAll(async () => {
    await prisma.$queryRawUnsafe(`
        DELETE FROM "Customer"
        WHERE id > 104`);
  });
});
