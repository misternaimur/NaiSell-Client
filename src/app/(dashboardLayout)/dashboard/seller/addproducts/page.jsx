/** @format */
"use client";

import { useState } from "react";
import Image from "next/image"; // 🚀 Next.js Image Component Import kora holo
import DashboardHeading from "@/components/DashboardHeading";
import { addProduct } from "@/lib/api/sellerActions"; // 🛠️ Import match kore nibe
import {
  CirclePlusFill,
  CloudArrowUpIn,
  Archive,
  Hashtag,
  Link,
} from "@gravity-ui/icons";

const AddProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [imageMethod, setImageMethod] = useState("upload"); // 'upload' | 'url'

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    stock: "",
    image: "", // Base64 ba direct Image URL
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📂 Local file upload handler (Convert to Base64)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("❌ File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
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

    if (!formData.image) {
      alert("❌ Please upload an image or provide a web URL first!");
      return;
    }

    setLoading(true);

    const productSubmitData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sellerEmail: "seller@naisell.com",
    };

    try {
      const data = await addProduct(productSubmitData);

      if (data.success || data._id) {
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
        alert(`❌ Failed to add product: ${data.message || "Unknown error"}`);
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
          {/* 🔘 Image selection controller */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Image Selection Method
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-1 rounded-xl border border-slate-800 max-w-xs">
              <button
                type="button"
                onClick={() => {
                  setImageMethod("upload");
                  setFormData((prev) => ({ ...prev, image: "" }));
                }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  imageMethod === "upload"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <CloudArrowUpIn className="w-3.5 h-3.5" />
                Local Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageMethod("url");
                  setFormData((prev) => ({ ...prev, image: "" }));
                }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  imageMethod === "url"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                Web URL
              </button>
            </div>
          </div>

          {/* 🔄 Conditional Image input layer with next/image optimization */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Product Image
            </label>

            {imageMethod === "upload" ? (
              <div className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/40 rounded-2xl p-6 transition-all duration-300 relative min-h-[160px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {formData.image && formData.image.startsWith("data:image") ? (
                  <div className="flex flex-col items-center gap-3">
                    {/* 🛠️ Fixed LCP with Next image component */}
                    <Image
                      src={formData.image}
                      alt="Product Preview"
                      width={96}
                      height={96}
                      unoptimized // Base64 data strings skip optimize step runtime errors
                      className="w-24 h-24 object-cover rounded-xl border border-slate-700 shadow-xl"
                    />
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      Image Selected (Click to change)
                    </span>
                  </div>
                ) : (
                  <>
                    <CloudArrowUpIn className="text-slate-500 group-hover:text-cyan-400 transition-colors mb-3 w-8 h-8" />
                    <p className="text-sm text-slate-400 text-center">
                      Click to browse or drag and drop your product image
                    </p>
                    <span className="text-[10px] text-slate-600 mt-1">
                      Supports PNG, JPG, JPEG (Max 2MB)
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/40 rounded-2xl p-6 transition-all duration-300 gap-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Link className="w-4 h-4 text-slate-500" />
                  <span>
                    Provide a high-quality direct URL for your product image
                  </span>
                </div>

                <input
                  type="url"
                  name="image"
                  value={
                    formData.image.startsWith("data:image")
                      ? ""
                      : formData.image
                  }
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  required={imageMethod === "url"}
                  className="w-full max-w-md h-11 px-4 rounded-xl border border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm"
                />

                {formData.image && !formData.image.startsWith("data:image") && (
                  <div className="w-20 h-20 relative border border-slate-700 shadow-md rounded-xl overflow-hidden mt-2">
                    <Image
                      src={formData.image}
                      alt="URL Preview"
                      fill
                      unoptimized // Next.js dynamic URLs standard verification handle
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}
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
              placeholder="Describe the product features, specifications..."
              required
              rows={4}
              className="w-full p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-y min-h-[100px]"
            />
          </div>

          {/* Dropdowns Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
