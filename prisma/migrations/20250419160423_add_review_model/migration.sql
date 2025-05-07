/*
  Warnings:

  - You are about to drop the column `content` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "content",
ADD COLUMN     "comment" TEXT;
