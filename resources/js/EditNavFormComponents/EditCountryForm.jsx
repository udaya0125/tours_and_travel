// import axios from "axios";
// import { Globe, X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const EditCountryForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingCountry,
//     setEditingCountry,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [countryName, setCountryName] = useState("");
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
//         if (editingCountry) {
//             setCountryName(editingCountry.name);
//         } else {
//             setCountryName("");
//         }
//         setError("");
//     }, [editingCountry]);

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourcountries.update", { id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } },
//         );
//         return response.data;
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingCountry(null);
//         setCountryName("");
//         setError("");
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!countryName.trim()) {
//             setError("Country name is required.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("name", countryName.trim());

//         try {
//             setSubmitting(true);
//             setError("");
//             await handleUpdate(formData, editingCountry.id);
//             setReloadTrigger((prev) => !prev);
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
//         setCountryName(e.target.value);
//         if (error) setError("");
//     };

//     if (!showForm || !editingCountry) return null;

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
//                             Edit country
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
//                             value={countryName}
//                             onChange={handleChange}
//                             placeholder="e.g. Nepal"
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

// export default EditCountryForm;



import axios from "axios";
import { Globe, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import worldCountries from "@/data/worldCountries";

const EditCountryForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    editingCountry,
    setEditingCountry,
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const inputRef = useRef(null);
    const suggestionRefs = useRef([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { name: "" },
    });

    const countryName = watch("name");

    // RHF's register ref + our own inputRef combined
    const { ref: registerRef, ...registerRest } = register("name", {
        required: "Country name is required.",
        validate: (v) => !!v.trim() || "Country name cannot be blank.",
    });

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

    useEffect(() => {
        if (editingCountry) {
            reset({ name: editingCountry.name });
        } else {
            reset({ name: "" });
        }
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
    }, [editingCountry, reset]);

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourcountries.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        return response.data;
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingCountry(null);
        reset({ name: "" });
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name.trim());

        try {
            await handleUpdate(formData, editingCountry.id);
            setReloadTrigger((prev) => !prev);
            handleClose();
        } catch (err) {
            const msg =
                err?.response?.data?.errors?.name?.[0] ||
                err?.response?.data?.message ||
                "Something went wrong. Please try again.";
            setError("name", { message: msg });
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setValue("name", val, { shouldValidate: false });
        setActiveSuggestionIndex(-1);

        if (val.trim().length > 0) {
            const filtered = worldCountries
                .filter((name) =>
                    name.toLowerCase().includes(val.trim().toLowerCase()),
                )
                .slice(0, 8);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (name) => {
        setValue("name", name, { shouldValidate: true });
        setSuggestions([]);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        inputRef.current?.focus();
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
        }, 150);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            const next = (activeSuggestionIndex + 1) % suggestions.length;
            setActiveSuggestionIndex(next);
            suggestionRefs.current[next]?.scrollIntoView({ block: "nearest" });
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const prev =
                activeSuggestionIndex <= 0
                    ? suggestions.length - 1
                    : activeSuggestionIndex - 1;
            setActiveSuggestionIndex(prev);
            suggestionRefs.current[prev]?.scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
            e.preventDefault();
            handleSelectSuggestion(suggestions[activeSuggestionIndex]);
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
        }
    };

    const highlightMatch = (name, query) => {
        if (!query.trim()) return name;
        const index = name.toLowerCase().indexOf(query.trim().toLowerCase());
        if (index === -1) return name;
        return (
            <>
                {name.slice(0, index)}
                <span className="font-semibold text-indigo-600">
                    {name.slice(index, index + query.trim().length)}
                </span>
                {name.slice(index + query.trim().length)}
            </>
        );
    };

    if (!showForm || !editingCountry) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-visible shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Globe size={17} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">
                            Edit country
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-5 py-5 space-y-4"
                >
                    <div className="relative">
                        <label
                            htmlFor="edit-country-name"
                            className="block text-xs font-medium text-gray-500 mb-1.5"
                        >
                            Country name{" "}
                            <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="edit-country-name"
                            type="text"
                            placeholder="Type to search countries..."
                            autoComplete="off"
                            {...registerRest}
                            ref={(el) => {
                                registerRef(el);
                                inputRef.current = el;
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (suggestions.length > 0)
                                    setShowSuggestions(true);
                            }}
                            className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all
                                ${
                                    errors.name
                                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
                                        : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                                }`}
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-52">
                                <li className="px-3 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50 sticky top-0">
                                    Countries
                                </li>
                                {suggestions.map((name, i) => (
                                    <li
                                        key={name}
                                        ref={(el) =>
                                            (suggestionRefs.current[i] = el)
                                        }
                                        onMouseDown={() =>
                                            handleSelectSuggestion(name)
                                        }
                                        className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2
                                            ${
                                                activeSuggestionIndex === i
                                                    ? "bg-indigo-50 text-indigo-700"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Globe
                                            size={12}
                                            className="text-gray-300 shrink-0"
                                        />
                                        <span>
                                            {highlightMatch(name, countryName)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

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
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCountryForm;

// import axios from "axios";
// import { Globe, X } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import worldCountries from "@/data/worldCountries";

// const EditCountryForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingCountry,
//     setEditingCountry,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [countryName, setCountryName] = useState("");
//     const [error, setError] = useState("");
//     const [suggestions, setSuggestions] = useState([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
//     const inputRef = useRef(null);
//     const suggestionRefs = useRef([]);

//     useEffect(() => {
//         if (showForm) {
//             document.body.style.overflow = "hidden";
//             setTimeout(() => inputRef.current?.focus(), 50);
//         } else {
//             document.body.style.overflow = "";
//         }
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [showForm]);

//     useEffect(() => {
//         if (editingCountry) {
//             setCountryName(editingCountry.name);
//         } else {
//             setCountryName("");
//         }
//         setError("");
//         setSuggestions([]);
//         setShowSuggestions(false);
//         setActiveSuggestionIndex(-1);
//     }, [editingCountry]);

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourcountries.update", { id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } },
//         );
//         return response.data;
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingCountry(null);
//         setCountryName("");
//         setError("");
//         setSuggestions([]);
//         setShowSuggestions(false);
//         setActiveSuggestionIndex(-1);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!countryName.trim()) {
//             setError("Country name is required.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("name", countryName.trim());

//         try {
//             setSubmitting(true);
//             setError("");
//             await handleUpdate(formData, editingCountry.id);
//             setReloadTrigger((prev) => !prev);
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
//         const val = e.target.value;
//         setCountryName(val);
//         setActiveSuggestionIndex(-1);
//         if (error) setError("");

//         if (val.trim().length > 0) {
//             const filtered = worldCountries
//                 .filter((name) =>
//                     name.toLowerCase().includes(val.trim().toLowerCase()),
//                 )
//                 .slice(0, 8);
//             setSuggestions(filtered);
//             setShowSuggestions(filtered.length > 0);
//         } else {
//             setSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     const handleSelectSuggestion = (name) => {
//         setCountryName(name);
//         setSuggestions([]);
//         setShowSuggestions(false);
//         setActiveSuggestionIndex(-1);
//         if (error) setError("");
//         inputRef.current?.focus();
//     };

//     const handleBlur = () => {
//         setTimeout(() => {
//             setShowSuggestions(false);
//             setActiveSuggestionIndex(-1);
//         }, 150);
//     };

//     const handleKeyDown = (e) => {
//         if (!showSuggestions || suggestions.length === 0) return;

//         if (e.key === "ArrowDown") {
//             e.preventDefault();
//             const next = (activeSuggestionIndex + 1) % suggestions.length;
//             setActiveSuggestionIndex(next);
//             suggestionRefs.current[next]?.scrollIntoView({ block: "nearest" });
//         } else if (e.key === "ArrowUp") {
//             e.preventDefault();
//             const prev =
//                 activeSuggestionIndex <= 0
//                     ? suggestions.length - 1
//                     : activeSuggestionIndex - 1;
//             setActiveSuggestionIndex(prev);
//             suggestionRefs.current[prev]?.scrollIntoView({ block: "nearest" });
//         } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
//             e.preventDefault();
//             handleSelectSuggestion(suggestions[activeSuggestionIndex]);
//         } else if (e.key === "Escape") {
//             setShowSuggestions(false);
//             setActiveSuggestionIndex(-1);
//         }
//     };

//     const highlightMatch = (name, query) => {
//         if (!query.trim()) return name;
//         const index = name.toLowerCase().indexOf(query.trim().toLowerCase());
//         if (index === -1) return name;
//         return (
//             <>
//                 {name.slice(0, index)}
//                 <span className="font-semibold text-indigo-600">
//                     {name.slice(index, index + query.trim().length)}
//                 </span>
//                 {name.slice(index + query.trim().length)}
//             </>
//         );
//     };

//     if (!showForm || !editingCountry) return null;

//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-xl w-full max-w-md border border-gray-200 overflow-visible shadow-xl"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//                     <div className="flex items-center gap-2.5">
//                         <Globe size={17} className="text-gray-400" />
//                         <span className="text-sm font-medium text-gray-800">
//                             Edit country
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
//                     <div className="relative">
//                         <label
//                             htmlFor="edit-country-name"
//                             className="block text-xs font-medium text-gray-500 mb-1.5"
//                         >
//                             Country name{" "}
//                             <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             ref={inputRef}
//                             id="edit-country-name"
//                             type="text"
//                             name="name"
//                             value={countryName}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             onKeyDown={handleKeyDown}
//                             onFocus={() => {
//                                 if (suggestions.length > 0)
//                                     setShowSuggestions(true);
//                             }}
//                             placeholder="Type to search countries..."
//                             autoComplete="off"
//                             className={`w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all
//                                 ${
//                                     error
//                                         ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100"
//                                         : "border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
//                                 }`}
//                         />

//                         {/* Suggestions Dropdown */}
//                         {showSuggestions && suggestions.length > 0 && (
//                             <ul className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-52">
//                                 <li className="px-3 py-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50 sticky top-0">
//                                     Countries
//                                 </li>
//                                 {suggestions.map((name, i) => (
//                                     <li
//                                         key={name}
//                                         ref={(el) =>
//                                             (suggestionRefs.current[i] = el)
//                                         }
//                                         onMouseDown={() =>
//                                             handleSelectSuggestion(name)
//                                         }
//                                         className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2
//                                             ${
//                                                 activeSuggestionIndex === i
//                                                     ? "bg-indigo-50 text-indigo-700"
//                                                     : "text-gray-700 hover:bg-gray-50"
//                                             }`}
//                                     >
//                                         <Globe
//                                             size={12}
//                                             className="text-gray-300 shrink-0"
//                                         />
//                                         <span>
//                                             {highlightMatch(name, countryName)}
//                                         </span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}

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

// export default EditCountryForm;