import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { IncentiveSummary } from "./IncentiveSummary"
import { incentiveInfoSchema } from "@/lib/incentive/schema"
import { z } from "zod"

interface Props {
  incentiveInfo: z.infer<typeof incentiveInfoSchema>
}

const IncentiveHoverCard = ({incentiveInfo}: Props) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="max-w-[16rem]"><span className="text-secondary-foreground/80 line-clamp-1 underline cursor-pointer">
          {`${(incentiveInfo.weights.normalizedCompositeWeight * 100).toFixed(2)}%`}
        </span></div>
      </HoverCardTrigger>
      <HoverCardContent 
        onClick={(e) => e.stopPropagation()}
        className="w-72"
      >
        <IncentiveSummary incentiveInfo={incentiveInfo!} />
      </HoverCardContent>
    </HoverCard>
  )
}

export default IncentiveHoverCard