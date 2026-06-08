import axios from "axios";
import { Globe, X } from "lucide-react";
import React, { useState } from "react";

const AddCountryForm = ({ showForm, setShowForm, setReloadTrigger }) => {
    const [submitting, setSubmitting] = useState(false);
    const [countryName, setCountryName] = useState("");
    const [error, setError] = useState("");

    const handleClose = () => {
        setShowForm(false);
        setCountryName("");
        setError("");
    };

    const handleCreate = async (formData) => {
        await axios.post(route("ourcountries.store"), formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setReloadTrigger((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!countryName.trim()) {
            setError("Country name is required.");
            return;
        }

        const formData = new FormData();
        formData.append("name", countryName.trim());

        try {
            setSubmitting(true);
            setError("");
            await handleCreate(formData);
            handleClose();
        } catch (err) {
            const msg =
                err?.response?.data?.errors?.name?.[0] ||
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setCountryName(e.target.value);
        if (error) setError("");
    };

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Globe size={17} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">
                            Add new country
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
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                            Country name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={countryName}
                            onChange={handleChange}
                            placeholder="e.g. Nepal"
                            className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all
                                ${error
                                    ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
                                    : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                }`}
                        />
                        {error && (
                            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                <span>⚠</span> {error}
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
                            disabled={submitting}
                            className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Creating..." : "Create country"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCountryForm;




// import axios from "axios";
// import { Globe, X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddCountryForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingCountry,
//     setEditingCountry,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [CountryForm, setCountryForm] = useState({ name: "" });
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (editingCountry) {
//             setCountryForm({ name: editingCountry.name });
//             setShowForm(true);
//         } else {
//             setCountryForm({ name: "" });
//         }
//         setError("");
//     }, [editingCountry]);

//     const handleCreate = async (formData) => {
//         await axios.post(route("ourcountries.store"), formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         setReloadTrigger((prev) => !prev);
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingCountry(null);
//         setCountryForm({ name: "" });
//         setError("");
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!CountryForm.name.trim()) {
//             setError("Country name is required.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("name", CountryForm.name.trim());

//         try {
//             setSubmitting(true);
//             setError("");
//             if (editingCountry) {
//                 await handleUpdate(formData, editingCountry.id);
//             } else {
//                 await handleCreate(formData);
//             }
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
//         setCountryForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//         if (error) setError("");
//     };

//     if (!showForm) return null;

//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//                     <div className="flex items-center gap-2.5">
//                         <Globe size={17} className="text-gray-400" />
//                         <span className="text-sm font-medium text-gray-800">
//                             {editingCountry ? "Edit country" : "Add new country"}
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
//                             Country name <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             id="name"
//                             type="text"
//                             name="name"
//                             value={CountryForm.name}
//                             onChange={handleChange}
//                             placeholder="e.g. Nepal"
//                             className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all
//                                 ${error
//                                     ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
//                                     : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
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
//                             {submitting
//                                 ? editingCountry ? "Saving..." : "Creating..."
//                                 : editingCountry ? "Save changes" : "Create country"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddCountryForm;



// import axios from "axios";
// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddCountryForm = ({
//     showForm,
//     setShowForm,
//     editingCountry,
//     setEditingCountry,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [CountryForm, setCountryForm] = useState({
//         name: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingCountry) {
//             setCountryForm({
//                 ...editingCountry,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setCountryForm({
//                 name: "",
//             });
//         }
//     }, [editingCountry]);

//     // Handle Create Country
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourcountries.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating country", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in CountryForm) {
//             if (CountryForm[key] !== null && CountryForm[key] !== "") {
//                 formData.append(key, CountryForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingCountry) {
//                 // Editing existing country
//                 await handleUpdate(formData, editingCountry.id);
//             } else {
//                 // Creating new country
//                 await handleCreate(formData);
//             }
//             setCountryForm({
//                 name: "",
//             });

//             setShowForm(false);
//             setEditingCountry(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setCountryForm((prev) => ({
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
//                         Add New Country
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

// export default AddCountryForm;
