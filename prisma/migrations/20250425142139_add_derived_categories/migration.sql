-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "derivedCategories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Itinerary_tripTypes_idx" ON "Itinerary"("tripTypes");

-- CreateIndex
CREATE INDEX "Itinerary_derivedCategories_idx" ON "Itinerary"("derivedCategories");
