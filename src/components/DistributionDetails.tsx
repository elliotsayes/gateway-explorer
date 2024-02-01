import { useNetwork } from "@/hooks/useNetwork";
import { fetchDistributions } from "@/lib/distribution/fetchDistributions";
import { useQuery } from "@tanstack/react-query";

const DistributionDetails = () => {
  const { network } = useNetwork();
  const { data } = useQuery({
    queryKey: ['distribution'],
    queryFn: () => fetchDistributions(network),
  });

  if (data === undefined) return <div>Loading...</div>;

  return (
    <div>{JSON.stringify(data)}</div>
  )
}

export { DistributionDetails }