interface DistanceSettings {
    averageCheckThreshold: number;
    visiblePeriodStandard: number;
    dailyOrderSumThreshold: number;
    netTurnoverThreshold: number;
    visiblePeriodDaily: number;
}
interface MasterDistanceInfo {
    master_id: number;
    master_email: string;
    distance_level: number;
    distance_level_name: string;
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
    fetchDistanceSettings: () => Promise<DistanceSettings | null>;
    updateDistanceSettings: (settings: DistanceSettings) => Promise<boolean>;
    fetchMasterDistanceInfo: (masterId: number) => Promise<MasterDistanceInfo | null>;
    fetchAllMastersDistance: () => Promise<MasterDistanceInfo[] | null>;
    forceUpdateAllMastersDistance: () => Promise<boolean>;
    fetchMasterAvailableOrdersWithDistance: () => Promise<any>;
    setMasterDistanceManually: (masterId: number, distanceLevel: number) => Promise<boolean>;
    resetMasterDistanceToAutomatic: (masterId: number) => Promise<boolean>;
    getAllMastersDistanceDetailed: () => Promise<MasterDistanceInfo[]>;
};
export {};
//# sourceMappingURL=useDistanceApi.d.ts.map