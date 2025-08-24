-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "public"."EmploymentType" AS ENUM ('Government', 'Private');

-- CreateEnum
CREATE TYPE "public"."MaritalStatus" AS ENUM ('NeverMarried', 'Divorced');

-- CreateEnum
CREATE TYPE "public"."PreferenceAnswer" AS ENUM ('Yes', 'No', 'Maybe');

-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('NEW', 'ACTIVE', 'MATCHED', 'PAUSED');

-- CreateEnum
CREATE TYPE "public"."Importance" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "income" TEXT NOT NULL,
    "employmentType" "public"."EmploymentType" NOT NULL,
    "company" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "maritalStatus" "public"."MaritalStatus" NOT NULL,
    "languages" TEXT[],
    "hobbies" TEXT[],
    "siblings" INTEGER NOT NULL,
    "caste" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "wantKids" "public"."PreferenceAnswer" NOT NULL,
    "openToRelocate" "public"."PreferenceAnswer" NOT NULL,
    "openToPets" "public"."PreferenceAnswer" NOT NULL,
    "accountStatus" "public"."AccountStatus" NOT NULL,
    "avatar" TEXT,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT NOT NULL,
    "familySize" INTEGER NOT NULL,
    "importanceOfCasteOfThePartner" "public"."Importance" NOT NULL,
    "importanceOfReligionOfThePartner" "public"."Importance" NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "public"."Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "public"."Customer"("phone");

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
