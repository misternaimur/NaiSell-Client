/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import DashboardHeading from "@/components/DashboardHeading";
import {
  getPlatformProducts,
  moderateProduct,
  deletePlatformProduct,
} from "@/lib/api/adminActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCheck,
  faTimes,
  faTrashCan,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        search: search.trim(),
        status: statusFilter,
      };
      const res = await getPlatformProducts(queryParams);

      if (res && Array.isArray(res.result)) {
        setProducts(res.result);
      } else if (res && Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (res && Array.isArray(res)) {
        setProducts(res);
      } else {
        // Fallback fake data for UI testing
        setProducts([
          {
            _id: "p1",
            title: "Used iPhone 13 Pro",
            category: "Electronics",
            price: 65000,
            status: "pending",
            sellerEmail: "seller@example.com",
            image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=200",
          },
          {
            _id: "p2",
            title: "Vintage Leather Jacket",
            category: "Fashion",
            price: 4500,
            status: "approved",
            sellerEmail: "vintage@example.com",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200",
          },
          {
            _id: "p3",
            title: "Suspicious Item Listing",
            category: "Other",
            price: 10,
            status: "reported",
            sellerEmail: "scam@example.com",
            image: null,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleModeration = async (productId, newStatus) => {
    const actionName = newStatus === "approved" ? "Approve" : "Reject";
    if (!window.confirm(`Are you sure you want to ${actionName} this product?`))
      return;

    try {
      const res = await moderateProduct(productId, newStatus);
      if (res && res.success !== false) {
        toast.success(`Product ${newStatus} successfully!`);
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, status: newStatus } : product
          )
        );
      } else {
        toast.error(`Failed to moderate: ${res?.message || "Error"}`);
      }
    } catch (error) {
      console.error("Error moderating product:", error);
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (productId) => {
    if (
      !window.confirm(
        "Are you absolutely sure you want to permanently delete this product listing? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await deletePlatformProduct(productId);
      if (res && res.success !== false) {
        toast.success("Product deleted successfully!");
        setProducts((prev) => prev.filter((product) => product._id !== productId));
      } else {
        toast.error(`Failed to delete product: ${res?.message || "Error"}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred");
    }
  };

  // Status Badge Colors
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "reported":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8 mt-6 pb-12 text-on-background max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="Manage Products"
        description="Review, approve, or reject product listings. Monitor reported items to keep the marketplace safe."
      />

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-lg">
        <div className="relative flex items-center col-span-1 md:col-span-2">
          <span className="absolute left-4 text-slate-500">
            <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search products by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="relative flex items-center">
          <span className="absolute left-4 text-slate-500">
            <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4" />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="reported">Reported / Flagged</option>
          </select>
        </div>
      </div>

      {/* 📦 Products Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-lg">No products found matching the criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 sm:p-5">Product Details</th>
                <th className="p-4">Seller</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 sm:p-5 flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-xl border border-slate-700 overflow-hidden shrink-0 bg-slate-950 flex items-center justify-center">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-600">No Img</span>
                      )}
                    </div>
                    <div>
                      <div className="max-w-[200px] truncate font-semibold text-slate-200">
                        {product.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {product.category}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-slate-400 text-xs truncate max-w-[150px]">
                    {product.sellerEmail || "Unknown Seller"}
                  </td>

                  <td className="p-4 font-mono font-bold text-amber-400">
                    ৳ {product.price?.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full border font-bold uppercase tracking-wider ${getStatusBadge(
                        product.status
                      )}`}
                    >
                      {product.status || "Pending"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleModeration(product._id, "approved")}
                        className="p-2 text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 rounded-lg transition-all"
                        title="Approve Listing"
                      >
                        <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleModeration(product._id, "rejected")}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-all"
                        title="Reject Listing"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                      </button>
                      <div className="w-px h-5 bg-slate-700 my-auto mx-1"></div>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 border border-transparent rounded-lg transition-all"
                        title="Delete Permanently"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
