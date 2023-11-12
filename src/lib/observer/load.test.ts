import { describe, it, expect } from "bun:test";
import {
  GetObserverReportTxIdsArgs,
  Transaction,
  getObserverReportsTxIdsArweave,
  getReportInfo,
} from "./load";
import { SortOrder } from "arweave-graphql";

describe("getObserverReportsTxIdsArweave", () => {
  it("should fetch transactions from Arweave GraphQL endpoint", async () => {
    const args: GetObserverReportTxIdsArgs = {
      first: 10,
      sort: SortOrder.HeightDesc,
    };

    const { cursor, transactions } = await getObserverReportsTxIdsArweave(
      args,
      false
    );

    // console.log(transactions);

    expect(cursor).toBeDefined();
    expect(transactions).toBeDefined();
    expect(transactions.length).toBeGreaterThan(0);
  });
});

describe("getReportInfo", () => {
  it("should fetch report info from Arweave gateway", async () => {
    const transaction: Transaction = {
      id: "oziZcRu1sUiRbOyowZouREPbRkb8P3Q9Qv2DjYuryEI",
      tags: [
        {
          name: "Content-Encoding",
          value: "gzip",
        },
      ],
    } as Transaction;
    const reportInfo = await getReportInfo(transaction);

    console.log(reportInfo);

    expect(reportInfo).toBeDefined();
  });
});
