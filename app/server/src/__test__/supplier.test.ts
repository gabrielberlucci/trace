import request from 'supertest';
import { describe, it, afterAll, beforeEach } from 'vitest';
import { app } from '../app';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { StatusCodes } from 'http-status-codes';

describe('Supplier Route Testes', () => {
  beforeEach(async () => {
    await prisma.$queryRawUnsafe(`
        DELETE FROM "Supplier"
        WHERE id > 2`);
  });

  it(`Expect that it returns ${StatusCodes.CREATED} for supplier creation`, async () => {
    await request(app)
      .post('/api/supplier/create')
      .send({
        document: '35897854033',
        typePerson: 'PJ',
        name: 'Gabriel Berlucci',
      })
      .expect(StatusCodes.CREATED);
  });

  it(`Expect that it returns ${StatusCodes.CONFLICT} for supplier creation`, async () => {
    const payload = {
      document: '35897854033',
      typePerson: 'PJ',
      name: 'Gabriel Berlucci',
    } as Prisma.SupplierCreateInput;
    await prisma.supplier.create({
      data: {
        document: payload.document,
        typePerson: payload.typePerson,
        name: payload.name,
      },
    });

    await request(app)
      .post('/api/supplier/create')
      .send(payload)
      .expect(StatusCodes.CONFLICT);
  });

  it(`Expect that it returns ${StatusCodes.BAD_REQUEST} for supplier creation`, async () => {
    await request(app)
      .post('/api/supplier/create')
      .send({
        document: '35897854033',
        typePerson: 'PM',
        name: 'Gabriel Berlucci',
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect that it returns ${StatusCodes.CONFLICT} for supplier modify using the same CNPJ`, async () => {
    await request(app)
      .patch('/api/supplier/modify/2')
      .send({
        document: '06934630000110',
      })
      .expect(StatusCodes.CONFLICT);
  });

  afterAll(async () => {
    await prisma.$queryRawUnsafe(`
        DELETE FROM "Supplier"
        WHERE id > 2`);
  });
});
