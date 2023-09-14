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
    ping: { status: "unknown" },
    health: { status: "unknown" },
    link: `${item.settings.protocol}://${item.settings.fqdn}:${item.settings.port}`,
    ...item,
  }));
};

export { extractGarItems };
