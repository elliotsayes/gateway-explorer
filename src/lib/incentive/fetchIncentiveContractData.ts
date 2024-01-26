import { incentiveContractEndpointSchema } from "./schema";

const contractTxId = "_NctcA2sRy1-J4OmIQZbYFPM17piNcbdBPH2ncX2RL8";
const getContractEndpointUrl = (contractTxId: string) =>
  `https://dev.arns.app/v1/contract/${contractTxId}/read/gateways`;
const contractEndpointUrl = getContractEndpointUrl(contractTxId);

export const fetchIncentiveContractData = async () => {
  const contractEndpointData = await fetch(contractEndpointUrl)
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
