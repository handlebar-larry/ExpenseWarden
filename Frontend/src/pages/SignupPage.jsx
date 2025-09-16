import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = { name, email, password };
    await signup(data);
    navigate("/");
    console.log("Signup attempt:", { name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="bg-gray-900/60 p-10 rounded-2xl shadow-xl w-[90%] max-w-md">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
          Create an Account
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Join us 🎉 Start tracking your expenses today
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSignup}>
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Re-enter your password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90 transition font-semibold shadow-lg"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
