import "server-only";

import path from "node:path";
import { JSONFilePreset } from "lowdb/node";
import type { DatabaseShape } from "./domain/types";
import { financialYearFor, todayInIndia } from "./date";

const now = new Date().toISOString();
const today = todayInIndia();
const businessId = "business_demo";

const defaultData: DatabaseShape = {
  businesses: [{
    id: businessId,
    name: "Arora Business Solutions",
    legalName: "Arora Business Solutions",
    gstin: "",
    gstRegistered: true,
    address: "Jaipur, Rajasthan",
    stateCode: "08",
    stateName: "Rajasthan",
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
    { id: "cus_sharma", businessId, name: "Sharma Traders", phone: "+91 98111 11111", email: "", gstin: "", address: "Jaipur, Rajasthan", stateCode: "08", stateName: "Rajasthan", createdAt: now, updatedAt: now },
    { id: "cus_gupta", businessId, name: "Gupta Enterprises", phone: "+91 98222 22222", email: "", gstin: "", address: "New Delhi", stateCode: "07", stateName: "Delhi", createdAt: now, updatedAt: now },
    { id: "cus_rahul", businessId, name: "Rahul Services", phone: "+91 98333 33333", email: "", gstin: "", address: "Jaipur, Rajasthan", stateCode: "08", stateName: "Rajasthan", createdAt: now, updatedAt: now },
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
const databasePromise = JSONFilePreset<DatabaseShape>(file, defaultData);
let writeChain: Promise<unknown> = Promise.resolve();

export async function getDatabase() {
  return databasePromise;
}

export async function withDatabaseWrite<T>(operation: (data: DatabaseShape) => T | Promise<T>): Promise<T> {
  const task = writeChain.then(async () => {
    const db = await databasePromise;
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
