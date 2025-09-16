import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import useQueryStore from "../stores/useQueryStore";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    info: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const imageUpload = useQueryStore((state) => state.imageUpload);
  const addExpense = useQueryStore((state) => state.addExpense);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image first!");
      return;
    }
    setLoading(true);
    try {
      const response = await imageUpload(image); // call zustand action
      if (response) {
        // Pre-fill form
        setForm({
          ...form,
          amount: response.amount,
          info: response.tag,
        });
        setShowForm(true);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await addExpense(form);
    // Reset
    setForm({ amount: "", category: "", date: new Date().toISOString().split("T")[0], info: "" });
    setImage(null);
    setPreview(null);
    setShowForm(false);
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl border border-gray-600/50 text-white w-full max-w-md mx-auto">
      {!showForm ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleImageChange}
              className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-600 file:text-white
              hover:file:bg-purple-700 cursor-pointer"
            />
            {preview && image.type !== "application/pdf" && (
              <div className="mt-4">
                <p className="text-gray-400 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-lg border border-gray-600 max-h-60 object-contain"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {loading ? <span className="loader border-t-2 border-white w-5 h-5 rounded-full animate-spin" /> : "Submit"}
            </button>
          </form>
        </>
      ) : (
        // Show the prefilled expense form
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
      )}
    </div>
  );
};

export default ImageUpload;
