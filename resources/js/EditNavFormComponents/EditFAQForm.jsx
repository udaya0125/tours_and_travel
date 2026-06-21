import React, { useState, useEffect, useMemo } from "react";
import { X, HelpCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const isQuillEmpty = (value) => {
    if (!value) return true;
    return value.replace(/<[^>]*>/g, "").trim() === "";
};

const editFaqSchema = z.object({
    category_id: z
        .object({ value: z.string(), label: z.string() }, { required_error: "Please select a category." })
        .nullable()
        .refine((v) => v !== null, "Please select a category."),
    package_id: z
        .object({ value: z.string(), label: z.string() }, { required_error: "Please select a package." })
        .nullable()
        .refine((v) => v !== null, "Please select a package."),
    question: z
        .string()
        .min(1, "Question is required.")
        .min(2, "Question must be at least 2 characters.")
        .max(100, "Question must be less than 100 characters.")
        .refine((v) => v.trim().length > 0, "Question cannot be blank."),
    answer: z
        .string()
        .min(1, "Answer is required.")
        .min(2, "Answer must be at least 2 characters.")
        .refine((v) => !isQuillEmpty(v), "Answer is required."),
});

// ─── Constants ────────────────────────────────────────────────────────────────

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
                    className="custom-quill"
                />
            </div>
        </div>
    );
};

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

// ─── Component ────────────────────────────────────────────────────────────────

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
        resolver: zodResolver(editFaqSchema),
    });

    const categoryId = watch("category_id");

    useEffect(() => {
        document.body.style.overflow = showForm ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [showForm]);

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
                package_id:  pkgOption,
                question:    editingFaq.question ?? "",
                answer:      editingFaq.answer   ?? "",
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
        () => filteredPackages.map((pkg) => ({
            value: String(pkg.id),
            label: pkg.name ?? pkg.title ?? `Package ${pkg.id}`,
        })),
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

    // All fields now validated by Zod — no manual guards needed
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("question",    data.question);
        formData.append("answer",      data.answer);
        formData.append("category_id", data.category_id.value);
        formData.append("package_id",  data.package_id.value);
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
                                {...register("question")}
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
