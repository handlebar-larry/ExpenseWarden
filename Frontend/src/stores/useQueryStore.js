import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import { useAuthStore } from "./useAuthStore.js";


const useQueryStore = create((set, get) => ({

    user: useAuthStore.getState().authUser,
    expenses: [],                   // current page of expenses
    incomes: [],                    // current page of incomes
    expenseStats: [],               // yearly expense stats
    incomeStats: [],                // yearly income stats
    monthlyExpenseCategory: {},     // monthly expense category totals
    monthlyIncomeCategory: {},      // monthly income category totals
    totalExpenses: 0,               // total expenses for pagination
    totalIncomes: 0,                // total incomes for pagination
    totalPagesExpenses: 0,
    totalPagesIncomes: 0,


    addExpense: async (expense) => {
        try {
            const userId = useAuthStore.getState().authUser._id;;
            const res = await axiosInstance.post("/query/addExpense", { ...expense, id: userId });

            // Refresh everything
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            get().getExpensesByPage(1);
            get().getYearlyExpenseStats(currentYear);
            get().getMonthlyCategoryExpenseStats(currentYear, currentMonth);
        } catch (error) {
            console.log("Error in addExpense", error);
        }
    },

    addIncome: async (income) => {
        try {
            const userId = useAuthStore.getState().authUser._id;;
            console.log("Hii", income);
            const res = await axiosInstance.post("/query/addIncome", { ...income, id: userId });

            // Refresh everything
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            get().getIncomesByPage(1);
            get().getYearlyIncomeStats(currentYear);
            get().getMonthlyCategoryIncomeStats(currentYear, currentMonth);
        } catch (error) {
            console.log("Error in addIncome", error);
        }
    },

    deleteExpense: async (expenseId) => {
        try {
            const userId = useAuthStore.getState().authUser._id;;
            const res = await axiosInstance.post("/query/deleteExpense", { id: userId, expenseId });

            // Refresh everything
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            get().getExpensesByPage(1);
            get().getYearlyExpenseStats(currentYear);
            get().getMonthlyCategoryExpenseStats(currentYear, currentMonth);

        } catch (error) {
            console.log("Error in deleteExpense");
        }
    },

    deleteIncome: async (incomeId) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/deleteIncome", { id: userId, incomeId });

        // Refresh everything
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        get().getIncomesByPage(1);
        get().getYearlyIncomeStats(currentYear);
        get().getMonthlyCategoryIncomeStats(currentYear, currentMonth);
    },

    getExpensesByPage: async (page) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/getExpensesByPage", { id: userId, page });
        set({
            expenses: res.data.expenses,
            totalExpenses: res.data.totalExpenses,
            totalPagesExpenses: res.data.totalPages,
        });
    },

    getIncomesByPage: async (page = 1) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/getIncomesByPage", { id: userId, page });
        set({
            incomes: res.data.incomes,
            totalIncomes: res.data.totalIncomes,
            totalPagesIncomes: res.data.totalPages,
        });
    },

    getExpensesByDateRange: async (startDate, endDate, page) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/getExpensesByDateRange", { id: userId, startDate, endDate, page });
        set({
            expenses: res.data.expenses,
            totalExpenses: res.data.totalExpenses,
            totalPagesExpenses: res.data.totalPages,
        });
    },

    getIncomesByDateRange: async (startDate, endDate, page = 1) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/getIncomesByDateRange", { id: userId, startDate, endDate, page });
        set({
            incomes: res.data.incomes,
            totalIncomes: res.data.totalIncomes,
            totalPagesIncomes: res.data.totalPages,
        });
    },

    getYearlyExpenseStats: async (year) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/getYearlyExpenseStats", { id: userId, year });
        set({ expenseStats: res.data });
    },

    getYearlyIncomeStats: async (year) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/getYearlyIncomeStats", { id: userId, year });
        set({ incomeStats: res.data });
    },

    getMonthlyCategoryExpenseStats: async (year, month) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/getMonthlyCategoryExpenseStats", { id: userId, year, month });
        set({ monthlyExpenseCategory: res.data });
    },

    getMonthlyCategoryIncomeStats: async (year, month) => {
        const userId = useAuthStore.getState().authUser._id;;
        const res = await axiosInstance.post("/query/getMonthlyCategoryIncomeStats", { id: userId, year, month });
        set({ monthlyIncomeCategory: res.data });
    },

    imageUpload: async (file) => {
        try {
            const userId = useAuthStore.getState().authUser._id;;
            const formData = new FormData();
            formData.append("id", userId);
            formData.append("image", file);

            console.log("about to upload");
            console.log(formData);

            const res = await axiosInstance.post("/query/imageUpload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(res.data);
            return res.data;

        } catch (err) {
            console.error("Image upload failed:", err);
        }
    },
    

}));


export default useQueryStore;



