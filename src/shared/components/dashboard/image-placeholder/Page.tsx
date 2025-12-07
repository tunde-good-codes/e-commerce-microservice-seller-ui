"use client";
import { url } from "inspector";
import React, { useState } from "react";
interface Props {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove?: (index: number) => void;
  defaultImage?: string | null;
  index?: any;
  setOpenImageModal: (openImage: boolean) => void;
}
const ImagePlaceHolder = ({
  size,
  small,
  onImageChange,
  onRemove,
  defaultImage = null,
  index = null,
  setOpenImageModal,
}: Props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
const file = event.target.files?.[0]
if(file){
    setImagePreview(URL.createObjectURL(file))
    onImageChange(file, index!)
}
  }
  return <div className={`relative ${small ? "h-[180px]" : "450px"}  w-full cursor-pointer bg-[#1e1e1e1e] border border-gray-600 rounded-lg flex flex-col justify-center items-center  `}>ImagePlaceHolder </div>;
};

export default ImagePlaceHolder;
