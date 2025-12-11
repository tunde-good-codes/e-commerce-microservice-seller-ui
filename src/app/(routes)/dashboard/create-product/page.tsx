"use client";
import ColorSelector from "@/shared/components/dashboard/color-selector/ColorSelector";
import ColorSpecification from "@/shared/components/dashboard/color-specification/ColorSpecification";
import CustomProperties from "@/shared/components/dashboard/custom-properties/CustomProperties";
import ImagePlaceHolder from "@/shared/components/dashboard/image-placeholder/Page";
import RichTextEditor from "@/shared/components/dashboard/rich-text-editor";
import SizeSelector from "@/shared/components/dashboard/size-selector";
import Input from "@/shared/components/input/Input";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const Page = () => {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {};

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = file;

    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    }
    setImages(updatedImages);
    setValue("images", updatedImages);
  };
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      let updatedImages = [...prevImages];

      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      return updatedImages;
    });
    setValue("images", images);
  };
  const handleSaveDraft = () => {};

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/get-categories");
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 1000 * 60 * 50,
    retry: 2,
  });

  const {
    data: discount_codes = [],
    isLoading: discountIsLoading,
    isError: discountIsError,
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

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || [];
  const selectedCategory = watch("categories");
  const regularPrice = watch("regular_price");
  console.log(subCategoriesData, categories);

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white "
    >
      <h2 className="text-2xl font-semibold py-2 font-poppins text-white ">
        Create Product
      </h2>
      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <ChevronRight size={20} className="opacity-[.8] " />
        <span>Create Product</span>
      </div>

      <div className="py-4 w-full flex gap-6 ">
        <div className="md:w-[35%]">
          {images.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 x 780"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}

          <div className="grid grid-cols-2 gap-3 mt-4 ">
            {images.slice(1).map((_, index) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                size="765 x 780"
                small
                key={index}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>

        <div className="md:w-[65%]">
          <div className="w-full flex gap-6 ">
            <div className="w-2/4">
              <Input
                label="Product Title"
                placeholder="enter product title"
                {...register("title", { required: "title is required" })}
              />

              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.title.message)}
                </p>
              )}

              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description * (Max 150 words)"
                  placeholder="Enter product description for quick view"
                  {...register("description", {
                    required: "Description is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;

                      return (
                        wordCount <= 150 ||
                        `Description cannot exceeds 150 words: (current:${wordCount} )`
                      );
                    },
                  })}
                />
              </div>

              <div className="mt-2">
                <Input
                  label="Tags *"
                  placeholder="apps, flagship"
                  {...register("tags", {
                    required:
                      "separate related product tags with commas is required",
                  })}
                />

                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.tags.message)}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Warranty *"
                  placeholder="1 Year or no warranty"
                  {...register("warranty", {
                    required: "Warranty is required",
                  })}
                />

                {errors.warranty && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.warranty.message)}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Slug *"
                  placeholder="product_slug"
                  {...register("slug", {
                    required: "slug is required",
                  })}
                />

                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.slug.message)}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Brand *"
                  placeholder="product brand"
                  {...register("brand", {
                    required: "brand is required",
                  })}
                />

                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.brand.message)}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <ColorSelector control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <ColorSpecification control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <CustomProperties control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <label
                  htmlFor=""
                  className="font-semibold block text-gray-300 mb-1"
                >
                  Cash On Delivery
                </label>

                <select
                  {...register("cash_on_delivery", {
                    required: "Cash on delivery",
                  })}
                  name=""
                  id=""
                  defaultValue={"yes"}
                  className="w-full border outline-none border-gray-700 bg-transparent  "
                >
                  <option value="yes" className="bg-black">
                    {" "}
                    Yes{" "}
                  </option>
                  <option value="no" className="bg-black">
                    {" "}
                    No{" "}
                  </option>
                </select>
              </div>
            </div>

            <div className="w-2/4">
              <label
                htmlFor=""
                className="block font-semibold mb-1 text-gray-500 "
              >
                Category *
              </label>
              {isLoading ? (
                <p className="text-gray-400">Loading ....</p>
              ) : isError ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "category is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent"
                    >
                      <option value="" className="bg-black">
                        Select Category
                      </option>
                      {categories.map((category: string) => (
                        <option
                          value={category}
                          key={category}
                          className="bg-black"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}

              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.category.message)}
                </p>
              )}

              <div className="mt-2">
                <label
                  htmlFor=""
                  className="block font-semibold text-gray-300 mb-1 "
                >
                  Sub Category *
                </label>

                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "category is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent"
                    >
                      <option value="" className="bg-black">
                        Select Category
                      </option>
                      {subCategories.map((subCat: string) => (
                        <option
                          value={subCat}
                          key={subCat}
                          className="bg-black"
                        >
                          {subCat}
                        </option>
                      ))}
                    </select>
                  )}
                />

                {errors.subCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.subCategory.message)}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label
                  htmlFor=""
                  className="block font-semibold text-gray-300 mb-1 "
                >
                  Detailed description *{" "}
                </label>

                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: "detailed description  is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;

                      return (
                        wordCount >= 100 ||
                        `Description cannot exceeds 150 words: (current:${wordCount} )`
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.detailed_description && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.detailed_description.message)}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <Input label="video url" placeholder="https://youtube.com" />
                {errors.video_url && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.video_url.message)}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <Input label="Regular price" placeholder="$20" />
                {errors.regular_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.regular_price.message)}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <Input label="Sale  price" placeholder="$20" />
                {errors.sale_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.sale_price.message)}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <Input label="Stock  price" placeholder="$20" />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.stock.message)}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <SizeSelector error={errors} control={control} />

                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.stock.message)}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <label
                  htmlFor=""
                  className="block font-semibold text-gray-300 mb-1"
                >
                  select discount codes (optional){" "}
                </label>

                {discountIsLoading ? (
                  <p className="text-gray-400 ">Loading discount codes...</p>
                ) : (
                  <div className="flex flex-wrap gap-2 ">
                    {discount_codes.map((code: any) => (
                      <button
                        key={code.id}
                        type="button"
                        className={` px-3 py-1 rounded-md text-sm font-semibold border ${
                          watch("discountCode").includes(code?.id)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-800 text-gray-300 border-gray-600 hover:text-gray-700 "
                        } `}
                        onClick={() => {
                          const currentSelection = watch("discountCode") || [];
                          const updatedSelection = currentSelection.includes(
                            code.id
                          )
                            ? currentSelection.filter(
                                (id: string) => id !== code.id
                              )
                            : [...currentSelection, code.id];
                          setValue("discountCode", updatedSelection);
                        }}
                      >
                        {code?.public_name} ({code.discountValue}{" "}
                        {code?.discountType === "percentage" ? "%" : "$"})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-3 ">
        {isChanged && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 text-white rounded-md "
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        )}

        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md "
          onClick={handleSaveDraft}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
          Save Draft
        </button>
      </div>
    </form>
  );
};

export default Page;
