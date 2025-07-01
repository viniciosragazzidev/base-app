/*
  Warnings:

  - You are about to drop the column `maxSessions` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "maxSessions";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "maxSessions" INTEGER NOT NULL DEFAULT 3;
