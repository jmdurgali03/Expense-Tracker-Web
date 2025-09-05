import moment from 'moment';

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");

    const initials = name
        .split(" ")
        .map((w) => w[0].toUpperCase())
        .slice(0, 2)
        .join("");

    return initials;
};

export const addThousandsSeparator = (num) => {
    if (num === null || isNaN(num)) return '';

    const [integerPart, fractionalPart] = num.toString().split('.');

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return fractionalPart
        ? `${formattedIntegerPart}.${fractionalPart}`
        : formattedIntegerPart;
}

export const prepareExpenseBarChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category: item?.category,
        amount: Number(item?.amount),
    }));

    return chartData;
}

export const prepareIncomeBarChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format('Do MMM'),
        amount: item?.amount,
        source: item?.source,
    }));

    return chartData;
}

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        date: moment(item?.date).format('Do MMM'),
        amount: item?.amount,
        category: item?.category,
    }));

    return chartData;
}