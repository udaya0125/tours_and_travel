import React, { useEffect } from "react";
import { X } from "lucide-react";
import { BiTrash } from "react-icons/bi";

const DeleteConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure you want to delete this item?", 
    description = null,
    showForm = false, // New prop to indicate if an edit/add form is open
}) => {
    if (!isOpen) return null;

    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = "hidden";
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showForm]);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 px-8 py-8 flex flex-col items-center text-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Trash Icon */}
                <div className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
                    <BiTrash size={32} className="text-red-500" />
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-800 leading-snug mb-1">
                    {title}
                </h2>

                {/* Optional description */}
                {description && (
                    <p className="text-sm text-gray-500 mt-1 mb-2">
                        {description}
                    </p>
                )}

                {/* Actions */}
                <div className="mt-6 flex gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        No, cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                        Yes, I'm sure
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmDialog;
