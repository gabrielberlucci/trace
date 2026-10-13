/*
  Warnings:

  - You are about to drop the column `unity` on the `Product` table. All the data in the column will be lost.
  - Added the required column `unit` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('UN', 'CM', 'MT', 'MM', 'BALDE', 'LITRO');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "unity",
ADD COLUMN     "unit" "Unit" NOT NULL;

-- DropEnum
DROP TYPE "Unity";
