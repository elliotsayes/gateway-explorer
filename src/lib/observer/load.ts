import arweaveGraphql, {
  GetTransactionsQuery,
  SortOrder,
} from "arweave-graphql";

const graphqlUrl = "arweave.net/graphql";
const gql = arweaveGraphql(graphqlUrl);

type GetAllReportArgs = Parameters<typeof gql.getTransactions>["0"];

type TransactionEdge = GetTransactionsQuery["transactions"]["edges"][0];

export type Transaction = TransactionEdge["node"];

export const getObserverReportsArweave = async (
  args: GetAllReportArgs,
  all = true
) => {
  let queryRes: GetTransactionsQuery | undefined = undefined;
  let results: TransactionEdge[] = [];
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
    console.log({
      pageArgs: pageArgs,
      queryRes: queryRes,
    });
    results = results.concat(queryRes.transactions.edges);
  } while (all && queryRes.transactions.pageInfo.hasNextPage);

  const cursor = results[results.length - 1]?.cursor as string | undefined;
  const transactions: Transaction[] = results.map((r) => r.node);

  return {
    cursor,
    transactions,
  };
};
