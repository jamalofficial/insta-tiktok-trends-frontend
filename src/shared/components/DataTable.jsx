import React from "react"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Removed TypeScript interface & generics for plain JS usage

export function DataTable({ columns, data, actions, defaultSorting={sort_by: null, sort_order: null} }) {
    const [sorting, setSorting] = React.useState([{
        id: defaultSorting.sort_by,
        desc: defaultSorting?.sort_order == 'desc'
    }])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: { actions },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting,
        }
    })

  return (
    <div className="overflow-hidden rounded-md">
      <Table>
        <TableHeader className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const headerTypeBasedClass = (typeof header.column.columnDef.header === "string") ? 'px-6' : ''
                return (
                <TableHead key={header.id} className={`py-3 text-left text-sm font-medium text-gray-500 tracking-wider ${headerTypeBasedClass}`}>
                    {console.log("header", header.column.columnDef)}
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
                );
            })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows && table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className=""
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-6 py-4 whitespace-nowrap">
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
  )
}