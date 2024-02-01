import { useNetwork } from "@/hooks/useNetwork";
import { fetchDistributions } from "@/lib/distribution/fetchDistributions";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { InfoIcon } from "lucide-react";
import { fetchBalanceContract } from "@/lib/balance/fetchBalance";

const DistributionDetails = () => {
  const { network } = useNetwork();
  const { data: distributionsData } = useQuery({
    queryKey: ['distributions', network],
    queryFn: () => fetchDistributions(network),
  });

  const { data: balanceData } = useQuery({
    queryKey: ['balance', network],
    queryFn: () => fetchBalanceContract(network),
  })

  if (distributionsData === undefined || balanceData === undefined) 
    return <div>Loading...</div>;

  return (
    <div>
      <p className="text-lg">Epoch {distributionsData.epochPeriod} Distribution</p>
      <div className="text-secondary-foreground/80">
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
        <p>Distribution amount: {(balanceData*0.0025).toFixed(2)}</p>
      </div>
    </div>
  )
}

export { DistributionDetails }