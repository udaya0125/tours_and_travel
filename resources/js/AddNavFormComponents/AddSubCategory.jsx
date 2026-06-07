import axios from "axios";
import { Layers, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddSubCategory = ({
    showForm,
    setShowForm,
    setReloadTrigger,
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
        if (editingSubCategory) {
            setSubCategoryForm({
                name: editingSubCategory.name ?? "",
                category_id: editingSubCategory.category_id ?? "",
            });
        } else {
            setSubCategoryForm({ name: "", category_id: "" });
        }
        setErrors({});
    }, [editingSubCategory]);

    const handleCreate = async (formData) => {
        await axios.post(route("oursubcategories.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingSubCategory(null);
        setSubCategoryForm({ name: "", category_id: "" });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!subCategoryForm.name.trim()) newErrors.name = "Name is required.";
        if (!subCategoryForm.category_id) newErrors.category_id = "Category is required.";
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
            if (editingSubCategory) {
                await handleUpdate(formData, editingSubCategory.id);
            } else {
                await handleCreate(formData);
            }
            handleClose();
        } catch (err) {
            const apiErrors = err?.response?.data?.errors || {};
            const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
            setErrors(
                Object.keys(apiErrors).length > 0
                    ? Object.fromEntries(Object.entries(apiErrors).map(([k, v]) => [k, v[0]]))
                    : { general: msg }
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
                            {editingSubCategory ? "Edit subcategory" : "Add new subcategory"}
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
                        <label htmlFor="name" className="block text-xs font-medium text-gray-500 mb-1.5">
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

                    {/* Category */}
                    <div>
                        <label htmlFor="category_id" className="block text-xs font-medium text-gray-500 mb-1.5">
                            Category <span className="text-red-400">*</span>
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={subCategoryForm.category_id}
                            onChange={handleChange}
                            className={inputClass("category_id")}
                        >
                            <option value="">Select a category</option>
                            {allCategories?.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
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
                            {submitting
                                ? "Saving..."
                                : editingSubCategory
                                ? "Save changes"
                                : "Create subcategory"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategory;


// import axios from "axios";
// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddSubCategory = () => {
//     const [submitting, setSubmitting] = useState(false);
//     const [subCategoryForm, setSubCategoryForm] = useState({
//         name: "",
//         category_id: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingSubCategory) {
//             setSubCategoryForm({
//                 ...editingSubCategory,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setSubCategoryForm({
//                 name: "",
//                 category_id: "",
//             });
//         }
//     }, [editingSubCategory]);

//     // Handle Create SubCategory
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("subcategories.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating subcategory", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in subCategoryForm) {
//             if (subCategoryForm[key] !== null && subCategoryForm[key] !== "") {
//                 formData.append(key, subCategoryForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingSubCategory) {
//                 // Editing existing subcategory
//                 await handleUpdate(formData, editingSubCategory.id);
//             } else {
//                 // Creating new subcategory
//                 await handleCreate(formData);
//             }
//             setSubCategoryForm({
//                 name: "",
//                 category_id: "",
//             });

//             setShowForm(false);
//             setEditingSubCategory(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setSubCategoryForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//     if (!showForm) return null;
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Add New SubCategory
//                     </h2>
//                     <button
//                         onClick={() => {
//                             setShowForm(false);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddSubCategory;
