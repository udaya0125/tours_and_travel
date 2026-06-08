import axios from "axios";
import { Globe, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const EditCountryForm = ({ 
    showForm, 
    setShowForm, 
    setReloadTrigger, 
    editingCountry, 
    setEditingCountry 
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [countryName, setCountryName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingCountry) {
            setCountryName(editingCountry.name);
        } else {
            setCountryName("");
        }
        setError("");
    }, [editingCountry]);

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourcountries.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingCountry(null);
        setCountryName("");
        setError("");
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
            await handleUpdate(formData, editingCountry.id);
            setReloadTrigger((prev) => !prev);
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

    if (!showForm || !editingCountry) return null;

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
                            Edit country
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
                            {submitting ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCountryForm;