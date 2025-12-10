"use client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

// Define proper TypeScript interfaces
interface ColorSelectorProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
}

interface FormValues {
  colors?: string[];
}

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

const ColorSelector = ({ control, errors }: ColorSelectorProps) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#ffffff");

  return (
    <div className="mt-2">
      <label className="block font-semibold text-gray-300 mb-1">Colors</label>

      <Controller
        name="colors"
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const fieldValue: string[] = field.value || [];
          const allColors = [...defaultColors, ...customColors];

          return (
            <div className="flex gap-3 flex-wrap">
              {allColors.map((color) => {
                const isSelected = fieldValue.includes(color);
                const isLightColor = ["#FFFFFF", "#FFFF00", "#00FFFF"].includes(
                  color
                );

                return (
                  <button
                    type="button"
                    key={color}
                    onClick={() => {
                      const newValue = isSelected
                        ? fieldValue.filter((c: string) => c !== color)
                        : [...fieldValue, color];
                      field.onChange(newValue);
                    }}
                    className={`w-8 h-8 rounded-md flex items-center justify-center border-2 transition ${
                      isSelected
                        ? "scale-110 border-white shadow-lg"
                        : "border-transparent hover:scale-105"
                    } ${isLightColor ? "border-gray-600" : ""}`}
                    style={{
                      backgroundColor: color,
                    }}
                    title={color}
                  />
                );
              })}

              {/* Add new color button */}
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 hover:bg-gray-700 transition"
              >
                <Plus color="white" size={16} />
              </button>

              {/* Color picker - conditionally shown */}
              {showColorPicker && (
                <div className="absolute mt-10 p-3 bg-gray-800 rounded-md shadow-lg z-10 flex items-center gap-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-10 h-10 border-none cursor-pointer bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customColors.includes(newColor)) {
                        setCustomColors([...customColors, newColor]);
                        // Also add to form field immediately
                        field.onChange([...fieldValue, newColor]);
                      }
                      setShowColorPicker(false);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(false)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />

      {errors?.colors && (
        <p className="text-red-400 text-sm mt-1">
          {errors.colors.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default ColorSelector;
