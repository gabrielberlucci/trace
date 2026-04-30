-- CreateTable
CREATE TABLE "TotalCount" (
    "id" SERIAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "TotalCount_pkey" PRIMARY KEY ("id")
);
