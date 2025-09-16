const User = require('../models/user.model');
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const sharp = require("sharp");
const { text } = require('stream/consumers');


const apiKey = process.env.GEMINI_API_KEY.trim();
const genAI = new GoogleGenerativeAI(apiKey);

// Add expense
const addExpense = async (req, res) => {
  try {
    const { date, amount, category, info, id } = req.body;

    if (amount == null || !category) {
      return res.status(400).json({ error: "Amount and category are required" });
    }

    const expense = { date, amount, category, info };

    const user = await User.findByIdAndUpdate(
      id,
      { $push: { expenses: expense } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({ message: "Expense added", expense });
  } catch (err) {
    console.log("Error in adding expnese : ", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete an expense by id
const deleteExpense = async (req, res) => {
  try {
    const { id, expenseId } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { expenses: { _id: expenseId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Income
const addIncome = async (req, res) => {
  try {
    const { date, amount, category, info, id } = req.body;

    if (amount == null || !category) {
      return res.status(400).json({ error: "Amount and category are required" });
    }

    const income = { date, amount, category, info };

    const user = await User.findByIdAndUpdate(
      id,
      { $push: { incomes: income } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({ message: "Income added", income });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an income by id
const deleteIncome = async (req, res) => {
  try {
    const { id, incomeId } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { incomes: { _id: incomeId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get Expense by page

const getExpensesByPage = async (req, res) => {
  try {
    const { id, page } = req.body;
    const currentPage = parseInt(page) || 1;   // convert page param to number
    const limit = 10;
    const skip = (currentPage - 1) * limit;

    const user = await User.findById(id).select("expenses");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // sort by date (newest first) and paginate
    const expenses = user.expenses
      .sort((a, b) => b.date - a.date)
      .slice(skip, skip + limit);

    res.json({
      page: currentPage,
      limit,
      expenses,
      totalExpenses: user.expenses.length,
      totalPages: Math.ceil(user.expenses.length / limit)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get Incomes by page

const getIncomesByPage = async (req, res) => {
  try {
    const { id, page } = req.body;
    const currentPage = parseInt(page) || 1;   // convert page param to number
    const limit = 10;
    const skip = (currentPage - 1) * limit;

    const user = await User.findById(id).select("incomes");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // sort by date (newest first) and paginate
    const incomes = user.incomes
      .sort((a, b) => b.date - a.date)
      .slice(skip, skip + limit);

    res.json({
      page: currentPage,
      limit,
      incomes,
      totalExpenses: user.incomes.length,
      totalPages: Math.ceil(user.incomes.length / limit)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get Expense by Range

const getExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, page, id } = req.body;

    const currentPage = parseInt(page) || 1;
    const limit = 10;
    const skip = (currentPage - 1) * limit;

    const user = await User.findById(id).select("expenses");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // filter expenses by date range
    const filteredExpenses = user.expenses.filter(exp => {
      return new Date(exp.date) >= new Date(startDate) &&
        new Date(exp.date) <= new Date(endDate);
    });

    // sort & paginate
    const expenses = filteredExpenses
      .sort((a, b) => b.date - a.date)
      .slice(skip, skip + limit);

    res.json({
      page: currentPage,
      limit,
      expenses,
      totalExpenses: filteredExpenses.length,
      totalPages: Math.ceil(filteredExpenses.length / limit)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get Incomes by Range

const getIncomesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, page, id } = req.body;

    const currentPage = parseInt(page) || 1;
    const limit = 10;
    const skip = (currentPage - 1) * limit;

    const user = await User.findById(id).select("expenses");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // filter incomes by date range
    const filteredIncomes = user.incomes.filter(exp => {
      return new Date(exp.date) >= new Date(startDate) &&
        new Date(exp.date) <= new Date(endDate);
    });

    // sort & paginate
    const incomes = filteredIncomes
      .sort((a, b) => b.date - a.date)
      .slice(skip, skip + limit);

    res.json({
      page: currentPage,
      limit,
      incomes,
      totalIncomes: filteredIncomes.length,
      totalPages: Math.ceil(filteredIncomes.length / limit)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get yearly expense data 

const getYearlyExpenseStats = async (req, res) => {
  try {
    const { year, id } = req.body;

    const user = await User.findById(id).select("expenses");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // initialize result array with 12 months
    const result = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
      totalAmount: 0
    }));

    user.expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      if (expDate.getFullYear() === parseInt(year)) {
        const month = expDate.getMonth(); // 0 = Jan, 11 = Dec
        result[month].count += 1;
        result[month].totalAmount += exp.amount;
      }
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get yearly income data 

const getYearlyIncomeStats = async (req, res) => {
  try {
    const { year, id } = req.body;

    const user = await User.findById(id).select("incomes");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // initialize result array with 12 months
    const result = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
      totalAmount: 0
    }));

    user.incomes.forEach(inc => {
      const incDate = new Date(inc.date);
      if (incDate.getFullYear() === parseInt(year)) {
        const month = incDate.getMonth(); // 0 = Jan, 11 = Dec
        result[month].count += 1;
        result[month].totalAmount += inc.amount;
      }
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get monthly category  expense stats

const getMonthlyCategoryExpenseStats = async (req, res) => {
  try {
    const { year, month, id } = req.body; // e.g., { year: 2025, month: 9 }

    const user = await User.findById(id).select("expenses");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // category totals map
    const categoryTotals = {};

    user.expenses.forEach(exp => {
      const expDate = new Date(exp.date);

      if (
        expDate.getFullYear() === parseInt(year) &&
        expDate.getMonth() + 1 === parseInt(month) // getMonth is 0-based
      ) {
        if (!categoryTotals[exp.category]) {
          categoryTotals[exp.category] = 0;
        }
        categoryTotals[exp.category] += exp.amount;
      }
    });

    res.json(categoryTotals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//get monthly category income stats 

const getMonthlyCategoryIncomeStats = async (req, res) => {
  try {
    const { year, month, id } = req.body; // e.g., { year: 2025, month: 9 }

    const user = await User.findById(id).select("incomes");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // category totals map
    const categoryTotals = {};

    user.incomes.forEach(inc => {
      const incDate = new Date(inc.date);

      if (
        incDate.getFullYear() === parseInt(year) &&
        incDate.getMonth() + 1 === parseInt(month) // getMonth is 0-based
      ) {
        if (!categoryTotals[inc.category]) {
          categoryTotals[inc.category] = 0;
        }
        categoryTotals[inc.category] += inc.amount;
      }
    });

    res.json(categoryTotals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const imageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let mimeType = req.file.mimetype;
    let imageData; // Will hold the final base64 data

    // If the uploaded file is a PDF, convert it and get base64 directly
    if (mimeType === "application/pdf") {
      const { fromPath } = require("pdf2pic");
      const options = {
        density: 150,
        format: "png",
        width: 1240,
        height: 1754,
      };

      const converter = fromPath(req.file.path, options);
      
      const convertResult = await converter(1, { responseType: "base64" });

      if (!convertResult || !convertResult.base64) {
        throw new Error("PDF to Base64 conversion failed.");
      }

      imageData = convertResult.base64;
      
    // For all other image types (PNG, JPEG, etc.)
    } else {
      imageData = fs.readFileSync(req.file.path).toString("base64");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Extract the final total amount and the store/merchant/restaurant name from this receipt.
      Respond ONLY in strict JSON format like:
      { "amount": "732.49", "tag": "Swiggy" }
    `;

    const result = await model.generateContent([
      { inlineData: { mimeType: "image/png", data: imageData } }, 
      { text: prompt },
    ]);

    const textResponse = result.response.text().trim();
    let parsed;
    try {
      
      const startIndex = textResponse.indexOf('{');
      const endIndex = textResponse.lastIndexOf('}');
      const jsonString = textResponse.substring(startIndex, endIndex + 1);
      parsed = JSON.parse(jsonString);
    } catch {
      return res.status(500).json({
        error: "Gemini did not return valid JSON",
        raw: textResponse,
      });
    }

    // Cleanup: Only delete the original uploaded file
    fs.unlinkSync(req.file.path);

    res.json(parsed);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addExpense,
  deleteExpense,
  addIncome,
  deleteIncome,
  getExpensesByPage,
  getIncomesByPage,
  getExpensesByDateRange,
  getIncomesByDateRange,
  getYearlyExpenseStats,
  getYearlyIncomeStats,
  getMonthlyCategoryExpenseStats,
  getMonthlyCategoryIncomeStats,
  imageUpload,
};
