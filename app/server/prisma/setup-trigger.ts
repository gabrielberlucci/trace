import { prisma } from '../lib/prisma';

interface Table {
  tablename: string;
}

const tables: Table[] = await prisma.$queryRawUnsafe(
  `SELECT tablename FROM pg_tables
    WHERE schemaname = 'public';`,
);

await Promise.all(
  tables
    .filter((table) => table.tablename !== '_prisma_migrations')
    .map(async (t) => {
      await prisma.$executeRawUnsafe(
        `CREATE OR REPLACE TRIGGER trig_a_i_d_count_total
    AFTER INSERT OR DELETE
    ON "${t.tablename}"
    FOR EACH ROW
EXECUTE FUNCTION count_total_from_table();

CREATE OR REPLACE TRIGGER trig_a_t_count_total
    AFTER TRUNCATE
    ON "${t.tablename}"
    FOR EACH STATEMENT
EXECUTE FUNCTION count_total_from_table();`,
      );
    }),
);
