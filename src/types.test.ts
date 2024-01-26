import { expect, test } from "bun:test";
import GatewayAddressRegistryItem from "./fixtures/GatewayAddressRegistryItem.json";
import { zGatewayAddressRegistryItem } from "./types";

test("parse GatewayAddressRegistryItem fixture", () => {
  const result = zGatewayAddressRegistryItem.safeParse(
    GatewayAddressRegistryItem
  );
  expect(result.success).toBeTruthy();
});
