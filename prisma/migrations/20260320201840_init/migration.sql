-- CreateTable
CREATE TABLE "Prenotazione" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "campo" TEXT NOT NULL,
    "orario" TEXT NOT NULL,
    "creataIl" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prenotazione_pkey" PRIMARY KEY ("id")
);
