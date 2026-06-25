/** @format */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardHeading from "@/components/DashboardHeading";
import { getBuyerPaymentHistory } from "@/lib/api/buyerActions";
import {
  FaCreditCard,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaReceipt,
} from "react-icons/fa";

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const buyerEmail = session?.user?.email || "";

  useEffect(() => {
    if (!buyerEmail) return;
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getBuyerPaymentHistory(buyerEmail);
        const paymentsData = Array.isArray(data)
          ? data
          : Array.isArray(data?.result)
            ? data.result
            : [];

        if (isMounted) setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        if (isMounted) setPayments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [buyerEmail]);

  // 🎨 পেমেন্ট স্ট্যাটাস অনুযায়ী ডাইনামিক স্টাইল
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
      case "success":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: <FaCheckCircle className="inline mr-1" />,
        };
      case "pending":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: <FaClock className="inline mr-1" />,
        };
      case "failed":
      case "cancelled":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          icon: <FaTimesCircle className="inline mr-1" />,
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
        title="Payment History"
        description="Monitor all your transaction records, billing amounts, method of payment, and official statements."
      />

      {/* 📋 পেমেন্ট রেকর্ড টেবিল */}
      <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="p-4 pl-6">Transaction ID</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Amount</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    Loading payment history...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FaReceipt size={32} className="text-slate-700" />
                      <p>No transactions found for this account.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const statusStyle = getStatusStyles(payment.status);

                  return (
                    <tr
                      key={payment._id || payment.transactionId}
                      className="hover:bg-slate-900/30 transition-colors"
                    >
                      {/* ট্রানজেকশন আইডি */}
                      <td className="p-4 pl-6 font-mono text-cyan-400 text-xs select-all">
                        {payment.transactionId
                          ? payment.transactionId.toUpperCase()
                          : "N/A"}
                      </td>

                      {/* পেমেন্ট মেথড (bKash, SSLCommerz, Card ইত্যাদি) */}
                      <td className="p-4 text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                          <FaCreditCard className="text-slate-500 text-xs" />
                          <span>{payment.method || "Online Payment"}</span>
                        </div>
                      </td>

                      {/* পেমেন্ট তারিখ */}
                      <td className="p-4 text-slate-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-slate-600" />
                          <span>
                            {payment.date
                              ? new Date(payment.date).toLocaleString("en-US", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* মোট টাকা */}
                      <td className="p-4 font-black text-emerald-400 text-base">
                        ৳ {payment.amount}
                      </td>

                      {/* স্ট্যাটাস ব্যাজ */}
                      <td className="p-4 pr-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyle.bg}`}
                        >
                          {statusStyle.icon}
                          {payment.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
