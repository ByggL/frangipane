-- CreateTable
CREATE TABLE "WrestlerCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "birthdate" TEXT NOT NULL,
    "birthplace" TEXT NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "alignment" TEXT NOT NULL DEFAULT 'FACE',
    "promotion" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WrestlerCard_name_key" ON "WrestlerCard"("name");
