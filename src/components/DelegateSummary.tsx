import { z } from "zod"
import { zGatewayAddressRegistryItem } from "@/types";
import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";

interface Props {
  delegates: z.infer<typeof zGatewayAddressRegistryItem>['delegates']
}

const DelegateSummary = ({delegates}: Props) => {
  const sortedDelegates = useMemo(() => {
    return Object.entries(delegates).sort((a, b) => {
      return b[1].delegatedStake - a[1].delegatedStake
    })
  }, [delegates]);

  return (
    <div>
      <ScrollArea className="h-60 w-full pr-4">
        {/* <p className="text-lg">Delegates</p> */}
        <Table>
          <TableHeader>
            <TableCell className="text-md">
              Delegate Address
            </TableCell>
            <TableCell className="text-md text-right">
              Stake
            </TableCell>
          </TableHeader>
          <TableBody>
            {sortedDelegates.map(([delegateId, delegateInfo]) => (
              <TableRow key={delegateId} className="py-2">
                <TableCell className="py-1">
                  <a 
                    href={`https://viewblock.io/arweave/address/${delegateId}`}
                    target="_blank"
                    className="text-secondary-foreground/80 underline"
                  >
                    <code className="text-secondary-foreground/80">
                      {delegateId.slice(0, 5)}...{delegateId.slice(delegateId.length-5)}
                    </code>
                  </a>
                </TableCell>
                <TableCell className="text-right py-2">
                  <code className="text-secondary-foreground/80">
                    {delegateInfo.delegatedStake}
                  </code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}

export { DelegateSummary }