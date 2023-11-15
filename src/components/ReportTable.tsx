import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ColumnSelection } from "./ColumnSelection"
import { 
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from "lucide-react"
import { Button } from "./ui/button"
import { useQuery } from "@tanstack/react-query"
import { downloadCurrentReportInfoFromGateway } from "@/lib/observer/downloadObservation"
import { useMemo, useState } from "react"
import { PassFailCell } from "./PassFailCell"
import { ReportTableDatum, generateReportTableData } from "@/lib/observer/report"

const columns: ColumnDef<ReportTableDatum>[] = [
  {
    id: "Observed Host",
    accessorKey: "gatewayHost",
    header: "Observed Host",
    enableHiding: false,
  },
  {
    id: "Expected Owner",
    accessorKey: "gatewayAssessment.ownershipAssessment.expectedWallet",
    header: "Expected Owner",
    cell: (cell) => <code className="break-all text-xs">{cell.row.original.gatewayAssessment.ownershipAssessment.expectedWallet ?? '<none>'}</code>
  },
  {
    id: "Observed Owner",
    accessorKey: "gatewayAssessment.ownershipAssessment.observedWallet",
    header: "Observed Owner",
    cell: (cell) => <code className="break-all text-xs">{cell.row.original.gatewayAssessment.ownershipAssessment.observedWallet ?? '<none>'}</code>
  },
  {
    id: "Ownership Result",
    accessorKey: "gatewayAssessment.ownershipAssessment.pass",
    header: "Ownership Result",
    cell: (cell) => <PassFailCell pass={cell.row.original.gatewayAssessment.ownershipAssessment.pass} />,
  },
  {
    id: "ArNS Result",
    accessorKey: "gatewayAssessment.arnsAssessments.pass",
    header: "ArNS Result",
    cell: (cell) => (
      <PassFailCell pass={cell.row.original.gatewayAssessment.arnsAssessments.pass}>
        <span className="text-xs text-muted-foreground line-clamp-1">
         ({cell.row.original.statistics.passFail.allNames.pass}
         /
         {cell.row.original.statistics.passFail.allNames.total})
        </span>
      </PassFailCell>
    ),
  },
  {
    id: "Overall Result",
    accessorKey: "gatewayAssessment.pass",
    header: "Overall Result",
    cell: (cell) => <PassFailCell pass={cell.row.original.gatewayAssessment.pass} />,
  },
];

interface Props {
  observer: z.infer<typeof zGatewayAddressRegistryItem>
  onUpdateObserver: (observer: z.infer<typeof zGatewayAddressRegistryItem>) => void
}

const ReportTable = ({ observer }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const {
    data,
    isError,
  } = useQuery(['observationReportCurrent', observer.id], async () => {
    return await downloadCurrentReportInfoFromGateway(observer.linkFull)
  });

  const gatewayAssessmentData: ReportTableDatum[] = useMemo(() => 
    Object.entries(data?.gatewayAssessments ?? {})
    .map(
      ([gatewayHost, gatewayAssessment]) => 
        generateReportTableData(gatewayHost, gatewayAssessment)
    ),
    [data?.gatewayAssessments],
  );

  const table = useReactTable({
    data: gatewayAssessmentData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: {
        "Expected Owner": false,
        "Observed Owner": false,
      }
    }
  })

  const assessmentCount = gatewayAssessmentData.length ?? 0
  const assessmentPassedCount = gatewayAssessmentData.filter(item => item.gatewayAssessment.pass).length
 
  return (
    <div className="relative">
      <div className="right-0 md:absolute md:-top-14">
        <div className="pb-2 flex flex-row items-end gap-2">
          <div className="ml-2 mr-auto md:mr-0 md:ml-auto text-muted-foreground">
            {assessmentPassedCount}/{assessmentCount} passed
          </div>
          <ColumnSelection table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-secondary/95">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : (
                          header.column.getCanSort() ? (
                            <Button
                              variant="ghost"
                              onClick={() => {
                                const firstDir = header.column.getFirstSortDir()
                                const currentDir = header.column.getIsSorted()
                                if (currentDir == false) {
                                  header.column.toggleSorting(firstDir === "desc")
                                } else {
                                  if (currentDir === firstDir) {
                                    header.column.toggleSorting(firstDir !== "desc")
                                  } else {
                                    header.column.clearSorting();
                                  }
                                }
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === "asc" ? (
                                  <ArrowUp className={`ml-2 h-4 w-4`} />
                                ) : (
                                  <ArrowDown className={`ml-2 h-4 w-4`} />
                                )
                              ) : (
                                <ArrowUpDown className={`ml-2 h-4 w-4`} />
                              )}
                            </Button>
                          ) : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isError ? "Failed to load report." : "Loading report..."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { ReportTable }