/*
  Warnings:

  - You are about to drop the column `productsId` on the `StockMovement` table. All the data in the column will be lost.
  - Added the required column `productId` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_productsId_fkey";

-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "productsId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
