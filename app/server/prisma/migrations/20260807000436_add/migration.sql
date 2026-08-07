/*
  Warnings:

  - Added the required column `numNf` to the `NfeUploadControl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serieNf` to the `NfeUploadControl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NfeUploadControl" ADD COLUMN     "numNf" TEXT NOT NULL,
ADD COLUMN     "serieNf" TEXT NOT NULL;
