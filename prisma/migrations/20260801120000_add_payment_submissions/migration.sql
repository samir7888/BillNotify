-- CreateEnum
CREATE TYPE "PaymentSubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PaymentSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proofImage" TEXT NOT NULL,
    "status" "PaymentSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentSubmission_userId_idx" ON "PaymentSubmission"("userId");

-- CreateIndex
CREATE INDEX "PaymentSubmission_status_idx" ON "PaymentSubmission"("status");

-- AddForeignKey
ALTER TABLE "PaymentSubmission" ADD CONSTRAINT "PaymentSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
