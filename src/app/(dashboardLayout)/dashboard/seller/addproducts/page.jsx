/** @format */
"use client";

import { useState } from "react";
import DashboardHeading from "@/components/DashboardHeading";
import {
  CirclePlusFill,
  CloudArrowUpIn,
  Archive,
  Hashtag,
} from "@gravity-ui/icons";

const AddProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const categories = [
    "Electronics",
    "Gadgets",
    "Fashion",
    "Home Appliances",
    "Automobiles",
  ];
  const conditions = ["Used", "Like New", "Refurbished"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productSubmitData = {
      ...formData,
      sellerEmail: "seller@naisell.com",
    };

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productSubmitData),
      });

      const data = await response.json();

      if (data.success) {
        alert("🎉 Product listed successfully on NaiSell!");
        setFormData({
          title: "",
          description: "",
          category: "",
          condition: "",
          price: "",
          stock: "",
          image: "",
        });
      } else {
        alert(`❌ Failed to add product: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Something went wrong while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-4xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="Add New Product"
        description="List a new item for sale on NaiSell. Fill in the product details, set your price, and start earning."
      />

      <form onSubmit={handleSubmit}>
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
          {/* Product Image Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Product Image
            </label>
            <div className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/40 rounded-2xl p-6 transition-all duration-300">
              <CloudArrowUpIn className="text-slate-500 group-hover:text-cyan-400 transition-colors mb-3 w-8 h-8" />
              <p className="text-sm text-slate-400 mb-4 text-center">
                Provide a high-quality direct URL for your product image
              </p>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
                className="w-full max-w-md h-11 px-4 rounded-xl border border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Product Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Product Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., iPhone 13 Pro Max"
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product features, specifications, and layout..."
              required
              rows={4}
              className="w-full p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-y min-h-[100px]"
            />
          </div>

          {/* Dropdowns Group (Category & Condition) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Category
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500">
                  <Hashtag className="w-4 h-4" />
                </span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-slate-900 text-white"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 text-slate-500 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* Condition Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Condition
              </label>
              <div className="relative flex items-center">
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 rounded-xl border border-slate-800 bg-slate-900 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Select Condition
                  </option>
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
                <span className="absolute right-4 text-slate-500 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Price (BDT)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 text-sm font-semibold">
                  ৳
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Stock Quantity
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500">
                  <Archive className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Available Stock"
                  required
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-bold px-8 h-12 rounded-xl shadow-lg transition-all duration-300"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Publishing Listing...
                </>
              ) : (
                <>
                  <CirclePlusFill className="w-4 h-4" />
                  Publish Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
