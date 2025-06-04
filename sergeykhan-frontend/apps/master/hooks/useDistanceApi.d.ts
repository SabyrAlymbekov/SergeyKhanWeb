interface Order {
    id: number;
    client_name: string;
    client_phone: string;
    description: string;
    address?: string;
    street?: string;
    house_number?: string;
    apartment?: string;
    entrance?: string;
    public_address?: string;
    full_address?: string;
    status: string;
    estimated_cost?: string;
    final_cost?: string;
    created_at: string;
    assigned_master?: string | null;
}
interface DistanceInfo {
    distance_level: number;
    distance_level_name: string;
    orders_count: number;
}
interface OrdersWithDistance {
    orders: Order[];
    distance_info: DistanceInfo;
}
interface MasterDistanceInfo {
    distance_info: {
        distance_level: number;
        distance_level_name: string;
        visibility_hours: number;
        statistics: {
            average_check: number;
            daily_revenue: number;
            net_turnover_10_days: number;
        };
        thresholds: {
            average_check_threshold: number;
            daily_revenue_threshold: number;
            net_turnover_threshold: number;
        };
        meets_requirements: {
            level_1: boolean;
            level_2: boolean;
        };
    };
    orders: Order[];
    total_orders: number;
}
export declare const useDistanceApi: () => {
    loading: boolean;
    error: string | null;
    fetchMasterAvailableOrdersWithDistance: () => Promise<OrdersWithDistance | null>;
    fetchMasterDistanceWithOrders: () => Promise<MasterDistanceInfo | null>;
    takeOrder: (orderId: number) => Promise<boolean>;
};
export {};
//# sourceMappingURL=useDistanceApi.d.ts.map