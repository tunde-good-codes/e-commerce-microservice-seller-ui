"use client"
import { ChevronRight } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {};
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

        <div className="w-[35%]"></div>
      </div>
    </form>
  );
};

export default Page;
