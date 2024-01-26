import { QueryClient, queryOptions } from "@tanstack/react-query";
import { defaultGARCacheURL } from "./consts";
import { extractGarItems } from "./convert";
import {
  downloadReportInfoForTransaction,
  querySingleTransaction,
} from "./observer/downloadObservation";
import { fetchIncentiveContractData } from "./incentive/fetchIncentiveContractData";
import { zGatewayAddressRegistryCache } from "./gar/schema";

export const queryClient = new QueryClient();

export const garQuery = queryOptions({
  queryKey: ["gar"],
  queryFn: async () => {
    const garCache = await fetch(defaultGARCacheURL)
      .then((res) => res.json())
      .then((json) => zGatewayAddressRegistryCache.parse(json));
    const incentiveContractData = await fetchIncentiveContractData();

    const garItems = extractGarItems(garCache, incentiveContractData);
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
