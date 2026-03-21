-- AlterTable
ALTER TABLE "Prenotazione" ADD COLUMN     "utenteId" INTEGER;

-- CreateTable
CREATE TABLE "Utente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "creataIl" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");

-- AddForeignKey
ALTER TABLE "Prenotazione" ADD CONSTRAINT "Prenotazione_utenteId_fkey" FOREIGN KEY ("utenteId") REFERENCES "Utente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
