/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCheckCircle,
  faArrowLeft,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/lib/auth-client";
import { addToWishlist } from "@/lib/api/buyerActions";
import { getAuthHeaders } from "@/lib/api/server";

const getConditionStyle = (condition) => {
  switch (condition?.toLowerCase()) {
    case "pristine":
      return "bg-primary/10 text-primary border border-primary/20";
    case "like new":
      return "bg-secondary-container/20 text-secondary-container border border-secondary-container/30";
    case "refurbished":
      return "bg-tertiary-container/20 text-on-tertiary-container border border-tertiary-container/30";
    case "good":
    default:
      return "bg-outline-variant/30 text-outline border border-outline-variant/40";
  }
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const productId = params?.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${productId}`,
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reviews/${productId}`,
        );
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  const handleWishlist = async () => {
    if (!session) return router.push("/auth/login");
    try {
      await addToWishlist({
        buyerEmail: session.user.email,
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        sellerEmail: product.sellerEmail,
      });
      setWishlisted(true);
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  };

  const handleBuyNow = () => {
    if (!session) return router.push("/auth/login");
    router.push(`/checkout?productId=${product._id}&quantity=1`);
  };

  const handleSubmitReview = async () => {
    if (!session) return router.push("/auth/login");
    if (!newReview.comment.trim()) return;
    setSubmittingReview(true);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({
            productId: productId,
            reviewerInfo: {
              userId: session.user.email,
              name: session.user.name || "User",
            },
            rating: newReview.rating,
            comment: newReview.comment,
          }),
        },
      );
      if (res.ok) {
        setNewReview({ rating: 5, comment: "" });
        const updated = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/reviews/${productId}`,
        );
        const data = await updated.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-surface-container-high rounded w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square bg-surface-container-high rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-surface-container-high rounded w-3/4" />
              <div className="h-4 bg-surface-container-high rounded w-1/2" />
              <div className="h-10 bg-surface-container-high rounded w-1/3 mt-6" />
              <div className="h-24 bg-surface-container-high rounded mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-on-surface font-display">
            Product Not Found
          </h2>
          <p className="text-on-surface-variant font-sans">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/products">
            <Button className="bg-primary text-on-primary font-sans">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-surface py-8 md:py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-6 font-sans cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container-lowest relative">
              {product.images?.[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title || "Product Image"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer relative ${
                      selectedImage === i
                        ? "border-primary"
                        : "border-outline-variant/30"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title || "Product"} thumbnail ${i + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Category & Condition */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider font-sans">
                {product.category}
              </span>
              <span className="text-outline">·</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getConditionStyle(product.condition)}`}
              >
                {product.condition}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-on-surface font-display">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary font-display">
                ৳{product.price?.toLocaleString()}
              </span>
            </div>

            {/* Seller Info */}
            {product.sellerInfo && (
              <div className="flex items-center gap-3 py-4 border-y border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-primary"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface font-sans">
                    {product.sellerInfo.name}
                  </p>
                  <p className="text-xs text-outline font-sans">
                    Verified Seller
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider font-sans">
                Description
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <p className="text-sm text-on-surface-variant font-sans">
                <span className="font-semibold text-on-surface">Stock:</span>{" "}
                {product.stock} available
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                onClick={handleBuyNow}
                className="bg-primary text-on-primary font-semibold px-8 h-12 rounded-2xl shadow-sm hover:bg-primary/95 transition-all font-sans flex-1 sm:flex-none"
              >
                Buy Now
              </Button>
              <Button
                onClick={handleWishlist}
                variant="bordered"
                className={`border-outline font-semibold px-6 h-12 rounded-2xl transition-all font-sans ${
                  wishlisted
                    ? "bg-primary/10 text-primary border-primary"
                    : "text-on-surface-variant hover:bg-on-surface/5"
                }`}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={wishlisted ? "text-primary" : ""}
                />
                <span className="ml-2">
                  {wishlisted ? "Wishlisted" : "Add to Wishlist"}
                </span>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-bold text-on-surface font-display">
            Reviews ({reviews.length})
          </h2>

          {/* Review Form */}
          {session && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface font-sans">
                  Your Rating:
                </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setNewReview((prev) => ({ ...prev, rating: star }))
                    }
                    className="cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faStar}
                      className={`w-5 h-5 ${star <= newReview.rating ? "text-secondary-container" : "text-outline-variant"}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Write your review..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-sans focus:outline-none focus:border-primary transition resize-none"
              />
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview || !newReview.comment.trim()}
                className="bg-primary text-on-primary font-semibold px-6 h-10 rounded-2xl text-sm font-sans"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-on-surface-variant text-sm font-sans">
              No reviews yet. Be the first to review this product.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-on-surface font-sans">
                        {review.reviewerInfo?.name || "User"}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FontAwesomeIcon
                            key={s}
                            icon={faStar}
                            className={`w-3 h-3 ${s <= (review.rating || 5) ? "text-secondary-container" : "text-outline-variant"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-outline font-sans">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-sans">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
