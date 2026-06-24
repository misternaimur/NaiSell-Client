/** @format */
"use client";

import { useState, useEffect } from "react";
import DashboardHeading from "@/components/DashboardHeading";
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  useEffect(() => {
    // ডামি অর্ডার ডেটা সেটআপ (আপনার ব্যাকএন্ড API এর সাথে কানেক্ট করতে পারবেন)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders([
      {
        id: "ORD-9821",
        productTitle: "iPhone 13 Pro Max",
        price: 85000,
        status: "Pending",
        date: "24 June, 2026",
        buyer: {
          name: "Anisur Rahman",
          email: "anis@gmail.com",
          phone: "+8801712345678",
          address: "Mirpur 10, Dhaka",
        },
      },
      {
        id: "ORD-4412",
        productTitle: "Mechanical Keyboard",
        price: 4500,
        status: "Accepted",
        date: "23 June, 2026",
        buyer: {
          name: "Farhana Yasmin",
          email: "farhana@yahoo.com",
          phone: "+8801987654321",
          address: "Halishahar, Chattogram",
        },
      },
      {
        id: "ORD-1205",
        productTitle: "Premium Leather Jacket",
        price: 6200,
        status: "Shipped",
        date: "20 June, 2026",
        buyer: {
          name: "Rakib Hasan",
          email: "rakib@outlook.com",
          phone: "+8801555443322",
          address: "Zindabazar, Sylhet",
        },
      },
    ]);
    setLoading(false);
  }, []);

  // অর্ডার স্ট্যাটাস আপডেট ফ্লো হ্যান্ডলার (Pending → Accepted → Processing → Shipped → Delivered)
  const handleStatusUpdate = (orderId, currentStatus, action) => {
    let nextStatus = currentStatus;

    if (action === "REJECT") {
      if (!confirm("Are you sure you want to reject this order?")) return;
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

    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order,
      ),
    );
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
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <div className="space-y-8 mt-6 pb-12 text-white max-w-6xl mx-auto px-4 sm:px-0">
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
            No incoming orders found at the moment.
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
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 font-mono text-cyan-400 font-semibold">
                    {order.id}
                  </td>
                  <td className="p-4 font-medium text-slate-200">
                    {order.productTitle}
                  </td>
                  <td className="p-4 font-semibold text-slate-300">
                    ৳ {order.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${getStatusBadgeClass(order.status)}`}
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
                            handleStatusUpdate(order.id, order.status, "NEXT")
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
                            handleStatusUpdate(order.id, order.status, "REJECT")
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
                          handleStatusUpdate(order.id, order.status, "NEXT")
                        }
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
                      >
                        Start Processing
                      </button>
                    )}

                    {order.status === "Processing" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order.id, order.status, "NEXT")
                        }
                        className="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-white font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTruck} className="w-3 h-3" />{" "}
                        Ship Package
                      </button>
                    )}

                    {order.status === "Shipped" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order.id, order.status, "NEXT")
                        }
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-white font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <FontAwesomeIcon icon={faBoxOpen} className="w-3 h-3" />{" "}
                        Mark Delivered
                      </button>
                    )}

                    {order.status === "Delivered" && (
                      <span className="text-emerald-400 text-xs font-semibold inline-flex items-center gap-1.5">
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="w-3.5 h-3.5"
                        />{" "}
                        Order Complete
                      </span>
                    )}

                    {order.status === "Rejected" && (
                      <span className="text-slate-500 text-xs line-through">
                        Cancelled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-cyan-400 w-4 h-4"
                />{" "}
                Customer Shipping Info
              </h3>
              <button
                onClick={() => setSelectedBuyer(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  Full Name
                </label>
                <p className="text-slate-200 font-medium mt-0.5">
                  {selectedBuyer.name}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  Email Address
                </label>
                <p className="text-slate-200 mt-0.5 font-mono">
                  {selectedBuyer.email}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  Phone Number
                </label>
                <p className="text-slate-200 mt-0.5 font-mono">
                  {selectedBuyer.phone}
                </p>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  Delivery Address
                </label>
                <p className="text-slate-300 mt-0.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {selectedBuyer.address}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBuyer(null)}
                className="w-full px-5 h-10 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-xl transition-colors"
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
