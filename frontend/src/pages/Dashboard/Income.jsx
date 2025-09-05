import React, { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';

import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import IncomeList from '../../components/Income/IncomeList';

import { API_PATHS } from '../../utils/apiPaths';
import { axiosInstance } from '../../utils/axiosInstance';
import { useUserAuth } from '../../hooks/useUserAuth';


const Income = () => {
    useUserAuth();

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOMES}`);

            if (response.data) {
                setIncomeData(response.data);
            }
        }

        catch (error) {
            console.error('Error fetching income details', error);
        }

        finally {
            setLoading(false);
        }
    };

    const handleAddIncome = async (income) => {
        const { source, amount, date, icon } = income;

        // validations
        if (!source.trim()) {
            toast.error('Income source is required');
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error('Amount is required and must be a positive number');
            return;
        }

        if (!date) {
            toast.error('Date is required');
            return;
        }

        try {
            await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source,
                amount,
                date,
                icon
            });

            setOpenAddIncomeModal(false);
            toast.success('Income added successfully');
            fetchIncomeDetails();
        }

        catch (error) {
            console.error(
                'Error adding income',
                error.response?.data?.message || error.message
            )
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success('Income deleted successfully');
            fetchIncomeDetails();
        }

        catch (error) {
            console.error(
                'Error deleting income',
                error.response?.data?.message || error.message
            )
        }
    };

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'incomes_details.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        }

        catch (error) {
            console.error(
                'Error downloading income details',
                error.response?.data?.message || error.message
            )
            toast.error('Error downloading income details. Please try again.');
        }
    };

    useEffect(() => {
        fetchIncomeDetails();

        return () => { };
    }, []);

    return (
        <DashboardLayout activeMenu='Income' >
            <div className='my-5 mx-auto' >
                <div className='grid grid-cols-1 gap-6'>
                    <div className=''>
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>
                </div>

                <IncomeList
                    transactions={incomeData}
                    onDelete={(id) => {
                        setOpenDeleteAlert({ show: true, data: id });
                    }}
                    onDownload={handleDownloadIncomeDetails}
                />

                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    )
}

export default Income