const express = require('express');

const {
    addIncome,
    getAllIncomes,
    deleteIncome,
    downloadIncomeExcel
} = require('../controllers/incomeController');

const { protect } = require('../middlewares/authMiddle');

const router = express.Router();

router.post('/add', protect, addIncome);
router.get('/get', protect, getAllIncomes);
router.get('/download-excel', protect, downloadIncomeExcel);
router.delete('/delete/:id', protect, deleteIncome);

module.exports = router;