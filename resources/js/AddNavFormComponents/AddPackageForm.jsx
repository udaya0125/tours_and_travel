import axios from "axios";
import { X, Plus, Trash2, ImagePlus, Package } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const EMPTY_FORM = {
    title: "",
    country_id: "",
    category_id: "",
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

const EMPTY_ITINERARY = { day: "", title: "", description: "" };

const inputBase = "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";
const selectBase = `${inputBase} bg-gray-50`;

const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", required = false }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={inputBase}
        />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, rows = 3, required = false }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            required={required}
            className={`${inputBase} resize-none`}
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options = [], placeholder = "Select...", required = false }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={selectBase}
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                    {opt.name}
                </option>
            ))}
        </select>
    </div>
);

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {children}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

const AddPackageForm = ({
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
    const [submitting, setSubmitting] = useState(false);
    const [packageForm, setPackageForm] = useState(EMPTY_FORM);
    const [itineraries, setItineraries] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (editingPackage) {
            const { images, itineraries: itin, ...rest } = editingPackage;
            setPackageForm({ ...EMPTY_FORM, ...rest });
            setItineraries(
                itin?.map(({ day, title, description }) => ({ day, title, description })) ?? []
            );
            setExistingImages(images ?? []);
            setNewImages([]);
            setImagePreviews([]);
        } else {
            setPackageForm(EMPTY_FORM);
            setItineraries([]);
            setExistingImages([]);
            setNewImages([]);
            setImagePreviews([]);
        }
    }, [editingPackage]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPackageForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "country_id") {
                updated.category_id = "";
                updated.sub_category_id = "";
            }
            if (name === "category_id") {
                updated.sub_category_id = "";
            }
            return updated;
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const previews = files.map((f) => URL.createObjectURL(f));
        setNewImages((prev) => [...prev, ...files]);
        setImagePreviews((prev) => [...prev, ...previews]);
        e.target.value = "";
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const addItineraryRow = () =>
        setItineraries((prev) => [...prev, { ...EMPTY_ITINERARY }]);

    const updateItinerary = (index, field, value) => {
        setItineraries((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    };

    const removeItinerary = (index) =>
        setItineraries((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(packageForm).forEach(([key, val]) => {
            if (val !== null && val !== "") formData.append(key, val);
        });

        newImages.forEach((file) => formData.append("images[]", file));

        itineraries.forEach((item, i) => {
            formData.append(`itineraries[${i}][day]`, item.day);
            formData.append(`itineraries[${i}][title]`, item.title);
            formData.append(`itineraries[${i}][description]`, item.description);
        });

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
            console.error("Error saving package", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingPackage(null);
        setPackageForm(EMPTY_FORM);
        setItineraries([]);
        setNewImages([]);
        setImagePreviews([]);
        setExistingImages([]);
    };

    // Filter subcategories based on selected category
    const filteredSubCategories = allSubCategory.filter(
        (s) => String(s.category_id) === String(packageForm.category_id)
    );

    if (!showForm) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl w-full max-w-2xl border border-gray-200 overflow-hidden flex flex-col"
                style={{ maxHeight: "calc(100vh - 2rem)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <Package size={17} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">
                            {editingPackage ? "Edit package" : "Add new package"}
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
                    {/* Basic Info */}
                    <SectionHeading>Basic info</SectionHeading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Title — full width */}
                        <div className="sm:col-span-2">
                            <InputField
                                label="Title"
                                name="title"
                                value={packageForm.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Everest Base Camp Trek"
                            />
                        </div>

                        {/* Country + Category on same row */}
                        <div className="sm:col-span-2 flex gap-4">
                            <div className={packageForm.country_id ? "flex-1" : "w-full"}>
                                <SelectField
                                    label="Country"
                                    name="country_id"
                                    value={packageForm.country_id}
                                    onChange={handleChange}
                                    options={allCountry}
                                    required
                                    placeholder="Select country"
                                />
                            </div>
                            {packageForm.country_id && (
                                <div className="flex-1">
                                    <SelectField
                                        label="Category"
                                        name="category_id"
                                        value={packageForm.category_id}
                                        onChange={handleChange}
                                        options={allCategory}
                                        required
                                        placeholder="Select category"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Sub category — only if category selected AND filtered subcategories exist */}
                        {packageForm.category_id && filteredSubCategories.length > 0 && (
                            <div className="sm:col-span-1">
                                <SelectField
                                    label="Sub category"
                                    name="sub_category_id"
                                    value={packageForm.sub_category_id}
                                    onChange={handleChange}
                                    options={filteredSubCategories}
                                    placeholder="Select sub category"
                                />
                            </div>
                        )}

                        {/* Price */}
                        <div className="sm:col-span-1">
                            <InputField
                                label="Price ($)"
                                name="price"
                                value={packageForm.price}
                                onChange={handleChange}
                                type="number"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <SectionHeading>Description</SectionHeading>
                    <TextAreaField
                        label="Short description"
                        name="short_description"
                        value={packageForm.short_description}
                        onChange={handleChange}
                        required
                        rows={2}
                    />
                    <TextAreaField
                        label="Long description"
                        name="long_description"
                        value={packageForm.long_description}
                        onChange={handleChange}
                        required
                        rows={4}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextAreaField
                            label="Includes"
                            name="include"
                            value={packageForm.include}
                            onChange={handleChange}
                            rows={3}
                        />
                        <TextAreaField
                            label="Excludes"
                            name="exclude"
                            value={packageForm.exclude}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    <TextAreaField
                        label="Highlights"
                        name="highlight"
                        value={packageForm.highlight}
                        onChange={handleChange}
                        rows={2}
                    />

                    {/* Trip Details */}
                    <SectionHeading>Trip details</SectionHeading>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <InputField label="Duration" name="duration" value={packageForm.duration} onChange={handleChange} placeholder="e.g. 14 days" />
                        <InputField label="Difficulty" name="difficulty" value={packageForm.difficulty} onChange={handleChange} placeholder="e.g. Moderate" />
                        <InputField label="Max altitude" name="max_altitude" value={packageForm.max_altitude} onChange={handleChange} placeholder="e.g. 5364m" />
                        <InputField label="Best season" name="best_season" value={packageForm.best_season} onChange={handleChange} placeholder="e.g. March–May" />
                        <InputField label="Accommodation" name="accommodation" value={packageForm.accommodation} onChange={handleChange} placeholder="e.g. Tea Houses" />
                        <InputField label="Meals" name="meals" value={packageForm.meals} onChange={handleChange} placeholder="e.g. B/L/D" />
                        <InputField label="Start point" name="start_point" value={packageForm.start_point} onChange={handleChange} placeholder="e.g. Kathmandu" />
                        <InputField label="End point" name="end_point" value={packageForm.end_point} onChange={handleChange} placeholder="e.g. Kathmandu" />
                    </div>

                    {/* Images */}
                    <SectionHeading>Images</SectionHeading>

                    {existingImages.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                    <img
                                        src={`/storage/${img.image}`}
                                        alt="existing"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {imagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(i)}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X size={16} className="text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 w-fit px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ImagePlus size={15} />
                        {editingPackage ? "Add more images" : "Upload images"}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpg,image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                    />

                    {/* Itinerary */}
                    <SectionHeading>Itinerary</SectionHeading>
                    <div className="flex flex-col gap-3">
                        {itineraries.map((item, index) => (
                            <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex flex-col gap-2 flex-1">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Day (e.g. 1)"
                                            value={item.day}
                                            onChange={(e) => updateItinerary(index, "day", e.target.value)}
                                            className={inputBase}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={item.title}
                                            onChange={(e) => updateItinerary(index, "title", e.target.value)}
                                            className={inputBase}
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Description"
                                        value={item.description}
                                        rows={2}
                                        onChange={(e) => updateItinerary(index, "description", e.target.value)}
                                        className={`${inputBase} resize-none`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItinerary(index)}
                                    className="mt-1 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItineraryRow}
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
                            disabled={submitting}
                            className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting
                                ? "Saving..."
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


// import axios from "axios";
// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddPackageForm = ({
//     showForm,
//     setShowForm,
//     editingPackage,
//     setEditingPackage,
//     setReloadTrigger,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [packageForm, setPackageForm] = useState({
//         title: "",
//         country_id: "",
//         category_id: "",
//         sub_category_id: "",
//         short_description: "",
//         long_description: "",
//         include: "",
//         exclude: "",
//         images: "",
//         itinerary: "",
//         highlight: "",
//         duration: "",
//         difficulty: "",
//         max_altitude: "",
//         best_season: "",
//         accommodation: "",
//         meals: "",
//         start_point: "",
//         end_point: "",
//         price: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingPackage) {
//             setPackageForm({
//                 ...editingPackage,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setPackageForm({
//                 title: "",
//                 country_id: "",
//                 category_id: "",
//                 sub_category_id: "",
//                 short_description: "",
//                 long_description: "",
//                 include: "",
//                 exclude: "",
//                 images: "",
//                 itinerary: "",
//                 highlight: "",
//                 duration: "",
//                 difficulty: "",
//                 max_altitude: "",
//                 best_season: "",
//                 accommodation: "",
//                 meals: "",
//                 start_point: "",
//                 end_point: "",
//                 price: "",
//             });
//         }
//     }, [editingPackage]);

//     // Handle Create Package
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourpackages.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating package", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in packageForm) {
//             if (packageForm[key] !== null && packageForm[key] !== "") {
//                 formData.append(key, packageForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingPackage) {
//                 // Editing existing package
//                 await handleUpdate(formData, editingPackage.id);
//             } else {
//                 // Creating new package
//                 await handleCreate(formData);
//             }
//             setPackageForm({
//                 title: "",
//                 country_id: "",
//                 category_id: "",
//                 sub_category_id: "",
//                 short_description: "",
//                 long_description: "",
//                 include: "",
//                 exclude: "",
//                 images: "",
//                 itinerary: "",
//                 highlight: "",
//                 duration: "",
//                 difficulty: "",
//                 max_altitude: "",
//                 best_season: "",
//                 accommodation: "",
//                 meals: "",
//                 start_point: "",
//                 end_point: "",
//                 price: "",
//             });

//             setShowForm(false);
//             setEditingPackage(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setPackageForm((prev) => ({
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
//                         Add New Package
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

// export default AddPackageForm;
