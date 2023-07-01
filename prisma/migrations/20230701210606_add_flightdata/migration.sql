-- CreateTable
CREATE TABLE "flightdata" (
    "id" SERIAL NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" INTEGER NOT NULL,
    "groundspeed" INTEGER NOT NULL,
    "transponder" INTEGER NOT NULL,
    "heading" INTEGER NOT NULL,
    "qnh_i_hg" DOUBLE PRECISION NOT NULL,
    "qnh_mb" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flightdata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flightdata" ADD CONSTRAINT "flightdata_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
