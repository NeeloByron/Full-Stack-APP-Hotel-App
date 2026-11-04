/*
  Warnings:

  - Made the column `description` on table `RoomType` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "RoomType" ALTER COLUMN "description" SET NOT NULL;

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "roomTypeId" INTEGER NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "rooms" INTEGER NOT NULL,
    "nightlyPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_hotelId_idx" ON "Booking"("hotelId");

-- CreateIndex
CREATE INDEX "Booking_roomTypeId_idx" ON "Booking"("roomTypeId");

-- CreateIndex
CREATE INDEX "Booking_checkIn_checkOut_idx" ON "Booking"("checkIn", "checkOut");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
