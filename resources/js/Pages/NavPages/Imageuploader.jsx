/**
 * Shared image uploader component
 * - Drag-and-drop or click-to-select zone
 * - Thumbnail preview grid for newly selected files
 * - Remove individual new images before submit
 * - (Edit mode) Show existing images with delete button
 */

import React, { useCallback, useRef, useState } from "react";
import { Trash2, Upload, X, ImageIcon } from "lucide-react";

// ─── Existing images (edit mode) ────────────────────────────────────────────

export const ExistingImages = ({ images = [], onDelete, imageBasePath = "/storage/" }) => {
    const [deletingId, setDeletingId] = useState(null);

    if (!images.length) return null;

    const handleDelete = async (img) => {
        if (!window.confirm("Remove this image from the package?")) return;
        setDeletingId(img.id);
        try {
            await onDelete(img.id);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-400">Current images</span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square"
                    >
                        <img
                            src={`${imageBasePath}${img.image}`}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        {/* Dark overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-150" />
                        {/* Delete button */}
                        <button
                            type="button"
                            onClick={() => handleDelete(img)}
                            disabled={deletingId === img.id}
                            className="absolute top-1 right-1 p-1 rounded-md bg-white/90 text-red-400 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-150 disabled:opacity-50"
                            title="Remove image"
                        >
                            {deletingId === img.id ? (
                                <svg className="animate-spin" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            ) : (
                                <Trash2 size={13} />
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── New image staging area ──────────────────────────────────────────────────

export const NewImageUploader = ({ files, onChange, error }) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const addFiles = useCallback(
        (incoming) => {
            const valid = Array.from(incoming).filter((f) =>
                ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)
            );
            // Merge, deduplicate by name+size
            const merged = [...files];
            valid.forEach((f) => {
                const exists = merged.some((m) => m.name === f.name && m.size === f.size);
                if (!exists) merged.push(f);
            });
            onChange(merged);
        },
        [files, onChange]
    );

    const removeFile = (idx) => {
        const next = files.filter((_, i) => i !== idx);
        onChange(next);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`
                    relative flex flex-col items-center justify-center gap-2 
                    px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer 
                    transition-all duration-150 select-none
                    ${isDragging
                        ? "border-gray-400 bg-gray-100"
                        : error
                        ? "border-red-300 bg-red-50 hover:border-red-400"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                    }
                `}
            >
                <div className={`p-2 rounded-lg ${isDragging ? "bg-gray-200" : "bg-white border border-gray-200"}`}>
                    <Upload size={16} className={isDragging ? "text-gray-600" : "text-gray-400"} />
                </div>
                <div className="text-center">
                    <p className="text-xs font-medium text-gray-500">
                        {isDragging ? "Drop to add images" : "Click or drag images here"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP · max 2 MB each</p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpg,image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
                />
            </div>

            {/* Staged thumbnails */}
            {files.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-gray-400">
                        {files.length} new image{files.length > 1 ? "s" : ""} to upload
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {files.map((file, idx) => (
                            <div
                                key={`${file.name}-${idx}`}
                                className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-150" />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                    className="absolute top-1 right-1 p-1 rounded-md bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-150"
                                    title="Remove"
                                >
                                    <X size={12} />
                                </button>
                                {/* File name tooltip on hover */}
                                <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/50 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-all duration-150">
                                    {file.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}
        </div>
    );
};