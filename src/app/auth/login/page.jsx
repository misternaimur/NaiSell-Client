"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  Button,
  Link,
  TextField,
  Label,
  Input,
  Form,
  FieldError,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { authClient } from "../../../lib/auth-client";
import { toast } from "react-toastify";

export default function SigninPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading("Signing in... Please wait.");

    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            toast.update(toastId, {
              render: "Logged in successfully! Welcome back.",
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            reset();
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          },
          onError: (ctx) => {
            setIsLoading(false);
            toast.update(toastId, {
              render: ctx.error.message || "Invalid email or password.",
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          },
        },
      );
    } catch (err) {
      console.error("Signin failed:", err);
      setIsLoading(false);
      toast.update(toastId, {
        render: "Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleGoogleSignin = async () => {
    const toastId = toast.loading("Connecting to Google...");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google signin error:", err);
      toast.update(toastId, {
        render: "Google authentication failed.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 relative overflow-hidden font-sans">
      {/* Background Subtle Brand Gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="w-full p-6 sm:p-8 bg-white border border-outline-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-1.5 pb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-display">
              Welcome Back
            </h1>
            <p className="text-sm text-on-surface-variant font-sans">
              Sign in to manage your pre-loved goods on{" "}
              <span className="text-primary font-semibold font-sans">NaiSell Hub</span>
            </p>
          </div>

          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Google Login Button */}
            <Button
              onClick={handleGoogleSignin}
              type="button"
              variant="bordered"
              className="w-full border border-outline-variant hover:border-outline text-on-surface font-medium h-11 rounded-[8px] bg-white hover:bg-surface-container-low transition-all duration-200 text-sm flex items-center justify-center gap-2.5"
            >
              <FontAwesomeIcon
                icon={faGoogle}
                className="text-base text-primary"
              />
              Log in with Google
            </Button>

            {/* Divider */}
            <div className="flex items-center my-1 w-full">
              <div className="flex-1 border-t border-outline-variant/60"></div>
              <span className="px-3 text-[11px] text-outline uppercase tracking-wider font-semibold">
                Or credentials
              </span>
              <div className="flex-1 border-t border-outline-variant/60"></div>
            </div>

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
                  <Label className="text-sm font-medium text-on-surface-variant">
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
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-low border border-outline-variant text-on-surface placeholder-outline hover:border-outline focus:outline-none focus:border-primary rounded-[8px] transition-colors text-sm h-11"
                    />
                  </div>
                  <FieldError className="text-xs text-error mt-1">
                    {errors.email?.message}
                  </FieldError>
                </TextField>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <TextField
                  isInvalid={!!errors.password}
                  className="flex flex-col gap-1.5 w-full"
                >
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-on-surface-variant">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-semibold text-primary hover:underline transition-colors font-sans"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="absolute left-3.5 text-outline text-sm z-10"
                    />
                    <Input
                      {...field}
                      type={isVisible ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2 bg-surface-container-low border border-outline-variant text-on-surface placeholder-outline hover:border-outline focus:outline-none focus:border-primary rounded-[8px] transition-colors text-sm h-11"
                    />
                    <button
                      className="absolute right-3 focus:outline-none text-outline hover:text-primary transition-colors z-10"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label="toggle password visibility"
                    >
                      <FontAwesomeIcon icon={isVisible ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <FieldError className="text-xs text-error mt-1">
                    {errors.password?.message}
                  </FieldError>
                </TextField>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-white font-semibold rounded-[8px] text-sm h-12 shadow-sm transition-all duration-300 mt-2 flex items-center justify-center gap-2"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {!isLoading && <FontAwesomeIcon icon={faArrowRightToBracket} />}
              Sign In
            </Button>

            {/* Navigation Option */}
            <div className="text-center pt-4 border-t border-outline-variant/20 mt-1 text-sm text-on-surface-variant font-sans">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-bold text-primary hover:underline cursor-pointer transition-colors text-sm font-sans"
              >
                Create an account
              </Link>
            </div>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}
