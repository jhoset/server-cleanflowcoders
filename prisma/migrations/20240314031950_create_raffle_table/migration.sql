-- CreateTable
CREATE TABLE "raffles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TEXT NOT NULL,
    "start_inscription_date" TEXT NOT NULL,
    "end_inscription_date" TEXT NOT NULL,
    "max_participants" INTEGER NOT NULL,
    "graphic_url" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "changed_by" VARCHAR(55) NOT NULL DEFAULT 'system',

    CONSTRAINT "raffles_pkey" PRIMARY KEY ("id")
);
