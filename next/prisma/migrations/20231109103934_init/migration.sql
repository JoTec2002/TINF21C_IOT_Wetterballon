/*
  Warnings:

  - You are about to drop the `humidity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `temperature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "humidity";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "temperature";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "humidityIndoor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "humidityIndoor_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "humidityOutdoor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "humidityOutdoor_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "temperatureIndoor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "temperatureIndoor_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "temperatureOutdoor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "value" REAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "temperatureOutdoor_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
