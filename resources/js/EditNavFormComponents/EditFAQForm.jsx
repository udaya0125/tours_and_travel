import React, { useState, useEffect, useMemo } from "react";
import { X, HelpCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "check", "indent", "align",
    "link", "image", "video",
];

const inputBase =
    "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";
const inputError =
    "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100";

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {children}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

const isQuillEmpty = (value) => {
    if (!value) return true;
    return value.replace(/<[^>]*>/g, "").trim() === "";
};

const RichTextEditor = ({ value, onChange, placeholder, hasError }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="rich-text-editor">
            <div
                className="transition-all duration-200 overflow-hidden rounded-lg"
                style={{
                    border: `1px solid ${hasError ? "#fca5a5" : isFocused ? "#9ca3af" : "#e5e7eb"}`,
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

const quillCustomStyles = `
    .custom-quill-faq { display: flex; flex-direction: column; height: 250px; min-height: 200px; max-height: 400px; }
    .custom-quill-faq .ql-toolbar { flex-shrink: 0; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border: none; border-bottom: 1px solid #e5e7eb; background-color: #ffffff; padding: 8px; }
    .custom-quill-faq .ql-container { flex: 1; overflow-y: auto; min-height: 150px; max-height: 340px; font-size: 0.875rem; font-family: inherit; border: none; }
    .custom-quill-faq .ql-editor { min-height: 150px; max-height: 320px; overflow-y: auto; background-color: #f9fafb; color: #1f2937; font-size: 0.875rem; line-height: 1.5; }
    .custom-quill-faq .ql-editor.ql-blank::before { color: #9ca3af; font-style: normal; font-size: 0.875rem; }
    .custom-quill-faq .ql-toolbar button:hover { color: #374151; }
    .custom-quill-faq .ql-toolbar button.ql-active { color: #111827; }
    .custom-quill-faq .ql-picker-label:hover { color: #374151; }
    .custom-quill-faq .ql-editor::-webkit-scrollbar, .custom-quill-faq .ql-container::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-quill-faq .ql-editor::-webkit-scrollbar-track, .custom-quill-faq .ql-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
    .custom-quill-faq .ql-editor::-webkit-scrollbar-thumb, .custom-quill-faq .ql-container::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
    .custom-quill-faq .ql-editor::-webkit-scrollbar-thumb:hover, .custom-quill-faq .ql-container::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
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
        borderColor: hasError ? "#fca5a5" : state.isFocused ? "#9ca3af" : "#e5e7eb",
        backgroundColor: isDisabled ? "#f3f4f6" : hasError ? "#fef2f2" : "#f9fafb",
        boxShadow: state.isFocused ? (hasError ? "0 0 0 2px #fee2e2" : "0 0 0 2px #f3f4f6") : "none",
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? "not-allowed" : "default",
        pointerEvents: isDisabled ? "none" : "auto",
        "&:hover": { borderColor: hasError ? "#fca5a5" : "#9ca3af" },
        transition: "all 0.15s ease",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 10px" }),
    placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
    singleValue: (base) => ({ ...base, color: "#1f2937", fontSize: "0.875rem" }),
    option: (base, state) => ({
        ...base,
        fontSize: "0.875rem",
        borderRadius: "0.375rem",
        backgroundColor: state.isSelected ? "#111827" : state.isFocused ? "#f3f4f6" : "white",
        color: state.isSelected ? "white" : "#1f2937",
        "&:active": { backgroundColor: "#374151" },
        cursor: "pointer",
    }),
    menu: (base) => ({
        ...base,
        borderRadius: "0.5rem",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
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

const ErrorMsg = ({ message }) =>
    message ? (
        <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {message}
        </p>
    ) : null;

const EditFAQForm = ({
    showForm,
    setShowForm,
    editingFaq,
    setEditingFaq,
    handleUpdate,
    allCategories = [],
    allPackages = [],
}) => {
    const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            category_id: null,
            package_id: null,
            question: "",
            answer: "",
        },
    });

    const categoryId = watch("category_id");

    useEffect(() => {
        document.body.style.overflow = showForm ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [showForm]);

    // Populate form when editingFaq changes
    useEffect(() => {
        if (editingFaq) {
            const catOption =
                allCategories
                    .map((c) => ({ value: String(c.id), label: c.name }))
                    .find((o) => o.value === String(editingFaq.category_id ?? "")) || null;

            const pkgOption =
                allPackages
                    .map((p) => ({ value: String(p.id), label: p.name ?? p.title ?? `Package ${p.id}` }))
                    .find((o) => o.value === String(editingFaq.package_id ?? "")) || null;

            reset({
                category_id: catOption,
                package_id: pkgOption,
                question: editingFaq.question ?? "",
                answer: editingFaq.answer ?? "",
            });
        }
    }, [editingFaq, allCategories, allPackages, reset]);

    const filteredPackages = useMemo(() => {
        if (!categoryId) return allPackages;
        return allPackages.filter((pkg) => {
            if (pkg.category_id) return String(pkg.category_id) === String(categoryId.value);
            if (pkg.categories?.length) return pkg.categories.some((cat) => String(cat.id) === String(categoryId.value));
            if (pkg.category?.id) return String(pkg.category.id) === String(categoryId.value);
            return false;
        });
    }, [categoryId, allPackages]);

    const categoryOptions = useMemo(
        () => allCategories.map((cat) => ({ value: String(cat.id), label: cat.name })),
        [allCategories],
    );

    const packageOptions = useMemo(
        () => filteredPackages.map((pkg) => ({ value: String(pkg.id), label: pkg.name ?? pkg.title ?? `Package ${pkg.id}` })),
        [filteredPackages],
    );

    const noPackages = !!categoryId && filteredPackages.length === 0;

    const handleClose = () => {
        setShowForm(false);
        setEditingFaq(null);
        reset({ category_id: null, package_id: null, question: "", answer: "" });
    };

    const updateMutation = useMutation({
        mutationFn: ({ formData, id }) => handleUpdate(formData, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            handleClose();
        },
        onError: (err) => {
            const apiErrors = err?.response?.data?.errors;
            if (apiErrors) {
                Object.entries(apiErrors).forEach(([key, val]) => {
                    setError(key, { message: val[0] });
                });
            } else {
                setError("root", {
                    message: err?.response?.data?.message ?? "Something went wrong.",
                });
            }
        },
    });

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("question", data.question);
        formData.append("answer", data.answer);
        formData.append("category_id", data.category_id.value);
        formData.append("package_id", data.package_id.value);
        updateMutation.mutate({ formData, id: editingFaq.id });
    };

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
                        <span className="text-sm font-medium text-gray-800">Edit FAQ</span>
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
                    onSubmit={handleSubmit(onSubmit)}
                    className="overflow-y-auto px-5 py-5 flex flex-col gap-4 flex-1 min-h-0"
                >
                    {errors.root && (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                            <span>⚠</span> {errors.root.message}
                        </p>
                    )}

                    {/* Category & Package */}
                    <SectionHeading>Assignment</SectionHeading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">
                                Category <span className="text-red-400">*</span>
                            </label>
                            <Controller
                                name="category_id"
                                control={control}
                                rules={{ required: "Please select a category." }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={categoryOptions}
                                        placeholder="— Select category —"
                                        isClearable
                                        styles={makeSelectStyles(!!errors.category_id)}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                        onChange={(selected) => {
                                            field.onChange(selected);
                                            const currentPkg = watch("package_id");
                                            if (currentPkg && selected) {
                                                const pkg = allPackages.find(
                                                    (p) => String(p.id) === String(currentPkg.value),
                                                );
                                                const stillValid =
                                                    pkg?.categories?.some(
                                                        (c) => String(c.id) === String(selected.value),
                                                    ) || String(pkg?.category_id) === String(selected.value);
                                                if (!stillValid) setValue("package_id", null);
                                            } else {
                                                setValue("package_id", null);
                                            }
                                        }}
                                    />
                                )}
                            />
                            <ErrorMsg message={errors.category_id?.message} />
                            {noPackages && (
                                <p className="text-xs text-amber-500">
                                    No packages available for this category
                                </p>
                            )}
                        </div>

                        {/* Package */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">
                                Package <span className="text-red-400">*</span>
                            </label>
                            <Controller
                                name="package_id"
                                control={control}
                                rules={{ required: "Please select a package." }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={packageOptions}
                                        placeholder={!categoryId ? "Select a category first" : "— Select package —"}
                                        isClearable
                                        isDisabled={!categoryId || noPackages}
                                        styles={makeSelectStyles(!!errors.package_id, !categoryId || noPackages)}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                            <ErrorMsg message={errors.package_id?.message} />
                        </div>
                    </div>

                    {/* Question & Answer */}
                    <SectionHeading>Question & Answer</SectionHeading>
                    <div className="flex flex-col gap-4">
                        {/* Question */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">
                                Question <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("question", {
                                    required: "Question is required.",
                                    validate: (v) => !!v.trim() || "Question cannot be blank.",
                                })}
                                placeholder="Enter the question"
                                className={errors.question ? inputError : inputBase}
                            />
                            <ErrorMsg message={errors.question?.message} />
                        </div>

                        {/* Answer */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-500">
                                Answer <span className="text-red-400">*</span>
                            </label>
                            <Controller
                                name="answer"
                                control={control}
                                rules={{
                                    required: "Answer is required.",
                                    validate: (v) => !isQuillEmpty(v) || "Answer cannot be blank.",
                                }}
                                render={({ field }) => (
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Write a clear, helpful answer..."
                                        hasError={!!errors.answer}
                                    />
                                )}
                            />
                            <ErrorMsg message={errors.answer?.message} />
                        </div>
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
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateMutation.isPending ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFAQForm;



// import React, { useState, useEffect, useMemo } from "react";
// import { X, HelpCircle } from "lucide-react";
// import { useForm, Controller } from "react-hook-form";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import Select from "react-select";

// const quillModules = {
//     toolbar: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         [{ align: [] }],
//         ["link", "image", "video"],
//         ["clean"],
//     ],
// };

// const quillFormats = [
//     "header", "bold", "italic", "underline", "strike",
//     "list", "bullet", "check", "indent", "align",
//     "link", "image", "video",
// ];

// const inputBase =
//     "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";
// const inputError =
//     "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100";

// const SectionHeading = ({ children }) => (
//     <div className="flex items-center gap-2 mt-1">
//         <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
//             {children}
//         </span>
//         <div className="flex-1 h-px bg-gray-100" />
//     </div>
// );

// // Helper: Quill always returns "<p><br></p>" for empty — strip tags to check truly empty
// const isQuillEmpty = (value) => {
//     if (!value) return true;
//     return value.replace(/<[^>]*>/g, "").trim() === "";
// };

// const RichTextEditor = ({ value, onChange, placeholder, hasError }) => {
//     const [isFocused, setIsFocused] = useState(false);
//     return (
//         <div className="rich-text-editor">
//             <div
//                 className="transition-all duration-200 overflow-hidden rounded-lg"
//                 style={{
//                     border: `1px solid ${hasError ? "#fca5a5" : isFocused ? "#9ca3af" : "#e5e7eb"}`,
//                     borderRadius: "0.5rem",
//                 }}
//             >
//                 <ReactQuill
//                     theme="snow"
//                     value={value}
//                     onChange={onChange}
//                     modules={quillModules}
//                     formats={quillFormats}
//                     placeholder={placeholder}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => setIsFocused(false)}
//                     className="custom-quill-faq"
//                 />
//             </div>
//         </div>
//     );
// };

// const quillCustomStyles = `
//     .custom-quill-faq { display: flex; flex-direction: column; height: 250px; min-height: 200px; max-height: 400px; }
//     .custom-quill-faq .ql-toolbar { flex-shrink: 0; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; border: none; border-bottom: 1px solid #e5e7eb; background-color: #ffffff; padding: 8px; }
//     .custom-quill-faq .ql-container { flex: 1; overflow-y: auto; min-height: 150px; max-height: 340px; font-size: 0.875rem; font-family: inherit; border: none; }
//     .custom-quill-faq .ql-editor { min-height: 150px; max-height: 320px; overflow-y: auto; background-color: #f9fafb; color: #1f2937; font-size: 0.875rem; line-height: 1.5; }
//     .custom-quill-faq .ql-editor.ql-blank::before { color: #9ca3af; font-style: normal; font-size: 0.875rem; }
//     .custom-quill-faq .ql-toolbar button:hover { color: #374151; }
//     .custom-quill-faq .ql-toolbar button.ql-active { color: #111827; }
//     .custom-quill-faq .ql-picker-label:hover { color: #374151; }
//     .custom-quill-faq .ql-editor::-webkit-scrollbar, .custom-quill-faq .ql-container::-webkit-scrollbar { width: 6px; height: 6px; }
//     .custom-quill-faq .ql-editor::-webkit-scrollbar-track, .custom-quill-faq .ql-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
//     .custom-quill-faq .ql-editor::-webkit-scrollbar-thumb, .custom-quill-faq .ql-container::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
//     .custom-quill-faq .ql-editor::-webkit-scrollbar-thumb:hover, .custom-quill-faq .ql-container::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
// `;

// if (typeof document !== "undefined") {
//     const styleElement = document.createElement("style");
//     styleElement.textContent = quillCustomStyles;
//     document.head.appendChild(styleElement);
// }

// const makeSelectStyles = (hasError = false, isDisabled = false) => ({
//     control: (base, state) => ({
//         ...base,
//         minHeight: "38px",
//         fontSize: "0.875rem",
//         borderRadius: "0.5rem",
//         borderColor: hasError ? "#fca5a5" : state.isFocused ? "#9ca3af" : "#e5e7eb",
//         backgroundColor: isDisabled ? "#f3f4f6" : hasError ? "#fef2f2" : "#f9fafb",
//         boxShadow: state.isFocused ? (hasError ? "0 0 0 2px #fee2e2" : "0 0 0 2px #f3f4f6") : "none",
//         opacity: isDisabled ? 0.5 : 1,
//         cursor: isDisabled ? "not-allowed" : "default",
//         pointerEvents: isDisabled ? "none" : "auto",
//         "&:hover": { borderColor: hasError ? "#fca5a5" : "#9ca3af" },
//         transition: "all 0.15s ease",
//     }),
//     valueContainer: (base) => ({ ...base, padding: "0 10px" }),
//     placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
//     singleValue: (base) => ({ ...base, color: "#1f2937", fontSize: "0.875rem" }),
//     option: (base, state) => ({
//         ...base,
//         fontSize: "0.875rem",
//         borderRadius: "0.375rem",
//         backgroundColor: state.isSelected ? "#111827" : state.isFocused ? "#f3f4f6" : "white",
//         color: state.isSelected ? "white" : "#1f2937",
//         "&:active": { backgroundColor: "#374151" },
//         cursor: "pointer",
//     }),
//     menu: (base) => ({
//         ...base,
//         borderRadius: "0.5rem",
//         border: "1px solid #e5e7eb",
//         boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
//         overflow: "hidden",
//     }),
//     menuList: (base) => ({ ...base, padding: "4px" }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     indicatorSeparator: () => ({ display: "none" }),
//     dropdownIndicator: (base, state) => ({
//         ...base,
//         color: state.isFocused ? "#6b7280" : "#9ca3af",
//         padding: "0 8px",
//         "&:hover": { color: "#6b7280" },
//     }),
//     clearIndicator: (base) => ({
//         ...base,
//         color: "#9ca3af",
//         padding: "0 4px",
//         "&:hover": { color: "#6b7280" },
//     }),
// });

// const ErrorMsg = ({ message }) =>
//     message ? (
//         <p className="text-xs text-red-400 flex items-center gap-1">
//             <span>⚠</span> {message}
//         </p>
//     ) : null;

// const EditFAQForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingFaq,
//     setEditingFaq,
//     handleUpdate,
//     allCategories = [],
//     allPackages = [],
// }) => {
//     const {
//         register,
//         control,
//         handleSubmit,
//         reset,
//         watch,
//         setValue,
//         setError,
//         formState: { errors, isSubmitting },
//     } = useForm({
//         defaultValues: {
//             category_id: null,
//             package_id: null,
//             question: "",
//             answer: "",
//         },
//     });

//     const categoryId = watch("category_id");

//     useEffect(() => {
//         if (showForm) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "";
//         }
//         return () => { document.body.style.overflow = ""; };
//     }, [showForm]);

//     // Populate form when editingFaq changes
//     useEffect(() => {
//         if (editingFaq) {
//             const catOption =
//                 allCategories
//                     .map((c) => ({ value: String(c.id), label: c.name }))
//                     .find((o) => o.value === String(editingFaq.category_id ?? "")) || null;

//             const pkgOption =
//                 allPackages
//                     .map((p) => ({ value: String(p.id), label: p.name ?? p.title ?? `Package ${p.id}` }))
//                     .find((o) => o.value === String(editingFaq.package_id ?? "")) || null;

//             reset({
//                 category_id: catOption,
//                 package_id: pkgOption,
//                 question: editingFaq.question ?? "",
//                 answer: editingFaq.answer ?? "",
//             });
//         }
//     }, [editingFaq, allCategories, allPackages, reset]);

//     const filteredPackages = useMemo(() => {
//         if (!categoryId) return allPackages;
//         return allPackages.filter((pkg) => {
//             if (pkg.category_id) return String(pkg.category_id) === String(categoryId.value);
//             if (pkg.categories?.length) return pkg.categories.some((cat) => String(cat.id) === String(categoryId.value));
//             if (pkg.category?.id) return String(pkg.category.id) === String(categoryId.value);
//             return false;
//         });
//     }, [categoryId, allPackages]);

//     const categoryOptions = useMemo(
//         () => allCategories.map((cat) => ({ value: String(cat.id), label: cat.name })),
//         [allCategories],
//     );

//     const packageOptions = useMemo(
//         () => filteredPackages.map((pkg) => ({ value: String(pkg.id), label: pkg.name ?? pkg.title ?? `Package ${pkg.id}` })),
//         [filteredPackages],
//     );

//     const noPackages = !!categoryId && filteredPackages.length === 0;

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingFaq(null);
//         reset({ category_id: null, package_id: null, question: "", answer: "" });
//     };

//     const onSubmit = async (data) => {
//         const formData = new FormData();
//         formData.append("question", data.question);
//         formData.append("answer", data.answer);
//         formData.append("category_id", data.category_id.value);
//         formData.append("package_id", data.package_id.value); // always present — required

//         try {
//             await handleUpdate(formData, editingFaq.id);
//             setReloadTrigger((prev) => !prev);
//             handleClose();
//         } catch (err) {
//             const apiErrors = err?.response?.data?.errors;
//             if (apiErrors) {
//                 Object.entries(apiErrors).forEach(([key, val]) => {
//                     setError(key, { message: val[0] });
//                 });
//             } else {
//                 setError("root", {
//                     message: err?.response?.data?.message ?? "Something went wrong.",
//                 });
//             }
//         }
//     };

//     if (!showForm || !editingFaq) return null;

//     return (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-xl w-full max-w-3xl border border-gray-200 overflow-hidden flex flex-col"
//                 style={{ maxHeight: "calc(100vh - 2rem)" }}
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 {/* Header */}
//                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
//                     <div className="flex items-center gap-2.5">
//                         <HelpCircle size={17} className="text-gray-400" />
//                         <span className="text-sm font-medium text-gray-800">Edit FAQ</span>
//                     </div>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                     >
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Scrollable body */}
//                 <form
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="overflow-y-auto px-5 py-5 flex flex-col gap-4 flex-1 min-h-0"
//                 >
//                     {errors.root && (
//                         <p className="text-xs text-red-400 flex items-center gap-1">
//                             <span>⚠</span> {errors.root.message}
//                         </p>
//                     )}

//                     {/* Category & Package */}
//                     <SectionHeading>Assignment</SectionHeading>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         {/* Category */}
//                         <div className="flex flex-col gap-1.5">
//                             <label className="text-xs font-medium text-gray-500">
//                                 Category <span className="text-red-400">*</span>
//                             </label>
//                             <Controller
//                                 name="category_id"
//                                 control={control}
//                                 rules={{ required: "Please select a category." }}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         options={categoryOptions}
//                                         placeholder="— Select category —"
//                                         isClearable
//                                         styles={makeSelectStyles(!!errors.category_id)}
//                                         menuPortalTarget={document.body}
//                                         menuPosition="fixed"
//                                         onChange={(selected) => {
//                                             field.onChange(selected);
//                                             const currentPkg = watch("package_id");
//                                             if (currentPkg && selected) {
//                                                 const pkg = allPackages.find(
//                                                     (p) => String(p.id) === String(currentPkg.value),
//                                                 );
//                                                 const stillValid =
//                                                     pkg?.categories?.some(
//                                                         (c) => String(c.id) === String(selected.value),
//                                                     ) || String(pkg?.category_id) === String(selected.value);
//                                                 if (!stillValid) setValue("package_id", null);
//                                             } else {
//                                                 setValue("package_id", null);
//                                             }
//                                         }}
//                                     />
//                                 )}
//                             />
//                             <ErrorMsg message={errors.category_id?.message} />
//                             {noPackages && (
//                                 <p className="text-xs text-amber-500">
//                                     No packages available for this category
//                                 </p>
//                             )}
//                         </div>

//                         {/* Package — now required */}
//                         <div className="flex flex-col gap-1.5">
//                             <label className="text-xs font-medium text-gray-500">
//                                 Package <span className="text-red-400">*</span>
//                             </label>
//                             <Controller
//                                 name="package_id"
//                                 control={control}
//                                 rules={{ required: "Please select a package." }}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         options={packageOptions}
//                                         placeholder={!categoryId ? "Select a category first" : "— Select package —"}
//                                         isClearable
//                                         isDisabled={!categoryId || noPackages}
//                                         styles={makeSelectStyles(!!errors.package_id, !categoryId || noPackages)}
//                                         menuPortalTarget={document.body}
//                                         menuPosition="fixed"
//                                     />
//                                 )}
//                             />
//                             <ErrorMsg message={errors.package_id?.message} />
//                         </div>
//                     </div>

//                     {/* Question & Answer */}
//                     <SectionHeading>Question & Answer</SectionHeading>
//                     <div className="flex flex-col gap-4">
//                         {/* Question */}
//                         <div className="flex flex-col gap-1.5">
//                             <label className="text-xs font-medium text-gray-500">
//                                 Question <span className="text-red-400">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 {...register("question", {
//                                     required: "Question is required.",
//                                     validate: (v) => !!v.trim() || "Question cannot be blank.",
//                                 })}
//                                 placeholder="Enter the question"
//                                 className={errors.question ? inputError : inputBase}
//                             />
//                             <ErrorMsg message={errors.question?.message} />
//                         </div>

//                         {/* Answer */}
//                         <div className="flex flex-col gap-1.5">
//                             <label className="text-xs font-medium text-gray-500">
//                                 Answer <span className="text-red-400">*</span>
//                             </label>
//                             <Controller
//                                 name="answer"
//                                 control={control}
//                                 rules={{
//                                     required: "Answer is required.",
//                                     validate: (v) => !isQuillEmpty(v) || "Answer cannot be blank.",
//                                 }}
//                                 render={({ field }) => (
//                                     <RichTextEditor
//                                         value={field.value}
//                                         onChange={field.onChange}
//                                         placeholder="Write a clear, helpful answer..."
//                                         hasError={!!errors.answer}
//                                     />
//                                 )}
//                             />
//                             <ErrorMsg message={errors.answer?.message} />
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="flex gap-2.5 pt-3 mt-1 border-t border-gray-100 shrink-0">
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

// export default EditFAQForm;