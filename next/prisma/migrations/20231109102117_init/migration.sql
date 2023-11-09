/*
  Warnings:

  - You are about to drop the column `lonitude` on the `gpsdata` table. All the data in the column will be lost.
  - Added the required column `longitude` to the `gpsdata` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_gpsdata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "satellites" INTEGER NOT NULL,
    "speed" REAL NOT NULL,
    "course" REAL NOT NULL,
    "altitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "latitude" REAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "gpsdata_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_gpsdata" ("altitude", "course", "flightId", "id", "latitude", "satellites", "speed", "time") SELECT "altitude", "course", "flightId", "id", "latitude", "satellites", "speed", "time" FROM "gpsdata";
DROP TABLE "gpsdata";
ALTER TABLE "new_gpsdata" RENAME TO "gpsdata";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
