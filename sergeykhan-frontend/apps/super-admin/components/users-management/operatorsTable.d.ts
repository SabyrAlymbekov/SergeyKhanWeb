import * as React from "react";
interface Operator {
    id: string;
    email: string;
    role: string;
}
interface OperatorsTableProps {
    operatorsData: Operator[];
}
declare const OperatorsTable: React.FC<OperatorsTableProps>;
export default OperatorsTable;
//# sourceMappingURL=operatorsTable.d.ts.map