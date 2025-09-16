const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); 
const upload = require('../middleware/multer');
const { addExpense, addIncome, deleteExpense, deleteIncome, getExpensesByPage, getIncomesByPage, getExpensesByDateRange, getIncomesByDateRange, getYearlyExpenseStats, getYearlyIncomeStats, getMonthlyCategoryExpenseStats, getMonthlyCategoryIncomeStats, imageUpload } = require('../controllers/query.controller');
const { protectRoute } = require("../middleware/auth");

router.post("/addExpense", addExpense);
router.post("/addIncome", addIncome);
router.post("/deleteExpense", deleteExpense);
router.post("/deleteIncome", deleteIncome);
router.post("/getExpensesByPage", getExpensesByPage);
router.post("/getIncomesByPage", getIncomesByPage);
router.post("/getExpensesByDateRange", getExpensesByDateRange);
router.post("/getIncomesByDateRange", getIncomesByDateRange);
router.post("/getYearlyExpenseStats", getYearlyExpenseStats);
router.post("/getYearlyIncomeStats", getYearlyIncomeStats);
router.post("/getMonthlyCategoryExpenseStats", getMonthlyCategoryExpenseStats);
router.post("/getMonthlyCategoryIncomeStats", getMonthlyCategoryIncomeStats);
router.post("/imageUpload", protectRoute, upload.single('image'), imageUpload);


module.exports = router;
