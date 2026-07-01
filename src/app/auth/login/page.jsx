/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { clearAuthToken, primeBackendToken } from "@/lib/api/server";
import { toast } from "react-toastify";

export default function SigninPage() {
  const router = useRouter();
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

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForSession = async () => {
    for (let i = 0; i < 8; i += 1) {
      const result = await authClient.getSession();
      if (result?.data?.session && result?.data?.user) return true;
      await sleep(150);
    }
    return false;
  };

  const finishLogin = async (toastId, successMessage) => {
    const hasSession = await waitForSession();
    if (!hasSession) {
      toast.update(toastId, {
        render:
          "Login succeeded but session is not ready. Please try once more.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }

    await primeBackendToken();

    toast.update(toastId, {
      render: successMessage,
      type: "success",
      isLoading: false,
      autoClose: 1500,
    });

    reset();
    router.replace("/dashboard");
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    clearAuthToken();
    const toastId = toast.loading("Signing in... Please wait.");

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      });

      if (result?.error) {
        toast.update(toastId, {
          render: result.error.message || "Invalid email or password.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      await finishLogin(toastId, "Logged in successfully! Welcome back.");
    } catch (err) {
      console.error("Signin failed:", err);
      toast.update(toastId, {
        render: "Something went wrong. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
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
        <Card className="w-full p-6 sm:p-8 bg-surface-container-lowest border border-outline-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.06)] rounded-2xl transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          {/* Header */}
          <div className="flex flex-col items-center justify-center gap-1.5 pb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-display">
              Welcome Back
            </h1>
            <p className="text-sm text-on-surface-variant font-sans">
              Sign in to manage your pre-loved goods on{" "}
              <span className="text-primary font-semibold font-sans">
                NaiSell Hub
              </span>
            </p>
          </div>

          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Google Login Button */}
            <Button
              type="button"
              variant="bordered"
              onClick={async () => {
                const toastId = toast.loading("Connecting to Google...");
                try {
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
              className="w-full border border-outline-variant hover:border-outline text-on-surface font-medium h-11 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 text-sm flex items-center justify-center gap-2.5"
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
                Or
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
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-low border border-outline-variant text-on-surface placeholder-outline hover:border-outline focus:outline-none focus:border-primary rounded-2xl transition-colors text-sm h-11"
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
                      className="w-full pl-10 pr-10 py-2 bg-surface-container-low border border-outline-variant text-on-surface placeholder-outline hover:border-outline focus:outline-none focus:border-primary rounded-2xl transition-colors text-sm h-11"
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
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-2xl text-sm h-12 shadow-sm transition-all duration-300 mt-2 flex items-center justify-center gap-2"
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

            {/* Demo Login Buttons */}
            <div className="pt-4 border-t border-outline-variant/20">
              <p className="text-xs text-center text-outline uppercase tracking-wider font-semibold mb-3 font-sans">
                Quick Demo Login
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    role: "Buyer",
                    email: "demo@naisell.com",
                    name: "Demo Buyer",
                    password: "password123",
                    color:
                      "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20",
                  },
                  {
                    role: "Seller",
                    email: "seller@naisell.com",
                    name: "Demo Seller",
                    password: "password123",
                    color:
                      "bg-secondary-container/20 text-secondary-container hover:bg-secondary-container/30 border-secondary-container/30",
                  },
                  {
                    role: "Admin",
                    email: "admin@naisell.com",
                    name: "Demo Admin",
                    password: "admin321",
                    color:
                      "bg-tertiary-container/20 text-on-tertiary-container hover:bg-tertiary-container/30 border-tertiary-container/30",
                  },
                ].map((demo) => (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      clearAuthToken();
                      const toastId = toast.loading(
                        `Signing in as ${demo.role}...`,
                      );
                      try {
                        // First try to create the user (ignore error if exists)
                        await fetch("/api/seed", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: demo.email,
                            password: demo.password,
                            name: demo.name,
                            role: demo.role.toLowerCase(),
                          }),
                        });

                        // Then login
                        const loginResult = await authClient.signIn.email({
                          email: demo.email,
                          password: demo.password,
                          callbackURL: "/dashboard",
                        });

                        if (loginResult?.error) {
                          toast.update(toastId, {
                            render: loginResult.error.message || "Login failed",
                            type: "error",
                            isLoading: false,
                            autoClose: 3000,
                          });
                          return;
                        }

                        await finishLogin(
                          toastId,
                          `Logged in as ${demo.role}!`,
                        );
                      } catch {
                        toast.update(toastId, {
                          render: "Login failed",
                          type: "error",
                          isLoading: false,
                          autoClose: 3000,
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold font-sans transition-all cursor-pointer ${demo.color}`}
                  >
                    {demo.role}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-outline text-center mt-2 font-sans">
                Passwords: Buyer/Seller: password123 | Admin: admin321
              </p>
            </div>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}
