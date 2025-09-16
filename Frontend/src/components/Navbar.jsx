import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const location = useLocation();
  const { authUser, logout } = useAuthStore(); 
  // console.log(authUser);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Expenses", path: "/expenses" },
    { name: "Income", path: "/income" },
    { name: "Receipt", path: "/receipt" },
  ];

  return (
    <nav className="bg-zinc-900 text-white p-4 flex items-center justify-between shadow-md">
      {/* Logo / Title */}
      <h1 className="text-xl font-bold">💰 Expense Tracker</h1>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-zinc-700 text-white font-semibold"
                : "hover:bg-zinc-800"
            }`}
          >
            {item.name}
          </Link>
        ))}

        {/* Auth buttons */}
        {!authUser ? (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
