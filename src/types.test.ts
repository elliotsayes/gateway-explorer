import { expect, test } from "bun:test";
import GatewayAddressRegistryCache from "./fixtures/GatewayAddressRegistryCache.json";
import { zGatewayAddressRegistryCache } from "./types";

test("parse fixture", () => {
  const result = zGatewayAddressRegistryCache.safeParse(
    GatewayAddressRegistryCache
  );
  expect(result.success).toBeTruthy();
});
