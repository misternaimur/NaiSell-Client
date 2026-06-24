/** @format */
"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/DashboardHeading";
import {
  Magnifier,
  TrashBin,
  Pencil,
  Eye,
  Archive,
  ArrowRotateLeft,
} from "@gravity-ui/icons";

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // ডামি ডেটা লোড বা API থেকে ডেটা কল (আপনার ব্যাকএন্ড URL বসিয়ে নিতে পারেন)
  useEffect(() => {
    // API কল করার জন্য নিচের কমেন্ট আউট করা কোডটি ব্যবহার করতে পারেন:
    /*
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products?email=seller@naisell.com");
        const data = await response.json();
        if (data.success) setProducts(data.data);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchProducts();
    */

    // সাময়িক টেস্ট করার জন্য ডামি ডেটা সেট করা হলো:
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts([
      {
        id: "1",
        title: "iPhone 13 Pro Max",
        category: "Electronics",
        price: 85000,
        stock: 5,
        image:
          "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=150",
      },
      {
        id: "2",
        title: "Mechanical Keyboard",
        category: "Gadgets",
        price: 4500,
        stock: 12,
        image:
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=150",
      },
      {
        id: "3",
        title: "Premium Leather Jacket",
        category: "Fashion",
        price: 6200,
        stock: 3,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150",
      },
    ]);
    setLoading(false);
  }, []);

  // প্রোডাক্ট ডিলিট (Delete Operation)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // API Call: await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p) => p.id !== id));
      alert("🎉 Product deleted successfully!");
    } catch (error) {
      alert("❌ Failed to delete product.");
    }
  };

  // প্রোডাক্ট এডিট সাবমিট (Update Operation)
  const handleUpdate = (e) => {
    e.preventDefault();
    setProducts(
      products.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
    );
    setEditingProduct(null);
    alert("🎉 Product updated successfully!");
  };

  // সার্চ এবং ফিল্টারিং মেকানিজম
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "Electronics",
    "Gadgets",
    "Fashion",
    "Home Appliances",
    "Automobiles",
  ];

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="My Products"
        description="Manage all products created by you. View active listings, update details, or remove items instantly."
      />

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
        {/* Search Input */}
        <div className="relative flex items-center col-span-1 sm:col-span-2">
          <span className="absolute left-4 text-slate-500">
            <Magnifier className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="relative flex items-center">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900">
                {cat}
              </option>
            ))}
          </select>
          <span className="absolute right-4 text-slate-500 pointer-events-none">
            ▼
          </span>
        </div>
      </div>

      {/* Product List Table / Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/20 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">
            No products found alignment with your search criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {/* Info */}
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-800"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/150?text=No+Image";
                      }}
                    />
                    <span className="font-medium text-slate-200 line-clamp-1">
                      {product.title}
                    </span>
                  </td>
                  {/* Category */}
                  <td className="p-4 text-slate-400">{product.category}</td>
                  {/* Price */}
                  <td className="p-4 font-semibold text-emerald-400">
                    ৳ {product.price.toLocaleString()}
                  </td>
                  {/* Stock */}
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                    >
                      {product.stock} left
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-2 inline-flex items-center justify-center rounded-lg border border-slate-800 hover:border-cyan-500/50 bg-slate-900 hover:text-cyan-400 transition-all"
                      title="Edit Product"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 inline-flex items-center justify-center rounded-lg border border-slate-800 hover:border-rose-500/50 bg-slate-900 hover:text-rose-400 transition-all"
                      title="Delete Product"
                    >
                      <TrashBin className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update/Edit Modal (Pure CSS/React Control) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-200">
                Update Product Details
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold">
                  Title
                </label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">
                    Price (BDT)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 h-10 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-sm font-semibold rounded-xl text-white transition-opacity hover:opacity-90"
                >
                  Save Changes
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
