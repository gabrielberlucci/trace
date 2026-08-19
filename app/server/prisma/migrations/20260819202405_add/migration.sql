-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "fantasyName" TEXT,
ADD COLUMN     "neighborhood" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "fantasyName" TEXT,
ADD COLUMN     "neighborhood" TEXT;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "fantasyName" TEXT,
ADD COLUMN     "neighborhood" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "neighborhood" TEXT;
