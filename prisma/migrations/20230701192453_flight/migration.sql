/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test";

-- CreateTable
CREATE TABLE "Flight" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);
