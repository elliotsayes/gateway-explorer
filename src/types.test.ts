import { expect, test } from "bun:test";
import GatewayAddressRegistryCache from "./fixtures/GatewayAddressRegistryCache.json";
import GatewayAddressRegistryItem from "./fixtures/GatewayAddressRegistryItem.json";
import {
  zGatewayAddressRegistryCache,
  zGatewayAddressRegistryItem,
} from "./types";

test("parse GatewayAddressRegistryCache fixture", () => {
  const result = zGatewayAddressRegistryCache.safeParse(
    GatewayAddressRegistryCache
  );
  expect(result.success).toBeTruthy();
});

test("parse GatewayAddressRegistryItem fixture", () => {
  const result = zGatewayAddressRegistryItem.safeParse(
    GatewayAddressRegistryItem
  );
  expect(result.success).toBeTruthy();
});
