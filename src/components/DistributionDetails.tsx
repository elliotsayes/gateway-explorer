import { useNetwork } from "@/hooks/useNetwork";
import { fetchDistributions } from "@/lib/distribution/fetchDistributions";
import { useQuery } from "@tanstack/react-query";

const DistributionDetails = () => {
  const { network } = useNetwork();
  const { data: distributionsData } = useQuery({
    queryKey: ['distributions'],
    queryFn: () => fetchDistributions(network),
  });

  if (distributionsData === undefined) return <div>Loading...</div>;

  return (
    <div>
      <p className="text-lg">Distributions for epoch {distributionsData.epochPeriod}</p>
      <div>{JSON.stringify(distributionsData, undefined, 2)}</div>
    </div>
  )
}

export { DistributionDetails }