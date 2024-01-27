export const networks = ["mainnet", "devnet"] as const;
export const defaultNetwork = networks[0];

export type Network = (typeof networks)[number];

type NetworkConfig = {
  garCacheUrl: string;
  incentiveContractUrl: string;
};

export const networkConfigMap: Record<Network, NetworkConfig> = {
  mainnet: {
    garCacheUrl:
      "https://api.arns.app/v1/contract/bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U/gateways",
    incentiveContractUrl: "https://incentive.gar.dev",
  },
  devnet: {
    garCacheUrl:
      "https://dev.arns.app/v1/contract/bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U/gateways",
    incentiveContractUrl: "https://incentive.devnet.gar.dev",
  },
};
