import { Network } from '@/lib/networks';
import { useEffect } from 'react';

const url = new URL(window.location.href);
const hostname = url.hostname;
const domainParts = hostname.split('.');
const tld = domainParts.slice(-1)[0];

let currentNetwork: Network = import.meta.env.VITE_DEFAULT_NETWORK ?? 'mainnet';
if (tld === 'dev') {
  currentNetwork = 'devnet';
}

export const useNetwork = () => {
  useEffect(() => {
    console.info(`TLD: ${tld}`);
    console.info(`Using network: ${currentNetwork}`);
  }, []);

  return currentNetwork;
};
