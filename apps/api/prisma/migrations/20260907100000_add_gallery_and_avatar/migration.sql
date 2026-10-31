-- Add a profile photo to visitor accounts.
ALTER TABLE "User"
ADD COLUMN "avatarUrl" TEXT NOT NULL DEFAULT '';

-- Store the shared hero carousel in its display order.
CREATE TABLE "HeroGallery" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "HeroGallery_pkey" PRIMARY KEY ("id")
);