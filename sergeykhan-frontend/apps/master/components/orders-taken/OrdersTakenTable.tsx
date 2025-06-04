"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import { Order } from "@shared/constants/orders";
import CompleteOrderDialog from "../../components/orders/CompleteOrderDialog";

export function OrdersTakenDataTable({ data, columns }: { data: Order[]; columns: ColumnDef<Order>[] }) {
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [orders, setOrders] = React.useState<Order[]>(data);

  const handleOrderCompleted = (completedOrder: Order) => {
    // Обновляем локальное состояние заказов
    setOrders((prev) =>
      prev.map((order) =>
        order.id === completedOrder.id ? completedOrder : order
      )
    );
  };

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Поиск..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Колонки <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md p-4 border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                  header.column.id !== "actions" ? (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ) : null
                )}
                <TableHead>Действие</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => router.push(`/orders-taken/${row.original.id}`)}
                className="cursor-pointer hover:bg-muted"
              >
                {row.getVisibleCells().map((cell) =>
                  cell.column.id !== "actions" ? (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ) : null
                )}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {row.original.status === "завершен" ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Завершен
                    </span>
                  ) : row.original.status === "проверяется" ? (
                    <span className="text-yellow-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> Проверяется
                    </span>
                  ) : (
                    <CompleteOrderDialog 
                      order={row.original} 
                      onOrderCompleted={handleOrderCompleted} 
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Предыдущий
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Следующий
        </Button>
      </div>
    </div>
  );
}
