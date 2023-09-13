import { zGatewayAddressRegistryItem } from "@/types"
import { z } from "zod"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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

interface Props {
  data: Array<z.infer<typeof zGatewayAddressRegistryItem>>
}

const columns: ColumnDef<z.infer<typeof zGatewayAddressRegistryItem>>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
  {
    accessorKey: "operatorStake",
    header: "Operator Stake",
  },
  {
    accessorKey: "settings.fqdn",
    header: "Domain",
    cell: (cell) => {
      return (
        <a
          href={`${cell.row.original.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {cell.row.original.settings.fqdn}
        </a>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "ping",
    header: "Ping",
    cell: (cell) => {
      const status = cell.row.original.ping.status;
      switch (status) {
        case "success":
          return (
            <span className="text-xs font-bold text-green-400/80">{cell.row.original.ping.value}ms</span>
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
    }
  }
]


const GarTable = ({ data }: Props) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
 
  return (
    <div>
      <div className="py-2 w-full text-right">
        <ColumnSelection table={table} />
        <RefreshButton onClick={() => {}} isRefreshing={false} className="ml-2" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { GarTable }