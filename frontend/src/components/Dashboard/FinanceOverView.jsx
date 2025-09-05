import React from 'react'
import CustomPieChart from '../charts/CustomPieChart';

const COLORS = ["#875CF5", "#22C55E", "#FA2C37"]

const FinanceOverView = ({ totalBalance, totalIncome, totalExpense }) => {
    const balanceData = [
        { name: "Total Balance", amount: Number(totalBalance) },
        { name: "Total Income", amount: Number(totalIncome) },
        { name: "Total Expense", amount: Number(totalExpense) },
    ];

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>
                    Financial Overview
                </h5>
            </div>

            <div className='mt-4 sm:mt-2 flex justify-center'>
                <CustomPieChart
                    data={balanceData}
                    colors={COLORS}
                    totalAmount={`$${totalBalance}`}
                    showTextAnchor
                />
            </div>
        </div>
    )
}

export default FinanceOverView