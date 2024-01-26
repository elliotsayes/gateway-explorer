import { zArweaveTxId, zGatewayAddressRegistryItemData } from "@/types";
import { z } from "zod";

export const incentiveContractItemSchema = z.union([
  zGatewayAddressRegistryItemData,
  z.object({
    stats: z.object({
      failedConsecutiveEpochs: z.number().int().nonnegative(),
      passedEpochCount: z.number().int().nonnegative(),
      submittedEpochCount: z.number().int().nonnegative(),
      totalEpochParticipationCount: z.number().int().nonnegative(),
      totalEpochsPrescribedCount: z.number().int().nonnegative(),
    }),
    weights: z.object({
      compositeWeight: z.number().nonnegative(),
      gatewayRewardRatioWeight: z.number().nonnegative(),
      normalizedCompositeWeight: z.number().nonnegative(),
      observerRewardRatioWeight: z.number().nonnegative(),
      stakeWeight: z.number().nonnegative(),
      tenureWeight: z.number().nonnegative(),
    }),
  }),
]);

export const incentiveContractSchema = z.record(
  zArweaveTxId,
  incentiveContractItemSchema
);

export const incentiveContractEndpointSchema = z.object({
  contractTxId: zArweaveTxId,
  result: incentiveContractSchema,
  evaluationOptions: z.object({
    sourceType: z.string(),
  }),
});
