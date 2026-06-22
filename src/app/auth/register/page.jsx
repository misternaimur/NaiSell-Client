/** @format */

"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faUserTag,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { authClient } from "../../../lib/auth-client"; // path to your auth-client file
import { toast } from "react-toastify"; // 👈 react-toastify ইম্পোর্ট করা হলো

export default function RegisterForm() {
  // useForm ইনিশিয়ালাইজেশন
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

  // onSubmit ফাংশন
  const onSubmit = async (data) => {
   
    const toastId = toast.loading("Creating your account... Please wait.");

    try {
      const { data: signupData, error: signupError } =
        await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
        });

      if (signupError) {
        
        toast.update(toastId, {
          render: signupError.message || "Signup failed!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        console.log("Signup Error:", signupError.message);
      } else {
       
        toast.update(toastId, {
          render: "Registration Successful! Welcome to Loom & Ledger.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        console.log("Signup Response:", signupData);
        reset(); 
      }
    } catch (err) {
    
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
    <div className="flex min-h-screen items-center justify-center bg-[#f7faf6] px-4 py-12 font-['Inter']">
      <Card className="w-full max-w-md rounded-2xl border border-[#bec9c2] bg-white p-8 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        <Card.Header className="flex flex-col items-center gap-1.5 pb-6 text-center">
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-[#181d1a]">
            Create an Account
          </h1>
          <p className="text-sm text-[#3f4943]">
            Join Loom & Ledger curated marketplace
          </p>
        </Card.Header>

        <Card.Content>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* User Name Field */}
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
                  <Label className="text-sm font-medium text-[#3f4943]">
                    User Name
                  </Label>
                  <div className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="absolute left-3.5 text-[#6f7a73] text-sm z-10"
                    />
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-3 py-2 bg-[#f1f5f0] border border-[#bec9c2] rounded-[8px] text-[#181d1a] placeholder-[#6f7a73] hover:border-[#6f7a73] focus:outline-none focus:border-[#00543c] transition-colors text-sm"
                    />
                  </div>
                  <FieldError className="text-xs text-[#ba1a1a] mt-1">
                    {errors.name?.message}
                  </FieldError>
                </TextField>
              )}
            />

            {/* Email Field */}
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
                  <Label className="text-sm font-medium text-[#3f4943]">
                    Email Address
                  </Label>
                  <div className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-3.5 text-[#6f7a73] text-sm z-10"
                    />
                    <Input
                      {...field}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-3 py-2 bg-[#f1f5f0] border border-[#bec9c2] rounded-[8px] text-[#181d1a] placeholder-[#6f7a73] hover:border-[#6f7a73] focus:outline-none focus:border-[#00543c] transition-colors text-sm"
                    />
                  </div>
                  <FieldError className="text-xs text-[#ba1a1a] mt-1">
                    {errors.email?.message}
                  </FieldError>
                </TextField>
              )}
            />

            {/* Password Field */}
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
                  <Label className="text-sm font-medium text-[#3f4943]">
                    Password
                  </Label>
                  <div className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-3.5 text-[#6f7a73] text-sm z-10"
                    />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-3 py-2 bg-[#f1f5f0] border border-[#bec9c2] rounded-[8px] text-[#181d1a] placeholder-[#6f7a73] hover:border-[#6f7a73] focus:outline-none focus:border-[#00543c] transition-colors text-sm"
                    />
                  </div>
                  <Description className="text-xs text-[#3f4943]/70 mt-1">
                    Must be at least 8 characters with 1 uppercase and 1 number
                  </Description>
                  <FieldError className="text-xs text-[#ba1a1a] mt-1">
                    {errors.password?.message}
                  </FieldError>
                </TextField>
              )}
            />

            {/* Role Select Field */}
            <Controller
              name="role"
              control={control}
              rules={{ required: "Please select a role" }}
              render={({ field: { onChange, value } }) => (
                <div className="flex flex-col gap-1.5 w-full">
                  <Label className="text-sm font-medium text-[#3f4943]">
                    Select Role
                  </Label>
                  <Select
                    placeholder="Choose your role"
                    className="w-full"
                    selectedKey={value}
                    onSelectionChange={onChange}
                    aria-label="Select your role"
                  >
                    <Select.Trigger className="w-full flex items-center gap-2 px-3.5 py-2 bg-[#f1f5f0] border border-[#bec9c2] rounded-[8px] text-[#181d1a] hover:border-[#6f7a73] data-[focus=true]:border-[#00543c] transition-colors text-sm">
                      <FontAwesomeIcon
                        icon={faUserTag}
                        className="text-[#6f7a73] text-sm"
                      />
                      <Select.Value />
                      <Select.Indicator className="ml-auto text-[#6f7a73]" />
                    </Select.Trigger>

                    <Select.Popover className="border border-[#bec9c2] bg-white rounded-lg shadow-xl p-1 text-[#181d1a]">
                      <ListBox>
                        <ListBox.Item
                          id="buyer"
                          textValue="Buyer"
                          className="px-3 py-2 rounded-md hover:bg-[#ebefea] cursor-pointer text-sm font-medium text-[#181d1a]"
                        >
                          Buyer
                        </ListBox.Item>
                        <ListBox.Item
                          id="seller"
                          textValue="Seller"
                          className="px-3 py-2 rounded-md hover:bg-[#ebefea] cursor-pointer text-sm font-medium text-[#181d1a]"
                        >
                          Seller
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                  {errors.role && (
                    <span className="text-xs text-[#ba1a1a] mt-1">
                      {errors.role.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Primary Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-[#00543c] hover:bg-[#0f6e51] text-white font-semibold py-2.5 rounded-[8px] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faCheck} />
              {isSubmitting ? "Registering..." : "Register"}
            </Button>

            {/* Divider */}
            <div className="flex items-center my-1">
              <div className="flex-1 border-t border-[#bec9c2]"></div>
              <span className="px-3 text-xs text-[#6f7a73] uppercase font-semibold tracking-wider">
                Or
              </span>
              <div className="flex-1 border-t border-[#bec9c2]"></div>
            </div>

            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="bordered"
              aria-label="Sign up with Google"
              className="w-full border border-[#bec9c2] hover:border-[#6f7a73] text-[#181d1a] font-medium py-2.5 rounded-[8px] bg-white hover:bg-[#f1f5f0] transition-all text-sm flex items-center justify-center gap-2.5"
            >
              <FontAwesomeIcon
                icon={faGoogle}
                className="text-base text-[#00543c]"
              />
              Sign in with Google
            </Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
