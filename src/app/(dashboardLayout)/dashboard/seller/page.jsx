/** @format */
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import DashboardHeading from "@/components/DashboardHeading";
import {
  getSellerProducts,
  deleteProduct,
  updateProduct,
} from "@/lib/api/sellerActions"; // 🚀 আপনার এপিআই অ্যাকশনগুলো ইমপোর্ট করা হলো
import {
  Magnifier,
  TrashBin,
  Pencil,
  Archive,
  Hashtag,
  Xmark,
} from "@gravity-ui/icons";

const MyProductsPage = () => {
  const sellerEmail = "seller@naisell.com"; // ডিফল্ট বা লগইন করা সেলারের ইমেইল

  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const categories = [
    "Electronics",
    "Gadgets",
    "Fashion",
    "Home Appliances",
    "Automobiles",
  ];
  const conditions = ["Used", "Like New", "Refurbished"];

  // 🔄 ১. READ - ডাটাবেজ থেকে প্রোডাক্ট ফেচ করা ( useCallback দিয়ে অপ্টিমাইজড)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        email: sellerEmail,
        search: search,
        category: category,
        condition: condition,
      };
      const data = await getSellerProducts(queryParams);
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [search, category, condition]);

  // সার্চ এবং ফিল্টার চেঞ্জ হলে প্রোডাক্ট আবার লোড হবে
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🗑️ ২. DELETE - প্রোডাক্ট ডিলিট করা
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product permanently?",
    );
    if (!confirmDelete) return;

    try {
      const data = await deleteProduct(id);
      if (data.success || data.result?.deletedCount > 0) {
        alert("🎉 Product deleted successfully!");
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        alert(`❌ Failed to delete: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Something went wrong while deleting.");
    }
  };

  // 📝 ৩. UPDATE - এডিট মোডাল ওপেন করা
  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 ৪. UPDATE - ফর্ম সাবমিট করে ডাটাবেজে সেভ করা
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const payload = {
        title: editingProduct.title,
        description: editingProduct.description,
        category: editingProduct.category,
        condition: editingProduct.condition,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        image: editingProduct.image,
      };

      const data = await updateProduct(editingProduct._id, payload);

      if (data.success || data.result?.modifiedCount > 0) {
        alert("🎉 Product updated successfully!");
        setIsEditModalOpen(false);
        // লোকাল স্টেট আপডেট করা যাতে রিফ্রেশ করা না লাগে
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id ? { ...p, ...payload } : p,
          ),
        );
      } else {
        alert(`❌ Update failed: ${data.message || "No changes made"}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("❌ Something went wrong while updating.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="My Products"
        description="Manage all products created by you. View, search, filter, edit or delete items instantly."
      />

      {/* 🔍 সার্চ এবং ফিল্টার সেকশন */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-lg">
        {/* সার্চ বার */}
        <div className="relative flex items-center col-span-1 md:col-span-2">
          <span className="absolute left-4 text-slate-500">
            <Magnifier className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search products by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* ক্যাটাগরি ফিল্টার */}
        <div className="relative flex items-center">
          <span className="absolute left-4 text-slate-500">
            <Hashtag className="w-4 h-4" />
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* কন্ডিশন ফিল্টার */}
        <div className="relative flex items-center">
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Conditions</option>
            {conditions.map((cond) => (
              <option
                key={cond}
                value={cond}
                className="bg-slate-900 text-white"
              >
                {cond}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📦 প্রোডাক্ট টেবিল বা লিস্টিং গ্রিড */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></span>
          <span className="ml-3 text-slate-400">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-lg">
            No products found matching the criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 sm:p-5">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {/* ইমেজ ও টাইটেল */}
                  <td className="p-4 sm:p-5 flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-xl border border-slate-700 overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          product.image || "https://example.com/placeholder.jpg"
                        }
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="max-w-xs truncate font-semibold text-slate-200">
                      {product.title}
                    </div>
                  </td>

                  {/* ক্যাটাগরি */}
                  <td className="p-4 text-slate-300">{product.category}</td>

                  {/* কন্ডিশন */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {product.condition}
                    </span>
                  </td>

                  {/* প্রাইস */}
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    ৳ {product.price}
                  </td>

                  {/* স্টক */}
                  <td className="p-4 font-mono text-slate-400">
                    {product.stock} pcs
                  </td>

                  {/* অ্যাকশন বাটনসমূহ */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 rounded-lg transition-all"
                        title="Edit Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-all"
                        title="Delete Product"
                      >
                        <TrashBin className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🪟 ৩. UPDATE MODAL (এডিট উইন্ডো) */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative text-white">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Xmark className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold border-b border-slate-800 pb-3">
              Edit Product Information
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* প্রোডাক্ট টাইটেল */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingProduct.title}
                  onChange={handleEditChange}
                  required
                  className="w-full h-10 px-4 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* প্রাইস এবং স্টক গ্রূপ */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold uppercase">
                    Price (BDT)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    required
                    className="w-full h-10 px-4 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold uppercase">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct.stock}
                    onChange={handleEditChange}
                    required
                    className="w-full h-10 px-4 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* ক্যাটাগরি এবং কন্ডিশন */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold uppercase">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editingProduct.category}
                    onChange={handleEditChange}
                    className="w-full h-10 px-4 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold uppercase">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={editingProduct.condition}
                    onChange={handleEditChange}
                    className="w-full h-10 px-4 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {conditions.map((cond) => (
                      <option key={cond} value={cond} className="bg-slate-900">
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ডেসক্রিপশন */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={handleEditChange}
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              {/* সেভ বাটন */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 h-10 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 font-bold hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-6 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold shadow-lg disabled:opacity-50 transition-opacity"
                >
                  {updateLoading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
