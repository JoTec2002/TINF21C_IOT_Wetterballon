-- CreateTable
CREATE TABLE "Ballon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "apikey" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "begin" DATETIME,
    "end" DATETIME,
    "ballodId" INTEGER NOT NULL,
    CONSTRAINT "Flight_ballodId_fkey" FOREIGN KEY ("ballodId") REFERENCES "Ballon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gpsdata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "satellites" INTEGER NOT NULL,
    "speed" REAL NOT NULL,
    "course" REAL NOT NULL,
    "altitude" REAL NOT NULL,
    "lonitude" REAL NOT NULL,
    "latitude" REAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "gpsdata_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "humidity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "indoor" BOOLEAN NOT NULL,
    "value" REAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "humidity_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "temperature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "indoor" BOOLEAN NOT NULL,
    "value" REAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "temperature_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "airpressure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "value" INTEGER NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "airpressure_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
