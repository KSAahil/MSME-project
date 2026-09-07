import "server-only";

import path from "node:path";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { JSONFilePreset } from "lowdb/node";
import { createCloudStore, withCloudWrite } from "./cloud-store";
import type { DatabaseShape } from "./domain/types";
import { financialYearFor, todayInIndia } from "./date";

const now = new Date().toISOString();
const today = todayInIndia();
const businessId = "business_demo";

const defaultData: DatabaseShape = {
  businesses: [{
    id: businessId,
    name: "Shree Industrial Services",
    legalName: "Shree Industrial Services",
    gstin: "",
    gstRegistered: true,
    address: "Raipur, Chhattisgarh",
    stateCode: "22",
    stateName: "Chhattisgarh",
    phone: "+91 98765 43210",
    email: "owner@example.com",
    upiId: "merchant@upi",
    invoicePrefix: "INV",
    nextInvoiceNumber: 1,
    defaultDueDays: 15,
    financialYear: financialYearFor(today),
    createdAt: now,
    updatedAt: now,
  }],
  customers: [
    { id: "cus_sharma", businessId, name: "Sharma Traders", phone: "+91 98111 11111", email: "", gstin: "", address: "Raipur, Chhattisgarh", stateCode: "22", stateName: "Chhattisgarh", createdAt: now, updatedAt: now },
    { id: "cus_gupta", businessId, name: "Gupta Enterprises", phone: "+91 98222 22222", email: "", gstin: "", address: "New Delhi", stateCode: "07", stateName: "Delhi", createdAt: now, updatedAt: now },
    { id: "cus_rahul", businessId, name: "Rahul Services", phone: "+91 98333 33333", email: "", gstin: "", address: "Bhilai, Chhattisgarh", stateCode: "22", stateName: "Chhattisgarh", createdAt: now, updatedAt: now },
  ],
  items: [
    { id: "item_box", businessId, name: "Boxes", description: "Boxes", unit: "Boxes", unitPricePaise: 85000, taxRateBps: 1800, hsnSac: "", createdAt: now, updatedAt: now },
    { id: "item_service", businessId, name: "Professional service", description: "Professional service", unit: "Service", unitPricePaise: 3500000, taxRateBps: 1800, hsnSac: "9983", createdAt: now, updatedAt: now },
  ],
  invoices: [],
  payments: [],
  auditEvents: [],
};

const file = path.resolve(process.cwd(), process.env.APP_DATA_FILE || ".data/db.json");
let databasePromise: ReturnType<typeof JSONFilePreset<DatabaseShape>> | undefined;
let writeChain: Promise<unknown> = Promise.resolve();

export const isCloudDemo = () => Boolean(process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN);

async function cloudPath() {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    throw new Error("Hosted demo storage is not connected yet.");
  }
  const jar = await cookies();
  let workspace = jar.get("msme_demo_workspace")?.value;
  if (!workspace || !/^[a-f0-9-]{36}$/.test(workspace)) {
    workspace = randomUUID();
    jar.set("msme_demo_workspace", workspace, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
  }
  return `demo-workspaces/${workspace}.json`;
}

function localDatabase() {
  databasePromise ??= JSONFilePreset<DatabaseShape>(file, defaultData);
  return databasePromise;
}

export async function getDatabase() {
  if (isCloudDemo()) return createCloudStore(await cloudPath(), defaultData);
  return localDatabase();
}

export async function withDatabaseWrite<T>(operation: (data: DatabaseShape) => T | Promise<T>): Promise<T> {
  if (isCloudDemo()) return withCloudWrite(await cloudPath(), defaultData, operation);
  const task = writeChain.then(async () => {
    const db = await localDatabase();
    await db.read();
    const result = await operation(db.data);
    await db.write();
    return result;
  });
  writeChain = task.catch(() => undefined);
  return task;
}

export const DEMO_BUSINESS_ID = businessId;
export const DEMO_ACTOR_ID = "owner_demo";
