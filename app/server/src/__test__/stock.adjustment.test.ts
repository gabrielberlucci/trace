import request from 'supertest';
import { describe, it, afterAll, beforeAll, expect } from 'vitest';
import { app } from '../app';
import { prisma } from '../../lib/prisma';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

describe('Stock Adjustment Route Tests', () => {
  const apiRoute = '/api/v1/stock-adjustment';
  let token: string;
  const validBarcode = 'ADJ-TEST-123';
  const notFoundBarcode = 'ADJ-TEST-999';

  beforeAll(async () => {
    const role = await prisma.role.upsert({
      where: { name: 'ADMIN_TEST' },
      update: {},
      create: { name: 'ADMIN_TEST', level: 1 },
    });

    const user = await prisma.user.upsert({
      where: { username: 'admin_test_adj' },
      update: {},
      create: {
        name: 'Admin Test Adj',
        username: 'admin_test_adj',
        password: 'password',
        email: 'admin_test_adj@test.com',
        roleId: role.id,
        active: true,
      },
    });

    token = jwt.sign(
      { id: user.id, username: user.username, role: role.name },
      process.env.JWT_SECRET || 'secret',
    );

    await prisma.product.upsert({
      where: { barcode: validBarcode },
      update: { currentStock: 10 },
      create: {
        barcode: validBarcode,
        description: 'Test Product Adjustment',
        unity: 'UN',
        currentStock: 10,
        costPrice: 10.0,
        salePrice: 20.0,
      },
    });
  });

  afterAll(async () => {
    const product = await prisma.product.findUnique({
      where: { barcode: validBarcode },
    });

    if (product) {
      await prisma.stockMovement.deleteMany({
        where: { productId: product.id },
      });
      await prisma.product.delete({
        where: { id: product.id },
      });
    }
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} with no body`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({})
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} without items`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({ date: new Date().toISOString() })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} with invalid date`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({
        date: 'invalid-date',
        items: [{ barcode: validBarcode, type: 'AJUSTE_ENTRADA', quantity: 5 }],
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} with invalid quantity`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({
        date: new Date().toISOString(),
        items: [{ barcode: validBarcode, type: 'AJUSTE_ENTRADA', quantity: 0 }],
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} with invalid type`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({
        date: new Date().toISOString(),
        items: [{ barcode: validBarcode, type: 'INVALID_TYPE', quantity: 5 }],
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} if product is not found`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({
        date: new Date().toISOString(),
        items: [
          { barcode: notFoundBarcode, type: 'AJUSTE_ENTRADA', quantity: 5 },
        ],
      })
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.CREATED} for valid AJUSTE_ENTRADA`, async () => {
    const response = await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({
        date: new Date().toISOString(),
        items: [{ barcode: validBarcode, type: 'AJUSTE_ENTRADA', quantity: 5 }],
      })
      .expect(StatusCodes.CREATED);

    expect(response.body.message).toBe(
      'Ajuste de estoque realizado com sucesso',
    );

    const product = await prisma.product.findUnique({
      where: { barcode: validBarcode },
    });
    expect(product?.currentStock).toBe(15);
  });

  it(`Expect it returns ${StatusCodes.CREATED} for valid AJUSTE_SAIDA`, async () => {
    const response = await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({
        date: new Date().toISOString(),
        items: [{ barcode: validBarcode, type: 'AJUSTE_SAIDA', quantity: 2 }],
      })
      .expect(StatusCodes.CREATED);

    expect(response.body.message).toBe(
      'Ajuste de estoque realizado com sucesso',
    );

    const product = await prisma.product.findUnique({
      where: { barcode: validBarcode },
    });
    expect(product?.currentStock).toBe(13); // Was 15, - 2 = 13
  });
});
