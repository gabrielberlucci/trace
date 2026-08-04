-- CreateTable
CREATE TABLE "NfeUploadControl" (
    "id" SERIAL NOT NULL,
    "nfeAccessKey" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NfeUploadControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NfeUploadControl_nfeAccessKey_key" ON "NfeUploadControl"("nfeAccessKey");
