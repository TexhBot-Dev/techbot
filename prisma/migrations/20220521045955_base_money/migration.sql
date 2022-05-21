-- CreateEnum
CREATE TYPE "PetTypes" AS ENUM ('DOG', 'CAT', 'BIRD', 'FISH', 'HORSE', 'PIG', 'SHEEP', 'TURTLE', 'OTHER');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "JobNames" AS ENUM ('JOBLESS', 'JANITOR', 'COOK', 'FIRE_FIGHTER', 'YOUTUBER', 'INVESTOR', 'PEPE_KING');

-- CreateEnum
CREATE TYPE "ItemNames" AS ENUM ('GRILLED_CHEESE', 'HELICOPTER', 'HUNTING_RIFLE', 'GOLDEN_CHICKEN_NUGGET', 'TV', 'LAPTOP', 'IPHONE', 'FISHING_POLE', 'SCISSORS', 'TROPHY', 'KFC', 'FISH');

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "slotsWinMultiplier" INTEGER NOT NULL DEFAULT 0,
    "slotsMoneyPool" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet" INTEGER NOT NULL DEFAULT 0,
    "bank" INTEGER NOT NULL DEFAULT 0,
    "currentJob" "JobNames" NOT NULL DEFAULT E'JOBLESS',
    "jobEXP" INTEGER NOT NULL DEFAULT 0,
    "passiveMode" BOOLEAN NOT NULL DEFAULT false,
    "preferredEmojiColor" TEXT NOT NULL DEFAULT E'yellow',
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "userID" TEXT NOT NULL,
    "itemID" "ItemNames" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ItemMetaData" (
    "name" "ItemNames" NOT NULL,
    "price" INTEGER NOT NULL,
    "rarity" "Rarity" NOT NULL DEFAULT E'COMMON',
    "emoji" TEXT,
    "description" TEXT NOT NULL DEFAULT E'I was forgotten about by the devs ;(',
    "sellable" BOOLEAN NOT NULL DEFAULT false,
    "tradeable" BOOLEAN NOT NULL DEFAULT false,
    "collectable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ItemMetaData_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Pet" (
    "userID" TEXT NOT NULL,
    "petType" "PetTypes" NOT NULL,
    "name" TEXT NOT NULL,
    "hunger" INTEGER NOT NULL DEFAULT 10,
    "lastFed" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PetMetaData" (
    "type" "PetTypes" NOT NULL,
    "price" INTEGER NOT NULL,
    "rarity" "Rarity" NOT NULL DEFAULT E'COMMON',
    "tradeable" BOOLEAN NOT NULL DEFAULT false,
    "collectable" BOOLEAN NOT NULL DEFAULT false,
    "feedInterval" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PetMetaData_pkey" PRIMARY KEY ("type")
);

-- CreateTable
CREATE TABLE "Job" (
    "name" "JobNames" NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'I was forgotten about by the devs ;(',
    "minimumXP" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_userID_itemID_key" ON "Inventory"("userID", "itemID");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_userID_petType_key" ON "Pet"("userID", "petType");
