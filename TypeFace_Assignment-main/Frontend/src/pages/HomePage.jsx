import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import useQueryStore from "./../stores/useQueryStore.js";

const HomePage = () => {
  const currentYear = new Date().getFullYear();

  async function fetchStats() {
    const getYearlyExpenseStats = useQueryStore.getState().getYearlyExpenseStats;
    await getYearlyExpenseStats(currentYear);

    const getYearlyIncomeStats = useQueryStore.getState().getYearlyIncomeStats;
    await getYearlyIncomeStats(currentYear);
  }

  function statsToMonthlyData(expenseStats = [], incomeStats = []) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    const monthlyData = monthNames.map((name, i) => {
      const m = i + 1;
      const expense = Number(expenseStats.find((s) => +s.month === m)?.totalAmount) || 0;
      const income = Number(incomeStats.find((s) => +s.month === m)?.totalAmount) || 0;

      return { month: name, income, expense, savings: income - expense };
    });

    return monthlyData;
  }

  function getTotals(monthlyData = []) {
    const result = monthlyData.reduce(
      (acc, item) => {
        const income = Number(item?.income) || 0;
        const expense = Number(item?.expense) || 0;
        acc.totalIncome += income;
        acc.totalExpense += expense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );

    return result;
  } 

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const monthlyData = statsToMonthlyData(
        useQueryStore.getState().expenseStats,
        useQueryStore.getState().incomeStats
      );

      setChartData(monthlyData);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    } finally {
      setLoading(false);
    }
  };

  // run fetchStats once on mount
  useEffect(() => {
    fetchStats();
    fetchMonthlyData();
    
  }, []);

  const totalsFromStore = getTotals(
    statsToMonthlyData(useQueryStore.getState().expenseStats, useQueryStore.getState().incomeStats)
  );

  var totalIncome = totalsFromStore.totalIncome;
  var totalExpense = totalsFromStore.totalExpense;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-700/90 backdrop-blur-sm p-3 rounded-lg border border-slate-500 shadow-lg">
          <p className="text-slate-200 font-medium">{`${label} ${currentYear}`}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ₹${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="min-h-screen bg-slate-900"
      style={{
        background:
          "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(17,24,39,1) 35%, rgba(7,10,16,1) 100%)"
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-slate-700/40">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-white">
              Welcome to Expense Tracker <span role="img" aria-label="wave">👋</span>
            </h1>
            <div className="hidden md:block px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30 text-slate-200">Home</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-slate-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-500/20">
              <h2 className="text-lg font-semibold text-green-400">Total Income ({currentYear})</h2>
              <p className="text-2xl font-bold mt-2 text-white">₹{totalIncome.toLocaleString()}</p>
            </div>

            <div className="bg-slate-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-500/20">
              <h2 className="text-lg font-semibold text-red-400">Total Expense ({currentYear})</h2>
              <p className="text-2xl font-bold mt-2 text-white">₹{totalExpense.toLocaleString()}</p>
            </div>

            <div className="bg-slate-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-500/20">
              <h2 className="text-lg font-semibold text-blue-400">Balance ({currentYear})</h2>
              <p className="text-2xl font-bold mt-2 text-white">₹{(totalIncome - totalExpense).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-600/30 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Monthly Financial Overview - {currentYear}</h2>

            {loading ? (
              <div className="flex justify-center items-center h-80">
                <div className="text-slate-300">Loading chart data...</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.25} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px", color: "#E2E8F0" }} iconType="line" />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Income"
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2, fill: "#10B981" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#EF4444"
                    strokeWidth={3}
                    name="Expense"
                    dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2, fill: "#EF4444" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Savings"
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2, fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;