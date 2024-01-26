import { describe, it, expect } from "bun:test";
import { fetchIncentiveContractData } from "./fetchIncentiveContractData";

describe("fetchIncentiveContractData", () => {
  it("should fetch fetchIncentiveContractData from endpoint", async () => {
    const observerInfo = await fetchIncentiveContractData();

    // console.log(observerInfo);

    expect(observerInfo).toBeDefined();
  });
});
