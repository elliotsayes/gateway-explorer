import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArnsNameAssessment } from "@/lib/observer/types"
import { useMemo } from "react"
 
interface Props {
  timings: NonNullable<ArnsNameAssessment["timings"]>;
}

const timingNames = ["wait", "dns", "tcp", "tls", "firstByte", "download", "total"] as const;
const timingLabels = {
  wait: "Wait",
  dns: "DNS",
  tcp: "TCP",
  tls: "TLS",
  firstByte: "First Byte",
  download: "Download",
  total: "Total",
} as const;

export const AssessmentTimings = ({ timings }: Props) => {
  const timingRows = useMemo(
    () => {
      const timingObjects = timingNames
        .map((timingName) => [timingName, timings[timingName]])
        .filter(([, value]) => value !== undefined) as [typeof timingNames[number], number][];
      return timingObjects
        .map(([timingName, value]) => ({ label: timingLabels[timingName], value }))
    },
    [timings],
  );

  return (
    <Table>
      <TableCaption>Timings for ArNS Resolution</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timingRows.map((timingRow) => (
          <TableRow key={timingRow.label}>
            <TableCell className="font-medium">{timingRow.label}</TableCell>
            <TableCell className="text-right">{timingRow.value}ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}

