import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { z } from "zod"
import { useState } from "react"
import { zGatewayAddressRegistryItem } from "@/types"
import { DelegateSummary } from "./DelegateSummary"

interface Props {
  totalDelegatedStake: z.infer<typeof zGatewayAddressRegistryItem>['totalDelegatedStake']
  delegates: z.infer<typeof zGatewayAddressRegistryItem>['delegates']
}

const DelegatedStakeHoverCard = ({totalDelegatedStake, delegates}: Props) => {
  const [open, setOpen] = useState(false);  

  return (
    <HoverCard
      open={open}
      onOpenChange={(o) => setOpen(o)}
    >
      <HoverCardTrigger
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <div className="max-w-[16rem]"><span className="text-secondary-foreground/80 line-clamp-1 underline cursor-pointer text-center">
          {totalDelegatedStake}
        </span></div>
      </HoverCardTrigger>
      <HoverCardContent 
        onClick={(e) => e.stopPropagation()}
        className="w-full"
      >
        <DelegateSummary delegates={delegates} />
      </HoverCardContent>
    </HoverCard>
  )
}

export default DelegatedStakeHoverCard