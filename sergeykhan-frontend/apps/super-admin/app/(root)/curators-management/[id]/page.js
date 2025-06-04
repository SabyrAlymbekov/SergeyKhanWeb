"use client";
import { use } from "react";
import CuratorProfile from "@/components/users-management/curator-profile/curator-profile";
export default function Page({ params }) {
    // «Разворачиваем» промис, чтобы получить реальное значение id
    const { id } = use(params);
    return <CuratorProfile id={id}/>;
}
