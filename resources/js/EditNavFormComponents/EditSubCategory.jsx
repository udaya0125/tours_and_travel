import { Layers, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const EditSubCategory = ({
    showForm,
    setShowForm,
    editingSubCategory,
    setEditingSubCategory,
    handleUpdate,
    allCategories,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [subCategoryForm, setSubCategoryForm] = useState({
        name: "",
        category_id: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showForm]);

    useEffect(() => {
        if (editingSubCategory) {
            setSubCategoryForm({
                name: editingSubCategory.name ?? "",
                category_id:
                    editingSubCategory.category_id ??
                    editingSubCategory.category?.id ?? // ✅ nested relation fallback
                    "",
            });
        } else {
            setSubCategoryForm({ name: "", category_id: "" });
        }
        setErrors({});
    }, [editingSubCategory]);

    const resetForm = () => {
        setSubCategoryForm({ name: "", category_id: "" });
        setErrors({});
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingSubCategory(null);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!subCategoryForm.name.trim()) newErrors.name = "Name is required.";
        if (!subCategoryForm.category_id)
            newErrors.category_id = "Category is required.";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const formData = new FormData();
        formData.append("name", subCategoryForm.name.trim());
        formData.append("category_id", subCategoryForm.category_id);

        try {
            setSubmitting(true);
            setErrors({});
            await handleUpdate(formData, editingSubCategory.id);
            handleClose();
        } catch (err) {
            const apiErrors = err?.response?.data?.errors || {};
            const msg =
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setErrors(
                Object.keys(apiErrors).length > 0
                    ? Object.fromEntries(
                          Object.entries(apiErrors).map(([k, v]) => [k, v[0]]),
                      )
                    : { general: msg },
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    if (!showForm) return null;

    const inputClass = (field) =>
        `w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all ${
            errors[field]
                ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
                : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        }`;

    const categoryOptions = (allCategories ?? []).map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const selectedCategoryOption =
        categoryOptions.find(
            (opt) => String(opt.value) === String(subCategoryForm.category_id),
        ) || null;

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: "38px",
            fontSize: "0.875rem",
            borderRadius: "0.5rem",
            borderColor: errors.category_id
                ? "#fca5a5"
                : state.isFocused
                  ? "#9ca3af"
                  : "#e5e7eb",
            backgroundColor: errors.category_id ? "#fef2f2" : "#f9fafb",
            boxShadow: state.isFocused
                ? errors.category_id
                    ? "0 0 0 2px #fee2e2"
                    : "0 0 0 2px #f3f4f6"
                : "none",
            "&:hover": {
                borderColor: errors.category_id ? "#fca5a5" : "#9ca3af",
            },
            transition: "all 0.15s ease",
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "0 10px",
        }),
        placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
            fontSize: "0.875rem",
        }),
        singleValue: (base) => ({
            ...base,
            color: "#1f2937",
            fontSize: "0.875rem",
        }),
        option: (base, state) => ({
            ...base,
            fontSize: "0.875rem",
            backgroundColor: state.isSelected
                ? "#4f46e5"
                : state.isFocused
                  ? "#eef2ff"
                  : "white",
            color: state.isSelected ? "white" : "#1f2937",
            "&:active": {
                backgroundColor: "#4338ca",
            },
            cursor: "pointer",
        }),
        menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
            overflow: "hidden",
        }),
        menuList: (base) => ({
            ...base,
            padding: "4px",
        }),
        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#6b7280" : "#9ca3af",
            padding: "0 8px",
            "&:hover": { color: "#6b7280" },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: "#9ca3af",
            padding: "0 4px",
            "&:hover": { color: "#6b7280" },
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Layers size={17} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">
                            Edit subcategory
                        </span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
                    {errors.general && (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                            <span>⚠</span> {errors.general}
                        </p>
                    )}

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                            Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={subCategoryForm.name}
                            onChange={handleChange}
                            placeholder="Enter subcategory name"
                            className={inputClass("name")}
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                <span>⚠</span> {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Category — react-select */}
                    <div>
                        <label
                            htmlFor="category_id"
                            className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                            Category <span className="text-red-400">*</span>
                        </label>
                        <Select
                            inputId="category_id"
                            options={categoryOptions}
                            value={selectedCategoryOption}
                            onChange={(selected) => {
                                setSubCategoryForm((prev) => ({
                                    ...prev,
                                    category_id: selected ? selected.value : "",
                                }));
                                if (errors.category_id)
                                    setErrors((prev) => ({
                                        ...prev,
                                        category_id: "",
                                    }));
                            }}
                            placeholder="Select a category"
                            isClearable
                            styles={selectStyles}
                            classNamePrefix="rs"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                        {errors.category_id && (
                            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                <span>⚠</span> {errors.category_id}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubCategory;
