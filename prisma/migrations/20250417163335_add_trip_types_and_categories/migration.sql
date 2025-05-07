-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tripTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];
