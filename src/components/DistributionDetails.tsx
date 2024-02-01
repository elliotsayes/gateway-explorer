import { useNetwork } from "@/hooks/useNetwork";
import { fetchDistributions } from "@/lib/distribution/fetchDistributions";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { InfoIcon } from "lucide-react";

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
      <div>
        <div className="flex flex-row gap-1">
          <span>
            Height: {distributionsData.epochStartHeight} - {distributionsData.epochEndHeight}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon size={12} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Zero epoch height: {distributionsData.epochZeroStartHeight}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p>Next distribution at {distributionsData.nextDistributionHeight}</p>
      </div>
    </div>
  )
}

export { DistributionDetails }