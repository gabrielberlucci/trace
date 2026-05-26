"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Download, Funnel, Search } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  exportFileName?: string
  filterColumn?: string
  toolbarActions?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Buscar...",
  exportFileName = "export.csv",
  filterColumn,
  toolbarActions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  const exportData = () => {
    const rowsToExport = table.getFilteredRowModel().rows.map(row => row.original)
    if (rowsToExport.length === 0) return

    const headers = Object.keys(rowsToExport[0] as object)
    const csvContent = [
      headers,
      ...rowsToExport.map(item => headers.map(header => (item as any)[header]))
    ].map(e => e.join(",")).join("\n")
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", exportFileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-background border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-9 h-10 border-zinc-200 dark:border-zinc-800"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {filterColumn && table.getColumn(filterColumn) && (
              <Button variant="outline" size="sm" onClick={() => {
                const currentFilter = table.getColumn(filterColumn)?.getFilterValue() as string
                if (!currentFilter) table.getColumn(filterColumn)?.setFilterValue("Ativo")
                else if (currentFilter === "Ativo") table.getColumn(filterColumn)?.setFilterValue("Inativo")
                else table.getColumn(filterColumn)?.setFilterValue("")
              }}>
                <Funnel className="mr-2 h-4 w-4" /> 
                Status: {table.getColumn(filterColumn)?.getFilterValue() as string || "Todos"}
              </Button>
            )}

            {toolbarActions}

            {!toolbarActions && (
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="mr-2 h-4 w-4" /> Exportar CSV
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground py-4 px-6">
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
                  className="hover:bg-muted/30 border-b border-zinc-100 dark:border-zinc-800/50 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
