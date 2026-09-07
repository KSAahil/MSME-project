import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import type { DatabaseShape } from "./domain/types";

// A small demo store, not the future production accounting database.
export function createCloudStore(pathname: string, defaults: DatabaseShape) {
  let etag: string | undefined;
  const store = {
    data: structuredClone(defaults),
    async read() {
      const result = await get(pathname, { access: "private", useCache: false });
      if (!result) {
        etag = undefined;
        store.data = structuredClone(defaults);
        return;
      }
      if (!result.stream) throw new Error("Could not read demo records.");
      store.data = await new Response(result.stream).json() as DatabaseShape;
      etag = result.blob.etag;
    },
    async write() {
      const result = await put(pathname, JSON.stringify(store.data), {
        access: "private", contentType: "application/json",
        addRandomSuffix: false, allowOverwrite: Boolean(etag),
        ...(etag ? { ifMatch: etag } : {}),
      });
      etag = result.etag;
    },
  };
  return store;
}

export async function withCloudWrite<T>(pathname: string, defaults: DatabaseShape, operation: (data: DatabaseShape) => T | Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const store = createCloudStore(pathname, defaults);
    await store.read();
    const result = await operation(store.data);
    try {
      await store.write();
      return result;
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) continue;
      // Concurrent first writes must never overwrite one another.
      if (error instanceof Error && /already exists/i.test(error.message)) continue;
      throw error;
    }
  }
  throw new Error("Another update is being saved. Please try again.");
}
