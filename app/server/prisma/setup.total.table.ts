import type { Prisma } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

interface Table {
  tablename: string;
}

interface Total {
  total: number;
}

const setupTotalCountTable = async () => {
  const tables: Table[] = await prisma.$queryRawUnsafe(
    `
    SELECT t.tablename
    FROM pg_tables t
            LEFT JOIN "TotalCount" tc ON t.tablename = tc."tableName"
    WHERE t.schemaname = 'public'
    AND t.tablename != '_prisma_migrations'
    AND tc."tableName" IS NULL;
    `,
  );

  if (tables.length === 0) {
    console.log('New tables where not founded');
    return;
  }

  const countData: Prisma.TotalCountCreateManyInput[] = await Promise.all(
    tables.map(async (t) => {
      const result: Total[] = await prisma.$queryRawUnsafe(`
            SELECT COUNT(*) as total FROM "${t.tablename}"
        `);

      return {
        tableName: t.tablename,
        total: Number(result.at(0)?.total || 0),
      };
    }),
  );

  await prisma.totalCount.createMany({
    data: countData,
  });
};

setupTotalCountTable()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
