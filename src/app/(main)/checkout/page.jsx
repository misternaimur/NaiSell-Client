"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/lib/auth-client";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const productId = searchParams.get("productId");
  const quantity = parseInt(searchParams.get("quantity") || "1");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user?.email) {
      router.push("/auth/login");
      return;
    }
    if (!productId) {
      router.push("/products");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL }/api/products/${productId}`,
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, session, router]);

  const handleCheckout = async () => {
    setProcessing(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.session?.token || ""}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
          buyerEmail: session.user.email,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || "Failed to create checkout session.");
        setProcessing(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-2xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-surface-container-high rounded w-48" />
          <div className="h-48 bg-surface-container-high rounded-2xl" />
          <div className="h-12 bg-surface-container-high rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-on-surface font-display">Product Not Found</h2>
          <Link href="/products">
            <Button className="bg-primary text-on-primary font-sans">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const total = product.price * quantity;

  return (
    <section className="min-h-screen bg-surface py-8 md:py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-6 font-sans cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-2xl font-bold text-on-surface font-display">Checkout</h1>

          {/* Order Summary */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider font-sans">Order Summary</h2>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container-high flex-shrink-0">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate font-sans">{product.title}</p>
                <p className="text-xs text-outline font-sans">{product.category} · {product.condition}</p>
                <p className="text-xs text-on-surface-variant font-sans mt-1">Qty: {quantity}</p>
              </div>
              <p className="text-lg font-extrabold text-on-surface font-display">
                ৳{total.toLocaleString()}
              </p>
            </div>

            <div className="border-t border-outline-variant/20 pt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-on-surface font-sans">Total</span>
              <span className="text-xl font-extrabold text-primary font-display">৳{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider font-sans">Payment Method</h2>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <FontAwesomeIcon icon={faLock} className="text-primary" />
              <div>
                <p className="text-sm font-bold text-on-surface font-sans">Stripe Secure Payment</p>
                <p className="text-xs text-outline font-sans">Your payment info is encrypted and secure</p>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-error font-sans text-center">{error}</p>
          )}

          <Button
            onClick={handleCheckout}
            disabled={processing}
            className="w-full bg-primary text-on-primary font-semibold h-12 rounded-2xl shadow-sm hover:bg-primary/95 transition-all font-sans"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Processing...
              </span>
            ) : (
              `Pay ৳${total.toLocaleString()}`
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
