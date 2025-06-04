export interface MasterDistanceInfo {
    master_id: number;
    master_email: string;
    distance_level: number;
    distance_level_name: string;
    manual_override: boolean;
    statistics: {
        average_check: number;
        daily_revenue: number;
        net_turnover_10_days: number;
    };
    thresholds: {
        average_check_threshold: number;
        daily_order_sum_threshold: number;
        net_turnover_threshold: number;
    };
    meets_requirements: {
        standard_distance: boolean;
        daily_distance_by_revenue: boolean;
        daily_distance_by_turnover: boolean;
    };
}
export declare const useDistanceApi: () => {
    loading: boolean;
    error: string | null;
    fetchMasterDistanceInfo: (masterId: number) => Promise<MasterDistanceInfo | null>;
    fetchMasterDistanceWithOrders: () => Promise<any>;
};
//# sourceMappingURL=useDistanceApi.d.ts.map