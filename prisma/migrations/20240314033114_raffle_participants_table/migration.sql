-- CreateTable
CREATE TABLE "raffles_has_participants" (
    "raffle_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "is_winner" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raffles_has_participants_pkey" PRIMARY KEY ("raffle_id","participant_id")
);

-- AddForeignKey
ALTER TABLE "raffles_has_participants" ADD CONSTRAINT "raffles_has_participants_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffles_has_participants" ADD CONSTRAINT "raffles_has_participants_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
