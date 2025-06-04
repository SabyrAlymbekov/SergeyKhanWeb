// app/(root)/orders/[id]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CuratorOrderDetailsClient from "@/components/orders/CuratorOrderDetailsClient";
import { API } from "@shared/constants/constants";
export default function Page() {
    const params = useParams();
    const id = params?.id;
    const [order, setOrder] = useState(null);
    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (id) {
            fetchOrderDetails();
            fetchMasters();
        }
    }, [id]);
    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/api/orders/${id}/detail/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Ошибка загрузки данных заказа");
            }
            const orderData = await response.json();
            setOrder(orderData);
        }
        catch (error) {
            console.error("Error fetching order:", error);
            setError("Ошибка загрузки данных заказа");
        }
        finally {
            setLoading(false);
        }
    };
    const fetchMasters = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API}/users/masters/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Ошибка загрузки списка мастеров");
            }
            const mastersData = await response.json();
            setMasters(mastersData);
        }
        catch (error) {
            console.error("Error fetching masters:", error);
        }
    };
    if (!id) {
        return <div className="p-4 text-center">ID заказа не указан</div>;
    }
    if (loading) {
        return <div className="p-4 text-center">Загрузка...</div>;
    }
    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }
    if (!order) {
        return <div className="p-4 text-center">Заказ не найден</div>;
    }
    return <CuratorOrderDetailsClient initialOrder={order} masters={masters}/>;
}
