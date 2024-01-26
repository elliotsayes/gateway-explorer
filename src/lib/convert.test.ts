import { expect, test } from "bun:test";
import GatewayAddressRegistryCache from "../fixtures/GatewayAddressRegistryCache.json";
import { zGatewayAddressRegistryItem } from "../types";
import { extractGarItems } from "./convert";
import { z } from "zod";
import { zGatewayAddressRegistryCache } from "./gar/schema";

test("convert GatewayAddressRegistryCache fixture", () => {
  const garCache = zGatewayAddressRegistryCache.parse(
    GatewayAddressRegistryCache
  );
  const garItems = extractGarItems(garCache);
  expect(garItems.length).toEqual(Object.keys(garCache.gateways).length);

  const garItemsParsed = z
    .array(zGatewayAddressRegistryItem)
    .safeParse(garItems);
  expect(garItemsParsed.success).toBeTruthy();
});
