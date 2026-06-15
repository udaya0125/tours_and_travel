import axios from "axios";
import { X, Plus, Trash2, AlertCircle, Package } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const emptyForm = {
    title: "",
    country_id: "",
    category_ids: [],
    sub_category_id: "",
    short_description: "",
    long_description: "",
    include: "",
    exclude: "",
    highlight: "",
    duration: "",
    difficulty: "",
    max_altitude: "",
    best_season: "",
    accommodation: "",
    meals: "",
    start_point: "",
    end_point: "",
    price: "",
};

const inputBase =
    "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";
const inputError =
    "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100";

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

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {children}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

const FieldError = ({ errors, field }) =>
    errors[field] ? (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {errors[field][0]}
        </p>
    ) : null;

const RichTextEditor = ({ value, onChange, error, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`rich-text-editor ${error ? "has-error" : ""}`}>
            <div
                className={`transition-all duration-200 overflow-hidden rounded-lg ${error ? "ring-2 ring-red-100" : ""}`}
                style={{
                    border: `1px solid ${error ? "#fca5a5" : isFocused ? "#9ca3af" : "#e5e7eb"}`,
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
                    className="custom-quill"
                />
            </div>
            {error && (
                <FieldError
                    errors={{ [error.field]: [error.message] }}
                    field={error.field}
                />
            )}
        </div>
    );
};

const RichTextEditorSmall = ({ value, onChange, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="rich-text-editor-small">
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
                    modules={{
                        toolbar: [
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link", "clean"],
                        ],
                    }}
                    formats={[
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "list",
                        "bullet",
                        "link",
                    ]}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="custom-quill-small"
                />
            </div>
        </div>
    );
};

const quillCustomStyles = `
    .custom-quill {
        display: flex;
        flex-direction: column;
        height: 250px;
        min-height: 200px;
        max-height: 400px;
    }
    .custom-quill .ql-toolbar {
        flex-shrink: 0;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border: none;
        border-bottom: 1px solid #e5e7eb;
        background-color: #ffffff;
        padding: 8px;
    }
    .custom-quill .ql-container {
        flex: 1;
        overflow-y: auto;
        min-height: 150px;
        max-height: 340px;
        font-size: 0.875rem;
        font-family: inherit;
        border: none;
    }
    .custom-quill .ql-editor {
        min-height: 150px;
        max-height: 320px;
        overflow-y: auto;
        background-color: #f9fafb;
        color: #1f2937;
        font-size: 0.875rem;
        line-height: 1.5;
    }
    .custom-quill .ql-editor.ql-blank::before {
        color: #9ca3af;
        font-style: normal;
        font-size: 0.875rem;
    }
    .custom-quill .ql-toolbar button:hover { color: #374151; }
    .custom-quill .ql-toolbar button.ql-active { color: #111827; }
    .custom-quill .ql-picker-label:hover { color: #374151; }
    .has-error .ql-toolbar { border-bottom-color: #fca5a5; }
    .custom-quill .ql-editor::-webkit-scrollbar,
    .custom-quill .ql-container::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-quill .ql-editor::-webkit-scrollbar-track,
    .custom-quill .ql-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
    .custom-quill .ql-editor::-webkit-scrollbar-thumb,
    .custom-quill .ql-container::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
    .custom-quill .ql-editor::-webkit-scrollbar-thumb:hover,
    .custom-quill .ql-container::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

    /* Small editor — mobile-first */
    .custom-quill-small { display: flex; flex-direction: column; height: auto; min-height: 90px; max-height: 180px; }
    .custom-quill-small .ql-toolbar {
        flex-shrink: 0;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        border: none;
        border-bottom: 1px solid #e5e7eb;
        background-color: #ffffff;
        padding: 5px;
        flex-wrap: wrap;
    }
    .custom-quill-small .ql-container { flex: 1; overflow-y: auto; min-height: 70px; max-height: 140px; font-size: 0.875rem; font-family: inherit; border: none; }
    .custom-quill-small .ql-editor { min-height: 70px; max-height: 130px; overflow-y: auto; background-color: #f9fafb; color: #1f2937; font-size: 0.875rem; line-height: 1.5; }
    .custom-quill-small .ql-editor.ql-blank::before { color: #9ca3af; font-style: normal; font-size: 0.875rem; }
    .custom-quill-small .ql-toolbar button { padding: 3px; }
    .custom-quill-small .ql-toolbar button:hover { color: #374151; }
    .custom-quill-small .ql-toolbar button.ql-active { color: #111827; }
    .custom-quill-small .ql-editor::-webkit-scrollbar,
    .custom-quill-small .ql-container::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-quill-small .ql-editor::-webkit-scrollbar-track,
    .custom-quill-small .ql-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
    .custom-quill-small .ql-editor::-webkit-scrollbar-thumb,
    .custom-quill-small .ql-container::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
    .custom-quill-small .ql-editor::-webkit-scrollbar-thumb:hover,
    .custom-quill-small .ql-container::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

    /* Tablet (≥640px) */
    @media (min-width: 640px) {
        .custom-quill-small { min-height: 100px; max-height: 200px; }
        .custom-quill-small .ql-toolbar { padding: 6px; }
        .custom-quill-small .ql-toolbar button { padding: 4px; }
        .custom-quill-small .ql-container { min-height: 80px; max-height: 160px; }
        .custom-quill-small .ql-editor { min-height: 80px; max-height: 150px; }
    }

    /* Desktop (≥1024px) */
    @media (min-width: 1024px) {
        .custom-quill-small { min-height: 110px; max-height: 220px; }
        .custom-quill-small .ql-container { min-height: 90px; max-height: 180px; }
        .custom-quill-small .ql-editor { min-height: 90px; max-height: 170px; }
    }
`;

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
        "&:hover": { borderColor: hasError ? "#fca5a5" : "#9ca3af" },
        transition: "all 0.15s ease",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 10px" }),
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
    menuList: (base) => ({ ...base, padding: "4px" }),
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

const AddPackageForm = ({
    showForm,
    setShowForm,
    editingPackage,
    setEditingPackage = () => {}, // ← default no-op
    setReloadTrigger,
    handleUpdate,
    allCountry = [],
    allCategory = [],
    allSubCategory = [],
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [packageForm, setPackageForm] = useState(emptyForm);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");

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
        if (editingPackage) {
            setPackageForm({
                title: editingPackage.title ?? "",
                country_id: editingPackage.country_id ?? "",
                category_ids: editingPackage.categories
                    ? editingPackage.categories.map((c) => String(c.id))
                    : (editingPackage.category_ids ?? []),
                sub_category_id: editingPackage.sub_category_id ?? "",
                short_description: editingPackage.short_description ?? "",
                long_description: editingPackage.long_description ?? "",
                include: editingPackage.include ?? "",
                exclude: editingPackage.exclude ?? "",
                highlight: editingPackage.highlight ?? "",
                duration: editingPackage.duration ?? "",
                difficulty: editingPackage.difficulty ?? "",
                max_altitude: editingPackage.max_altitude ?? "",
                best_season: editingPackage.best_season ?? "",
                accommodation: editingPackage.accommodation ?? "",
                meals: editingPackage.meals ?? "",
                start_point: editingPackage.start_point ?? "",
                end_point: editingPackage.end_point ?? "",
                price: editingPackage.price ?? "",
            });
            setItineraries(
                editingPackage.itineraries?.map((i) => ({
                    day: i.day,
                    title: i.title,
                    description: i.description ?? "",
                })) ?? [],
            );
            setSelectedImages([]);
            setShowForm(true);
        } else {
            setPackageForm(emptyForm);
            setItineraries([]);
            setSelectedImages([]);
        }
        setErrors({});
        setServerError("");
    }, [editingPackage]);

    const countryOptions = useMemo(
        () => allCountry.map((c) => ({ value: String(c.id), label: c.name })),
        [allCountry],
    );

    const filteredSubCategories = useMemo(
        () =>
            allSubCategory.filter((s) =>
                packageForm.category_ids.includes(String(s.category_id)),
            ),
        [allSubCategory, packageForm.category_ids],
    );

    const subCategoryOptions = useMemo(
        () =>
            filteredSubCategories.map((s) => ({
                value: String(s.id),
                label: s.name,
            })),
        [filteredSubCategories],
    );

    const selectedCountry =
        countryOptions.find(
            (o) => o.value === String(packageForm.country_id),
        ) || null;

    const selectedSubCategory =
        subCategoryOptions.find(
            (o) => o.value === String(packageForm.sub_category_id),
        ) || null;

    const noSubCategories =
        packageForm.category_ids.length > 0 &&
        filteredSubCategories.length === 0;

    const buildFormData = () => {
        const fd = new FormData();
        for (const key in packageForm) {
            if (key === "category_ids") continue;
            const val = packageForm[key];
            if (val !== null && val !== "") fd.append(key, val);
        }
        packageForm.category_ids.forEach((id) =>
            fd.append("category_ids[]", id),
        );
        selectedImages.forEach((file) => fd.append("images[]", file));
        itineraries.forEach((item, idx) => {
            fd.append(`itineraries[${idx}][day]`, item.day);
            // fd.append(`itineraries[${idx}][title]`, item.title);
            fd.append(`itineraries[${idx}][title]`, item.title ?? "");
            fd.append(
                `itineraries[${idx}][description]`,
                item.description ?? "",
            );
        });
        return fd;
    };

    const parseError = (error) => {
        const response = error?.response;
        if (!response) {
            setServerError("Network error — no response from server.");
            return;
        }
        const { status, data } = response;
        if (status === 422) {
            setErrors(data.errors ?? {});
            setServerError("");
        } else {
            setServerError(data.message ?? `Unexpected error (${status}).`);
            setErrors({});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerError("");

        if (packageForm.category_ids.length === 0) {
            setErrors({
                category_ids: ["Please select at least one category."],
            });
            return;
        }

        const formData = buildFormData();
        try {
            setSubmitting(true);
            if (editingPackage) {
                await handleUpdate(formData, editingPackage.id);
            } else {
                await axios.post(route("ourpackages.store"), formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setReloadTrigger((prev) => !prev);
            }
            handleClose();
        } catch (error) {
            parseError(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPackageForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleRichTextChange = (field, value) => {
        setPackageForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field])
            setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleCategoryToggle = (id) => {
        const sid = String(id);
        setPackageForm((prev) => {
            const newIds = prev.category_ids.includes(sid)
                ? prev.category_ids.filter((c) => c !== sid)
                : [...prev.category_ids, sid];
            const subStillValid = allSubCategory.some(
                (s) =>
                    String(s.id) === String(prev.sub_category_id) &&
                    newIds.includes(String(s.category_id)),
            );
            return {
                ...prev,
                category_ids: newIds,
                sub_category_id: subStillValid ? prev.sub_category_id : "",
            };
        });
        if (errors.category_ids)
            setErrors((prev) => ({ ...prev, category_ids: undefined }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages((prev) => [...prev, ...files]);
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
                f.type,
            ),
        );
        if (files.length) setSelectedImages((prev) => [...prev, ...files]);
    };

    const removeImage = (idx) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const addItinerary = () =>
        setItineraries((prev) => [
            ...prev,
            { day: prev.length + 1, title: "", description: "" },
        ]);

    const updateItinerary = (idx, field, value) =>
        setItineraries((prev) =>
            prev.map((item, i) =>
                i === idx ? { ...item, [field]: value } : item,
            ),
        );

    const removeItinerary = (idx) =>
        setItineraries((prev) => prev.filter((_, i) => i !== idx));

    // const handleClose = () => {
    //     setShowForm(false);
    //     setEditingPackage(null);
    //     setPackageForm(emptyForm);
    //     setItineraries([]);
    //     setSelectedImages([]);
    //     setErrors({});
    //     setServerError("");
    // };
    // AddPackageForm.jsx — handleClose, line ~481

    const handleClose = () => {
        setShowForm(false);
        if (typeof setEditingPackage === "function") setEditingPackage(null); // ← guard added
        setPackageForm(emptyForm);
        setItineraries([]);
        setSelectedImages([]);
        setErrors({});
        setServerError("");
    };

    const cls = (field) => (errors[field] ? inputError : inputBase);

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl w-full max-w-4xl border border-gray-200 overflow-hidden flex flex-col"
                style={{ maxHeight: "calc(100vh - 2rem)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <Package size={17} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">
                            {editingPackage
                                ? "Edit package"
                                : "Add new package"}
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

                {/* Server error banner */}
                {serverError && (
                    <div className="mx-5 mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-400 rounded-lg px-4 py-3 text-xs shrink-0">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <span>{serverError}</span>
                    </div>
                )}

                {/* Scrollable body */}
                <form
                    onSubmit={handleSubmit}
                    className="overflow-y-auto px-5 py-5 flex flex-col gap-4 flex-1 min-h-0"
                >
                    {/* Basic Info */}
                    <SectionHeading>Basic info</SectionHeading>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            name="title"
                            value={packageForm.title}
                            onChange={handleChange}
                            placeholder="Package title"
                            className={cls("title")}
                        />
                        <FieldError errors={errors} field="title" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Country <span className="text-red-400">*</span>
                            </label>
                            <Select
                                options={countryOptions}
                                value={selectedCountry}
                                onChange={(selected) => {
                                    setPackageForm((prev) => ({
                                        ...prev,
                                        country_id: selected
                                            ? selected.value
                                            : "",
                                    }));
                                    if (errors.country_id)
                                        setErrors((prev) => ({
                                            ...prev,
                                            country_id: undefined,
                                        }));
                                }}
                                placeholder="Select country"
                                isClearable
                                styles={makeSelectStyles(!!errors.country_id)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                            <FieldError errors={errors} field="country_id" />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Price (USD)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={packageForm.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className={cls("price")}
                            />
                            <FieldError errors={errors} field="price" />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                            Categories <span className="text-red-400">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {allCategory.map((cat) => {
                                const checked =
                                    packageForm.category_ids.includes(
                                        String(cat.id),
                                    );
                                return (
                                    <label
                                        key={cat.id}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full border cursor-pointer text-xs font-medium transition-colors ${
                                            checked
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={checked}
                                            onChange={() =>
                                                handleCategoryToggle(cat.id)
                                            }
                                        />
                                        {cat.name}
                                    </label>
                                );
                            })}
                        </div>
                        <FieldError errors={errors} field="category_ids" />
                    </div>

                    {/* Sub Category */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Sub category
                        </label>
                        {packageForm.category_ids.length === 0 ? (
                            <p className="text-xs text-gray-400">
                                Select a category first to see sub-categories.
                            </p>
                        ) : noSubCategories ? (
                            <p className="text-xs text-gray-400">
                                No sub-categories available for the selected
                                categories.
                            </p>
                        ) : (
                            <Select
                                options={subCategoryOptions}
                                value={selectedSubCategory}
                                onChange={(selected) => {
                                    setPackageForm((prev) => ({
                                        ...prev,
                                        sub_category_id: selected
                                            ? selected.value
                                            : "",
                                    }));
                                    if (errors.sub_category_id)
                                        setErrors((prev) => ({
                                            ...prev,
                                            sub_category_id: undefined,
                                        }));
                                }}
                                placeholder="Select sub-category"
                                isClearable
                                styles={makeSelectStyles(
                                    !!errors.sub_category_id,
                                )}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                        )}
                    </div>

                    {/* Rich text fields */}
                    <SectionHeading>Short Description</SectionHeading>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Short Description
                        </label>
                        <RichTextEditor
                            value={packageForm.short_description}
                            onChange={(value) =>
                                handleRichTextChange("short_description", value)
                            }
                            error={
                                errors.short_description
                                    ? {
                                          field: "short_description",
                                          message: errors.short_description[0],
                                      }
                                    : null
                            }
                            placeholder="Write a brief description of the package..."
                        />
                    </div>

                    <SectionHeading>Long Description</SectionHeading>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Long Description
                        </label>
                        <RichTextEditor
                            value={packageForm.long_description}
                            onChange={(value) =>
                                handleRichTextChange("long_description", value)
                            }
                            error={
                                errors.long_description
                                    ? {
                                          field: "long_description",
                                          message: errors.long_description[0],
                                      }
                                    : null
                            }
                            placeholder="Write a detailed description of the package..."
                        />
                    </div>

                    <SectionHeading>Highlights</SectionHeading>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Highlights
                        </label>
                        <RichTextEditor
                            value={packageForm.highlight}
                            onChange={(value) =>
                                handleRichTextChange("highlight", value)
                            }
                            error={
                                errors.highlight
                                    ? {
                                          field: "highlight",
                                          message: errors.highlight[0],
                                      }
                                    : null
                            }
                            placeholder="List the key highlights of the package..."
                        />
                    </div>

                    <SectionHeading>What's Included</SectionHeading>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            What's Included
                        </label>
                        <RichTextEditor
                            value={packageForm.include}
                            onChange={(value) =>
                                handleRichTextChange("include", value)
                            }
                            error={
                                errors.include
                                    ? {
                                          field: "include",
                                          message: errors.include[0],
                                      }
                                    : null
                            }
                            placeholder="List all items, services, and amenities included in the package..."
                        />
                    </div>

                    <SectionHeading>What's Excluded</SectionHeading>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            What's Excluded
                        </label>
                        <RichTextEditor
                            value={packageForm.exclude}
                            onChange={(value) =>
                                handleRichTextChange("exclude", value)
                            }
                            error={
                                errors.exclude
                                    ? {
                                          field: "exclude",
                                          message: errors.exclude[0],
                                      }
                                    : null
                            }
                            placeholder="List items, services, or costs not included in the package..."
                        />
                    </div>

                    {/* Trip Details */}
                    <SectionHeading>Trip details</SectionHeading>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            ["duration", "Duration"],
                            ["difficulty", "Difficulty"],
                            ["max_altitude", "Max altitude"],
                            ["best_season", "Best season"],
                            ["accommodation", "Accommodation"],
                            ["meals", "Meals"],
                            ["start_point", "Start point"],
                            ["end_point", "End point"],
                        ].map(([name, label]) => (
                            <div key={name}>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    {label}
                                </label>
                                <input
                                    name={name}
                                    value={packageForm[name]}
                                    onChange={handleChange}
                                    className={cls(name)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Images */}
                    <SectionHeading>Images</SectionHeading>

                    <div className="flex flex-col gap-3">
                        <label
                            className={`relative flex flex-col items-center justify-center gap-2.5 w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 py-8 ${
                                isDragging
                                    ? "border-gray-400 bg-gray-100 scale-[0.995]"
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/60"
                            }`}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isDragging ? "bg-gray-300" : "bg-gray-200/80"}`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="17"
                                    height="17"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-500"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                    />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-medium text-gray-600">
                                    {isDragging ? (
                                        "Drop to upload"
                                    ) : (
                                        <>
                                            Drag & drop or{" "}
                                            <span className="text-gray-800 underline underline-offset-2">
                                                browse files
                                            </span>
                                        </>
                                    )}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    JPG, PNG, WEBP — multiple allowed
                                </p>
                            </div>
                            {editingPackage && (
                                <p className="text-[11px] text-gray-400 bg-gray-200/60 px-2.5 py-1 rounded-full">
                                    New uploads will be added to existing images
                                </p>
                            )}
                        </label>

                        {selectedImages.length > 0 && (
                            <div>
                                <p className="text-[11px] text-gray-400 mb-2">
                                    {selectedImages.length} image
                                    {selectedImages.length !== 1
                                        ? "s"
                                        : ""}{" "}
                                    selected
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                                    {selectedImages.map((file, idx) => {
                                        const url = URL.createObjectURL(file);
                                        return (
                                            <div
                                                key={idx}
                                                className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                                                style={{ aspectRatio: "1 / 1" }}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`preview-${idx}`}
                                                    className="w-full h-full object-cover"
                                                    onLoad={() =>
                                                        URL.revokeObjectURL(url)
                                                    }
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(idx)
                                                        }
                                                        className="p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-white hover:scale-110 transition-all duration-150 shadow-sm"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                    <p className="text-[10px] text-white truncate leading-tight">
                                                        {file.name}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <FieldError errors={errors} field="images" />
                    </div>

                    {/* Itinerary */}
                    <SectionHeading>Itinerary</SectionHeading>

                    <div className="flex flex-col gap-3">
                        {itineraries.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex gap-2 sm:gap-3 items-start p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <div className="flex flex-col gap-2 flex-1 min-w-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input
                                            placeholder="Day (e.g. 1)"
                                            value={item.day}
                                            onChange={(e) =>
                                                updateItinerary(
                                                    idx,
                                                    "day",
                                                    e.target.value,
                                                )
                                            }
                                            className={inputBase}
                                        />
                                        <input
                                            placeholder="Title"
                                            value={item.title}
                                            onChange={(e) =>
                                                updateItinerary(
                                                    idx,
                                                    "title",
                                                    e.target.value,
                                                )
                                            }
                                            className={inputBase}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-500">
                                            Description
                                        </label>
                                        <RichTextEditorSmall
                                            value={item.description}
                                            onChange={(value) =>
                                                updateItinerary(
                                                    idx,
                                                    "description",
                                                    value,
                                                )
                                            }
                                            placeholder="Describe the day's activities..."
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItinerary(idx)}
                                    className="mt-1 p-1.5 shrink-0 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItinerary}
                            className="flex items-center gap-2 w-fit px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Plus size={15} />
                            Add day
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2.5 pt-3 mt-1 border-t border-gray-100 shrink-0">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting
                                ? "Saving…"
                                : editingPackage
                                  ? "Save changes"
                                  : "Create package"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPackageForm;
