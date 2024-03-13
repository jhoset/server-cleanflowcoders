-- CreateTable
CREATE TABLE "raffles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "start_inscription_date" TIMESTAMP(3) NOT NULL,
    "end_inscription_date" TIMESTAMP(3) NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "graphic_url" TEXT NOT NULL,

    CONSTRAINT "raffles_pkey" PRIMARY KEY ("id")
);
