-- AlterTable
ALTER TABLE "SupplierProduct" ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "PendingProduct" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "supplierCode" TEXT NOT NULL,
    "supplierDesc" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "unity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PendingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingProduct_supplierId_supplierCode_key" ON "PendingProduct"("supplierId", "supplierCode");

-- AddForeignKey
ALTER TABLE "PendingProduct" ADD CONSTRAINT "PendingProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
