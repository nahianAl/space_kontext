/*
  Warnings:

  - You are about to drop the column `address` on the `site_analysis` table. All the data in the column will be lost.
  - You are about to drop the column `boundaries` on the `site_analysis` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `site_analysis` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `site_analysis` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `site_analysis` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `site_analysis` table. All the data in the column will be lost.
  - Added the required column `boundary` to the `site_analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordinates` to the `site_analysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app"."site_analysis" DROP COLUMN "address",
DROP COLUMN "boundaries",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "boundary" JSONB NOT NULL,
ADD COLUMN     "coordinates" JSONB NOT NULL;
