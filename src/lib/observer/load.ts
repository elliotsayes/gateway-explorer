import arweaveGraphql, {
  GetTransactionsQuery,
  SortOrder,
} from "arweave-graphql";

const graphqlUrl = "https://arweave.net/graphql";

const gql = arweaveGraphql(graphqlUrl);

type GetAllReportArgs = Parameters<typeof gql.getTransactions>["0"];

type Transaction = GetTransactionsQuery["transactions"]["edges"][0];

export const getAllObserverReportsArweave = async (args: GetAllReportArgs) => {
  let queryRes: GetTransactionsQuery | undefined = undefined;
  const results: Transaction[] = [];
  do {
    queryRes = await gql.getTransactions({
      tags: [
        { name: "App-Name", values: ["AR-IO Observer"] },
        { name: "App-Version", values: ["0.0.1"] },
        { name: "Content-Type", values: ["application/json"] },
        { name: "Content-Encoding", values: ["gzip"] },
      ],
      first: 100,
      sort: SortOrder.HeightAsc,
      ...args,
      after: queryRes!.transactions.edges[0].cursor,
    });
    results.concat(queryRes.transactions.edges);
  } while (queryRes.transactions.pageInfo.hasNextPage);

  const transactions = results.map((r) => r.node);
  const cursor = results[results.length - 1].cursor;

  return {
    transactions,
    cursor,
  };
};
