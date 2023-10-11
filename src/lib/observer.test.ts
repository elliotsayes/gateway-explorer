import { expect, test } from "bun:test";
import { getArnsResolution } from "./observer";

test(
  "getArnsResolution from ar.io.dev node",
  async () => {
    const gatewayAddress = "ar-io.dev:443";
    const result = await getArnsResolution({
      host: gatewayAddress,
      arnsName: "bitcoin",
    });

    // expect(result.contentLength).toEqual();
    expect(result.contentType).toEqual("text/html; charset=utf-8");
    expect(result.dataHashDigest).toEqual(
      "6FAUalNO45Lz9ZwFqXt1R3AD7meqmQG_9_VumijD5sI"
    );
    expect(result.resolvedId).toEqual(
      "ynve-5sftS5fUp_UZw39bKuDjIybsm7AsWsBILey9iU"
    );
    expect(result.statusCode).toEqual(200);

    expect(result.timings?.request).toBeGreaterThanOrEqual(0);
    expect(result.timings?.total).toBeGreaterThanOrEqual(0);
    expect(result.timings?.total).toBeGreaterThanOrEqual(
      result.timings!.request!
    );

    expect(parseInt(result.ttlSeconds!)).toBeGreaterThanOrEqual(0);
  },
  { timeout: 11_000 }
);
