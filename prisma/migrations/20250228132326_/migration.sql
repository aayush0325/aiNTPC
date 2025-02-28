-- CreateTable
CREATE TABLE "IsPopulated" (
    "id" SERIAL NOT NULL,
    "value" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "IsPopulated_pkey" PRIMARY KEY ("id")
);
