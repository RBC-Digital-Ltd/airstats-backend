/*
  Warnings:

  - You are about to drop the `Flight` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Flight";

-- CreateTable
CREATE TABLE "flight" (
    "id" SERIAL NOT NULL,
    "callsign" TEXT NOT NULL,
    "cid" INTEGER NOT NULL,
    "departure" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "flight_pkey" PRIMARY KEY ("id")
);
