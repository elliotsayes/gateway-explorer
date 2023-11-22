import { defaultGARCacheURL } from "./consts";
import { extractGarItems } from "./convert";

export const garQuery = {
  queryKey: ["gar"],
  queryFn: async () => {
    const fetchResult = await fetch(defaultGARCacheURL);
    const fetchJson = await fetchResult.json();
    const garItems = extractGarItems(fetchJson);
    return garItems;
  },
  refetchInterval: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: false,
} as const;
