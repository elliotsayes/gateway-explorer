import { z } from "zod";
import ky from "ky";
import { arrayBufferToBase64Url } from "../utils";
import { arnsResolutionSchema } from "./schema";

const getArnsResolution = async ({
  protocol,
  fqdn,
  port,
  arnsName,
}: {
  protocol?: string;
  fqdn: string;
  port?: number;
  arnsName: string;
}): Promise<z.infer<typeof arnsResolutionSchema>> => {
  const url = `${protocol ?? "https"}://${arnsName}.${fqdn}:${port ?? 443}/`;

  const startTimestamp = Date.now();
  const response = await ky.get(url, {
    timeout: 10_000, // 10 seconds
    throwHttpErrors: false,
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

  return arnsResolutionSchema.parse({
    statusCode: response.status,
    resolvedId: response.headers.get("x-arns-resolved-id"),
    ttlSeconds: response.headers.get("x-arns-ttl-seconds"),
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
    dataHashDigest: dataHashBase64url,
    timings: {
      start: startTimestamp,
      phases: {
        request: responseTimestamp - startTimestamp,
        total: endTimestamp - startTimestamp,
      },
    },
  });
};

export { getArnsResolution };
