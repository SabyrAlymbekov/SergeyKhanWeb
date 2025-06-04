export type Master = {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    balance: number;
};
export type Curator = {
    id: string;
    name: string;
    balance: number;
    masters: Master[];
};
export type Contact = {
    id: string;
    name: string;
    number: string;
    date: string;
    status?: string;
};
export type Operator = {
    id: string;
    name: string;
    called: Contact[];
    balance: number;
};
//# sourceMappingURL=types.d.ts.map