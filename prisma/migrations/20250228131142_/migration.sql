-- CreateTable
CREATE TABLE "EnergyData" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "production" DOUBLE PRECISION NOT NULL,
    "maxtempC" DOUBLE PRECISION NOT NULL,
    "mintempC" DOUBLE PRECISION NOT NULL,
    "sunHour" DOUBLE PRECISION NOT NULL,
    "cloudcover" INTEGER NOT NULL,
    "tempC" INTEGER NOT NULL,
    "FeelsLikeC" INTEGER NOT NULL,
    "humidity" INTEGER NOT NULL,
    "windSpeedKmph" INTEGER NOT NULL,
    "precipMM" DOUBLE PRECISION NOT NULL,
    "weatherDesc" TEXT NOT NULL,

    CONSTRAINT "EnergyData_pkey" PRIMARY KEY ("id")
);
