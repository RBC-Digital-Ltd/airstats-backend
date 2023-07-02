/*
  Warnings:

  - Added the required column `aircraft` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aircraft_faa` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aircraft_short` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alternate` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assigned_transponder` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flight_plan_altitude` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flight_rules` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remarks` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revision_id` to the `flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route` to the `flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flight" ADD COLUMN     "aircraft" TEXT NOT NULL,
ADD COLUMN     "aircraft_faa" TEXT NOT NULL,
ADD COLUMN     "aircraft_short" TEXT NOT NULL,
ADD COLUMN     "alternate" TEXT NOT NULL,
ADD COLUMN     "assigned_transponder" TEXT NOT NULL,
ADD COLUMN     "flight_plan_altitude" TEXT NOT NULL,
ADD COLUMN     "flight_rules" TEXT NOT NULL,
ADD COLUMN     "remarks" TEXT NOT NULL,
ADD COLUMN     "revision_id" INTEGER NOT NULL,
ADD COLUMN     "route" TEXT NOT NULL;
