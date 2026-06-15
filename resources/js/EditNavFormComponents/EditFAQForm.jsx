import React, { useState, useEffect, useMemo } from "react";
import { X, HelpCircle } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
    ],
};

const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "check",
    "indent",
    "align",
    "link",
    "image",
    "video",
];

const inputBase =
    "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {children}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

// Rich Text Editor Component with scrollable content (same as AddPackageForm)
const RichTextEditor = ({ value, onChange, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="rich-text-editor">
            <div
                className={`transition-all duration-200 overflow-hidden rounded-lg`}
                style={{
                    border: `1px solid ${isFocused ? "#9ca3af" : "#e5e7eb"}`,
                    borderRadius: "0.5rem",
                }}
            >
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="custom-quill-faq"
                />
            </div>
        </div>
    );
};

// Custom CSS for Quill editor with scrollable content (matching AddPackageForm)
const quillCustomStyles = `
    .custom-quill-faq {
        display: flex;
        flex-direction: column;
        height: 250px;
        min-height: 200px;
        max-height: 400px;
    }
    
    .custom-quill-faq .ql-toolbar {
        flex-shrink: 0;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border: none;
        border-bottom: 1px solid #e5e7eb;
        background-color: #ffffff;
        padding: 8px;
    }
    
    .custom-quill-faq .ql-container {
        flex: 1;
        overflow-y: auto;
        min-height: 150px;
        max-height: 340px;
        font-size: 0.875rem;
        font-family: inherit;
        border: none;
    }
    
    .custom-quill-faq .ql-editor {
        min-height: 150px;
        max-height: 320px;
        overflow-y: auto;
        background-color: #f9fafb;
        color: #1f2937;
        font-size: 0.875rem;
        line-height: 1.5;
    }
    
    .custom-quill-faq .ql-editor.ql-blank::before {
        color: #9ca3af;
        font-style: normal;
        font-size: 0.875rem;
    }
    
    .custom-quill-faq .ql-toolbar button:hover {
        color: #374151;
    }
    
    .custom-quill-faq .ql-toolbar button.ql-active {
        color: #111827;
    }
    
    .custom-quill-faq .ql-picker-label:hover {
        color: #374151;
    }
    
    /* Scrollbar styling */
    .custom-quill-faq .ql-editor::-webkit-scrollbar,
    .custom-quill-faq .ql-container::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    .custom-quill-faq .ql-editor::-webkit-scrollbar-track,
    .custom-quill-faq .ql-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    .custom-quill-faq .ql-editor::-webkit-scrollbar-thumb,
    .custom-quill-faq .ql-container::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }
    
    .custom-quill-faq .ql-editor::-webkit-scrollbar-thumb:hover,
    .custom-quill-faq .ql-container::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
`;

// Inject custom styles
if (typeof document !== "undefined") {
    const styleElement = document.createElement("style");
    styleElement.textContent = quillCustomStyles;
    document.head.appendChild(styleElement);
}

const makeSelectStyles = (hasError = false, isDisabled = false) => ({
    control: (base, state) => ({
        ...base,
        minHeight: "38px",
        fontSize: "0.875rem",
        borderRadius: "0.5rem",
        borderColor: hasError
            ? "#fca5a5"
            : state.isFocused
              ? "#9ca3af"
              : "#e5e7eb",
        backgroundColor: isDisabled
            ? "#f3f4f6"
            : hasError
              ? "#fef2f2"
              : "#f9fafb",
        boxShadow: state.isFocused
            ? hasError
                ? "0 0 0 2px #fee2e2"
                : "0 0 0 2px #f3f4f6"
            : "none",
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? "not-allowed" : "default",
        pointerEvents: isDisabled ? "none" : "auto",
        "&:hover": {
            borderColor: hasError ? "#fca5a5" : "#9ca3af",
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
        borderRadius: "0.375rem",
        backgroundColor: state.isSelected
            ? "#111827"
            : state.isFocused
              ? "#f3f4f6"
              : "white",
        color: state.isSelected ? "white" : "#1f2937",
        "&:active": { backgroundColor: "#374151" },
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
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
});

const EditFAQForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    editingFaq,
    setEditingFaq,
    handleUpdate,
    allCategories = [],
    allPackages = [],
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [packageId, setPackageId] = useState("");
    const [editQa, setEditQa] = useState({ question: "", answer: "" });

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

    // Filter packages based on selected category
    const filteredPackages = useMemo(() => {
        if (!categoryId) return allPackages; // Show all packages if no category selected
        return allPackages.filter((pkg) => {
            // Check if package belongs to selected category
            // Handle different possible data structures
            if (pkg.category_id) {
                return String(pkg.category_id) === String(categoryId);
            }
            if (pkg.categories && Array.isArray(pkg.categories)) {
                return pkg.categories.some(
                    (cat) => String(cat.id) === String(categoryId),
                );
            }
            if (pkg.category && pkg.category.id) {
                return String(pkg.category.id) === String(categoryId);
            }
            return false;
        });
    }, [categoryId, allPackages]);

    const categoryOptions = useMemo(
        () =>
            allCategories.map((cat) => ({
                value: String(cat.id),
                label: cat.name,
            })),
        [allCategories],
    );

    const packageOptions = useMemo(
        () =>
            filteredPackages.map((pkg) => ({
                value: String(pkg.id),
                label: pkg.name ?? pkg.title ?? `Package ${pkg.id}`,
            })),
        [filteredPackages],
    );

    const selectedCategory =
        categoryOptions.find((o) => o.value === String(categoryId)) || null;
    const selectedPackage =
        packageOptions.find((o) => o.value === String(packageId)) || null;

    // Populate form when editingFaq changes
    useEffect(() => {
        if (editingFaq) {
            console.log("Editing FAQ:", editingFaq); // Debug log
            setCategoryId(String(editingFaq.category_id ?? ""));
            setPackageId(String(editingFaq.package_id ?? ""));
            setEditQa({
                question: editingFaq.question ?? "",
                answer: editingFaq.answer ?? "",
            });
        }
    }, [editingFaq]);

    // Validate package still belongs to selected category when category changes
    useEffect(() => {
        if (packageId && categoryId) {
            const packageBelongsToCategory = filteredPackages.some(
                (pkg) => String(pkg.id) === String(packageId),
            );
            if (!packageBelongsToCategory) {
                setPackageId(""); // Clear package if it doesn't belong to selected category
            }
        }
    }, [categoryId, filteredPackages, packageId]);

    const resetForm = () => {
        setCategoryId("");
        setPackageId("");
        setEditQa({ question: "", answer: "" });
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingFaq(null);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            alert("Please select a category.");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("question", editQa.question);
            formData.append("answer", editQa.answer);
            formData.append("category_id", categoryId);
            if (packageId) formData.append("package_id", packageId);
            await handleUpdate(formData, editingFaq.id);
            setReloadTrigger((prev) => !prev);
            handleClose();
        } catch (err) {
            console.error("Update error", err);
        } finally {
            setSubmitting(false);
        }
    };

    const noPackages = filteredPackages.length === 0;

    // Debug logging
    useEffect(() => {
        if (showForm && editingFaq) {
            console.log("Package ID to select:", packageId);
            console.log("Available packages:", packageOptions);
            console.log("Selected package object:", selectedPackage);
        }
    }, [showForm, editingFaq, packageId, packageOptions, selectedPackage]);

    if (!showForm || !editingFaq) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl w-full max-w-3xl border border-gray-200 overflow-hidden flex flex-col"
                style={{ maxHeight: "calc(100vh - 2rem)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <HelpCircle size={17} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">
                            Edit FAQ
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

                {/* Scrollable body */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto px-5 py-5 flex flex-col gap-4 flex-1 min-h-0"
                >
                    {/* Category & Package */}
                    <SectionHeading>Assignment</SectionHeading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <Select
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={(selected) => {
                                    setCategoryId(
                                        selected ? selected.value : "",
                                    );
                                    // Don't automatically clear package here - let the validation useEffect handle it
                                }}
                                placeholder="— Select category —"
                                isClearable
                                styles={makeSelectStyles()}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                        </div>

                        {/* Package */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">
                                Package
                            </label>
                            <Select
                                options={packageOptions}
                                value={selectedPackage}
                                onChange={(selected) =>
                                    setPackageId(selected ? selected.value : "")
                                }
                                placeholder={
                                    !categoryId
                                        ? "Select a category first"
                                        : "— Select package —"
                                }
                                isClearable
                                isDisabled={!categoryId}
                                styles={makeSelectStyles(false, !categoryId)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                            {categoryId && noPackages && (
                                <p className="text-xs text-amber-500">
                                    No packages available for this category
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Question & Answer */}
                    <SectionHeading>Question & Answer</SectionHeading>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">
                                Question <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={editQa.question}
                                onChange={(e) =>
                                    setEditQa((prev) => ({
                                        ...prev,
                                        question: e.target.value,
                                    }))
                                }
                                required
                                placeholder="Enter the question"
                                className={inputBase}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">
                                Answer <span className="text-red-400">*</span>
                            </label>
                            <RichTextEditor
                                value={editQa.answer}
                                onChange={(value) =>
                                    setEditQa((prev) => ({
                                        ...prev,
                                        answer: value,
                                    }))
                                }
                                placeholder="Write a clear, helpful answer..."
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-2.5 pt-3 mt-1 border-t border-gray-100 shrink-0">
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

export default EditFAQForm;
