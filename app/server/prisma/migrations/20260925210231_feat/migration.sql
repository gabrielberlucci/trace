/*
  Warnings:

  - The values [AJUSTE] on the enum `Movement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Movement_new" AS ENUM ('VENDAS', 'SERVICO', 'PERDA', 'IMPORTACAO', 'AJUSTE_ENTRADA', 'AJUSTE_SAIDA');
ALTER TABLE "StockMovement" ALTER COLUMN "typeMovement" TYPE "Movement_new" USING ("typeMovement"::text::"Movement_new");
ALTER TYPE "Movement" RENAME TO "Movement_old";
ALTER TYPE "Movement_new" RENAME TO "Movement";
DROP TYPE "public"."Movement_old";
COMMIT;
