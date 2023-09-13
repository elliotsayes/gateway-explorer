import { zGatewayAddressRegistryItem } from "@/types";
import { z } from "zod";

const pingUpdater = (
  data: Array<z.infer<typeof zGatewayAddressRegistryItem>>,
  onUpdate: (
    newData: Array<z.infer<typeof zGatewayAddressRegistryItem>>
  ) => void
) => {
  const newData = structuredClone(data);
  data.forEach(async (item, index) => {
    try {
      newData[index].ping = { status: "pending" };
      onUpdate(newData);

      const url = item.link;
      const start = Date.now();
      await fetch(url, { method: "HEAD" });
      const end = Date.now();
      const duration = end - start;

      newData[index].ping = { status: "success", value: duration };
      onUpdate(newData);
    } catch (e) {
      console.error(e);
      newData[index].ping = {
        status: "error",
        error: e?.toString() ?? JSON.stringify(e),
      };
      onUpdate(newData);
    }
  });
};

export { pingUpdater };
