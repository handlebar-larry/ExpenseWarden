import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ExpensePage from "./pages/ExpensePage";
import IncomePage from "./pages/IncomePage";
import ImageUpload from "./pages/ImageUpload";
import { useAuthStore } from "./stores/useAuthStore";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {

  const {checkAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth()
  },[])

  const {authUser} = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/expenses" element={<ExpensePage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/receipt" element={<ImageUpload />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
