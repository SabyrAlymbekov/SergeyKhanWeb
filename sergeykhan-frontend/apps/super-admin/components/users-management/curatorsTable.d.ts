import * as React from "react";
interface Curator {
    id: string;
    email: string;
    role: string;
}
interface CuratorsTableProps {
    curatorsData: Curator[];
}
declare const CuratorsTable: React.FC<CuratorsTableProps>;
export default CuratorsTable;
//# sourceMappingURL=curatorsTable.d.ts.map