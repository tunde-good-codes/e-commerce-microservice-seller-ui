import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../../input/Input";
import { PlusCircle, Trash2 } from "lucide-react";

const ColorSpecification = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specification",
  });

  return (
    <div>
      <label className="block font-semibold text-gray-300 mb-1">
        Custom Specifications
      </label>
      <div className="flex flex-col gap-3">
        {fields.map((item, index) => (
          <div key={item.id} className="flex gap-2 items-center">
            <Controller
              name={`custom_specification.${index}.name`}
              control={control}
              rules={{
                required: "Specification name is required",
              }}
              render={({ field }) => (
                <Input
                  label="Specification Name"
                  placeholder="e.g. Battery life, weight, material"
                  {...field}
                />
              )}
            />

            <Controller
              name={`custom_specification.${index}.value`}
              control={control}
              rules={{
                required: "Specification Value is required",
              }}
              render={({ field }) => (
                <Input
                  label="Specification Value"
                  placeholder="e.g. 400mph, 1.5kg, plastic"
                  {...field}
                />
              )}
            />
            <button
              type="button"
              className="text-red-500 hover:text-red-700"
              onClick={() => remove(index)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <button
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 "
          onClick={() => append({ name: "", value: "" })}
        >
          <PlusCircle size={20} /> Add Specification
        </button>
      </div>

      {errors.custom_specification && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors.custom_specification.message)}
        </p>
      )}
    </div>
  );
};

export default ColorSpecification;
