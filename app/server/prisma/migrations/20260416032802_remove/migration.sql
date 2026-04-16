/*
  Warnings:

  - The `active` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `active` column on the `Supplier` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "active",
ADD COLUMN     "active" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "active",
ADD COLUMN     "active" INTEGER NOT NULL DEFAULT 1;

-- DropEnum
DROP TYPE "Active";
