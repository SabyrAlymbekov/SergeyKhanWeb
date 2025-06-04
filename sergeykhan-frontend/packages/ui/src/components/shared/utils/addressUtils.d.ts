/**
 * Утилиты для обработки адресов
 */
/**
 * Фильтрует адрес, убирая детали квартиры и подъезда для отображения мастерам
 * @param address Полный адрес
 * @returns Отфильтрованный адрес без квартиры и подъезда
 */
export declare function filterAddressForMaster(address: string | null | undefined): string;
/**
 * Проверяет, содержит ли адрес конфиденциальную информацию
 * @param address Адрес для проверки
 * @returns true если содержит номер квартиры или подъезда
 */
export declare function addressContainsPrivateInfo(address: string | null | undefined): boolean;
//# sourceMappingURL=addressUtils.d.ts.map