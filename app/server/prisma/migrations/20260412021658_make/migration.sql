-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_cityId_fkey";

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "cityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
