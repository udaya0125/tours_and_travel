// import axios from "axios";
// import { LayoutGrid, X } from "lucide-react";
// import React, { useState, useEffect } from "react";

// const EditCategoryForm = ({
//     editingCategory,
//     setShowForm,
//     setEditingCategory,
//     setReloadTrigger,
//     showForm,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [categoryForm, setCategoryForm] = useState({ name: "" });
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (showForm) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "";
//         }

//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [showForm]);

//     useEffect(() => {
//         if (editingCategory) {
//             setCategoryForm({ name: editingCategory.name });
//             setShowForm(true);
//         } else {
//             setCategoryForm({ name: "" });
//         }
//         setError("");
//     }, [editingCategory, setShowForm]);

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingCategory(null);
//         setCategoryForm({ name: "" });
//         setError("");
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!categoryForm.name.trim()) {
//             setError("Category name is required.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("name", categoryForm.name.trim());

//         try {
//             setSubmitting(true);
//             setError("");
//             await handleUpdate(formData, editingCategory.id);
//             handleClose();
//         } catch (err) {
//             const msg =
//                 err?.response?.data?.errors?.name?.[0] ||
//                 err?.response?.data?.message ||
//                 "Something went wrong. Please try again.";
//             setError(msg);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleChange = (e) => {
//         setCategoryForm((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }));
//         if (error) setError("");
//     };

//     if (!showForm || !editingCategory) return null;

//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//                     <div className="flex items-center gap-2.5">
//                         <LayoutGrid size={17} className="text-gray-400" />
//                         <span className="text-sm font-medium text-gray-800">
//                             Edit category
//                         </span>
//                     </div>
//                     <button
//                         onClick={handleClose}
//                         className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                     >
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
//                     <div>
//                         <label
//                             htmlFor="name"
//                             className="block text-xs font-medium text-gray-500 mb-1.5"
//                         >
//                             Category name{" "}
//                             <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             id="name"
//                             type="text"
//                             name="name"
//                             value={categoryForm.name}
//                             onChange={handleChange}
//                             placeholder="Enter category name"
//                             className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all
//                                 ${
//                                     error
//                                         ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
//                                         : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
//                                 }`}
//                         />
//                         {error && (
//                             <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
//                                 <span>⚠</span> {error}
//                             </p>
//                         )}
//                     </div>

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
//                             disabled={submitting}
//                             className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {submitting ? "Saving..." : "Save changes"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditCategoryForm;



import { LayoutGrid, X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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
    } = useForm({ defaultValues: { name: "" } });

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
                            {...register("name", {
                                required: "Category name is required.",
                                validate: (v) => !!v.trim() || "Category name cannot be blank.",
                            })}
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

// import { LayoutGrid, X } from "lucide-react";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";

// const EditCategoryForm = ({
//     editingCategory,
//     setShowForm,
//     setEditingCategory,
//     setReloadTrigger,
//     showForm,
//     handleUpdate,
// }) => {
//     const {
//         register,
//         handleSubmit,
//         reset,
//         setError,
//         formState: { errors, isSubmitting },
//     } = useForm({
//         defaultValues: { name: "" },
//     });

//     useEffect(() => {
//         if (showForm) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "";
//         }
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [showForm]);

//     useEffect(() => {
//         if (editingCategory) {
//             reset({ name: editingCategory.name });
//             setShowForm(true);
//         } else {
//             reset({ name: "" });
//         }
//     }, [editingCategory, setShowForm, reset]);

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingCategory(null);
//         reset({ name: "" });
//     };

//     const onSubmit = async (data) => {
//         const formData = new FormData();
//         formData.append("name", data.name.trim());

//         try {
//             await handleUpdate(formData, editingCategory.id);
//             setReloadTrigger((prev) => !prev); // ✅ only toggled once, here
//             handleClose();
//         } catch (err) {
//             const msg =
//                 err?.response?.data?.errors?.name?.[0] ||
//                 err?.response?.data?.message ||
//                 "Something went wrong. Please try again.";
//             setError("name", { message: msg });
//         }
//     };

//     if (!showForm || !editingCategory) return null;

//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//                     <div className="flex items-center gap-2.5">
//                         <LayoutGrid size={17} className="text-gray-400" />
//                         <span className="text-sm font-medium text-gray-800">
//                             Edit category
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
//                 <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-5 space-y-4">
//                     <div>
//                         <label
//                             htmlFor="name"
//                             className="block text-xs font-medium text-gray-500 mb-1.5"
//                         >
//                             Category name <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             id="name"
//                             type="text"
//                             placeholder="Enter category name"
//                             {...register("name", {
//                                 required: "Category name is required.",
//                                 validate: (v) =>
//                                     !!v.trim() || "Category name cannot be blank.",
//                             })}
//                             className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all
//                                 ${
//                                     errors.name
//                                         ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
//                                         : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
//                                 }`}
//                         />
//                         {errors.name && (
//                             <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
//                                 <span>⚠</span> {errors.name.message}
//                             </p>
//                         )}
//                     </div>

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

// export default EditCategoryForm;