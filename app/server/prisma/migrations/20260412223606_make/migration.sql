-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_cityId_fkey";

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "cityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
