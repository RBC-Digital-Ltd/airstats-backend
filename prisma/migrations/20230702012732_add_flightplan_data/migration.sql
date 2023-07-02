-- AlterTable
ALTER TABLE "flight" ADD COLUMN     "aircraft" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "aircraft_faa" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "aircraft_short" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "alternate" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "assigned_transponder" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "flight_plan_altitude" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "flight_rules" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "remarks" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "revision_id" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "route" TEXT NOT NULL DEFAULT '';
