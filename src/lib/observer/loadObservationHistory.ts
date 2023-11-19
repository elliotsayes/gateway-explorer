import { observationDb } from "../idb/observation";
import { queryObserverReportTransactions } from "./downloadObservation";

const cursorKey = (observerAddresses?: string[]) => {
  if (observerAddresses === undefined) {
    return "lastCursor";
  }
  return `lastCursor-[${[...observerAddresses].sort().join(",")}]`;
};

export const loadObservationsLatest = async (
  n: number,
  observerAddresses?: string[]
) => {
  for await (const transactionEdge of queryObserverReportTransactions(
    {
      first: n,
      owners: observerAddresses,
    },
    false
  )) {
    const transaction = transactionEdge.node;
    await observationDb.observationIndex.put(transaction, transaction.id);
    localStorage.setItem(cursorKey(observerAddresses), transactionEdge.cursor);
  }
};

export const loadObservationHistory = async (
  startCursor?: string,
  observerAddresses?: string[]
) => {
  for await (const transactionEdge of queryObserverReportTransactions(
    {
      after: startCursor,
      owners: observerAddresses,
    },
    true
  )) {
    const transaction = transactionEdge.node;
    await observationDb.observationIndex.put(transaction, transaction.id);
    localStorage.setItem(cursorKey(observerAddresses), transactionEdge.cursor);
  }
};
