/** @format */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import DashboardHeading from "@/components/DashboardHeading";
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

  // Pagination State
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // এপিআই ডেটা অনুযায়ী অপশনস
  const categories = [
    "Electronics",
    "Gadgets",
    "Fashion",
    "Home Appliances",
    "Automobiles",
    "Vehicles",
    "Furniture",
  ];
  const conditions = ["Used", "Like New", "Refurbished", "Good", "Pristine"];

  // 🔄 [READ] - সরাসরি আপনার লোকালহোস্ট API থেকে ডেটা ফেচ করা
  const fetchProducts = useCallback(async () => {
    if (!sellerEmail) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const queryParams = new URLSearchParams({
        email: sellerEmail,
        search: search.trim(),
        category,
        condition,
      });

      const response = await fetch(`${baseUrl}/api/products?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products from server");
      }

      const res = await response.json();

      // 💡 ফিক্স: ডাটা সেট করার সময় রেন্ডার সাইকেলের বাইরে পাঠানো হলো
      setTimeout(() => {
        if (res && Array.isArray(res)) {
          setProducts(res);
        } else if (res && Array.isArray(res.products)) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      }, 0);
    } catch (error) {
      console.error("Error fetching products from API:", error);
    } finally {
      // 💡 ফিক্স: লোডিং স্টেটকেও নিরাপদ উপায়ে ফলস করা হলো
      setTimeout(() => setLoading(false), 0);
    }
  }, [sellerEmail, search, category, condition]);

  // 💡 ১০০% লিন্টার সেফ ইফেক্ট ব্লক:
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      // ক্যাসকেডিং রেন্ডার এড়াতে সম্পূর্ণ প্রসেসটিকে মাইক্রো-টাস্কে পুশ করা হলো
      setTimeout(() => {
        setCurrentPage(1);
        setLoading(true); // ডেটা লোড হওয়ার আগে লোডিং শুরু
        fetchProducts();
      }, 0);
    }

    return () => {
      isMounted = false;
    };
  }, [search, category, condition, fetchProducts]);

  // 🗑️ [DELETE] - API-তে ডিলিট রিকোয়েস্ট পাঠানো
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product permanently from the database?",
    );
    if (!confirmDelete) return;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("🎉 Product deleted successfully!");
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        alert("❌ Failed to delete product from server.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Operation failed. Could not connect to API.");
    }
  };

  // 📝 [UPDATE] - মোডাল ওপেন
  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 [UPDATE] - API-তে এডিটেড ডেটা পুশ করা
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const payload = {
        title: editingProduct.title,
        description: editingProduct.description,
        category: editingProduct.category,
        condition: editingProduct.condition,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        image: editingProduct.image || "",
        images: editingProduct.images || [],
      };

      const response = await fetch(
        `${baseUrl}/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        alert("🎉 Product info updated successfully!");
        setIsEditModalOpen(false);
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id ? { ...p, ...payload } : p,
          ),
        );
      } else {
        alert("❌ Update failed on server.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("❌ Something went wrong while saving updates.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (product.image && typeof product.image === "string") {
      return product.image;
    }
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }
    return null;
  };

  if (!sellerEmail && loading) {
    return (
      <div className="flex justify-center items-center py-20 text-white">
        <span className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></span>
        <span className="ml-3 text-slate-400">Checking authorization...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="My Products"
        description="Manage all products created by you. View, search, filter, edit or delete items instantly."
      />

      {/* 🔍 সার্চ এবং ফিল্টার কন্ট্রোলার */}
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

      {/* 📦 ডাটা টেবিল */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></span>
          <span className="ml-3 text-slate-400">
            Loading products from API...
          </span>
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
              {paginatedProducts.map((product) => {
                const imgUrl = getProductImage(product);
                return (
                  <tr
                    key={product._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4 sm:p-5 flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded-xl border border-slate-700 overflow-hidden flex-shrink-0 bg-slate-950">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500 font-medium">
            Showing{" "}
            <span className="text-slate-300 font-bold">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, products.length)}
            </span>{" "}
            of{" "}
            <span className="text-slate-300 font-bold">{products.length}</span>{" "}
            products
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1,
              )
              .reduce((acc, page, idx, arr) => {
                if (idx > 0 && page - arr[idx - 1] > 1) {
                  acc.push("...");
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="h-9 w-9 flex items-center justify-center text-slate-600 text-xs select-none"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={`h-9 w-9 flex items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                      currentPage === item
                        ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* 🪟 EDIT MODAL */}
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
