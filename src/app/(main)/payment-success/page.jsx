"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faShoppingBag, faList, faSpinner } from "@fortawesome/free-solid-svg-icons";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 text-center space-y-6"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-primary" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-on-surface font-display">Payment Successful!</h1>
        <p className="text-sm text-on-surface-variant font-sans">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      {sessionId && (
        <div className="bg-surface rounded-xl p-4 border border-outline-variant/20">
          <p className="text-xs text-outline uppercase tracking-wider font-sans mb-1">Transaction ID</p>
          <p className="text-sm font-mono text-on-surface break-all">{sessionId}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        <Link href="/dashboard/buyer/orders">
          <Button className="w-full bg-primary text-on-primary font-semibold h-11 rounded-[8px] shadow-sm font-sans">
            <FontAwesomeIcon icon={faList} className="mr-2" />
            View My Orders
          </Button>
        </Link>
        <Link href="/products">
          <Button
            variant="bordered"
            className="w-full border-outline text-on-surface-variant font-semibold h-11 rounded-[8px] font-sans"
          >
            <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <section className="min-h-screen bg-surface flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-primary" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </section>
  );
}
