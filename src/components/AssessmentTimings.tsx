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

interface Props {
  timings: NonNullable<ArnsNameAssessment["timings"]>;
}

export const AssessmentTimings = ({ timings }: Props) => {
  const timingRows = useMemo(
    () => {
      const timingObjects = timingNames
        .map((timingName) => [timingName, timings[timingName]])
        .filter(([, value]) => value !== undefined) as [typeof timingNames[number], number][];
      return timingObjects
        .map(([name, value]) => ({
          name,
          value,
          label: timingLabels[name],
        }))
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

