import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shouldNotify(
  lastAmount: number | null,
  lastBillMonth: string | null,
  newAmount: number,
  newBillMonth: string,
  lastNotifiedAt: Date | null
): boolean {
  // No amount means nothing to notify
  if (!newAmount || newAmount <= 0) return false;

  // Same bill month + same amount = already notified
  if (
    lastBillMonth === newBillMonth &&
    lastAmount === newAmount &&
    lastNotifiedAt !== null
  ) {
    return false;
  }

  return true;
}

export function FREE_ACCOUNT_LIMIT() {
  return 3;
}

export function getCheckIntervalHours(plan: string): number {
  return plan === "PRO" ? 2 : 6;
}
