import { zGatewayAddressRegistryItem } from "@/types";
import { z } from "zod";

const pingUpdater = async (
  data: Array<z.infer<typeof zGatewayAddressRegistryItem>>,
  onUpdate: (
    newData: Array<z.infer<typeof zGatewayAddressRegistryItem>>
  ) => void
) => {
  const newData = structuredClone(data);
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    try {
      newData[index].ping = { status: "pending" };
      onUpdate(newData);

      const url = item.link;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);

      const start = Date.now();
      await fetch(url, { method: "HEAD", signal: controller.signal });
      const end = Date.now();
      const duration = end - start;

      clearTimeout(id);
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
  }
};

export { pingUpdater };