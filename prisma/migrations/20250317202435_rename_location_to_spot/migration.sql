/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LocationToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_itineraryId_fkey";

-- DropForeignKey
ALTER TABLE "_LocationToTag" DROP CONSTRAINT "_LocationToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_LocationToTag" DROP CONSTRAINT "_LocationToTag_B_fkey";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "_LocationToTag";

-- CreateTable
CREATE TABLE "Spot" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "placeId" TEXT,
    "address" TEXT,
    "price" TEXT,
    "category" TEXT,
    "itineraryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpotToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SpotToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Spot_id_key" ON "Spot"("id");

-- CreateIndex
CREATE INDEX "_SpotToTag_B_index" ON "_SpotToTag"("B");

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpotToTag" ADD CONSTRAINT "_SpotToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpotToTag" ADD CONSTRAINT "_SpotToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
