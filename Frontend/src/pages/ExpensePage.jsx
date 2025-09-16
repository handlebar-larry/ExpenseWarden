import React, { useEffect, useState } from "react";
import useQueryStore from "../stores/useQueryStore";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { FaTrash, FaPlus, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";

const COLORS = ["#8B5CF6", "#06D6A0", "#FFD60A", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57"];

const ExpensePage = () => {
  const user = useQueryStore((state) => state.user);
  const expenseStats = useQueryStore((state) => state.expenseStats);
  const monthlyExpenseCategory = useQueryStore((state) => state.monthlyExpenseCategory);
  const expenses = useQueryStore((state) => state.expenses);
  const getYearlyExpenseStats = useQueryStore((state) => state.getYearlyExpenseStats);
  const getMonthlyCategoryExpenseStats = useQueryStore((state) => state.getMonthlyCategoryExpenseStats);
  const getExpensesByPage = useQueryStore((state) => state.getExpensesByPage);
  const addExpense = useQueryStore((state) => state.addExpense);
  const deleteExpense = useQueryStore((state) => state.deleteExpense);
  const totalPagesExpenses = useQueryStore((state) => state.totalPagesExpenses);
  const getExpensesByDateRange = useQueryStore((state) => state.getExpensesByDateRange);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "",
    info: "",
  });

  // local state for pagination
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState(new Date().getMonth() + 1);   //for category wise expense section
  const [year, setYear] = useState(new Date().getFullYear());

  const [filterMode, setFilterMode] = useState("all");  //for recent expense section
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [yearForBar, setYearForBar] = useState(new Date().getFullYear());


  useEffect(() => {
    if (!user) return;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    getYearlyExpenseStats(currentYear);
    getMonthlyCategoryExpenseStats(currentYear, currentMonth);
    getExpensesByPage(1);
  }, [user, getYearlyExpenseStats, getMonthlyCategoryExpenseStats, getExpensesByPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return alert("Amount and Category are required");
    await addExpense({
      date: form.date,
      amount: Number(form.amount),
      category: form.category,
      info: form.info,
    });

    // reset form
    setForm({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      category: "",
      info: "",
    });
  };

  // Calculate totals
  const thisMonthTotal = Object.values(monthlyExpenseCategory).reduce((sum, amount) => sum + amount, 0);
  const thisYearTotal = expenseStats.reduce((sum, stat) => sum + stat.totalAmount, 0);
  const totalExpenses = expenses.length;

  // convert monthlyExpenseCategory object to array for PieChart
  const pieData = Object.entries(monthlyExpenseCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <FaRupeeSign className="text-white text-lg" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Expense Dashboard
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Track your spending and manage your finances</p>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-teal-400">
                  ₹{thisMonthTotal.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-teal-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">This Year</p>
                <p className="text-2xl font-bold text-purple-400">
                  ₹{thisYearTotal.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <FaRupeeSign className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Charts and Form Row */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400">📊</span>
                </div>
                <h2 className="text-xl font-semibold">Monthly Expense Trend</h2>
              </div>

              {/* Year Selector */}
              <div className="flex items-center gap-3">
                <select
                  value={yearForBar}
                  onChange={(e) => setYearForBar(e.target.value)}
                  className="p-2 rounded-lg bg-gray-900/50 border border-gray-600 text-white"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const y = new Date().getFullYear() - i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={() => getYearlyExpenseStats(yearForBar)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={expenseStats}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(month) =>
                    [
                      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ][month - 1]
                  }
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                {/* Custom Tooltip */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const monthName = [
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                      ][label - 1];

                      const totalAmount = payload[0].payload.totalAmount;
                      const count = payload[0].payload.count;

                      return (
                        <div className="p-3 bg-gray-800 rounded-lg border border-gray-600">
                          <p className="text-gray-200 font-semibold">{monthName}</p>
                          <p className="text-purple-400">Total: ₹{totalAmount.toLocaleString()}</p>
                          <p className="text-teal-400"># Expenses: {count}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar dataKey="totalAmount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* Form */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FaPlus className="text-green-400 text-sm" />
              </div>
              <h2 className="text-xl font-semibold">Add New Expense</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-600/50 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Bills">Bills</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-600/50 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={form.info}
                  onChange={(e) => setForm({ ...form, info: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-900/50 border border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <FaPlus className="text-sm" />
                Add Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart with Month-Year Selector */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-yellow-400">🥧</span>
            </div>
            <h2 className="text-xl font-semibold">Category Breakdown</h2>
          </div>

          {/* Month & Year Selection */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="p-2 rounded-lg bg-gray-900/50 border border-gray-600 text-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString("en-US", { month: "long" })}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="p-2 rounded-lg bg-gray-900/50 border border-gray-600 text-white w-28"
              placeholder="Year"
            />

            <button
              onClick={() => getMonthlyCategoryExpenseStats(year, month)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Apply
            </button>
          </div>

          {pieData.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <ResponsiveContainer width="100%" height={300} className="lg:w-1/2">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 lg:w-1/2">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-300">
                      {entry.name}:{" "}
                      <span className="font-semibold text-white">
                        ₹{entry.value.toLocaleString()}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No expense data for this month.</p>
          )}
        </div>
      </div>



      {/* Expense List */}
      <div className="px-6 pb-8 flex justify-center">
        <div className="w-full max-w-6xl bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <span className="text-indigo-400">📝</span>
            </div>
            <h2 className="text-2xl font-semibold">Recent Expenses</h2>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <button
              onClick={() => {
                setFilterMode("all");
                setPage(1);
                getExpensesByPage(1);
              }}
              className={`px-4 py-2 rounded-lg ${filterMode === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300"
                }`}
            >
              All
            </button>

            <button
              onClick={() => setFilterMode("duration")}
              className={`px-4 py-2 rounded-lg ${filterMode === "duration"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300"
                }`}
            >
              Duration
            </button>

            {filterMode === "duration" && (
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 rounded-lg bg-gray-900/50 border border-gray-600 text-white"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 rounded-lg bg-gray-900/50 border border-gray-600 text-white"
                />
                <button
                  onClick={() => {
                    setPage(1);
                    getExpensesByDateRange(startDate, endDate, page);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💸</span>
              </div>
              <p className="text-gray-400">No expenses found.</p>
              <p className="text-gray-500 text-sm">Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((exp) => (
                <div
                  key={exp._id}
                  className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">
                        {exp.category === "Food" && "🍽️"}
                        {exp.category === "Bills" && "📄"}
                        {exp.category === "Travel" && "✈️"}
                        {exp.category === "Shopping" && "🛍️"}
                        {exp.category === "Medical" && "⚕️"}
                        {exp.category === "Other" && "📦"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{exp.category}</p>
                      <p className="text-sm text-gray-400">
                        📅{" "}
                        {new Date(exp.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {exp.info || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-red-400">
                      ₹{exp.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteExpense(exp._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => {
                    const newPage = Math.max(page - 1, 1);
                    setPage(newPage);
                    filterMode === "all"
                      ? getExpensesByPage(newPage)
                      : getExpensesByDateRange(startDate, endDate, newPage);
                  }}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-gray-300">
                  Page {page} of {totalPagesExpenses}
                </span>
                <button
                  onClick={() => {
                    const newPage = Math.min(page + 1, totalPagesExpenses);
                    setPage(newPage);
                    filterMode === "all"
                      ? getExpensesByPage(newPage)
                      : getExpensesByDateRange(startDate, endDate, newPage);
                  }}
                  disabled={page === totalPagesExpenses}
                  className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ExpensePage;