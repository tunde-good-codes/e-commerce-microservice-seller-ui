import { X } from "lucide-react";
import React from "react";

const DeleteDiscountModal = ({
  discount,
  onClose,
  onConfirm,
}: {
  discount: any;
  onClose: () => void;
  onConfirm?: any;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center gap-4 ">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-[450px] ">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 ">
          <h3 className="text-white text-xl">Delete discount Code</h3>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="text-gray-300 mt-4  ">
          {" "}
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">
            {discount?.public_nme}
          </span>
          ? <br /> this can't be undone{" "}
        </p>

        <div className="flex justify-end gap-3 mt-4  ">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white transition  "
            onClick={() => onclose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white transition  "
            onClick={() => onConfirm}
          >
            Delete{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountModal;
