-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'MMK', 'THB', 'JPY');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';
