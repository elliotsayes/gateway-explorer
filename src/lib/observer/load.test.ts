import { describe, it, expect } from "bun:test";

describe("getAllObserverReportsArweave", () => {
  it("should fetch transactions from Arweave GraphQL endpoint", async () => {
    const args = {
      first: 10,
    };

    const { cursor, transactions } = await getObserverReportsArweave(
      args,
      false
    );

    console.log(transactions);

    expect(cursor).toBeDefined();
    expect(transactions).toBeDefined();
    expect(transactions.length).toBeGreaterThan(0);
  });
});
import { getObserverReportsArweave } from "./load";
