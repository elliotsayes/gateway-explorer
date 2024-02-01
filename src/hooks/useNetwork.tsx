import { Network, defaultNetwork } from '@/lib/networks';
import { useLocalStorage } from '@rehooks/local-storage';

const url = new URL(window.location.href);
const hostname = url.hostname;
const domainParts = hostname.split('.');
const tld = domainParts.slice(-1)[0];

let defaultNetworkContextual: Network = import.meta.env.VITE_DEFAULT_NETWORK ?? defaultNetwork;
if (tld === 'dev') {
  defaultNetworkContextual = 'devnet';
}

export const useNetwork = () => {
  const [network, setNetwork] = useLocalStorage<Network>('network', defaultNetworkContextual);

  return { network, setNetwork };
};
