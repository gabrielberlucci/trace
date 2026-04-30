/*
  Warnings:

  - A unique constraint covering the columns `[tableName]` on the table `TotalCount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TotalCount_tableName_key" ON "TotalCount"("tableName");
