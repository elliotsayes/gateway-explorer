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
  ArrowUp,
  ArrowLeft
} from "lucide-react"
import { Button } from "./ui/button"
import { useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useNavigate } from "@tanstack/react-router"
import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryObserverReportTransactions } from "@/lib/observer/downloadObservation";
import { SortOrder, Transaction } from "arweave-graphql";
import { fromAsyncGenerator } from "@/lib/utils";
import { ReportHistoryTableData, generateReportHistoryTableData } from "@/lib/observer/history";

// const columns: ColumnDef<ReportTableDatum>[] = [
//   {
//     id: "Observed Host",
//     accessorKey: "gatewayHost",
//     header: "Observed Host",
//     enableHiding: false,
//   },
//   {
//     id: "Expected Owner",
//     accessorKey: "gatewayAssessment.ownershipAssessment.expectedWallet",
//     header: "Expected Owner",
//     cell: (cell) => <code className="break-all text-xs">{cell.row.original.gatewayAssessment.ownershipAssessment.expectedWallet ?? '<none>'}</code>
//   },
//   {
//     id: "Observed Owner",
//     accessorKey: "gatewayAssessment.ownershipAssessment.observedWallet",
//     header: "Observed Owner",
//     cell: (cell) => <code className="break-all text-xs">{cell.row.original.gatewayAssessment.ownershipAssessment.observedWallet ?? '<none>'}</code>
//   },
//   {
//     id: "Ownership Result",
//     accessorKey: "gatewayAssessment.ownershipAssessment.pass",
//     header: "Ownership Result",
//     cell: (cell) => <PassFailCell pass={cell.row.original.gatewayAssessment.ownershipAssessment.pass} />,
//   },
//   {
//     id: "ArNS Result",
//     accessorKey: "gatewayAssessment.arnsAssessments.pass",
//     header: "ArNS Result",
//     cell: (cell) => (
//       <PassFailCell pass={cell.row.original.gatewayAssessment.arnsAssessments.pass}>
//         <span className="text-xs text-muted-foreground line-clamp-1">
//          ({cell.row.original.statistics.passFail.allNames.pass}
//          /
//          {cell.row.original.statistics.passFail.allNames.total})
//         </span>
//       </PassFailCell>
//     ),
//   },
//   {
//     id: "Overall Result",
//     accessorKey: "gatewayAssessment.pass",
//     header: "Overall Result",
//     cell: (cell) => <PassFailCell pass={cell.row.original.gatewayAssessment.pass} />,
//   },
// ];

const columns: ColumnDef<ReportHistoryTableData>[] = [
  {
    id: "Observer",
    accessorKey: "observer",
    header: "Observer",
    enableHiding: false,
  },
  {
    id: "Timestamp",
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: (cell) => {
      const ts = cell.row.original.timestamp;
      return (
        <span>{ts === undefined ? "Unknown" : ts}</span>
      )
    }
  },
];

interface Props {
  host: string;
  observer?: z.infer<typeof zGatewayAddressRegistryItem>;
  garData?: Array<z.infer<typeof zGatewayAddressRegistryItem>>;
  isGarError: boolean;
}

export const ReportListTable = ({ host, observer, garData, isGarError }: Props) => {
  const {
    data: gqlData,
    isError: isGqlError,
  } = useInfiniteQuery({
    queryKey: ['observerReportListArweave', host], 
    queryFn: async ({ pageParam }) => {
      return await fromAsyncGenerator(
        queryObserverReportTransactions({
            owners: observer!.id,
            sort: SortOrder.HeightDesc,
            after: pageParam,
          },
          false,
        ));
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage[lastPage.length-1].cursor,
    getPreviousPageParam: undefined,
    enabled: observer !== undefined,
  });

  const tableData = useMemo(() => {
    if (gqlData === undefined) {
      return []
    }
    return gqlData.pages.map((page) => {
      return page.map((item) => {
        return generateReportHistoryTableData(item.node as Transaction)
      })
    }).flat()
  }, [gqlData])
  
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      columnVisibility: {
        // "Expected Owner": false,
        // "Observed Owner": false,
      }
    }
  })

  const navigate = useNavigate()

  return (
    <>
      <div>
        <div className="pb-2 flex items-center gap-1">
          <Button
            variant={"ghost"}
            size={"iconSm"}
            asChild
          >
            <Link to={"/"} >
              <ArrowLeft />
            </Link>
          </Button>
          <Select
            defaultValue={host}
            onValueChange={(value) => {
              if(value !== host) {
                navigate({
                  to: "/observer/$host/history",
                  params: { host: value },
                })
              }
            }}
          >
            <SelectTrigger className="md:max-w-xs">
              <SelectValue placeholder={"Select observer"} />
            </SelectTrigger>
            <SelectContent>
              {
                garData?.map((item) => (
                  <SelectItem key={item.id} value={item.settings.fqdn}>
                    {item.settings.label} ({item.linkDisplay})
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <div className="right-0 md:absolute md:-top-12">
            <div className="pb-2 flex flex-row items-end gap-2">
              <div className="ml-2 mr-auto md:mr-0 md:ml-auto text-muted-foreground">
                {tableData.length} loaded
              </div>
              <ColumnSelection table={table} />
            </div>
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
                    onClick={() => {
                      navigate({
                        to: "/observer/$host/$txId",
                        params: { host: host, txId: row.original.txId },
                      })
                    }}
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
                    {(isGarError || isGqlError) ? "Failed to load history." : "Loading history..."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
