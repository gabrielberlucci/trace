-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "document" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "zipcode" TEXT,
    "addressNumber" INTEGER,
    "complement" TEXT,
    "email" TEXT,
    "ie" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "cityId" INTEGER,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_document_key" ON "Company"("document");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_ie_key" ON "Company"("ie");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
