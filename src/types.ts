import { z } from "zod";

export const zArweaveTxId = z.string().regex(/^[\w-]{43}$/);

export const zGatewayVault = z.object({
  balance: z.number().int().nonnegative(),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
});

export const zGatewayAddressRegistryItem = z.object({
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
  gateways: z.record(zArweaveTxId, zGatewayAddressRegistryItem),
  evaluationOptions: z.object({}),
});
