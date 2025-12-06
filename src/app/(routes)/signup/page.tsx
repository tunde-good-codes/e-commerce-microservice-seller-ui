"use client";

import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { countries } from "@/utils/countries";
import CreateShop from "@/shared/components/auth/create-shop";
import { StripeLogo } from "@/assets/svg/stripe-logo";

type FormData = {
  email: string;
  name: string;
  password: string;
  phone_number: string;
  country: string;
};

const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(true);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [sellerId, setSellerId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const signUpMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/auth/seller-registration`,
        data
      );
      return response.data;
    },
    onSuccess: (data, formData) => {
      setSellerData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();

      // Success toast
      toast.success("Registration successful! OTP sent to your email.");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      // Error toast
      toast.error(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!sellerData) {
        console.log("❌ No sellerData found");
        return;
      }

      const payload = {
        ...sellerData,
        otp: otp.join(""),
      };

      console.log("🔄 Calling verify-seller with:", payload);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/auth/verify-seller`,
        payload
      );

      console.log("✅ verify-seller response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      console.log(sellerId);
      
      
  setSellerId(data?.sellerId);  // FIXED HERE
      setActiveStep(2);
      console.log("🎉 Verification successful, redirecting...");
      toast.success("Account verified successfully! Redirecting...");
    },
    onError: (error: any) => {
      console.log("💥 Verification error:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "OTP verification failed.";
      toast.error(errorMessage);
    },
  });

  const handleVerifyClick = () => {
    if (isVerifying) {
      console.log("⚠️ Verification already in progress");
      return;
    }

    setIsVerifying(true);
    verifyOtpMutation.mutate(undefined, {
      onSettled: () => {
        setIsVerifying(false);
      },
    });
  };

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/auth/resend-otp`,
        { email: sellerData?.email }
      );
      return response.data;
    },
    onSuccess: () => {
      setCanResend(false);
      setTimer(60);
      startResendTimer();
      toast.success("OTP resent successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to resend OTP.";
      toast.error(errorMessage);
    },
  });

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = (data: FormData) => {
    // Show loading toast
    const loadingToast = toast.loading("Creating your account...");

    signUpMutation.mutate(data, {
      onSettled: () => {
        toast.dismiss(loadingToast);
      },
    });
  };

  // In your SignUp component
  const connectStripe = async () => {
    try {
      if (!sellerId) {
        toast.error("Seller ID not found");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/auth/create-stripe-link`,
        { sellerId } // ✅ Pass sellerId
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (e: any) {
      console.error("Stripe connection error:", e);
      toast.error(e.response?.data?.message || "Failed to connect Stripe");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (sellerData) {
      signUpMutation.mutate(sellerData);
    }
  };
  const isSignUpLoading = signUpMutation.isPending;
  const isVerifyOtpLoading = verifyOtpMutation.isPending;
  const isResendOtpLoading = resendOtpMutation.isPending;

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      <div className="relative flex items-center justify-between md:w-[50%] mb-8">
        <div className="absolute top-[25%] left-0 w-[80% md:w-[90%] h-1 bg-gray-300 -z-10 " />

        {[1, 2, 3].map((step) => (
          <div key={step}>
            <div
              className={` w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step <= activeStep ? "bg-blue-600" : "bg-gray-300"
              } `}
            >
              {step}
            </div>
            <span className="-ml-[-15px] ">
              {step === 1
                ? "Create Account"
                : step === 2
                ? "Setup Shop"
                : "Connect Bank"}
            </span>
          </div>
        ))}
      </div>

      {/* steps contents */}

      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg ">
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <label
                  htmlFor=""
                  className="text-2xl font-semibold text-center mb-4"
                >
                  Create Account{" "}
                </label>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-700 mb-1 block font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors"
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-700 mb-1 block font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.email.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-700 mb-1 block font-medium">
                      Phone Number{" "}
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="8013255466"
                      className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors"
                      {...register("phone_number", {
                        required: "phone_number is required",
                        minLength: {
                          value: 10,
                          message: "phone number must be at least 10 digits",
                        },
                        maxLength: {
                          value: 15,
                          message: "phone number must be max 15 digits",
                        },
                      })}
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.phone_number.message)}
                      </p>
                    )}
                  </div>

                  <label className="text-gray-700 mb-1 block font-medium">
                    Country{" "}
                  </label>

                  <select
                    id="country"
                    className="w-full p-2 border border-grey-300 outline-0 rounded-lg"
                    {...register("country", {
                      required: "Country is required",
                    })}
                  >
                    <option value="">Select Your Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div>
                    <label className="text-gray-700 mb-1 block font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter your password (min 6 characters)"
                        className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {passwordVisible ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.password.message)}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSignUpLoading}
                    className="w-full text-lg cursor-pointer bg-black text-white py-3 rounded-lg mt-2 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSignUpLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing Up...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>

                <p className="pt-3 text-center">
                  Already have an Account?{" "}
                  <Link href={"/login"} className="text-blue-500">
                    Login{" "}
                  </Link>{" "}
                </p>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Enter Verification Code
                  </h3>
                  <p className="text-gray-600">
                    We sent a 4-digit code to {sellerData?.email}
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-center border border-gray-300 rounded-lg text-lg font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      disabled={isVerifyOtpLoading}
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyClick}
                  disabled={
                    isVerifyOtpLoading ||
                    otp.join("").length !== 4 ||
                    isVerifying
                  }
                  className="w-full text-lg cursor-pointer bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isVerifyOtpLoading || isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
                <div className="text-center">
                  {canResend ? (
                    <button
                      onClick={handleResendOtp}
                      disabled={isResendOtpLoading}
                      className="text-blue-500 hover:text-blue-600 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                      {isResendOtpLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          Resending...
                        </>
                      ) : (
                        "Resend OTP"
                      )}
                    </button>
                  ) : (
                    <p className="text-gray-500">Resend OTP in {timer}s</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeStep === 2 && (
          <CreateShop setActiveState={setActiveStep} sellerId={sellerId} />
        )}

        {activeStep === 3 && (
          <div className="text-center">
            <h3 className="text-2xl font-semibold ">Withdraw Method</h3>

          
            <button
              className="w-full m-auto flex items-center justify-center gap-3 text-lg bg-[#334155] text-white py-2 rounded-lg "
              onClick={connectStripe}
            >
              Connect Stripe <StripeLogo />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
