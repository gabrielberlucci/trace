/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `SaleItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SaleItem_barcode_key" ON "SaleItem"("barcode");
