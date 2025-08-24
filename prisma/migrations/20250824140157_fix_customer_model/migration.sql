/*
  Warnings:

  - The values [NEW,ACTIVE,MATCHED,PAUSED] on the enum `AccountStatus` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `income` on the `Customer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AccountStatus_new" AS ENUM ('matched', 'unmatched', 'paused');
ALTER TABLE "public"."Customer" ALTER COLUMN "accountStatus" TYPE "public"."AccountStatus_new" USING ("accountStatus"::text::"public"."AccountStatus_new");
ALTER TYPE "public"."AccountStatus" RENAME TO "AccountStatus_old";
ALTER TYPE "public"."AccountStatus_new" RENAME TO "AccountStatus";
DROP TYPE "public"."AccountStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Customer" DROP COLUMN "income",
ADD COLUMN     "income" INTEGER NOT NULL,
ALTER COLUMN "company" DROP NOT NULL,
ALTER COLUMN "accountStatus" SET DEFAULT 'unmatched';
