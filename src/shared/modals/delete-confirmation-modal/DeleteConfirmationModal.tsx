import React from 'react';
import { X } from 'lucide-react';

const DeleteConfirmationModal = ({ product, onClose, onConfirm, onRestore }: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {!product.isDeleted ? "Delete Product" : "Restore Product"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to {!product.isDeleted ? "delete" : "restore"} 
            <span className="font-medium text-gray-900 ml-1">"{product.title}"</span>?
          </p>
          {!product.isDeleted && (
            <p className="text-sm text-gray-500">
              This product will be deleted in 24h
            </p>
          )}
        </div>

        {/* Footer - Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={!product.isDeleted ? onConfirm : onRestore}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
              !product.isDeleted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {!product.isDeleted ? "Delete" : "Restore"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;