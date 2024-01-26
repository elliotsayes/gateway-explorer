import { test, expect } from "bun:test";
import IncentiveContract from "../../fixtures/IncentiveContract.json";
import { incentiveContractEndpointSchema } from "./schema";

test("parse IncentiveContract fixture", () => {
  const result = incentiveContractEndpointSchema.safeParse(IncentiveContract);
  expect(result.success).toBeTruthy();
});
