"use client";
import DeleteDiscountModal from "@/shared/components/dashboard/modals/deleteDiscountModals";
import Input from "@/shared/components/input/Input";
import axiosInstance from "@/utils/axiosInstance";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { table } from "console";
import { ChevronRight, Plus, Trash, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const DiscountCodes = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_name: "",
      discountType: "percentage",
      discountValue: "",
      discountCode: "",
    },
  });
  const {
    data: discount_codes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["shop_discounts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/get-discount-codes");
        return res.data.discount_codes || [];
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 1000 * 60 * 50,
    retry: 2,
  });
  const handleDeleteClick = async (discount: any) => {
    setSelectedDiscount(discount);
    setShowDeleteModal(true);
  };
  const onSubmit = (data: any) => {
    if (discount_codes.length >= 8) {
      toast.error("you can only create 8 discount codes");
      return;
    }
    createDiscountCodeMutation.mutate(data);
  };

  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/product/create-discount_codes`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop-discounts"],
      });
      setShowDeleteModal(false);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        "Invalid otp. Try Again!";
    },
  });

  const deleteDiscountCodeMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_URI}/product/delete-discount_codes/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop-discounts"],
      });
      reset();
      setShowModal(false);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        "Invalid otp. Try Again!";
    },
  });
  return (
    <div className="w-full min-h-screen p-8 ">
      <div className="flex justify-between items-center mb-1 ">
        <h2 className="text-2xl font-semibold text-white">Discount Codes</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 "
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Create Discount
        </button>
      </div>
      <div className="flex items-center text-white ">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={20} className="opacity-[.8] " />
        <span>Discount Codes</span>
      </div>
      <div className="mt-8 bg-gray-900 p-6 shadow-lg rounded-lg ">
        <h3 className="font-semibold text-lg text-white mb-4">
          Your Discount Codes
        </h3>

        {isLoading ? (
          <p className="text-gray-500 text-center">Loading Discounts...</p>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discount_codes.map((discount: any) => (
                <tr
                  key={discount.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition "
                >
                  <td className="p-3">{discount_codes.public_name}</td>
                  <td className="p-3 capitalize">
                    {discount.discountType === "percentage"
                      ? "Percentage (%)"
                      : "Flat ($)"}
                  </td>
                  <td className="p-3 capitalize">
                    {discount.discountType === "percentage"
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}%`}
                  </td>
                  <td className="p-3">{discount.discountCode}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteClick(discount)}
                      className="text-red-400 hover:text-red-500  transition"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && discount_codes.length === 0 && (
          <p className="text-gray-500 text-center pt-4 ">
            No discount codes available
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-[450px] ">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3 ">
              <h3 className="text-white text-xl">Create discount Code</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <form action="" className="mt-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Title (public name)"
                {...register("public_name", {
                  required: "Title is required",
                })}
              />
              {errors.public_name && (
                <p className="text-red-500 text-xs mt-1">
                  {" "}
                  {errors.public_name.message}{" "}
                </p>
              )}

              <div className="mt-4">
                <label className="block font-semibold text-gray-300 mb-1">
                  Discount Type
                </label>

                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => {
                    return (
                      <select
                        className="fw-full border outline-none border-gray-700 bg-transparent "
                        {...field}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="percentage">Flat Amount (%)</option>
                      </select>
                    );
                  }}
                />
              </div>

              <div className="mt-2">
                <Input
                  label="Discount Value"
                  type="number"
                  min={1}
                  {...register("discountValue", {
                    required: "discount value is required",
                  })}
                />
              </div>

              <div className="mt-2">
                <Input
                  label="Discount Code"
                  {...register("discountCode", {
                    required: "discount Code is required",
                  })}
                />
              </div>

              <button
                type="submit"
                disabled={createDiscountCodeMutation.isPending}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 "
              >
                {" "}
                <Plus size={18} />{" "}
                {createDiscountCodeMutation.isPending
                  ? "Creating..."
                  : "Create"}{" "}
              </button>
              {createDiscountCodeMutation.isError && (
                <p className="text-red-500 text-sm mt-2">
                  {(
                    createDiscountCodeMutation.error as AxiosError<{
                      message: string;
                    }>
                  )?.response?.data?.message || "something went wrong"}
                </p>
              )}
            </form>
          </div>
        </div>
      )}


      {
        showDeleteModal && selectedDiscount  && <DeleteDiscountModal
        
        discount={selectedDiscount} onClose={()=>setShowDeleteModal} onConfirm={deleteDiscountCodeMutation.mutate(selectedDiscount?.id)}
        />
      }
    </div>
  );
};

export default DiscountCodes;
