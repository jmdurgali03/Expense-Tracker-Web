const xlsx = require('xlsx');

const Expense = require('../models/Expense');


exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;
        
        if (!category || !amount || !date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } 
    
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getAllExpenses = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expense);
    } 
    
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.deleteExpense = async (req, res) => {

    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Expense deleted successfully' });    
    } 
    
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Expenses');

        xlsx.writeFile(wb, 'Expenses_details.xlsx');
        res.download('Expenses_details.xlsx');
    } 
    
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}