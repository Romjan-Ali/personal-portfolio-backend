/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `About` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `About` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."About" ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "shortBio" TEXT,
ADD COLUMN     "stats" JSONB,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "About_email_key" ON "public"."About"("email");
