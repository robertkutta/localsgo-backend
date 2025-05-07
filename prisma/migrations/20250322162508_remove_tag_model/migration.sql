/*
  Warnings:

  - You are about to drop the column `categories` on the `Itinerary` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SpotToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_itineraryId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_itineraryId_fkey";

-- DropForeignKey
ALTER TABLE "_SpotToTag" DROP CONSTRAINT "_SpotToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_SpotToTag" DROP CONSTRAINT "_SpotToTag_B_fkey";

-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "categories";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_SpotToTag";
