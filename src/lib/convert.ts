import {
  zGatewayAddressRegistryCache,
  zGatewayAddressRegistryItem,
} from "@/types";
import { z } from "zod";

const extractGarItems = (
  garCache: z.infer<typeof zGatewayAddressRegistryCache>
): Array<z.infer<typeof zGatewayAddressRegistryItem>> => {
  return Object.entries(garCache.gateways).map(([txId, item]) => ({
    id: txId,
    ...item,
  }));
};

export { extractGarItems };
