/** @format */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import DashboardHeading from "@/components/DashboardHeading";
import {
  getSellerProducts,
  deleteProduct,
  updateProduct,
} from "@/lib/api/sellerActions";
import { Magnifier, TrashBin, Pencil, Hashtag, Xmark } from "@gravity-ui/icons";

const MyProductsPage = () => {
  const { data: session } = useSession();
  const sellerEmail = session?.user?.email || "";

  // Live DB States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // ফিল্টার অপশনস (এগুলো ডাটাবেজ কোয়েরি প্যারামস হিসেবে পাস হবে)
  const categories = [
    "Electronics",
    "Gadgets",
    "Fashion",
    "Home Appliances",
    "Automobiles",
  ];
  const conditions = ["Used", "Like New", "Refurbished"];

  // 🔄 [READ] - সরাসরি ডাটাবেজ থেকে লাইভ ডেটা ফেচ করা


  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // directly query live database with search, category, and condition filters
      const res = await getSellerProducts({
        email: sellerEmail,
        search: search.trim(),
        category,
        condition,
      });

      if (res && Array.isArray(res)) {
        setProducts(res);
      } else if (res && Array.isArray(res.products)) {
        setProducts(res.products);
      } else if (res && Array.isArray(res.result)) {
        setProducts(res.result);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [sellerEmail, search, category, condition]);

  // সার্চ বা ফিল্টার চেঞ্জ হওয়া মাত্রই সরাসরি ডাটাবেজ রি-কোয়েরি হবে
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🗑️ [DELETE] - MongoDB থেকে পার্মানেন্টলি ডিলিট করার লজিক
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product permanently from the database?",
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteProduct(id);

      if (res && (res.success || res.result?.deletedCount > 0)) {
        alert("🎉 Product deleted successfully from database!");
        // রিফ্রেশ ছাড়া লাইভ UI স্টেট আপডেট করা
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        alert(`❌ Failed to delete: ${res?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Operation failed. Could not connect to database.");
    }
  };

  // 📝 [UPDATE] - মোডাল ওপেন ও ডেটা বাইন্ডিং
  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 [UPDATE] - ডাটাবেজে এডিটেড তথ্য সেভ করা
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

      const res = await updateProduct(editingProduct._id, payload);

      if (
        res &&
        (res.success ||
          res.result?.modifiedCount > 0 ||
          res.result?.acknowledged)
      ) {
        alert("🎉 Product info updated successfully in database!");
        setIsEditModalOpen(false);

        // পেজ রিফ্রেশ ছাড়া টেবিলে নতুন ডেটা পুশ করার জন্য স্টেট সিঙ্ক
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id ? { ...p, ...payload } : p,
          ),
        );
      } else {
        alert(
          `❌ Update failed: ${res?.message || "No changes were made to fields."}`,
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("❌ Something went wrong while saving updates.");
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

      {/* 🔍 লাইভ সার্চ এবং ফিল্টার কন্ট্রোলার */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-lg">
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

      {/* 📦 লাইভ ডাটা টেবিল */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></span>
          <span className="ml-3 text-slate-400">
            Fetching live products from database...
          </span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-lg">
            No products found in database matching the criteria.
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
                  <td className="p-4 sm:p-5 flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-xl border border-slate-700 overflow-hidden flex-shrink-0 bg-slate-950">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="max-w-xs truncate font-semibold text-slate-200">
                      {product.title}
                    </div>
                  </td>

                  <td className="p-4 text-slate-300">{product.category}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {product.condition}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    ৳ {product.price}
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {product.stock} pcs
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-all"
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

      {/* 🪟 UPDATE MODAL উইন্ডো */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
