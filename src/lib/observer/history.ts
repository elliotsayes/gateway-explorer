import { Transaction } from "arweave-graphql";

export interface ReportHistoryTableData {
  observer: string;
  timestamp?: number;
}

export const generateReportHistoryTableData = (
  gqlTransaction: Transaction
): ReportHistoryTableData => {
  return {
    observer: gqlTransaction.owner.address,
    timestamp: gqlTransaction.block?.timestamp,
  };
};
