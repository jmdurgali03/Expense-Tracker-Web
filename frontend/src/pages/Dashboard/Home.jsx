import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';

import DashboardLayout from '../../components/layouts/DashboardLayout'
import InfoCard from '../../components/cards/InfoCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverView from '../../components/Dashboard/FinanceOverView';
import ExpenseTransaction from '../../components/Dashboard/ExpenseTransaction';
import Last30Daysexpenses from '../../components/Dashboard/Last30Daysexpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

import { useUserAuth } from '../../hooks/useUserAuth'

import { axiosInstance } from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { addThousandsSeparator } from '../../utils/helper';


const Home = () => {
    useUserAuth();

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);

            if (response.data) {
                setDashboardData(response.data);
            }
        }

        catch (error) {
            console.error('Error fetching dashboard data', error);
        }

        finally {
            setLoading(false);
        }
    };

    const recentCombined = useMemo(() => {
        const expenses = (dashboardData?.last30DaysExpenses?.transactions || [])
            .map(t => ({ ...t, type: 'expense' }));

        const incomes = (dashboardData?.last60DaysIncome?.transactions || [])
            .map(t => ({ ...t, type: 'income' }));

        return [...expenses, ...incomes]
            .filter(t => t?.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [dashboardData]);

    useEffect(() => {
        fetchDashboardData();

        return () => { };
    }, []);

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className='my-5 mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <InfoCard
                        icon={<IoMdCard />}
                        label="Total Balance"
                        value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
                        color="bg-primary"
                    />

                    <InfoCard
                        icon={<LuWalletMinimal />}
                        label="Total Income"
                        value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
                        color="bg-orange-500"
                    />

                    <InfoCard
                        icon={<LuHandCoins />}
                        label="Total Expense"
                        value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
                        color="bg-red-500"
                    />
                </div>


                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                    <RecentTransactions
                        transactions={recentCombined}
                        onSeeMore={() => navigate('/expense')}
                    />

                    <FinanceOverView
                        totalBalance={dashboardData?.totalBalance || 0}
                        totalIncome={dashboardData?.totalIncome || 0}
                        totalExpense={dashboardData?.totalExpense || 0}
                    />

                    <ExpenseTransaction
                        transactions={dashboardData?.last30DaysExpenses?.transactions || []}
                        onSeeMore={() => navigate('/expense')}
                    />

                    <Last30Daysexpenses
                        data={dashboardData?.last30DaysExpenses?.transactions || []}
                    />

                    <RecentIncomeWithChart
                        data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
                        totalIncome={dashboardData?.totalIncome || 0}
                    />

                    <RecentIncome
                        transactions={dashboardData?.last60DaysIncome?.transactions || []}
                        onSeeMore={() => navigate('/income')}
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Home