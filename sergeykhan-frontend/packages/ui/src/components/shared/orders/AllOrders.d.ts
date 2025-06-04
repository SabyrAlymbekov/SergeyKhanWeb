import React from "react";
import { Order } from "@shared/constants/orders";
export interface ActiveOrdersProps {
    isActiveEdit: boolean;
    onSelectedChange: (selected: Order[]) => void;
    masterId?: string;
}
export default function ActiveOrders({ isActiveEdit, onSelectedChange, masterId }: ActiveOrdersProps): React.JSX.Element;
//# sourceMappingURL=AllOrders.d.ts.map