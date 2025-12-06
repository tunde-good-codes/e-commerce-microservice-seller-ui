import { categories } from "@/utils/categories";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  bio: string;
  name: string;
  address: string;
  opening_hour: string;
  website: string;
  category: string;
};

const CreateShop = ({
  sellerId,
  setActiveState,
}: {
  sellerId: string;
  setActiveState: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const createShopMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/auth/create-shop`,
        { ...data, sellerId }
      );
      return response.data;
    },
    onSuccess: () => {
      setActiveState(3);
      toast.success("Registration successful! OTP sent to your email.");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    const shopData = { ...data, sellerId };
    createShopMutation.mutate(shopData);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Setup new shop
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-gray-700 mb-1 block font-medium">
              Name *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Shop name"
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
              Bio (Max 100 words) *
            </label>
            <textarea
              id="bio"
              placeholder="Shop Bio"
              className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors min-h-[100px]"
              {...register("bio", {
                required: "Bio is required",
                validate: (value) =>
                  countWords(value) <= 100 || "Bio can't exceed 100 words",
              })}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.bio.message)}
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-700 mb-1 block font-medium">
              Address *
            </label>
            <input
              id="address"
              type="text"
              placeholder="Address"
              className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors"
              {...register("address", {
                required: "Address is required",
              })}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.address.message)}
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-700 mb-1 block font-medium">
              Opening Hours *
            </label>
            <input
              id="opening_hour"
              type="text"
              placeholder="e.g., 9:00 AM - 6:00 PM"
              className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors"
              {...register("opening_hour", {
                required: "Opening hours are required",
              })}
            />
            {errors.opening_hour && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.opening_hour.message)}
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-700 mb-1 block font-medium">
              Website *
            </label>
            <input
              id="website"
              type="text"
              placeholder="https://example.com"
              className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors"
              {...register("website", {
                required: "Website is required",
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Please enter a valid URL",
                },
              })}
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.website.message)}
              </p>
            )}
          </div>

          <div>
            <label className="text-gray-700 mb-1 block font-medium">
              Category *{" "}
            </label>
            <select
              id="website"
              className="w-full p-3 border border-gray-300 outline-0 rounded-lg focus:border-blue-500 transition-colors"
              {...register("category", {
                required: "category is required",
              })}
            >
              <option>Select a category</option>

              {categories.map((cat) => (
                <option value={cat.value} key={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.category.message)}
              </p>
            )}
          </div>



          <button
            type="submit"
            disabled={createShopMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createShopMutation.isPending ? "Creating Shop..." : "Create Shop"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShop;
