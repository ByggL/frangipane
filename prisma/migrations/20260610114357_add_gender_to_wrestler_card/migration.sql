-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WrestlerCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "birthdate" TEXT NOT NULL,
    "birthplace" TEXT NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "gender" TEXT NOT NULL DEFAULT 'Male',
    "alignment" TEXT NOT NULL DEFAULT 'FACE',
    "promotion" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WrestlerCard" ("alignment", "birthdate", "birthplace", "createdAt", "description", "height", "id", "imageUrl", "name", "promotion", "rarity", "updatedAt", "weight") SELECT "alignment", "birthdate", "birthplace", "createdAt", "description", "height", "id", "imageUrl", "name", "promotion", "rarity", "updatedAt", "weight" FROM "WrestlerCard";
DROP TABLE "WrestlerCard";
ALTER TABLE "new_WrestlerCard" RENAME TO "WrestlerCard";
CREATE UNIQUE INDEX "WrestlerCard_name_key" ON "WrestlerCard"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
