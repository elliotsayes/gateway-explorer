import arweaveGraphql, {
  GetTransactionsQuery,
  SortOrder,
} from "arweave-graphql";
import { z } from "zod";
import { observerReportSchema } from "./schema";
import { inflate } from "pako";

const gatewayUrl = "arweave.net";
const graphqlUrl = "arweave.net/graphql";
const gql = arweaveGraphql(graphqlUrl);

type TransactionEdge = GetTransactionsQuery["transactions"]["edges"][0];

export type GetObserverReportTxIdsArgs = Parameters<
  typeof gql.getTransactions
>["0"];

export type Transaction = TransactionEdge["node"];

export async function* queryObserverReportTransactions(
  args: GetObserverReportTxIdsArgs,
  all = true
) {
  let queryRes: GetTransactionsQuery | undefined = undefined;
  do {
    const pageArgs = {
      tags: [
        { name: "App-Name", values: ["AR-IO Observer"] },
        // { name: "App-Version", values: ["0.0.1"] },
        // { name: "Content-Type", values: ["application/json"] },
        // { name: "Content-Encoding", values: ["gzip"] },
      ],
      first: 100,
      sort: SortOrder.HeightAsc,
      ...args,
      after: queryRes?.transactions.edges[0].cursor ?? args?.after,
    };
    queryRes = await gql.getTransactions(pageArgs);
    const transactionEdges: TransactionEdge[] = queryRes.transactions.edges;
    yield* transactionEdges;
  } while (all && queryRes.transactions.pageInfo.hasNextPage);
  return queryRes;
}

export async function querySingleTransaction(id: string) {
  const results = await gql.getTransactions({
    ids: [id],
  });
  if (results.transactions.edges.length === 0) {
    throw new Error(`Transaction not found: ${id}`);
  }
  return results.transactions.edges[0].node;
}

export const downloadReportInfoForTransaction = async (
  transaction: Transaction
) => {
  const txDataRes = await fetch(`https://${gatewayUrl}/${transaction.id}`);
  let observerReport: z.infer<typeof observerReportSchema> | undefined =
    undefined;
  if (
    transaction.tags.find(
      (t) =>
        t.name.toLowerCase() === "content-encoding" &&
        t.value.toLowerCase() === "gzip"
    ) !== undefined
  ) {
    const txDataInflated = inflate(await txDataRes.arrayBuffer());
    const txDataText = new TextDecoder().decode(txDataInflated);
    const txDataJson = JSON.parse(txDataText);
    observerReport = observerReportSchema.parse(txDataJson);
  } else {
    observerReport = observerReportSchema.parse(await txDataRes.json());
  }
  return observerReport;
};

export const downloadCurrentReportInfoFromGateway = async (
  linkFull: string
) => {
  const currentReportUrl = `${linkFull}/ar-io/observer/reports/current`;
  return await fetch(currentReportUrl)
    .then((res) => res.json())
    .then((json) => observerReportSchema.parse(json));
};
