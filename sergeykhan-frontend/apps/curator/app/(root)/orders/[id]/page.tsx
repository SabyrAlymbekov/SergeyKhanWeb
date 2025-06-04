// app/(root)/orders/[id]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import CuratorOrderDetailsClient from "@/components/orders/CuratorOrderDetailsClient";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <div className="p-4 text-center text-red-500">Неверный ID заказа</div>;
  }

  return <CuratorOrderDetailsClient id={id} />;
}
