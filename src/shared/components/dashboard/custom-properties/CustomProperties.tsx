"use client";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../../input/Input";
import { Plus, X } from "lucide-react";

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    {
      label: string;
      values: string[];
    }[]
  >([]);

  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specification",
  });

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Controller
          name={`custom_properties`}
          control={control}
          rules={{
            required: "Specification name is required",
          }}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);

            const addProperty = (index: number) => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, values: [] }]);
              setNewValue("");
            };
            const addValue = (index: number) => {
              if (!newLabel.trim()) return;
              const updatedProperties = [...properties];
              updatedProperties[index].values.push(newValue);
              setProperties(updatedProperties);
              setNewValue("");
            };

            const removeProperties = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
            };
            return (
              <div className="mt-2">
                <label
                  htmlFor=""
                  className="block font-semibold text-gray-300 mb-1"
                >
                  Custom Properties
                </label>
                <div className="flex flex-col gap-3">
                  {properties.map((property, index) => {
                    return (
                      <div
                        key={index}
                        className="border border-gray-300 rounded-lg p-3 bg-gray-900"
                      >
                        <div className="flex items-center justify-between  ">
                          <label className="text-white font-medium">
                            {property.label}
                          </label>
                          <button
                            type="button"
                            onClick={() => removeProperties(index)}
                          >
                            <X size={18} color="text-red-500" />
                          </button>
                        </div>

                        <div className="flex gap-2 mt-2 items-center">
                          <input
                            className="border  outline-none border-gray-700 bg-gray-800 "
                            type="text"
                            placeholder="enter value"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                          />

                          <button
                            type="button"
                            className="px-3 py-1 bg-blue-500 text-white rounded-md"
                            onClick={() => addValue(index)}
                          >
                            Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {property.values.map((value, i) => {
                            return (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-700 text-white rounded-md"
                              >
                                {value}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-2 mt-1 ">
                    <Input
                      placeholder="enter property"
                      value={newLabel}
                      onChange={(e: any) => setNewLabel(e.target.value)}
                    />

                    <button
                      type="button"
                      className="px-3 py-1 bg-blue-500 text-white rounded-md"
                      onClick={() => addProperty}
                    >
                      <Plus size={18} /> Add
                    </button>
                  </div>
                </div>

                {errors.customProperties && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.customProperties.message)}
                  </p>
                )}
              </div>
            );
          }}
        />


      </div>
    </div>
  );
};

export default CustomProperties;
