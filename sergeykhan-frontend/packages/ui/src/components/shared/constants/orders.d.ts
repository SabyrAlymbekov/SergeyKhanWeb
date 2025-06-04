import { ColumnDef } from "@tanstack/react-table";
export declare enum ContentLayoutBg {
    Black = 0,
    Transperent = 1
}
export interface Order {
    id: number;
    client_name: string;
    client_phone: string;
    description: string;
    address: string;
    street?: string;
    house_number?: string;
    apartment?: string;
    entrance?: string;
    public_address?: string;
    full_address?: string;
    created_at: string;
    assigned_master: string | null;
    estimated_cost: string;
    expenses: string;
    final_cost: string;
    status: string;
}
export interface OrdersDataTableProps {
    data: Order[];
    columns: ColumnDef<Order>[];
    status?: "curator" | "operator";
    isEdit?: boolean;
    masterId?: string | undefined;
    isModel?: boolean;
    /**
     * Callback при выборе/отметке заказов в режиме редактирования.
     * Передаёт массив объектов Order, а не только их ID.
     */
    onSelectedChange?: (selected: Order[]) => void;
}
export declare const columns: ColumnDef<Order>[];
//# sourceMappingURL=orders.d.ts.map