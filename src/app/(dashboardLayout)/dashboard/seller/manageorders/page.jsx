/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeading from "@/components/DashboardHeading";
import {
  getSellerIncomingOrders,
  updateOrderStatus,
} from "@/lib/api/sellerActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faUser,
  faTruck,
  faBoxOpen,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const ManageOrdersPage = () => {
  // গ্লোবাল স্টেটস
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const { data: session } = useSession();
  const sellerEmail = session?.user?.email || "";

  useEffect(() => {
    if (!sellerEmail) return;
    let isMounted = true;
    const load = async () => {
      if (isMounted) setLoading(true);
      try {
        const data = await getSellerIncomingOrders(sellerEmail);
        if (isMounted) {
          if (data && Array.isArray(data)) {
            setOrders(data);
          } else if (data && Array.isArray(data.result)) {
            setOrders(data.result);
          } else if (data && data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          } else {
            setOrders([]);
          }
        }
      } catch (error) {
        console.error("Error fetching incoming orders:", error);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [sellerEmail]);

  // 🔄 ২. UPDATE STATUS - ডাটাবেজে অর্ডারের স্ট্যাটাস পরিবর্তন করা
  const handleStatusUpdate = async (orderId, currentStatus, action) => {
    let nextStatus = currentStatus;

    // ১. পরবর্তী স্ট্যাটাস নির্ধারণ করার লজিক
    if (action === "REJECT") {
      if (!confirm("Are you sure you want to reject this order permanently?"))
        return;
      nextStatus = "Rejected";
    } else if (action === "NEXT") {
      switch (currentStatus) {
        case "Pending":
          nextStatus = "Accepted";
          break;
        case "Accepted":
          nextStatus = "Processing";
          break;
        case "Processing":
          nextStatus = "Shipped";
          break;
        case "Shipped":
          nextStatus = "Delivered";
          break;
        default:
          return;
      }
    }

    try {
      // ২. API কল করা হচ্ছে
      const res = await updateOrderStatus(orderId, nextStatus);

      if (res && (res.success || res.acknowledged || res.modifiedCount > 0)) {
        alert("🎉 Order status updated successfully in database!");

        // পেজ রিফ্রেশ ছাড়া টেবিলে নতুন স্ট্যাটাস রিফ্লেক্ট করার জন্য স্টেট সিঙ্ক
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId || order.id === orderId
              ? { ...order, status: nextStatus }
              : order,
          ),
        );
      } else {
        alert(`❌ Update failed: ${res?.message || "No changes made"}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("❌ Something went wrong while saving status to database.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Accepted":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Processing":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "Shipped":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <div className="space-y-8 mt-6 pb-12 text-on-background max-w-6xl mx-auto px-4 sm:px-0">
      <DashboardHeading
        title="Manage Orders"
        description="Track and process your incoming customer orders. Update order steps from processing through successful delivery."
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-500 border-t-transparent"></span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/20 border border-slate-800 rounded-2xl">
          <p className="text-slate-400">
            No incoming orders found in your database at the moment.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4">Order ID</th>
                <th className="p-4">Product</th>
                <th className="p-4">Total Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Buyer Info</th>
                <th className="p-4 text-center">Order Actions Flow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {orders.map((order) => {
                const currentId = order._id || order.id;
                return (
                  <tr
                    key={currentId}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4 font-mono text-cyan-400 font-semibold">
                      {currentId}
                    </td>
                    <td className="p-4 font-medium text-slate-200">
                      {order.productTitle}
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      ৳ {order.price?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${getStatusBadgeClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedBuyer(order.buyer)}
                        className="inline-flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors border border-slate-700/50"
                      >
                        <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                        View Customer
                      </button>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {order.status === "Pending" && (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                currentId,
                                order.status,
                                "NEXT",
                              )
                            }
                            className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition-all border border-emerald-500/30 w-8 h-8 flex items-center justify-center"
                            title="Accept Order"
                          >
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="w-3.5 h-3.5"
                            />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                currentId,
                                order.status,
                                "REJECT",
                              )
                            }
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-all border border-rose-500/30 w-8 h-8 flex items-center justify-center"
                            title="Reject Order"
                          >
                            <FontAwesomeIcon
                              icon={faXmark}
                              className="w-3.5 h-3.5"
                            />
                          </button>
                        </div>
                      )}

                      {order.status === "Accepted" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(currentId, order.status, "NEXT")
                          }
                          className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
                        >
                          Start Processing
                        </button>
                      )}

                      {order.status === "Processing" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(currentId, order.status, "NEXT")
                          }
                          className="text-xs bg-primary hover:bg-primary-container px-3 py-1.5 rounded-lg text-on-primary font-medium inline-flex items-center gap-1.5 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTruck} className="w-3 h-3" />{" "}
                          Ship Package
                        </button>
                      )}

                      {order.status === "Shipped" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(currentId, order.status, "NEXT")
                          }
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-white font-medium inline-flex items-center gap-1.5 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faBoxOpen}
                            className="w-3 h-3"
                          />{" "}
                          Mark Delivered
                        </button>
                      )}

                      {order.status === "Delivered" && (
                        <span className="text-emerald-400 text-xs font-semibold inline-flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="w-3.5 h-3.5"
                          />{" "}
                          Order Complete
                        </span>
                      )}

                      {order.status === "Rejected" && (
                        <span className="text-slate-500 text-xs line-through bg-slate-800/40 px-2.5 py-1 rounded-full border border-slate-700/30">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-md font-bold text-slate-200 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-cyan-400 w-3.5 h-3.5"
                />{" "}
                Customer Shipping Info
              </h3>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Full Name
                </label>
                <p className="text-slate-200 font-medium mt-0.5">
                  {selectedBuyer.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Email Address
                </label>
                <p className="text-slate-200 mt-0.5 font-mono text-xs">
                  {selectedBuyer.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Phone Number
                </label>
                <p className="text-slate-200 mt-0.5 font-mono text-xs">
                  {selectedBuyer.phone || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Delivery Address
                </label>
                <p className="text-slate-300 mt-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed text-xs">
                  {selectedBuyer.address || "No address provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBuyer(null)}
                className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;
