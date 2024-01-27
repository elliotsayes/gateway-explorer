import { Network, networkConfigMap } from "../networks";
import { incentiveContractEndpointSchema } from "./schema";

export const fetchIncentiveContractData = async (network: Network) => {
  const contractTxId = networkConfigMap[network].incentiveContractTxId;
  const endpoint = networkConfigMap[network].incentiveContractEndpoint;
  const contractEndpointData = await fetch(endpoint)
    .then((res) => res.json())
    .then((json) => incentiveContractEndpointSchema.parse(json));
  if (contractEndpointData.contractTxId !== contractTxId) {
    throw Error(
      `Contract tx id mismatch. Expected ${contractTxId}, got ${contractEndpointData.contractTxId}`
    );
  }
  console.info(
    "Incentive contract evaluation options:",
    contractEndpointData.evaluationOptions
  );
  return contractEndpointData.result;
};
