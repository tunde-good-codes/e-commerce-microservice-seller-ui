"use client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

const colors = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  magenta: "#FF00FF",
  cyan: "#00FFFF",
  pink: "#FFC0CB",
};

// As an array:
const defaultColors = [
  "#000000", // black
  "#FFFFFF", // white
  "#FF0000", // red
  "#00FF00", // green
  "#0000FF", // blue
  "#FFFF00", // yellow
  "#FF00FF", // magenta
  "#00FFFF", // cyan
  "#FFC0CB", // pink
];
const ColorSelector = ({ control, errors }: any) => {
  const [customColors, setCustomColors] = useState<string[]>();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#ffffff");
  return (
    <div className="mt-2">
      <label htmlFor="" className="block font-semibold text-gray-300 mb-1 ">
        Colors
      </label>

      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <div className="flex gap-3 flex-wrap">
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ["#ffffff", "#fff000"].includes(color);

              return (
                <button
                  type="button"
                  key={color}
                  onClick={() => {
                    field.onChange(
                      isSelected
                        ? field.value.filter((c: string) => c !== color)
                        : [...(field.value || []), color]
                    );
                  }}
                  className={`w-7 h-7 p-2 rounded-md my-1 flex items-center justify-center border-2 transition ${
                    isSelected ? "scale-110 border-white" : "border-transparent"
                  } ${isLightColor ? "border-gray-600" : ""} `}
                  style={{
                    backgroundColor: color,
                  }}
                ></button>
              );
            })}

            {/* add new color */}
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full  border-2 border-gray-500 hover:bg-gray-600 transition "
            >
<Plus />

            </button>
          </div>
        )}
      />
    </div>
  );
};

export default ColorSelector;
