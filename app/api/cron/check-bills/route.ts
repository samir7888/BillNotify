import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkNEABill } from "@/lib/providers/nea";
import { sendBillReadyEmail } from "@/lib/email";
import { shouldNotify, getCheckIntervalHours } from "@/lib/utils";
import pLimit from "p-limit";
import { emailQueue } from "@/lib/workers/email-worker";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (CRON_SECRET && token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const summary = {
    totalAccounts: 0,
    checked: 0,
    skipped: 0,
    notified: 0,
    errors: 0,
    startedAt: now.toISOString(),
    finishedAt: "",
  };

  try {
    // Load all active accounts with their user profiles
    const accounts = await prisma.utilityAccount.findMany({
      where: { active: true },
      include: { user: true },
    });

    summary.totalAccounts = accounts.length;

    // Filter accounts that are due for a check based on plan
    const accountsDue = accounts.filter((account) => {
      const intervalHours = getCheckIntervalHours(account.user.plan);
      if (!account.lastCheckedAt) return true;
      const hoursSinceCheck =
        (now.getTime() - new Date(account.lastCheckedAt).getTime()) /
        (1000 * 60 * 60);
      return hoursSinceCheck >= intervalHours;
    });

    // Separate by plan for priority processing
    const proAccounts = accountsDue.filter((a) => a.user.plan === "PRO");
    const freeAccounts = accountsDue.filter((a) => a.user.plan === "FREE");

    // Process PRO accounts first with higher concurrency
    const proLimit = pLimit(5);
    const freeLimit = pLimit(3);

    const processAccount = async (account: (typeof accounts)[0]) => {
      if (account.utilityType !== "ELECTRICITY") {
        summary.skipped++;
        return;
      }

      try {
        const result = await checkNEABill({
          neaLocationCode: account.neaLocationCode,
          scNo: account.scNo,
          consumerId: account.consumerId,
        });

        const updateData: Record<string, unknown> = {
          lastCheckedAt: new Date(),
        };

        if (result.success) {
          updateData.lastStatus = result.status ?? "Checked";
          updateData.lastAmount = result.payableAmount ?? null;
          updateData.lastBillMonth = result.dueBillOf ?? null;
          if (result.customerName)
            updateData.customerName = result.customerName;
        } else {
          updateData.lastStatus = `Error: ${result.error}`;
        }

        await prisma.utilityAccount.update({
          where: { id: account.id },
          data: updateData,
        });

        summary.checked++;

        // Send notification if bill is ready
        if (
          result.success &&
          result.payableAmount &&
          result.payableAmount > 0 &&
          account.user.emailEnabled
        ) {
          const newBillMonth = result.dueBillOf ?? "Unknown";
          const needsNotification = shouldNotify(
            account.lastAmount,
            account.lastBillMonth,
            result.payableAmount,
            newBillMonth,
            account.lastNotifiedAt,
          );

          if (needsNotification) {
            const emailTo = account.emailOverride ?? account.user.email;

            try {
              await emailQueue.add("send-email", {
                to: emailTo,
                customerName:
                  result.customerName ?? account.customerName ?? "Customer",
                consumerId: account.consumerId,
                amount: result.payableAmount,
                billMonth: newBillMonth,
                status: result.status ?? "Ready to Pay",
                providerName: account.providerName,
                utilityType: account.utilityType,
              });

              // Log notification
              await prisma.notificationLog.create({
                data: {
                  userId: account.userId,
                  accountId: account.id,
                  email: emailTo,
                  amount: result.payableAmount,
                  billMonth: newBillMonth,
                  status: result.status ?? "Ready to Pay",
                },
              });

              // Update lastNotifiedAt
              await prisma.utilityAccount.update({
                where: { id: account.id },
                data: {
                  lastNotifiedAt: new Date(),
                  lastAmount: result.payableAmount,
                  lastBillMonth: newBillMonth,
                },
              });

              summary.notified++;
            } catch (emailErr) {
              console.error(
                `[Cron] Email failed for account ${account.id}:`,
                emailErr,
              );
              summary.errors++;
            }
          }
        }
      } catch (err) {
        console.error(`[Cron] Error checking account ${account.id}:`, err);
        summary.errors++;
        await prisma.utilityAccount
          .update({
            where: { id: account.id },
            data: {
              lastCheckedAt: new Date(),
              lastStatus: "Check failed",
            },
          })
          .catch(() => {});
      }
    };

    // Run PRO accounts first, then FREE
    await Promise.all(
      proAccounts.map((a) => proLimit(() => processAccount(a))),
    );
    await Promise.all(
      freeAccounts.map((a) => freeLimit(() => processAccount(a))),
    );

    summary.skipped = summary.totalAccounts - summary.checked - summary.errors;
    summary.finishedAt = new Date().toISOString();

    return NextResponse.json({ success: true, summary });
  } catch (err) {
    console.error("[Cron] Fatal error:", err);
    summary.finishedAt = new Date().toISOString();
    return NextResponse.json(
      { success: false, error: "Internal server error", summary },
      { status: 500 },
    );
  }
}
