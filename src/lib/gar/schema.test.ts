import { expect, test } from "bun:test";
import GatewayAddressRegistryCache from "../../fixtures/GatewayAddressRegistryCache.json";
import { zGatewayAddressRegistryCache } from "./schema";

test("parse GatewayAddressRegistryCache fixture", () => {
  const result = zGatewayAddressRegistryCache.safeParse(
    GatewayAddressRegistryCache
  );
  expect(result.success).toBeTruthy();
});
