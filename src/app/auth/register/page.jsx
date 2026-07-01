/** @format */

"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
// HeroUI (বা NextUI) থেকে প্রয়োজনীয় UI কম্পোনেন্টগুলো ইমপোর্ট করা হয়েছে
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Description,
  Select,
  ListBox,
  Button,
  Card,
} from "@heroui/react";
// আইকন ব্যবহারের জন্য FontAwesome ইমপোর্ট করা হয়েছে
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faUserTag,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { authClient } from "../../../lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // ফিক্স: router ব্যবহারের জন্য useRouter ইমপোর্ট করা হলো

export default function RegisterForm() {
  const router = useRouter(); // ফিক্স: useRouter হুক ইনিশিয়েট করা হলো

  // react-hook-form এর মাধ্যমে ফর্ম স্টেট ও ভ্যালিডেশন হ্যান্ডেল করা হচ্ছে
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  // ইমেইল এবং পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন করার সাবমিট ফাংশন
  const onSubmit = async (data) => {
    // লোডিং টোস্ট মেসেজ শুরু
    const toastId = toast.loading("Creating your account... Please wait.");

    try {
      // authClient এর মাধ্যমে সাইন-আপ রিকোয়েস্ট পাঠানো
      const { data: signupData, error: signupError } =
        await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
        });

      // সাইন-আপে কোনো এরর থাকলে টোস্ট আপডেট ও এরর শো করা
      if (signupError) {
        toast.update(toastId, {
          render: signupError.message || "Signup failed!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        console.log("Signup Error:", signupError.message);
      } else {
        // সাইন-আপ সফল হলে সফলতার টোস্ট মেসেজ দেখানো
        toast.update(toastId, {
          render: "Registration Successful! Welcome to NaiSell Hub.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        console.log("Signup Response:", signupData);
        reset(); // ফর্মের সকল ইনপুট ফিল্ড খালি বা রিসেট করা

        // ইউজারের রোল (seller/buyer) অনুযায়ী নির্দিষ্ট ড্যাশবোর্ডে রিডাইরেক্ট করা
        const role = signupData?.user?.role;
        if (role === "seller") {
          router.push("/dashboard/seller");
        } else if (role === "buyer") {
          router.push("/dashboard/buyer");
        }
      }
    } catch (err) {
      // কোনো অপ্রত্যাশিত বা নেটওয়ার্ক এরর হলে তা হ্যান্ডেল করা
      toast.update(toastId, {
        render: "An unexpected error occurred. Try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 font-sans">
      {/* মেইন ফর্ম কার্ড কন্টেইনার */}
      <Card className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        {/* ফর্ম হেডার অংশ */}
        <div className="flex flex-col items-center gap-1.5 pb-6 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-on-surface mt-4">
            Create an Account
          </h1>
          <p className="text-sm text-on-surface-variant font-sans">
            Join NaiSell Hub curated marketplace
          </p>
        </div>

        {/* গুগল দিয়ে সরাসরি লগইন করার বাটন */}
        <div className="w-full mb-5">
          <Button
            type="button"
            variant="bordered"
            onClick={async () => {
              const toastId = toast.loading("Connecting to Google...");
              try {
                // গুগলের সোশ্যাল লগইন সার্ভিস কল করা
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
              } catch (err) {
                console.error("Google login error:", err);
                toast.update(toastId, {
                  render: err.message || "Google login failed",
                  type: "error",
                  isLoading: false,
                  autoClose: 3000,
                });
              }
            }}
            className="w-full border border-outline-variant hover:border-outline text-on-surface font-medium h-11 rounded-[8px] bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 text-sm flex items-center justify-center gap-2.5"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className="text-base text-primary"
            />
            Log in with Google
          </Button>
        </div>

        {/* মেইন ইনপুট ফর্ম */}
        <div>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* ১. ইউজার নাম ইনপুট ফিল্ড */}
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  isInvalid={!!errors.name}
                  className="flex flex-col gap-1.5 w-full"
                >
                  <Label className="text-sm font-medium text-on-surface-variant font-sans">
                    User Name
                  </Label>
                  <div className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="absolute left-3.5 text-outline text-sm z-10"
                    />
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-[8px] text-on-surface placeholder-outline hover:border-outline focus:outline-none focus:border-primary transition-colors text-sm font-sans"
                    />
                  </div>
                  <FieldError className="text-xs text-error mt-1">
                    {errors.name?.message}
                  </FieldError>
                </TextField>
              )}
            />

            {/* ২. ইমেইল এড্রেস ইনপুট ফিল্ড */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              }}
              render={({ field }) => (
                <TextField
                  isInvalid={!!errors.email}
                  className="flex flex-col gap-1.5 w-full"
                >
                  <Label className="text-sm font-medium text-on-surface-variant font-sans">
                    Email Address
                  </Label>
                  <div className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-3.5 text-outline text-sm z-10"
                    />
                    <Input
                      {...field}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-[8px] text-on-surface placeholder-outline hover:border-outline focus:outline-none focus:border-primary transition-colors text-sm font-sans"
                    />
                  </div>
                  <FieldError className="text-xs text-error mt-1">
                    {errors.email?.message}
                  </FieldError>
                </TextField>
              )}
            />

            {/* ৩. পাসওয়ার্ড ইনপুট ফিল্ড (ভ্যালিডেশন সহ) */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasUppercase: (v) =>
                    /[A-Z]/.test(v) ||
                    "Must contain at least one uppercase letter",
                  hasNumber: (v) =>
                    /[0-9]/.test(v) || "Must contain at least one number",
                },
              }}
              render={({ field }) => (
                <TextField
                  isInvalid={!!errors.password}
                  className="flex flex-col gap-1.5 w-full"
                >
                  <Label className="text-sm font-medium text-on-surface-variant font-sans">
                    Password
                  </Label>
                  <div className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-3.5 text-outline text-sm z-10"
                    />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-[8px] text-on-surface placeholder-outline hover:border-outline focus:outline-none focus:border-primary transition-colors text-sm font-sans"
                    />
                  </div>
                  <Description className="text-xs text-on-surface-variant/70 mt-1 font-sans">
                    Must be at least 8 characters with 1 uppercase and 1 number
                  </Description>
                  <FieldError className="text-xs text-error mt-1">
                    {errors.password?.message}
                  </FieldError>
                </TextField>
              )}
            />

            {/* ৪. রোল সিলেক্ট ফিল্ড (Buyer বা Seller সিলেক্ট করার জন্য) */}
            <Controller
              name="role"
              control={control}
              rules={{ required: "Please select a role" }}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col gap-1.5 w-full">
                  <Label className="text-sm font-medium text-on-surface-variant font-sans">
                    Select Role
                  </Label>
                  <Select
                    placeholder="Choose your role"
                    className="w-full font-sans"
                    selectedKey={value}
                    onSelectionChange={onChange}
                    aria-label="Select your role"
                  >
                    {/* ড্রপডাউন ট্রিগার বাটন */}
                    <Select.Trigger className="w-full flex items-center gap-2 px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-[8px] text-on-surface hover:border-outline data-[focus=true]:border-primary transition-colors text-sm font-sans">
                      <FontAwesomeIcon
                        icon={faUserTag}
                        className="text-outline text-sm font-sans"
                      />
                      <Select.Value />
                      <Select.Indicator className="ml-auto text-outline" />
                    </Select.Trigger>

                    {/* ড্রপডাউন অপশন লিস্ট */}
                    <Select.Popover className="border border-outline-variant bg-surface-container-lowest rounded-lg shadow-xl p-1 text-on-surface">
                      <ListBox>
                        <ListBox.Item
                          id="buyer"
                          textValue="Buyer"
                          className="px-3 py-2 rounded-md hover:bg-surface-container cursor-pointer text-sm font-medium text-on-surface font-sans"
                        >
                          Buyer
                        </ListBox.Item>
                        <ListBox.Item
                          id="seller"
                          textValue="Seller"
                          className="px-3 py-2 rounded-md hover:bg-surface-container cursor-pointer text-sm font-medium text-on-surface font-sans"
                        >
                          Seller
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                  {errors.role && (
                    <span className="text-xs text-error mt-1 font-sans">
                      {errors.role.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* ফর্ম সাবমিট করার মেইন বাটন */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-primary hover:bg-primary-container text-on-primary font-semibold py-2.5 rounded-[8px] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed font-sans"
            >
              <FontAwesomeIcon icon={faCheck} />
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}
