import { z } from "zod";
import { zArnsResolution } from "@/types";
import ky from "ky";
import { arrayBufferToBase64Url } from "./utils";

const getArnsResolution = async ({
  host,
  arnsName,
}: {
  host: string;
  arnsName: string;
}): Promise<z.infer<typeof zArnsResolution>> => {
  const url = `https://${arnsName}.${host}/`;

  const startTimestamp = Date.now();
  const response = await ky.get(url, {
    timeout: 10_000, // 10 seconds
  });
  const responseTimestamp = Date.now();

  if (!response.ok) {
    if (response.status === 404) {
      return {
        statusCode: 404,
        resolvedId: null,
        ttlSeconds: null,
        contentType: null,
        contentLength: null,
        dataHashDigest: null,
        timings: null,
      };
    } else {
      throw new Error(
        `Unexpected response status: ${response.status} (${response.statusText}))`
      );
    }
  }

  const data = await response.arrayBuffer();
  const endTimestamp = Date.now();

  const dataHash = await crypto.subtle.digest("SHA-256", data);
  const dataHashBase64url = arrayBufferToBase64Url(dataHash);

  return zArnsResolution.parse({
    statusCode: response.status,
    resolvedId: response.headers.get("x-arns-resolved-id"),
    ttlSeconds: response.headers.get("x-arns-ttl-seconds"),
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
    dataHashDigest: dataHashBase64url,
    timings: {
      request: responseTimestamp - startTimestamp,
      total: endTimestamp - startTimestamp,
    },
  });
};

export { getArnsResolution };
