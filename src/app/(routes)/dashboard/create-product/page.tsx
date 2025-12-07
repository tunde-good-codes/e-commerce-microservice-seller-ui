"use client";
import ImagePlaceHolder from "@/shared/components/dashboard/image-placeholder/Page";
import Input from "@/shared/components/input/Input";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

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
                    required:
                      "Warranty is required",
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
                    required:
                      "slug is required",
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
                    required:
                      "brand is required",
                  })}
                />

                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.brand.message)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
