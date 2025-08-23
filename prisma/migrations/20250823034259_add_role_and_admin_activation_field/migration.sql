-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MATCHMAKER');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "adminActivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'MATCHMAKER';
