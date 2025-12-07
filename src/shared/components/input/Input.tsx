import { forwardRef } from "react";

interface BaseProps {
  label?: string;
  type?: "text" | "number" | "password" | "email" | "textarea";
  className?: string;
}

interface InputProps
  extends BaseProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  type?: Exclude<BaseProps["type"], "textarea">;
}

interface TextAreaProps
  extends BaseProps,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: "textarea";
}

type Props = InputProps | TextAreaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ label, type = "text", className = "", ...props }, ref) => {
    const baseClasses =
      "w-full outline-none border-gray-700 border bg-transparent p-2 rounded-md text-white";

    return (
      <div className="w-full">
        {label && (
          <label className="block font-semibold text-gray-500 mb-1">
            {label}
          </label>
        )}

        {type === "textarea" ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`${baseClasses} ${className}`}
            {...(props as TextAreaProps)}
          />
        ) : (
          <input
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            className={`${baseClasses} ${className}`}
            {...(props as InputProps)}
          />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
