import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DatabaseShape } from "./domain/types";

const mock = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn() }));
vi.mock("@vercel/blob", () => ({
  get: mock.get, put: mock.put,
  BlobPreconditionFailedError: class extends Error {},
}));
import { BlobPreconditionFailedError } from "@vercel/blob";
import { createCloudStore, withCloudWrite } from "./cloud-store";

const empty: DatabaseShape = { businesses: [], customers: [], items: [], invoices: [], payments: [], auditEvents: [] };
function saved(data: DatabaseShape, etag: string) {
  return { stream: new Response(JSON.stringify(data)).body, blob: { etag } };
}

beforeEach(() => vi.resetAllMocks());

describe("hosted demo storage", () => {
  it("separates fresh workspaces and does not write on reads", async () => {
    mock.get.mockResolvedValue(null);
    const one = createCloudStore("demo-workspaces/one.json", empty);
    const two = createCloudStore("demo-workspaces/two.json", empty);
    await one.read();
    await two.read();
    expect(one.data).not.toBe(two.data);
    expect(mock.get).toHaveBeenCalledWith("demo-workspaces/two.json", { access: "private", useCache: false });
    expect(mock.put).not.toHaveBeenCalled();
  });

  it("conditionally saves the version read, without using cached records", async () => {
    mock.get.mockResolvedValue(saved(empty, "version-1"));
    mock.put.mockResolvedValue({ etag: "version-2" });
    await withCloudWrite("demo-workspaces/one.json", empty, () => "done");
    expect(mock.put).toHaveBeenCalledWith("demo-workspaces/one.json", JSON.stringify(empty), expect.objectContaining({
      access: "private", allowOverwrite: true, ifMatch: "version-1",
    }));
  });

  it("retries conflicting writes using the latest stored data", async () => {
    const latest = { ...empty, businesses: [{ nextInvoiceNumber: 2 }] } as DatabaseShape;
    mock.get.mockResolvedValueOnce(saved(empty, "version-1")).mockResolvedValueOnce(saved(latest, "version-2"));
    mock.put.mockRejectedValueOnce(new BlobPreconditionFailedError()).mockResolvedValueOnce({ etag: "version-3" });
    const result = await withCloudWrite("demo-workspaces/one.json", empty, (data) => data.businesses[0]?.nextInvoiceNumber || 1);
    expect(result).toBe(2);
    expect(mock.put.mock.calls[1][2]).toMatchObject({ ifMatch: "version-2" });
  });

  it("never overwrites a concurrently created workspace", async () => {
    mock.get.mockResolvedValueOnce(null).mockResolvedValueOnce(saved(empty, "created"));
    mock.put.mockRejectedValueOnce(new Error("blob already exists")).mockResolvedValueOnce({ etag: "updated" });
    await withCloudWrite("demo-workspaces/one.json", empty, () => true);
    expect(mock.put.mock.calls[0][2].allowOverwrite).toBe(false);
    expect(mock.put.mock.calls[1][2].ifMatch).toBe("created");
  });

  it("propagates storage failures instead of reporting a successful save", async () => {
    mock.get.mockResolvedValue(null);
    mock.put.mockRejectedValue(new Error("Storage unavailable"));
    await expect(withCloudWrite("demo-workspaces/one.json", empty, () => true)).rejects.toThrow("Storage unavailable");
    expect(mock.put).toHaveBeenCalledTimes(1);
  });
});
