import { observationDb } from "../idb/observation";
import { queryObserverReportTransactions } from "./downloadObservation";

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
    localStorage.setItem("lastCursor", transactionEdge.cursor);
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
    localStorage.setItem("lastCursor", transactionEdge.cursor);
  }
};
