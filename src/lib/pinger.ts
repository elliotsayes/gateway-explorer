import { zGatewayAddressRegistryItem, zGatewayHealthCheck } from "@/types";
import { z } from "zod";

const pingStaggerDelayMs = 10;

const pingUpdater = async (
  data: Array<z.infer<typeof zGatewayAddressRegistryItem>>,
  onUpdate: (
    newData: Array<z.infer<typeof zGatewayAddressRegistryItem>>
  ) => void
) => {
  const newData = structuredClone(data);
  const pingPromises = data.map((item, index) => async () => {
    const delayMs = pingStaggerDelayMs * index;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    try {
      newData[index].ping = { status: "pending" };
      onUpdate(newData);

      const url = `${item.link}/ar-io/healthcheck`;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);

      const start = Date.now();
      const fetchResult = await fetch(url, {
        method: "GET",
        signal: controller.signal,
      });
      const end = Date.now();
      const duration = end - start;

      clearTimeout(id);
      newData[index].ping = { status: "success", value: duration };
      onUpdate(newData);

      try {
        newData[index].health = { status: "pending" };
        onUpdate(newData);

        const healthJson = await fetchResult.json();
        const healthData = zGatewayHealthCheck.parse(healthJson);

        newData[index].health = {
          status: "success",
          uptime: healthData.uptime,
        };
        onUpdate(newData);
      } catch (e) {
        console.error(e);
        newData[index].health = {
          status: "error",
          error: e?.toString() ?? JSON.stringify(e),
        };
        onUpdate(newData);
      }
    } catch (e) {
      console.error(e);
      newData[index].ping = {
        status: "error",
        error: e?.toString() ?? JSON.stringify(e),
      };
      onUpdate(newData);
    }
  });
  await Promise.all(pingPromises.map((p) => p()));
};

export { pingUpdater };
