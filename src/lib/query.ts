import { QueryClient, queryOptions } from "@tanstack/react-query";
import { defaultGARCacheURL } from "./consts";
import { extractGarItems } from "./convert";
import {
  downloadReportInfoForTransaction,
  querySingleTransaction,
} from "./observer/downloadObservation";

export const queryClient = new QueryClient();

export const garQuery = queryOptions({
  queryKey: ["gar"],
  queryFn: async () => {
    const fetchResult = await fetch(defaultGARCacheURL);
    const fetchJson = await fetchResult.json();
    const garItems = extractGarItems(fetchJson);
    garItems.sort((a, b) => a.fqdnKey.localeCompare(b.fqdnKey));
    return garItems;
  },
  refetchInterval: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: false,
});

export const reportTxQueryBuilder = (txId: string) =>
  queryOptions({
    queryKey: ["observationReportTx", txId],
    queryFn: async () => {
      const tx = await querySingleTransaction(txId);
      const reportData = await downloadReportInfoForTransaction(tx);
      return {
        tx,
        reportData,
      };
    },
  });
