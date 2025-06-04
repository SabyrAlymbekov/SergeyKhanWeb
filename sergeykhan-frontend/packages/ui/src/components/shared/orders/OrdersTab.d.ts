import React from 'react';
type UserStatusT = 'curator' | 'master' | 'operator';
type AccessStatusT = 'pro' | 'max' | 'none';
interface OrdersTabProps {
    status: UserStatusT;
    accessStatus?: AccessStatusT;
}
declare const OrdersTab: React.FC<OrdersTabProps>;
export default OrdersTab;
//# sourceMappingURL=OrdersTab.d.ts.map