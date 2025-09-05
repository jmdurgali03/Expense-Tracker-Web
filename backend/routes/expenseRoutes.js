const express = require('express');

const {
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpenseExcel
} = require('../controllers/expenseController');

const { protect } = require('../middlewares/authMiddle');

const router = express.Router();

router.post('/add', protect, addExpense);
router.get('/get', protect, getAllExpenses);
router.get('/download-excel', protect, downloadExpenseExcel);
router.delete('/delete/:id', protect, deleteExpense);

module.exports = router;