import { describe, it, expect } from "bun:test";
import {
  GetObserverReportTxIdsArgs,
  queryObserverReportTransactions,
  downloadReportInfoForTransaction,
  downloadCurrentReportInfoFromGateway,
} from "./downloadObservation";
import { SortOrder } from "arweave-graphql";
import transaction from "../../fixtures/ReportTransaction.json";
import transactionData from "../../fixtures/ReportTransactionData.json";

describe("getObserverReportsTxIdsArweave", () => {
  it("should fetch transactions from Arweave GraphQL endpoint", async () => {
    const args: GetObserverReportTxIdsArgs = {
      first: 10,
      sort: SortOrder.HeightDesc,
    };

    const transactions = await Array.fromAsync(
      queryObserverReportTransactions(args, false)
    );

    // console.log(transactions);

    expect(transactions).toBeDefined();
    expect(transactions.length).toBeGreaterThan(0);
  });
});

describe("getReportInfo", () => {
  it("should fetch report info from Arweave gateway", async () => {
    const reportInfo = await downloadReportInfoForTransaction(transaction);

    // console.log(reportInfo);

    expect(reportInfo).toBeDefined();
    expect(reportInfo).toEqual(transactionData);
  });
});

describe("downloadCurrentReportInfoFromGateway", () => {
  it("should fetch report info from Arweave gateway", async () => {
    const linkFull = "https://ar-io.dev";
    const reportInfo = await downloadCurrentReportInfoFromGateway(linkFull);

    // console.log(reportInfo);

    expect(reportInfo).toBeDefined();
  });
});
