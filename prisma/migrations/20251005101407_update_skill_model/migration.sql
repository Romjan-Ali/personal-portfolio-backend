/*
  Warnings:

  - The `level` column on the `Skill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Made the column `order` on table `Skill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Skill" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "order" SET NOT NULL;
