import React from "react";
import { Order } from "@shared/constants/orders";
interface CompleteOrderDialogProps {
    order: Order;
    onOrderCompleted: (completedOrder: Order) => void;
}
export default function CompleteOrderDialog({ order, onOrderCompleted }: CompleteOrderDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=CompleteOrderDialog.d.ts.map