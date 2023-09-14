import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"
import * as React from "react"
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
import { RefreshButton } from "./RefreshButton"
import { 
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from "lucide-react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

interface Props {
  data: Array<z.infer<typeof zGatewayAddressRegistryItem>>
  onRefresh: () => void
  isRefreshing: boolean
  onItemSelect: (item: z.infer<typeof zGatewayAddressRegistryItem>) => void
  selectedItemId?: string
}

const columns: ColumnDef<z.infer<typeof zGatewayAddressRegistryItem>>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    id: "Name",
    accessorKey: "settings.label",
    header: "Name",
  },
  {
    id: "Domain",
    accessorKey: "settings.fqdn",
    header: "Domain",
    cell: (cell) => {
      return (
        <a
          href={`${cell.row.original.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
          onClick={(e) => {e.stopPropagation()}}
        >
          {cell.row.original.settings.fqdn}
        </a>
      )
    }
  },
  {
    id: "Stake",
    accessorKey: "operatorStake",
    header: "Stake",
  },
  {
    id: "Ping",
    accessorKey: "ping",
    header: "Ping",
    size: 1,
    cell: (cell) => {
      const status = cell.row.original.ping.status;
      switch (status) {
        case "success":
          return (
            <div className="flex flex-row items-center">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="ml-1 text-xs font-bold text-gray-400/80">{cell.row.original.ping.value}ms</span>
            </div>
          )
        case "pending":
          return (
            <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          )
        case "error":
          return (
            <div className="h-2 w-2 rounded-full bg-red-500" />
          )
        default:
          return (
            <div className="h-2 w-2 rounded-full bg-gray-400" />
          )
      }
    },
    sortDescFirst: false,
    sortingFn: (a, b) => {
      if (a.original.ping.status === "success" && b.original.ping.status === "success") {
        return a.original.ping.value - b.original.ping.value
      } else if (a.original.ping.status === "success" && b.original.ping.status !== "success") {
        return -99999
      } else if (a.original.ping.status !== "success" && b.original.ping.status === "success") {
        return 99999
      } else if (a.original.ping.status === "pending" && b.original.ping.status !== "pending") {
        return -99999
      } else if (a.original.ping.status !== "pending" && b.original.ping.status === "pending") {
        return 99999
      }
      return 0
    },
    sortUndefined: 1,
  }
]


const GarTable = ({ data, onRefresh, isRefreshing, onItemSelect, selectedItemId }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    
  })
 
  return (
    <div className="relative">
      <div className="right-0 sm:absolute sm:-top-14">
        <div className="pb-2 flex flex-row items-end">
          <ColumnSelection table={table} />
          <RefreshButton onClick={onRefresh} isRefreshing={isRefreshing} className="ml-2" />
        </div>
      </div>
      <Table>
        <ScrollArea className="rounded-md border">
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
                  onClick={() => onItemSelect(row.original)}
                  className={selectedItemId === row.original.id ? "bg-muted hover:bg-muted" : ""}
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
                  Loading Gateway Address Registry...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  )
}

export { GarTable }