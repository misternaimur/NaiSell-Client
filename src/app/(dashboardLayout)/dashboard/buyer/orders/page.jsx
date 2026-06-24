/** @format */
"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/DashboardHeading";
import {
  FaShoppingBag,
  FaEye,
  FaTimesCircle,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaBan,
  FaTimes,
} from "react-icons/fa";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const buyerEmail = "buyer@naisell.com"; // অথেন্টিকেশন সেশন থেকে রিপ্লেস করে নেবেন

  // 📥 ডাটাবেজ থেকে বায়ারের অর্ডার লোড করা
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/buyer/orders?email=${buyerEmail}`,
      );
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ❌ অর্ডার বাতিল করার হ্যান্ডলার
  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setActionLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PATCH",
        },
      );
      const data = await res.json();

      if (data.success) {
        alert("🔒 Order cancelled successfully.");
        fetchOrders();
        if (isModalOpen) setIsModalOpen(false);
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("❌ Failed to connect to server.");
    } finally {
      setActionLoading(false);
    }
  };

  // 🔍 ডিটেইলস মোডাল ওপেন করা
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // 🎨 স্ট্যাটাস ডাইনামিক স্টাইল ও কালার ম্যাপ
  const getStatusStyles = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: <FaClock className="inline mr-1" />,
        };
      case "Accepted":
        return {
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: <FaCheckCircle className="inline mr-1" />,
        };
      case "Shipped":
        return {
          bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          icon: <FaTruck className="inline mr-1" />,
        };
      case "Delivered":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: <FaCheckCircle className="inline mr-1" />,
        };
      case "Cancelled":
      case "Rejected":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          icon: <FaBan className="inline mr-1" />,
        };
      default:
        return {
          bg: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          icon: null,
        };
    }
  };

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4">
      {/* 🎯 হেডিং সেকশন */}
      <DashboardHeading
        title="My Orders"
        description="Manage and track your purchased items, view real-time shipping status, or cancel items before dispatch."
      />

      {/* 📋 কাস্টম গ্লাস-মরফিজম টেবিল কন্টেইনার */}
      <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    Loading your orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No orders found. Start shopping!
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const styles = getStatusStyles(order.status);
                  const isCancellable =
                    order.status === "Pending" || order.status === "Accepted";

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-900/30 transition-colors group"
                    >
                      <td className="p-4 pl-6 font-mono text-cyan-400 text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4 text-slate-300">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        ৳ {order.totalAmount}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles.bg}`}
                        >
                          {styles.icon}
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-center gap-3">
                          {/* ডিটেইলস ভিউ বাটন */}
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all"
                            title="View Details"
                          >
                            <FaEye size={16} />
                          </button>

                          {/* ক্যানসেল বাটন কন্ডিশনাল লজিক */}
                          <button
                            onClick={() =>
                              isCancellable && handleCancelOrder(order._id)
                            }
                            disabled={!isCancellable || actionLoading}
                            className={`p-2 rounded-xl transition-all ${
                              isCancellable
                                ? "text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                : "text-slate-700 cursor-not-allowed"
                            }`}
                            title={
                              isCancellable ? "Cancel Order" : "Cannot Cancel"
                            }
                          >
                            <FaTimesCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔍 কাস্টম পিউর টেলউইন্ড মোডাল (Pure Tailwind Modal) */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* ব্যাকড্রপ ব্লার লেয়ার */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* মোডাল উইন্ডো */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 text-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* হেডার */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
                <FaShoppingBag />
                <h3>
                  Order Details ( #{selectedOrder._id.slice(-8).toUpperCase()} )
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* মোডাল বডি */}
            <div className="p-6 space-y-6">
              {/* স্ট্যাটাস ও পেমেন্ট সেকশন */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 gap-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Current Status
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(selectedOrder.status).bg}`}
                    >
                      {getStatusStyles(selectedOrder.status).icon}
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider text-left sm:text-right">
                    Payment Status
                  </p>
                  <p
                    className={`text-sm font-bold mt-1 ${selectedOrder.paymentStatus === "Paid" ? "text-emerald-400" : "text-amber-500"}`}
                  >
                    {selectedOrder.paymentStatus || "Pending"}
                  </p>
                </div>
              </div>

              {/* প্রোডাক্ট আইটেমসমূহ */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Items Ordered
                </h4>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                  {selectedOrder.products?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-950/20 border border-slate-800/40 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-800"
                          />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-200 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            Quantity: {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-300">
                        ৳ {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* অ্যাড্রেস ও ট্রানজেকশন আইডি গ্রিড */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/20 p-4 rounded-xl border border-slate-800/30">
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wider">
                    Shipping Address
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedOrder.shippingAddress || "No address provided."}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wider">
                    Transaction ID
                  </p>
                  <p className="text-cyan-400 font-mono select-all bg-slate-950/50 p-1 px-2 rounded border border-slate-800 inline-block mt-0.5">
                    {selectedOrder.transactionId || "N/A"}
                  </p>
                </div>
              </div>

              {/* গ্র্যান্ড টোটাল */}
              <div className="flex justify-end text-right items-center gap-4 border-t border-dashed border-slate-800 pt-4">
                <span className="text-slate-400 text-sm">Grand Total:</span>
                <span className="text-2xl font-black text-emerald-400">
                  ৳ {selectedOrder.totalAmount}
                </span>
              </div>
            </div>

            {/* ফুটার অ্যাকশন বাটন */}
            <div className="p-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-sm font-medium transition-all"
              >
                Close
              </button>

              {/* কন্ডিশনাল ক্যানসেল বাটন */}
              {(selectedOrder.status === "Pending" ||
                selectedOrder.status === "Accepted") && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-950/20 hover:opacity-90 transition-all"
                >
                  {actionLoading ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
