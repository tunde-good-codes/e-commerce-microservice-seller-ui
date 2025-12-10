"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Define props interface
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-800 animate-pulse rounded-md"></div>
  ),
});

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your product description here...",
  error,
  label,
  required = false,
}) => {
  // Custom toolbar modules
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  // Custom formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "color",
    "background",
    "code-block",
  ];

  return (
    <div className="w-full">
      {label && (
        <label className="block font-semibold text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="bg-gray-900 rounded-md overflow-hidden border border-gray-700">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="text-white"
          style={{
            height: "300px",
            color: "white",
          }}
        />
      </div>

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

      {/* Character count */}
      <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
        <span>Rich text editor</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
};

export default RichTextEditor;