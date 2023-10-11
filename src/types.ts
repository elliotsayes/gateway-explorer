import { z } from "zod";

export const zArweaveTxId = z.string().regex(/^[\w-]{43}$/);

export const zGatewayVault = z.object({
  balance: z.number().int().nonnegative(),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
});

export const zGatewayAddressRegistryItemData = z.object({
  operatorStake: z.number().int().nonnegative(),
  vaults: z.array(zGatewayVault),
  settings: z.object({
    label: z.string(),
    fqdn: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*$/i),
    port: z.number().int().nonnegative(),
    protocol: z.enum(["http", "https"]),
    properties: z.string().optional(),
    note: z.string().optional(),
  }),
  status: z.enum(["joined"]),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
});

export const zGatewayAddressRegistryCache = z.object({
  contractTxId: z.string(),
  gateways: z.record(zArweaveTxId, zGatewayAddressRegistryItemData),
  evaluationOptions: z.object({}),
});

export const zGatewayHealthCheck = z.object({
  uptime: z.number().nonnegative(),
  message: z.string().optional(),
  date: z.string().datetime().optional(),
});

export const zArnsResolutionSuccess = z.object({
  statusCode: z.literal(200),
  resolvedId: z.string(),
  ttlSeconds: z.string(),
  contentType: z.string(),
  contentLength: z.string().nullable(),
  dataHashDigest: z.string(),
  timings: z.object({
    wait: z.number().int().nonnegative().optional(),
    dns: z.number().int().nonnegative().optional(),
    tcp: z.number().int().nonnegative().optional(),
    tls: z.number().int().nonnegative().optional(),
    request: z.number().int().nonnegative().optional(),
    firstByte: z.number().int().nonnegative().optional(),
    download: z.number().int().nonnegative().optional(),
    total: z.number().int().nonnegative(),
  }),
});

export const zArnsResolution = z.discriminatedUnion("statusCode", [
  zArnsResolutionSuccess,
  z.object({
    statusCode: z.literal(404),
    resolvedId: z.null(),
    ttlSeconds: z.null(),
    contentType: z.null(),
    contentLength: z.null(),
    dataHashDigest: z.null(),
    timings: z.null(),
  }),
]);

// TODO: Copy from observation protocol standard
export const zArioObservation = z.object({
  pass: z.boolean(),
  resolution: zArnsResolution.optional(),
});

export const zGatewayAddressRegistryItem = z.intersection(
  z.object({
    id: zArweaveTxId,
    linkFull: z.string().url(),
    linkDisplay: z.string(),
    ping: z.discriminatedUnion("status", [
      z.object({ status: z.literal("unknown") }),
      z.object({ status: z.literal("pending") }),
      z.object({ status: z.literal("error"), error: z.string().optional() }),
      z.object({
        status: z.literal("success"),
        value: z.number().int().nonnegative(),
      }),
    ]),
    health: z.discriminatedUnion("status", [
      z.object({ status: z.literal("unknown") }),
      z.object({ status: z.literal("pending") }),
      z.object({ status: z.literal("error"), error: z.string().optional() }),
      z.object({
        status: z.literal("success"),
        uptime: z.number().nonnegative(),
      }),
    ]),
    observation: z.discriminatedUnion("status", [
      z.object({ status: z.literal("unknown") }),
      z.object({ status: z.literal("pending") }),
      z.object({ status: z.literal("error"), error: z.string().optional() }),
      z.object({
        status: z.literal("success"),
        result: zArioObservation,
      }),
    ]),
  }),
  zGatewayAddressRegistryItemData
);
