export const networks = ["mainnet", "devnet"] as const;
export const defaultNetwork: Network = "mainnet";

export type Network = (typeof networks)[number];

type ContractTxIdConfig = {
  garCache: string;
  incentive: string;
};

export const contractTxIdMap: Record<Network, ContractTxIdConfig> = {
  mainnet: {
    garCache: "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U",
    incentive: "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U",
  },
  devnet: {
    garCache: "_NctcA2sRy1-J4OmIQZbYFPM17piNcbdBPH2ncX2RL8",
    incentive: "_NctcA2sRy1-J4OmIQZbYFPM17piNcbdBPH2ncX2RL8",
  },
};

type EndpointConfig = {
  garCache: string;
  incentive: string;
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

type NetworkConfig = {
  contractTxIds: ContractTxIdConfig;
  endpoints: EndpointConfig;
};

const configBuilder = (network: Network): NetworkConfig => {
  const contractTxIds = contractTxIdMap[network];
  const endpoints = {
    garCache: endpointBuilder(network, contractTxIds.garCache, "/gateways"),
    incentive: endpointBuilder(
      network,
      contractTxIds.incentive,
      "/read/gateways"
    ),
  };
  return { contractTxIds, endpoints };
};

export const networkConfigMap: Record<Network, NetworkConfig> = {
  mainnet: configBuilder("mainnet"),
  devnet: configBuilder("devnet"),
};
