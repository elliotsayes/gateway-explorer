export const networks = ["mainnet", "devnet"] as const;
export const defaultNetwork = networks[0];

export type Network = (typeof networks)[number];

type NetworkConfig = {
  garCacheEndpoint: string;
  incentiveContractTxId: string;
  incentiveContractEndpoint: string;
};

const garCacheTxIdMap: Record<Network, string> = {
  mainnet: "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U",
  devnet: "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U",
};

const incentiveTxIdMap: Record<Network, string> = {
  mainnet: "_NctcA2sRy1-J4OmIQZbYFPM17piNcbdBPH2ncX2RL8",
  devnet: "_NctcA2sRy1-J4OmIQZbYFPM17piNcbdBPH2ncX2RL8",
};

const subdomainMap: Record<Network, string> = {
  mainnet: "api",
  devnet: "dev",
};
const endpointBuilder = (
  network: Network,
  contractTxId: string,
  path: string = "/",
  version: string = "v1"
) =>
  `https://${subdomainMap[network]}.arns.app/${version}/contract/${contractTxId}${path}`;

export const networkConfigMap: Record<Network, NetworkConfig> = {
  mainnet: {
    garCacheEndpoint: endpointBuilder(
      "mainnet",
      garCacheTxIdMap.mainnet,
      "/gateways"
    ),
    incentiveContractTxId: incentiveTxIdMap.mainnet,
    incentiveContractEndpoint: endpointBuilder(
      "mainnet",
      incentiveTxIdMap.mainnet,
      "/read/gateways"
    ),
  },
  devnet: {
    garCacheEndpoint: endpointBuilder(
      "devnet",
      garCacheTxIdMap.devnet,
      "/gateways"
    ),
    incentiveContractTxId: incentiveTxIdMap.devnet,
    incentiveContractEndpoint: endpointBuilder(
      "devnet",
      incentiveTxIdMap.devnet,
      "/read/gateways"
    ),
  },
};
