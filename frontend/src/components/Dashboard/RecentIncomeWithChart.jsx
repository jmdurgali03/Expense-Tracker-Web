import React, { useEffect, useState } from 'react'
import CustomPieChart from '../charts/CustomPieChart'

const COLORS = ["#6EE7B7", "#93C5FD", "#A5B4FC", "#C4B5FD"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
    const [chartData, setChartData] = useState([]);

    const prepareChartData = (dataArr) => {
        if (!Array.isArray(dataArr)) return [];
        return dataArr.map((item) => ({
            name: item?.source ?? "—",
            amount: Number(item?.amount ?? 0),
        }));
    }

    useEffect(() => {
        setChartData(prepareChartData(data));
    }, [data]);

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Last 60 Days Income</h5>
            </div>

            <div className='mt-4 sm:mt-2 flex justify-center'>
                <CustomPieChart
                    data={chartData}
                    label="Total Income"
                    totalAmount={`$${totalIncome}`}
                    showTextAnchor
                    colors={COLORS}
                />
            </div>
        </div>
    )
}

export default RecentIncomeWithChart