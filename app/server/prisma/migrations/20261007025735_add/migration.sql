/*
  Warnings:

  - You are about to drop the column `supplierId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_supplierId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "supplierId";

-- CreateTable
CREATE TABLE "SupplierProduct" (
    "productId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "supplierCode" TEXT NOT NULL,
    "supplierDesc" TEXT,
    "conversionFactor" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "SupplierProduct_pkey" PRIMARY KEY ("productId","supplierId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProduct_supplierId_supplierCode_key" ON "SupplierProduct"("supplierId", "supplierCode");

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
