import React from 'react';
interface UniversalBalanceManagerProps {
    userId: string;
    /** Роль текущего пользователя (curator, super-admin) */
    currentUserRole?: 'curator' | 'super-admin';
    /** Показывать ли кнопки управления балансом */
    showControls?: boolean;
    /** Показывать ли только просмотр */
    readonly?: boolean;
}
declare const UniversalBalanceManager: React.FC<UniversalBalanceManagerProps>;
export { UniversalBalanceManager };
//# sourceMappingURL=UniversalBalanceManager.d.ts.map