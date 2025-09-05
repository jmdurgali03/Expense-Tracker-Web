const xlsx = require('xlsx');

const Income = require('../models/Income');


exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;
        
        if (!source || !amount || !date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();
        res.status(201).json(newIncome);
    } 
    
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getAllIncomes = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.status(200).json(income);
    } 
    
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.deleteIncome = async (req, res) => {

    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Income deleted successfully' });    
    } 
    
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Incomes');

        xlsx.writeFile(wb, 'incomes_details.xlsx');
        res.download('incomes_details.xlsx');
    } 
    
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}