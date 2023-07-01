/*
  Warnings:

  - Added the required column `arrival` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `callsign` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cid` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departure` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "arrival" TEXT NOT NULL,
ADD COLUMN     "callsign" TEXT NOT NULL,
ADD COLUMN     "cid" INTEGER NOT NULL,
ADD COLUMN     "departure" TEXT NOT NULL;
