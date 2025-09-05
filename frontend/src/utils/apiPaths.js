export const API_BASE_URL = 'http://localhost:8000/api';

export const API_PATHS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGITER: "/auth/register",
        GET_USER_INFO: "/auth/getUser"
    },

    DASHBOARD: {
        GET_DATA: "/dashboard"
    },

    INCOME: {
        ADD_INCOME: "/income/add",
        GET_ALL_INCOMES: "/income/get",
        DELETE_INCOME: (incomeId) => `/income/delete/${incomeId}`,
        DOWNLOAD_INCOME: "/income/download-excel"
    },

    EXPENSE: {
        ADD_EXPENSE: "/expense/add",
        GET_ALL_EXPENSES: "/expense/get",
        DELETE_EXPENSE: (expenseId) => `/expense/delete/${expenseId}`,
        DOWNLOAD_EXPENSE: "/expense/download-excel"
    },

    IMAGE: {
        UPLOAD_IMAGE: "/auth/upload-image"
    }
}