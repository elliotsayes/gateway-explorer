import { zGatewayAddressRegistryItem } from "@/types";
import { z } from "zod";
import { linkFull, linkDisplay } from "./utils";
import {
  incentiveContractSchema,
  incentiveInfoSchema,
} from "./incentive/schema";
import { zGatewayAddressRegistryCache } from "./gar/schema";

const extractGarItems = (
  garCache: z.infer<typeof zGatewayAddressRegistryCache>,
  incentiveContractData?: z.infer<typeof incentiveContractSchema>
): Array<z.infer<typeof zGatewayAddressRegistryItem>> => {
  const gatewayEntries = Object.entries(garCache.gateways);
  return gatewayEntries.map(([txId, item]) => {
    const fqdnIndex = gatewayEntries
      .filter(([, matchItem]) => matchItem.settings.fqdn == item.settings.fqdn)
      .findIndex(([matchTx]) => matchTx === txId);
    const fqdnKey =
      fqdnIndex === 0
        ? item.settings.fqdn
        : `${item.settings.fqdn}${`~${fqdnIndex}`}`;

    let incentiveInfo: z.infer<typeof incentiveInfoSchema> | undefined;
    // TODO: find a better way to match these up
    const incentiveItem = incentiveContractData?.[txId];
    if (incentiveItem) {
      incentiveInfo = {
        stats: incentiveItem.stats,
        weights: incentiveItem.weights,
      };
    }

    return {
      id: txId,
      fqdnKey: fqdnKey,
      ping: { status: "unknown" },
      health: { status: "unknown" },
      observation: { status: "unknown" },
      linkFull: linkFull(
        item.settings.protocol,
        item.settings.fqdn,
        item.settings.port
      ),
      linkDisplay: linkDisplay(
        item.settings.protocol,
        item.settings.fqdn,
        item.settings.port
      ),
      ...item,
      incentiveInfo,
    };
  });
};

export { extractGarItems };
