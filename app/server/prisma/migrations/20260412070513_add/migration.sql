-- CreateEnum
CREATE TYPE "Active" AS ENUM ('YES', 'NO');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "active" "Active" NOT NULL DEFAULT 'YES';
