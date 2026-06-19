// import { Layers, X } from "lucide-react";
// import React, { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";

// const EditSubCategory = ({
//     showForm,
//     setShowForm,
//     editingSubCategory,
//     setEditingSubCategory,
//     handleUpdate,
//     allCategories,
// }) => {
//     const {
//         register,
//         handleSubmit,
//         reset,
//         control,
//         setError,
//         formState: { errors, isSubmitting },
//     } = useForm({ defaultValues: { name: "", category_id: null } });

//     useEffect(() => {
//         document.body.style.overflow = showForm ? "hidden" : "";
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [showForm]);

//     useEffect(() => {
//         if (editingSubCategory) {
//             const categoryId =
//                 editingSubCategory.category_id ??
//                 editingSubCategory.category?.id ??
//                 null;

//             const matchedOption =
//                 (allCategories ?? [])
//                     .map((cat) => ({ value: cat.id, label: cat.name }))
//                     .find(
//                         (opt) => String(opt.value) === String(categoryId),
//                     ) || null;

//             reset({
//                 name: editingSubCategory.name ?? "",
//                 category_id: matchedOption,
//             });
//         } else {
//             reset({ name: "", category_id: null });
//         }
//     }, [editingSubCategory, allCategories, reset]);

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingSubCategory(null);
//         reset({ name: "", category_id: null });
//     };

//     const onSubmit = async (data) => {
//         const formData = new FormData();
//         formData.append("name", data.name.trim());
//         formData.append("category_id", data.category_id.value);

//         try {
//             await handleUpdate(formData, editingSubCategory.id);
//             handleClose();
//         } catch (err) {
//             const apiErrors = err?.response?.data?.errors || {};
//             const msg =
//                 err?.response?.data?.message ||
//                 "Something went wrong. Please try again.";
//             if (Object.keys(apiErrors).length > 0) {
//                 Object.entries(apiErrors).forEach(([key, val]) => {
//                     setError(key, { message: val[0] });
//                 });
//             } else {
//                 setError("root", { message: msg });
//             }
//         }
//     };

//     if (!showForm || !editingSubCategory) return null;

//     const inputClass = (field) =>
//         `w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all ${
//             errors[field]
//                 ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
//                 : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
//         }`;

//     const categoryOptions = (allCategories ?? []).map((cat) => ({
//         value: cat.id,
//         label: cat.name,
//     }));

//     const selectStyles = {
//         control: (base, state) => ({
//             ...base,
//             minHeight: "38px",
//             fontSize: "0.875rem",
//             borderRadius: "0.5rem",
//             borderColor: errors.category_id
//                 ? "#fca5a5"
//                 : state.isFocused
//                   ? "#9ca3af"
//                   : "#e5e7eb",
//             backgroundColor: errors.category_id ? "#fef2f2" : "#f9fafb",
//             boxShadow: state.isFocused
//                 ? errors.category_id
//                     ? "0 0 0 2px #fee2e2"
//                     : "0 0 0 2px #f3f4f6"
//                 : "none",
//             "&:hover": {
//                 borderColor: errors.category_id ? "#fca5a5" : "#9ca3af",
//             },
//             transition: "all 0.15s ease",
//         }),
//         valueContainer: (base) => ({ ...base, padding: "0 10px" }),
//         placeholder: (base) => ({
//             ...base,
//             color: "#9ca3af",
//             fontSize: "0.875rem",
//         }),
//         singleValue: (base) => ({
//             ...base,
//             color: "#1f2937",
//             fontSize: "0.875rem",
//         }),
//         option: (base, state) => ({
//             ...base,
//             fontSize: "0.875rem",
//             backgroundColor: state.isSelected
//                 ? "#4f46e5"
//                 : state.isFocused
//                   ? "#eef2ff"
//                   : "white",
//             color: state.isSelected ? "white" : "#1f2937",
//             "&:active": { backgroundColor: "#4338ca" },
//             cursor: "pointer",
//         }),
//         menu: (base) => ({
//             ...base,
//             borderRadius: "0.5rem",
//             border: "1px solid #e5e7eb",
//             boxShadow:
//                 "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
//             overflow: "hidden",
//         }),
//         menuList: (base) => ({ ...base, padding: "4px" }),
//         indicatorSeparator: () => ({ display: "none" }),
//         dropdownIndicator: (base, state) => ({
//             ...base,
//             color: state.isFocused ? "#6b7280" : "#9ca3af",
//             padding: "0 8px",
//             "&:hover": { color: "#6b7280" },
//         }),
//         clearIndicator: (base) => ({
//             ...base,
//             color: "#9ca3af",
//             padding: "0 4px",
//             "&:hover": { color: "#6b7280" },
//         }),
//         menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     };

//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//                     <div className="flex items-center gap-2.5">
//                         <Layers size={17} className="text-gray-400" />
//                         <span className="text-sm font-medium text-gray-800">
//                             Edit subcategory
//                         </span>
//                     </div>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                     >
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <form
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="px-5 py-5 space-y-4"
//                 >
//                     {errors.root && (
//                         <p className="text-xs text-red-400 flex items-center gap-1">
//                             <span>⚠</span> {errors.root.message}
//                         </p>
//                     )}

//                     {/* Name */}
//                     <div>
//                         <label
//                             htmlFor="name"
//                             className="block text-xs font-medium text-gray-500 mb-1.5"
//                         >
//                             Name <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             id="name"
//                             type="text"
//                             placeholder="Enter subcategory name"
//                             {...register("name", {
//                                 required: "Name is required.",
//                                 validate: (v) =>
//                                     !!v.trim() || "Name cannot be blank.",
//                             })}
//                             className={inputClass("name")}
//                         />
//                         {errors.name && (
//                             <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
//                                 <span>⚠</span> {errors.name.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Category */}
//                     <div>
//                         <label
//                             htmlFor="category_id"
//                             className="block text-xs font-medium text-gray-500 mb-1.5"
//                         >
//                             Category <span className="text-red-400">*</span>
//                         </label>
//                         <Controller
//                             name="category_id"
//                             control={control}
//                             rules={{ required: "Category is required." }}
//                             render={({ field }) => (
//                                 <Select
//                                     {...field}
//                                     inputId="category_id"
//                                     options={categoryOptions}
//                                     placeholder="Select a category"
//                                     isClearable
//                                     styles={selectStyles}
//                                     classNamePrefix="rs"
//                                     menuPortalTarget={document.body}
//                                     menuPosition="fixed"
//                                 />
//                             )}
//                         />
//                         {errors.category_id && (
//                             <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
//                                 <span>⚠</span> {errors.category_id.message}
//                             </p>
//                         )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-2.5 pt-1">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isSubmitting ? "Saving..." : "Save changes"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditSubCategory;

import { LayoutGrid, X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required.")
        .refine((v) => v.trim().length > 0, "Category name cannot be blank."),
});

const EditCategoryForm = ({
    editingCategory,
    setShowForm,
    setEditingCategory,
    showForm,
}) => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: { name: "" },
        resolver: zodResolver(categorySchema),
    });

    useEffect(() => {
        document.body.style.overflow = showForm ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [showForm]);

    useEffect(() => {
        if (editingCategory) {
            reset({ name: editingCategory.name });
            setShowForm(true);
        } else {
            reset({ name: "" });
        }
    }, [editingCategory, setShowForm, reset]);

    const mutation = useMutation({
        mutationFn: ({ formData, id }) => {
            formData.append("_method", "PUT");
            return axios.post(route("ourcategories.update", { id }), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            handleClose();
        },
        onError: (err) => {
            const msg =
                err?.response?.data?.errors?.name?.[0] ||
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setError("name", { message: msg });
        },
    });

    const handleClose = () => {
        setShowForm(false);
        setEditingCategory(null);
        reset({ name: "" });
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name.trim());
        mutation.mutate({ formData, id: editingCategory.id });
    };

    if (!showForm || !editingCategory) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <LayoutGrid size={17} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">Edit category</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-500 mb-1.5">
                            Category name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter category name"
                            {...register("name")}
                            className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all ${
                                errors.name
                                    ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
                                    : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                            }`}
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                <span>⚠</span> {errors.name.message}
                            </p>
                        )}
                    </div>

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
                            disabled={mutation.isPending}
                            className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryForm;

