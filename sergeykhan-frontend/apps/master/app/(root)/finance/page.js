"use client";
import React from 'react';
import dynamic from 'next/dynamic';
const FinancesPage = dynamic(() => import("@shared/finances/financesPage"), {
    ssr: false
});
const Finances = () => {
    return (<div className="w-full">
      <FinancesPage />
    </div>);
};
export default Finances;
