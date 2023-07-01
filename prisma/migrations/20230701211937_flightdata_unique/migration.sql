/*
  Warnings:

  - A unique constraint covering the columns `[flight_id,timestamp]` on the table `flightdata` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "flightdata_flight_id_timestamp_key" ON "flightdata"("flight_id", "timestamp");
