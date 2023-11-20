import { Transaction } from "arweave-graphql";

export interface ReportHistoryTableData {
  txId: string;
  observer: string;
  timestamp?: number;
}

export const generateReportHistoryTableData = (
  gqlTransaction: Transaction
): ReportHistoryTableData => {
  return {
    txId: gqlTransaction.id,
    observer: gqlTransaction.owner.address,
    timestamp: gqlTransaction.block?.timestamp,
  };
};
