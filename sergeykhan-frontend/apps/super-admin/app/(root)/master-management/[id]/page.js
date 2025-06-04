"use client";
import { use } from "react";
import MasterProfile from "@/components/users-management/master-profile/masterProfile";
export default function Page({ params }) {
    // «Разворачиваем» промис, чтобы получить реальное значение id
    const { id } = use(params);
    return <MasterProfile id={id}/>;
}
