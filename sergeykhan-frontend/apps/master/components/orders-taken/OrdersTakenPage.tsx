"use client";

import React, { useState, useEffect } from "react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { OrdersTakenDataTable } from "../../components/orders-taken/OrdersTakenTable";
import { Order } from "@shared/constants/orders";
import { API } from "@shared/constants/constants";
import { Skeleton } from "@workspace/ui/components/skeleton";

// Определение функции для отображения данных в таблице
function createColumns(): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "client_name",
      header: "Клиент",
      cell: ({ row }) => <div>{row.getValue("client_name")}</div>,
    },
    {
      accessorKey: "full_address",
      header: "Адрес",
      cell: ({ row }) => <div>{row.getValue("full_address") || 'Не указан'}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Дата создания",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => <div>{row.getValue("status")}</div>,
    },
  ];
}

export default function OrdersTakenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const columns = createColumns();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Вы не авторизованы");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${API}/orders/assigned/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Не удалось загрузить заказы");
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error instanceof Error ? error.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Взятые заказы</h1>
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Взятые заказы</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Взятые заказы</h1>
      {orders.length === 0 ? (
        <div className="bg-blue-100 p-4 rounded-md text-blue-700">
          У вас пока нет взятых заказов
        </div>
      ) : (
        <OrdersTakenDataTable data={orders} columns={columns} />
      )}
    </div>
  );
}
