import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArnsNameAssessment } from "@/lib/observer/types"
import { useMemo } from "react"
 
interface Props {
  timings: NonNullable<ArnsNameAssessment["timings"]>;
}

const timingNames = [
  "wait",
  "dns",
  "tcp",
  "tls",
  "firstByte",
  "download",
  "total",
] as const;
const timingLabels: Record<typeof timingNames[number], string> = {
  wait: "Wait",
  dns: "DNS",
  tcp: "TCP",
  tls: "TLS",
  firstByte: "First Byte",
  download: "Download",
  total: "Total",
};

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
      </TableHeader>
      <TableBody>
        {timingRows.map((timingRow) => (
          <TableRow key={timingRow.label}>
            <TableCell className="font-medium">{timingRow.label}</TableCell>
            <TableCell className="text-right">{timingRow.value}ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

