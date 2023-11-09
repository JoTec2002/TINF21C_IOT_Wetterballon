/*
  Warnings:

  - You are about to drop the column `ballodId` on the `Flight` table. All the data in the column will be lost.
  - Added the required column `ballonId` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "begin" DATETIME,
    "end" DATETIME,
    "ballonId" INTEGER NOT NULL,
    CONSTRAINT "Flight_ballonId_fkey" FOREIGN KEY ("ballonId") REFERENCES "Ballon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("begin", "end", "id", "name") SELECT "begin", "end", "id", "name" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
