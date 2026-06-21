import axios from "axios";
import { X, Plus, Trash2, AlertCircle, Package } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useMutation } from "@tanstack/react-query";

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const packageSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required.")
        .trim()
        .min(2, "Title must be at least 2 characters.")
        .max(100, "Title must be less than 100 characters.")
        .refine((v) => v.trim().length > 0, "Title cannot be blank."),
    price: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)))
        .refine((v) => v === undefined || (!isNaN(v) && v >= 0), "Price must be a positive number."),
    country_id: z
        .object({ value: z.string(), label: z.string() }, { required_error: "Country is required." })
        .nullable()
        .refine((v) => v !== null, "Country is required."),
    category_ids: z.array(z.string()).min(1, "Please select at least one category."),
    sub_category_id: z.object({ value: z.string(), label: z.string() }).nullable().optional(),
    short_description: z.string().optional(),
    long_description:  z.string().optional(),
    highlight:         z.string().optional(),
    include:           z.string().optional(),
    exclude:           z.string().optional(),
    duration:          z.string().optional(),
    difficulty:        z.string().optional(),
    max_altitude:      z.string().optional(),
    best_season:       z.string().optional(),
    accommodation:     z.string().optional(),
    meals:             z.string().optional(),
    start_point:       z.string().optional(),
    end_point:         z.string().optional(),
});

// ─── Constants ────────────────────────────────────────────────────────────────

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
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "check", "indent", "align",
    "link", "image", "video",
];

const REGISTERED_FIELDS = [
    "title", "price",
    "duration", "difficulty", "max_altitude", "best_season",
    "accommodation", "meals", "start_point", "end_point",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {children}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

const FieldError = ({ message }) =>
    message ? (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {message}
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
            {error && <FieldError message={error} />}
        </div>
    );
};

const RichTextEditorSmall = ({ value, onChange, placeholder }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="rich-text-editor-small">
            <div
                className="transition-all duration-200 overflow-hidden rounded-lg"
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
                    formats={["bold", "italic", "underline", "strike", "list", "bullet", "link"]}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="custom-quill-small"
                />
            </div>
        </div>
    );
};

// ─── React-Select styles ──────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

const EditPackageForm = ({
    showForm,
    setShowForm,
    editingPackage,
    setEditingPackage,
    setReloadTrigger,
    handleUpdate,
    allCountry = [],
    allCategory = [],
    allSubCategory = [],
}) => {
    const [selectedImages, setSelectedImages]     = useState([]);
    const [existingImages, setExistingImages]     = useState([]);
    const [deletingImageIds, setDeletingImageIds] = useState([]);
    const [isDragging, setIsDragging]             = useState(false);
    const [itineraries, setItineraries]           = useState([]);

    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "", price: "", country_id: null, category_ids: [],
            sub_category_id: null, short_description: "", long_description: "",
            highlight: "", include: "", exclude: "", duration: "", difficulty: "",
            max_altitude: "", best_season: "", accommodation: "", meals: "",
            start_point: "", end_point: "",
        },
        resolver: zodResolver(packageSchema),
    });

    const categoryIds = watch("category_ids");

    // ── Mutation ──────────────────────────────────────────────────────────────

    const { mutate: submitUpdate, isPending, error: mutationError, reset: resetMutation } = useMutation({
        mutationFn: ({ formData, id }) => handleUpdate(formData, id),
        onSuccess: () => {
            setReloadTrigger();
            handleClose();
        },
        onError: (error) => {
            const response = error?.response;
            if (!response) return;
            const { status, data } = response;
            if (status === 422 && data.errors) {
                Object.entries(data.errors).forEach(([key, val]) => {
                    setError(key, { message: val[0] });
                });
            }
        },
    });

    // ── Body scroll lock ──────────────────────────────────────────────────────

    useEffect(() => {
        document.body.style.overflow = showForm ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [showForm]);

    // ── Populate form when editingPackage changes ─────────────────────────────

    useEffect(() => {
        if (editingPackage && showForm) {
            const pkgCategoryIds = editingPackage.categories
                ? editingPackage.categories.map((c) => String(c.id))
                : (editingPackage.category_ids ?? []).map(String);

            const countryOption =
                allCountry
                    .map((c) => ({ value: String(c.id), label: c.name }))
                    .find((o) => o.value === String(editingPackage.country_id)) || null;

            const subCatOption =
                allSubCategory
                    .map((s) => ({ value: String(s.id), label: s.name }))
                    .find((o) => o.value === String(editingPackage.sub_category_id)) || null;

            reset({
                title:             editingPackage.title             ?? "",
                price:             editingPackage.price             ?? "",
                country_id:        countryOption,
                category_ids:      pkgCategoryIds,
                sub_category_id:   subCatOption,
                short_description: editingPackage.short_description ?? "",
                long_description:  editingPackage.long_description  ?? "",
                highlight:         editingPackage.highlight         ?? "",
                include:           editingPackage.include           ?? "",
                exclude:           editingPackage.exclude           ?? "",
                duration:          editingPackage.duration          ?? "",
                difficulty:        editingPackage.difficulty        ?? "",
                max_altitude:      editingPackage.max_altitude      ?? "",
                best_season:       editingPackage.best_season       ?? "",
                accommodation:     editingPackage.accommodation     ?? "",
                meals:             editingPackage.meals             ?? "",
                start_point:       editingPackage.start_point       ?? "",
                end_point:         editingPackage.end_point         ?? "",
            });

            setItineraries(
                editingPackage.itineraries?.map((i) => ({
                    day: i.day, title: i.title, description: i.description ?? "",
                })) ?? [],
            );
            setExistingImages(editingPackage.images ?? []);
            setSelectedImages([]);
            setDeletingImageIds([]);
            resetMutation();
        }
    }, [editingPackage, showForm, allCountry, allSubCategory, reset, resetMutation]);

    // ── Derived options ───────────────────────────────────────────────────────

    const countryOptions = useMemo(
        () => allCountry.map((c) => ({ value: String(c.id), label: c.name })),
        [allCountry],
    );

    const filteredSubCategories = useMemo(
        () => allSubCategory.filter((s) => categoryIds?.includes(String(s.category_id))),
        [allSubCategory, categoryIds],
    );

    const subCategoryOptions = useMemo(
        () => filteredSubCategories.map((s) => ({ value: String(s.id), label: s.name })),
        [filteredSubCategories],
    );

    const noSubCategories = categoryIds?.length > 0 && filteredSubCategories.length === 0;

    // ── FormData builder ──────────────────────────────────────────────────────

    const buildFormData = (data) => {
        const fd = new FormData();
        REGISTERED_FIELDS.forEach((key) => {
            if (data[key] !== null && data[key] !== "" && data[key] !== undefined)
                fd.append(key, data[key]);
        });
        if (data.country_id)      fd.append("country_id",      data.country_id.value);
        if (data.sub_category_id) fd.append("sub_category_id", data.sub_category_id.value);
        ["short_description", "long_description", "highlight", "include", "exclude"].forEach((key) => {
            if (data[key] !== null && data[key] !== "") fd.append(key, data[key]);
        });
        (data.category_ids ?? []).forEach((id) => fd.append("category_ids[]", id));
        selectedImages.forEach((file) => fd.append("images[]", file));
        deletingImageIds.forEach((id) => fd.append("delete_image_ids[]", id));
        itineraries.forEach((item, idx) => {
            fd.append(`itineraries[${idx}][day]`,         item.day);
            fd.append(`itineraries[${idx}][title]`,       item.title ?? "");
            fd.append(`itineraries[${idx}][description]`, item.description ?? "");
        });
        return fd;
    };

    // ── Submit ────────────────────────────────────────────────────────────────

    // category_ids is validated by Zod (.min(1)) — no manual guard needed
    const onSubmit = (data) => {
        resetMutation();
        submitUpdate({ formData: buildFormData(data), id: editingPackage.id });
    };

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleCategoryToggle = (id) => {
        const sid     = String(id);
        const current = categoryIds ?? [];
        const next    = current.includes(sid)
            ? current.filter((c) => c !== sid)
            : [...current, sid];

        const currentSub    = watch("sub_category_id");
        const subStillValid = currentSub && allSubCategory.some(
            (s) => String(s.id) === String(currentSub.value) && next.includes(String(s.category_id)),
        );
        if (!subStillValid) setValue("sub_category_id", null);
        setValue("category_ids", next);
        if (next.length > 0) clearErrors("category_ids");
    };

    const handleImageChange = (e) => {
        setSelectedImages((prev) => [...prev, ...Array.from(e.target.files)]);
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files).filter((f) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type),
        );
        if (files.length) setSelectedImages((prev) => [...prev, ...files]);
    };

    const removeNewImage = (idx) =>
        setSelectedImages((prev) => prev.filter((_, i) => i !== idx));

    const toggleExistingImageDelete = (id) =>
        setDeletingImageIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );

    const allMarkedForDeletion =
        existingImages.length > 0 && existingImages.every((img) => deletingImageIds.includes(img.id));

    const markAllExistingForDeletion   = () => setDeletingImageIds(existingImages.map((img) => img.id));
    const unmarkAllExistingForDeletion = () => setDeletingImageIds([]);

    const addItinerary = () =>
        setItineraries((prev) => [...prev, { day: prev.length + 1, title: "", description: "" }]);

    const updateItinerary = (idx, field, value) =>
        setItineraries((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));

    const removeItinerary = (idx) =>
        setItineraries((prev) => prev.filter((_, i) => i !== idx));

    const handleClose = () => {
        setShowForm(false);
        setEditingPackage(null);
        setDeletingImageIds([]);
        setSelectedImages([]);
        resetMutation();
    };

    const cls = (field) => (errors[field] ? inputError : inputBase);

    const serverError = (() => {
        if (!mutationError) return "";
        const response = mutationError?.response;
        if (!response) return "Network error — no response from server.";
        const { status, data } = response;
        if (status === 422) return "";
        return data?.message ?? `Unexpected error (${status}).`;
    })();

    if (!showForm || !editingPackage) return null;

    // ── Render ────────────────────────────────────────────────────────────────

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
                        <span className="text-sm font-medium text-gray-800">Edit package</span>
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

                {/* Scrollable form body */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="overflow-y-auto px-5 py-5 flex flex-col gap-4 flex-1 min-h-0"
                >
                    <SectionHeading>Basic info</SectionHeading>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            {...register("title")}
                            placeholder="Package title"
                            className={cls("title")}
                        />
                        <FieldError message={errors.title?.message} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Country */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Country <span className="text-red-400">*</span>
                            </label>
                            <Controller
                                name="country_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={countryOptions}
                                        placeholder="Select country"
                                        isClearable
                                        styles={makeSelectStyles(!!errors.country_id)}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                            <FieldError message={errors.country_id?.message} />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                Price (USD)
                            </label>
                            <input
                                type="number"
                                {...register("price")}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className={cls("price")}
                            />
                            <FieldError message={errors.price?.message} />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                            Categories <span className="text-red-400">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {allCategory.map((cat) => {
                                const checked = categoryIds?.includes(String(cat.id)) || false;
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
                                            onChange={() => handleCategoryToggle(cat.id)}
                                        />
                                        {cat.name}
                                    </label>
                                );
                            })}
                        </div>
                        <FieldError message={errors.category_ids?.message} />
                    </div>

                    {/* Sub Category */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            Sub category
                        </label>
                        {categoryIds?.length === 0 ? (
                            <p className="text-xs text-gray-400">Select a category first to see sub-categories.</p>
                        ) : noSubCategories ? (
                            <p className="text-xs text-gray-400">No sub-categories available for the selected categories.</p>
                        ) : (
                            <Controller
                                name="sub_category_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={subCategoryOptions}
                                        placeholder="Select sub-category"
                                        isClearable
                                        styles={makeSelectStyles(!!errors.sub_category_id)}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                        )}
                    </div>

                    {/* Rich text fields */}
                    {[
                        ["short_description", "Short Description", "Write a brief description of the package..."],
                        ["long_description",  "Long Description",  "Write a detailed description of the package..."],
                        ["highlight",         "Highlights",        "List the key highlights of the package..."],
                        ["include",           "What's Included",   "List all items, services, and amenities included..."],
                        ["exclude",           "What's Excluded",   "List items, services, or costs not included..."],
                    ].map(([field, heading, placeholder]) => (
                        <React.Fragment key={field}>
                            <SectionHeading>{heading}</SectionHeading>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">{heading}</label>
                                <Controller
                                    name={field}
                                    control={control}
                                    render={({ field: f }) => (
                                        <RichTextEditor
                                            value={f.value}
                                            onChange={f.onChange}
                                            error={errors[field]?.message}
                                            placeholder={placeholder}
                                        />
                                    )}
                                />
                            </div>
                        </React.Fragment>
                    ))}

                    {/* Trip Details */}
                    <SectionHeading>Trip details</SectionHeading>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            ["duration",      "Duration"],
                            ["difficulty",    "Difficulty"],
                            ["max_altitude",  "Max altitude"],
                            ["best_season",   "Best season"],
                            ["accommodation", "Accommodation"],
                            ["meals",         "Meals"],
                            ["start_point",   "Start point"],
                            ["end_point",     "End point"],
                        ].map(([name, label]) => (
                            <div key={name}>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                                <input {...register(name)} className={cls(name)} />
                                <FieldError message={errors[name]?.message} />
                            </div>
                        ))}
                    </div>

                    {/* Images */}
                    <SectionHeading>Images</SectionHeading>
                    <div className="flex flex-col gap-4">
                        {existingImages.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium text-gray-500">
                                        Saved images
                                        {deletingImageIds.length > 0 && (
                                            <span className="ml-1.5 text-red-400">
                                                ({deletingImageIds.length} marked for removal)
                                            </span>
                                        )}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={allMarkedForDeletion ? unmarkAllExistingForDeletion : markAllExistingForDeletion}
                                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                                            allMarkedForDeletion
                                                ? "border-red-200 text-red-400 bg-red-50 hover:bg-red-100"
                                                : "border-gray-200 text-gray-400 bg-gray-50 hover:border-gray-300 hover:text-gray-600"
                                        }`}
                                    >
                                        {allMarkedForDeletion ? "Unmark all" : "Remove all"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                                    {existingImages.map((img) => {
                                        const markedForDeletion = deletingImageIds.includes(img.id);
                                        const imageUrl = `${imgurl}/${img.image}`;
                                        return (
                                            <div
                                                key={img.id}
                                                className={`relative group rounded-lg overflow-hidden border bg-gray-100 transition-all duration-150 ${
                                                    markedForDeletion
                                                        ? "border-red-300 opacity-50 ring-2 ring-red-200"
                                                        : "border-gray-200"
                                                }`}
                                                style={{ aspectRatio: "1 / 1" }}
                                            >
                                                <img src={imageUrl} alt="existing" className="w-full h-full object-cover" />
                                                {markedForDeletion && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-red-50/60 pointer-events-none">
                                                        <span className="text-[10px] font-semibold text-red-500 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                                                            Will be removed
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleExistingImageDelete(img.id)}
                                                        className={`p-1.5 rounded-full transition-all duration-150 shadow-sm ${
                                                            markedForDeletion
                                                                ? "bg-gray-800 text-white hover:bg-gray-700"
                                                                : "bg-white/90 text-red-500 hover:bg-white hover:scale-110"
                                                        }`}
                                                        title={markedForDeletion ? "Undo remove" : "Mark for removal"}
                                                    >
                                                        {markedForDeletion ? <X size={13} /> : <Trash2 size={13} />}
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                    <p className="text-[10px] text-white truncate leading-tight">
                                                        {img.image?.split("/").pop()}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Upload new images */}
                        <div>
                            {existingImages.length > 0 && (
                                <p className="text-xs font-medium text-gray-500 mb-2">Add more images</p>
                            )}
                            <label
                                className={`relative flex flex-col items-center justify-center gap-2.5 w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 py-8 ${
                                    isDragging
                                        ? "border-gray-400 bg-gray-100 scale-[0.995]"
                                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/60"
                                }`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isDragging ? "bg-gray-300" : "bg-gray-200/80"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-medium text-gray-600">
                                        {isDragging ? "Drop to upload" : (
                                            <>Drag & drop or <span className="text-gray-800 underline underline-offset-2">browse files</span></>
                                        )}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WEBP — multiple allowed</p>
                                </div>
                            </label>

                            {selectedImages.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-[11px] text-gray-400 mb-2">
                                        {selectedImages.length} new image{selectedImages.length !== 1 ? "s" : ""} queued for upload
                                    </p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                                        {selectedImages.map((file, idx) => {
                                            const url = URL.createObjectURL(file);
                                            return (
                                                <div
                                                    key={idx}
                                                    className="relative group rounded-lg overflow-hidden border border-gray-200 border-dashed bg-gray-100 ring-2 ring-blue-100"
                                                    style={{ aspectRatio: "1 / 1" }}
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`new-preview-${idx}`}
                                                        className="w-full h-full object-cover"
                                                        onLoad={() => URL.revokeObjectURL(url)}
                                                    />
                                                    <div className="absolute top-1.5 left-1.5 pointer-events-none">
                                                        <span className="text-[9px] font-semibold bg-blue-500 text-white px-1.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                                                            New
                                                        </span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewImage(idx)}
                                                            className="p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-white hover:scale-110 transition-all duration-150 shadow-sm"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                        <p className="text-[10px] text-white truncate leading-tight">{file.name}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <FieldError message={errors.images?.message} />
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
                                            onChange={(e) => updateItinerary(idx, "day", e.target.value)}
                                            className={inputBase}
                                        />
                                        <input
                                            placeholder="Title"
                                            value={item.title}
                                            onChange={(e) => updateItinerary(idx, "title", e.target.value)}
                                            className={inputBase}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-500">Description</label>
                                        <RichTextEditorSmall
                                            value={item.description}
                                            onChange={(value) => updateItinerary(idx, "description", value)}
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
                            type="submit"
                            disabled={isPending}
                            className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Saving…" : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPackageForm;
