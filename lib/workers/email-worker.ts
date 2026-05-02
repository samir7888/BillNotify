import { Worker, Queue } from "bullmq";
import Redis from "ioredis";
import { sendBillReadyEmail } from "../email";

// 1. Validate the URL immediately
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

// 2. Setup Connection with robust options
const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
  enableReadyCheck: false,    // Helps with NOAUTH/Connection race conditions
});

// 3. Define the Queue
export const emailQueue = new Queue("send-email", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 5000 },
  },
});

// 4. Define the Worker
const worker = new Worker(
  "send-email",
  async (job) => {
    // Safety check: ensure job and data exist
    if (!job?.data) return;
    
    const { data } = job;
    await sendBillReadyEmail({
      to: data.emailTo,
      customerName: data.customerName,
      consumerId: data.consumerId,
      amount: data.amount,
      billMonth: data.billMonth,
      status: data.status,
      providerName: data.providerName,
      utilityType: data.utilityType,
    });
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  }
);

// 5. Apply the 'noeviction' policy via code on startup
connection.config("SET", "maxmemory-policy", "noeviction")
  .then(() => console.log("✅ Redis policy set to noeviction"))
  .catch(err => console.error("❌ Failed to set Redis policy:", err.message));

export default worker;
