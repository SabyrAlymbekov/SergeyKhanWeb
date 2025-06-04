import React from "react";
interface Order {
    id: number;
    client_name: string;
    client_phone: string;
    address: string;
    description: string;
    price: number;
    status: string;
    created_at: string;
    assigned_master?: {
        id: number;
        name: string;
        phone: string;
    };
    master_name?: string;
    master_phone?: string;
    scheduled_date?: string;
    completion_date?: string;
    warranty_end_date?: string;
    notes?: string;
}
interface Master {
    id: number;
    name: string;
    phone: string;
    specialization?: string;
}
interface CuratorOrderDetailsClientProps {
    initialOrder: Order;
    masters: Master[];
}
declare const CuratorOrderDetailsClient: React.FC<CuratorOrderDetailsClientProps>;
export default CuratorOrderDetailsClient;
//# sourceMappingURL=CuratorOrderDetailsClient.d.ts.map