"use client";

import React from "react";
import { Controller, Control, FieldValues } from "react-hook-form";
import { Check } from "lucide-react";

// Size options - you can customize these
const DEFAULT_SIZES = [
  { value: "XS", label: "XS", available: true },
  { value: "S", label: "S", available: true },
  { value: "M", label: "M", available: true },
  { value: "L", label: "L", available: true },
  { value: "XL", label: "XL", available: true },
  { value: "XXL", label: "XXL", available: true },
  { value: "3XL", label: "3XL", available: true },
];

// For numeric sizes (shoes, etc.)
const NUMERIC_SIZES = [
  { value: "6", label: "6", available: true },
  { value: "7", label: "7", available: true },
  { value: "8", label: "8", available: true },
  { value: "9", label: "9", available: true },
  { value: "10", label: "10", available: true },
  { value: "11", label: "11", available: true },
  { value: "12", label: "12", available: true },
];

interface SizeOption {
  value: string;
  label: string;
  available?: boolean;
}

interface SizeSelectorProps {
  control: Control<any>;
  name?: string;
  label?: string;
  required?: boolean;
  error?: string |any;
  sizeType?: "clothing" | "shoes" | "custom";
  customSizes?: SizeOption[];
  multiple?: boolean;
  showAvailable?: boolean;
  className?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  control,
  name,
  label = "Select Size",
  required = false,
  error,
  sizeType = "clothing",
  customSizes,
  multiple = false,
  showAvailable = true,
  className = "",
}) => {
  // Determine which size array to use
  const getSizeOptions = (): SizeOption[] => {
    if (customSizes && customSizes.length > 0) {
      return customSizes;
    }
    
    switch (sizeType) {
      case "shoes":
        return NUMERIC_SIZES;
      case "clothing":
      default:
        return DEFAULT_SIZES;
    }
  };

  const sizes = getSizeOptions();

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <label className="block font-semibold text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {multiple && (
          <span className="text-sm text-gray-400">
            Select multiple sizes
          </span>
        )}
      </div>

      <Controller
        name={name!}
        control={control}
        rules={{
          required: required ? "Please select at least one size" : false,
        }}
        defaultValue={multiple ? [] : ""}
        render={({ field }) => {
          const fieldValue = field.value || (multiple ? [] : "");
          
          const handleSizeClick = (sizeValue: string) => {
            if (multiple) {
              const currentValues = Array.isArray(fieldValue) ? fieldValue : [];
              const newValues = currentValues.includes(sizeValue)
                ? currentValues.filter((v: string) => v !== sizeValue)
                : [...currentValues, sizeValue];
              field.onChange(newValues);
            } else {
              field.onChange(fieldValue === sizeValue ? "" : sizeValue);
            }
          };

          return (
            <>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const isSelected = multiple
                    ? Array.isArray(fieldValue) && fieldValue.includes(size.value)
                    : fieldValue === size.value;
                  
                  const isAvailable = size.available !== false;

                  return (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => {
                        if (isAvailable) {
                          handleSizeClick(size.value);
                        }
                      }}
                      disabled={!isAvailable}
                      className={`
                        relative w-12 h-12 flex items-center justify-center 
                        rounded-md border-2 transition-all duration-200
                        font-medium
                        ${isSelected
                          ? 'border-blue-500 bg-blue-500/20 text-white scale-105'
                          : 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }
                        ${!isAvailable
                          ? 'opacity-40 cursor-not-allowed line-through'
                          : 'cursor-pointer hover:border-gray-500'
                        }
                      `}
                      title={!isAvailable ? "Out of stock" : size.label}
                    >
                      {size.label}
                      
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                      
                      {!isAvailable && showAvailable && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected sizes display */}
              {multiple && Array.isArray(fieldValue) && fieldValue.length > 0 && (
                <div className="mt-3 p-2 bg-gray-800/50 rounded-md">
                  <p className="text-sm text-gray-400 mb-1">Selected sizes:</p>
                  <div className="flex flex-wrap gap-1">
                    {fieldValue.map((size: string) => {
                      const sizeLabel = sizes.find(s => s.value === size)?.label || size;
                      return (
                        <span
                          key={size}
                          className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-sm"
                        >
                          {sizeLabel}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          );
        }}
      />

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
      
      {/* Size guide hint */}
      <p className="text-xs text-gray-500 mt-2">
        Click to {multiple ? "select/deselect sizes" : "choose a size"}
      </p>
    </div>
  );
};

export default SizeSelector;