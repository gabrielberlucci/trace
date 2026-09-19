-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "nfeUploadControlId" INTEGER;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_nfeUploadControlId_fkey" FOREIGN KEY ("nfeUploadControlId") REFERENCES "NfeUploadControl"("id") ON DELETE SET NULL ON UPDATE CASCADE;
