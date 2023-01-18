-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('buyer', 'seller');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "amount_available" INTEGER,
    "cost" INTEGER NOT NULL,
    "product_name" VARCHAR(50) NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(1000) NOT NULL,
    "deposits" INTEGER NOT NULL,
    "role" "Roles" NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
