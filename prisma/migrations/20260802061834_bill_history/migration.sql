-- CreateTable
CREATE TABLE "BillHistory" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "billMonth" TEXT NOT NULL,
    "billDate" TIMESTAMP(3),
    "status" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BillHistory_accountId_idx" ON "BillHistory"("accountId");

-- CreateIndex
CREATE INDEX "BillHistory_billMonth_idx" ON "BillHistory"("billMonth");

-- CreateIndex
CREATE UNIQUE INDEX "BillHistory_accountId_billMonth_key" ON "BillHistory"("accountId", "billMonth");

-- AddForeignKey
ALTER TABLE "BillHistory" ADD CONSTRAINT "BillHistory_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "UtilityAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
