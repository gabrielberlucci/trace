import request from 'supertest';
import { describe, it, afterAll, beforeAll } from 'vitest';
import { app } from '../app';
import { prisma } from '../../lib/prisma';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

describe('Service Order Route Tests', () => {
  const apiRoute = '/api/v1/service-orders';
  const validCpf = '48005315007'; // Example valid document length
  let validCompanyId: number;
  let validCustomerId: number;
  let validServiceOrderId: number;

  const validPayload = {
    date: new Date().toISOString(),
    document: validCpf,
    items: [
      {
        date: new Date().toISOString(),
        description: 'Test Service',
        hours: 10,
        hourlyRate: 150,
      },
    ],
  };

  const payloadWithoutItems = {
    date: new Date().toISOString(),
    document: validCpf,
  };

  const payloadWithoutDocument = {
    date: new Date().toISOString(),
    items: [
      {
        date: new Date().toISOString(),
        description: 'Test Service',
        hours: 10,
        hourlyRate: 150,
      },
    ],
  };

  const payloadWithInvalidDate = {
    date: 'invalid-date',
    document: validCpf,
    items: [
      {
        date: new Date().toISOString(),
        description: 'Test Service',
        hours: 10,
        hourlyRate: 150,
      },
    ],
  };

  const payloadWithInvalidDocumentLength = {
    date: new Date().toISOString(),
    document: '123',
    items: [
      {
        date: new Date().toISOString(),
        description: 'Test Service',
        hours: 10,
        hourlyRate: 150,
      },
    ],
  };

  const payloadWithNegativeHours = {
    date: new Date().toISOString(),
    document: validCpf,
    items: [
      {
        date: new Date().toISOString(),
        description: 'Test Service',
        hours: -5,
        hourlyRate: 150,
      },
    ],
  };

  const payloadWithBodyNotSpecified = {
    potato: 'not-mapped',
  };

  let token: string;

  beforeAll(async () => {
    token = jwt.sign(
      { id: 1, username: 'admin', role: 'ADMIN' },
      process.env.JWT_SECRET || 'secret',
    );

    await prisma.$transaction(async (tx) => {
      const role = await tx.role.upsert({
        where: { name: 'ADMIN_TEST' },
        update: {},
        create: { name: 'ADMIN_TEST', level: 1 },
      });
      const permissionCreate = await tx.permission.upsert({
        where: { name: 'create:service-order' },
        update: {},
        create: { name: 'create:service-order' },
      });
      const permissionView = await tx.permission.upsert({
        where: { name: 'view:service-order' },
        update: {},
        create: { name: 'view:service-order' },
      });
      await tx.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permissionCreate.id,
          },
        },
        update: {},
        create: { roleId: role.id, permissionId: permissionCreate.id },
      });
      await tx.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permissionView.id,
          },
        },
        update: {},
        create: { roleId: role.id, permissionId: permissionView.id },
      });

      const user = await tx.user.upsert({
        where: { username: 'admin_test' },
        update: {},
        create: {
          name: 'Admin Test',
          username: 'admin_test',
          password: 'password',
          email: 'admin_test@test.com',
          roleId: role.id,
          active: true,
        },
      });
      token = jwt.sign(
        { id: user.id, username: user.username, role: role.name },
        process.env.JWT_SECRET || 'secret',
      );

      const company = await tx.company.upsert({
        where: { document: '00000000000100' },
        update: {},
        create: {
          name: 'Test Company',
          document: '00000000000100',
          active: true,
        },
      });
      validCompanyId = company.id;

      const customer = await tx.customer.upsert({
        where: { document: validCpf },
        update: { active: true },
        create: {
          name: 'Test Customer SO',
          document: validCpf,
          typePerson: 'PF',
          active: true,
        },
      });
      validCustomerId = customer.id;
    });
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for service order creation with no body`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send({})
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for service order creation when sending body without items`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send(payloadWithoutItems)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for service order creation when sending body without document`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send(payloadWithoutDocument)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for service order creation with a not mapped camp from JSON`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send(payloadWithBodyNotSpecified)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for service order creation with invalid date`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send(payloadWithInvalidDate)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for service order creation with invalid document length`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send(payloadWithInvalidDocumentLength)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.BAD_REQUEST} for service order creation with negative hours`, async () => {
    await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send(payloadWithNegativeHours)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it(`Expect it returns ${StatusCodes.CREATED} for service order creation with valid data`, async () => {
    const res = await request(app)
      .post(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .send(validPayload)
      .expect(StatusCodes.CREATED);

    // We expect the response to include success structure as defined in controller
    // "message": "Ordem de serviço criado com sucesso"
  });

  // ------- GET ROUTES -------
  it(`Expect it returns ${StatusCodes.OK} for getting paginated service orders`, async () => {
    await request(app)
      .get(apiRoute)
      .set('Cookie', [`access_token=${token}`])
      .query({ page: 1 })
      .expect(StatusCodes.OK);
  });

  afterAll(async () => {
    await prisma.$transaction(async (tx) => {
      const orders = await tx.serviceOrder.findMany({
        where: { customerId: validCustomerId, companyId: validCompanyId },
      });
      for (const order of orders) {
        await tx.serviceOrderItem.deleteMany({
          where: { serviceOrderId: order.id },
        });
        await tx.serviceOrder.delete({ where: { id: order.id } });
      }
    });
  });
});
