// import axios from "axios";
// import React, { useState, useMemo } from "react";
// import { X, Plus, Trash2, HelpCircle } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import Select from "react-select";

// const EMPTY_QA = { question: "", answer: "" };

// const quillModules = {
//     toolbar: [
//         [{ header: [1, 2, 3, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link", "clean"],
//     ],
// };

// const quillFormats = [
//     "header", "bold", "italic", "underline", "strike",
//     "list", "bullet", "link",
// ];

// const inputBase = "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

// const SectionHeading = ({ children }) => (
//     <div className="flex items-center gap-2 mt-1">
//         <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
//             {children}
//         </span>
//         <div className="flex-1 h-px bg-gray-100" />
//     </div>
// );

// const makeSelectStyles = (hasError = false, isDisabled = false) => ({
//     control: (base, state) => ({
//         ...base,
//         minHeight: "38px",
//         fontSize: "0.875rem",
//         borderRadius: "0.5rem",
//         borderColor: hasError
//             ? "#fca5a5"
//             : state.isFocused
//             ? "#9ca3af"
//             : "#e5e7eb",
//         backgroundColor: isDisabled ? "#f3f4f6" : hasError ? "#fef2f2" : "#f9fafb",
//         boxShadow: state.isFocused
//             ? hasError
//                 ? "0 0 0 2px #fee2e2"
//                 : "0 0 0 2px #f3f4f6"
//             : "none",
//         opacity: isDisabled ? 0.5 : 1,
//         cursor: isDisabled ? "not-allowed" : "default",
//         pointerEvents: isDisabled ? "none" : "auto",
//         "&:hover": {
//             borderColor: hasError ? "#fca5a5" : "#9ca3af",
//         },
//         transition: "all 0.15s ease",
//     }),
//     valueContainer: (base) => ({
//         ...base,
//         padding: "0 10px",
//     }),
//     placeholder: (base) => ({
//         ...base,
//         color: "#9ca3af",
//         fontSize: "0.875rem",
//     }),
//     singleValue: (base) => ({
//         ...base,
//         color: "#1f2937",
//         fontSize: "0.875rem",
//     }),
//     option: (base, state) => ({
//         ...base,
//         fontSize: "0.875rem",
//         borderRadius: "0.375rem",
//         backgroundColor: state.isSelected
//             ? "#4f46e5"
//             : state.isFocused
//             ? "#eef2ff"
//             : "white",
//         color: state.isSelected ? "white" : "#1f2937",
//         "&:active": { backgroundColor: "#4338ca" },
//         cursor: "pointer",
//     }),
//     menu: (base) => ({
//         ...base,
//         borderRadius: "0.5rem",
//         border: "1px solid #e5e7eb",
//         boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
//         overflow: "hidden",
//     }),
//     menuList: (base) => ({
//         ...base,
//         padding: "4px",
//     }),
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

// const AddFAQForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     allCategories = [],
//     allPackages = [],
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [categoryId, setCategoryId] = useState("");
//     const [packageId, setPackageId] = useState("");
//     const [qaList, setQaList] = useState([{ ...EMPTY_QA }]);

//     const filteredPackages = useMemo(() => {
//         if (!categoryId) return [];
//         return allPackages.filter((pkg) =>
//             pkg.categories?.some((cat) => String(cat.id) === String(categoryId))
//         );
//     }, [categoryId, allPackages]);

//     const categoryOptions = useMemo(
//         () => allCategories.map((cat) => ({ value: String(cat.id), label: cat.name })),
//         [allCategories]
//     );

//     const packageOptions = useMemo(
//         () => filteredPackages.map((pkg) => ({ value: String(pkg.id), label: pkg.name ?? pkg.title })),
//         [filteredPackages]
//     );

//     const selectedCategory = categoryOptions.find((o) => o.value === String(categoryId)) || null;
//     const selectedPackage = packageOptions.find((o) => o.value === String(packageId)) || null;

//     const resetForm = () => {
//         setCategoryId("");
//         setPackageId("");
//         setQaList([{ ...EMPTY_QA }]);
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         resetForm();
//     };

//     const handleQaChange = (index, field, value) => {
//         setQaList((prev) =>
//             prev.map((qa, i) => (i === index ? { ...qa, [field]: value } : qa))
//         );
//     };

//     const addQa = () => setQaList((prev) => [...prev, { ...EMPTY_QA }]);
//     const removeQa = (index) => setQaList((prev) => prev.filter((_, i) => i !== index));

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!categoryId) {
//             alert("Please select a category.");
//             return;
//         }

//         try {
//             setSubmitting(true);

//             const validQa = qaList.filter(
//                 (qa) => qa.question.trim() && qa.answer.trim()
//             );
//             if (validQa.length === 0) return;

//             await Promise.all(
//                 validQa.map((qa) => {
//                     const formData = new FormData();
//                     formData.append("question", qa.question);
//                     formData.append("answer", qa.answer);
//                     formData.append("category_id", categoryId);
//                     if (packageId) formData.append("package_id", packageId);
//                     return axios.post(route("ourfaqs.store"), formData, {
//                         headers: { "Content-Type": "multipart/form-data" },
//                     });
//                 })
//             );
//             setReloadTrigger((prev) => !prev);
//             handleClose();
//         } catch (err) {
//             console.error("Save error", err);
//             console.error("Validation errors:", err.response?.data?.errors);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const validCount = qaList.filter((q) => q.question.trim()).length;
//     const noPackages = !!categoryId && filteredPackages.length === 0;

//     if (!showForm) return null;

//     return (
//         <>
//             <style>{`
//                 .quill-faq .ql-container { 
//                     min-height: 120px; 
//                     max-height: 220px; 
//                     overflow-y: auto; 
//                     font-size: 14px; 
//                     border-bottom-left-radius: 8px; 
//                     border-bottom-right-radius: 8px; 
//                 }
//                 .quill-faq .ql-editor { min-height: 120px; }
//                 .quill-faq .ql-toolbar.ql-snow { 
//                     border-top-left-radius: 8px; 
//                     border-top-right-radius: 8px; 
//                     border-color: #e5e7eb;
//                     background-color: #f9fafb;
//                 }
//                 .quill-faq .ql-container.ql-snow { 
//                     border-color: #e5e7eb;
//                     background-color: #ffffff;
//                 }
//                 .quill-faq .ql-toolbar.ql-snow + .ql-container.ql-snow { border-top: none; }
//                 .quill-faq .ql-editor.ql-blank::before {
//                     color: #9ca3af;
//                     font-style: normal;
//                 }
//             `}</style>

//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//                 <div
//                     className="bg-white rounded-xl w-full max-w-2xl border border-gray-200 overflow-hidden flex flex-col"
//                     style={{ maxHeight: "calc(100vh - 2rem)" }}
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     {/* Header */}
//                     <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
//                         <div className="flex items-center gap-2.5">
//                             <HelpCircle size={17} className="text-gray-400" />
//                             <span className="text-sm font-medium text-gray-800">
//                                 Add new FAQ
//                             </span>
//                             {qaList.length > 1 && (
//                                 <span className="text-xs text-gray-400 ml-2">
//                                     ({qaList.length} Q&amp;A pairs)
//                                 </span>
//                             )}
//                         </div>
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                         >
//                             <X size={18} />
//                         </button>
//                     </div>

//                     {/* Scrollable body */}
//                     <form
//                         onSubmit={handleSubmit}
//                         className="overflow-y-auto px-5 py-5 flex flex-col gap-4 flex-1 min-h-0"
//                     >
//                         {/* Category & Package */}
//                         <SectionHeading>Assignment</SectionHeading>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {/* Category */}
//                             <div className="flex flex-col gap-1.5">
//                                 <label className="text-xs font-medium text-gray-500">
//                                     Category <span className="text-red-400">*</span>
//                                 </label>
//                                 <Select
//                                     options={categoryOptions}
//                                     value={selectedCategory}
//                                     onChange={(selected) => {
//                                         setCategoryId(selected ? selected.value : "");
//                                         setPackageId("");
//                                     }}
//                                     placeholder="— Select category —"
//                                     isClearable
//                                     styles={makeSelectStyles()}
//                                     menuPortalTarget={document.body}
//                                     menuPosition="fixed"
//                                 />
//                                 {noPackages && (
//                                     <p className="text-xs text-amber-500">
//                                         No packages available for this category
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Package */}
//                             <div className="flex flex-col gap-1.5">
//                                 <label className="text-xs font-medium text-gray-500">
//                                     Package
//                                 </label>
//                                 <Select
//                                     options={packageOptions}
//                                     value={selectedPackage}
//                                     onChange={(selected) =>
//                                         setPackageId(selected ? selected.value : "")
//                                     }
//                                     placeholder="— Select package —"
//                                     isClearable
//                                     isDisabled={!categoryId || noPackages}
//                                     styles={makeSelectStyles(false, !categoryId || noPackages)}
//                                     menuPortalTarget={document.body}
//                                     menuPosition="fixed"
//                                 />
//                             </div>
//                         </div>

//                         {/* Questions & Answers */}
//                         <SectionHeading>Questions & Answers</SectionHeading>
//                         <div className="flex flex-col gap-3">
//                             {qaList.map((qa, index) => (
//                                 <div
//                                     key={index}
//                                     className="relative p-4 bg-gray-50 rounded-lg border border-gray-200"
//                                 >
//                                     {qaList.length > 1 && (
//                                         <div className="flex items-center justify-between mb-3">
//                                             <span className="text-xs font-medium text-gray-400">
//                                                 FAQ #{index + 1}
//                                             </span>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeQa(index)}
//                                                 className="p-1 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
//                                             >
//                                                 <Trash2 size={14} />
//                                             </button>
//                                         </div>
//                                     )}
//                                     <div className="flex flex-col gap-3">
//                                         <div className="flex flex-col gap-1.5">
//                                             <label className="text-xs font-medium text-gray-500">
//                                                 Question <span className="text-red-400">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={qa.question}
//                                                 onChange={(e) => handleQaChange(index, "question", e.target.value)}
//                                                 required
//                                                 placeholder="e.g. What is included in the package?"
//                                                 className={inputBase}
//                                             />
//                                         </div>
//                                         <div className="flex flex-col gap-1.5">
//                                             <label className="text-xs font-medium text-gray-500">
//                                                 Answer <span className="text-red-400">*</span>
//                                             </label>
//                                             <div className="quill-faq">
//                                                 <ReactQuill
//                                                     theme="snow"
//                                                     value={qa.answer}
//                                                     onChange={(value) => handleQaChange(index, "answer", value)}
//                                                     modules={quillModules}
//                                                     formats={quillFormats}
//                                                     placeholder="Write a clear, helpful answer..."
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}

//                             <button
//                                 type="button"
//                                 onClick={addQa}
//                                 className="flex items-center gap-2 w-fit px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
//                             >
//                                 <Plus size={15} />
//                                 Add another Q&amp;A
//                             </button>
//                         </div>

//                         {/* Footer Buttons */}
//                         <div className="flex gap-2.5 pt-3 mt-1 border-t border-gray-100 shrink-0">
//                             <button
//                                 type="button"
//                                 onClick={handleClose}
//                                 className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {submitting
//                                     ? "Saving..."
//                                     : validCount > 1
//                                     ? `Save ${validCount} FAQs`
//                                     : "Create FAQ"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddFAQForm;


import axios from "axios";
import React, { useState, useMemo } from "react";
import { X, Plus, Trash2, HelpCircle } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

const EMPTY_QA = { question: "", answer: "" };

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'check',
    'indent',
    'align',
    'link', 'image', 'video'
];

const inputBase = "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";

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
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
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
        backgroundColor: isDisabled ? "#f3f4f6" : hasError ? "#fef2f2" : "#f9fafb",
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
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
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

const AddFAQForm = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    allCategories = [],
    allPackages = [],
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [packageId, setPackageId] = useState("");
    const [qaList, setQaList] = useState([{ ...EMPTY_QA }]);

    const filteredPackages = useMemo(() => {
        if (!categoryId) return [];
        return allPackages.filter((pkg) =>
            pkg.categories?.some((cat) => String(cat.id) === String(categoryId))
        );
    }, [categoryId, allPackages]);

    const categoryOptions = useMemo(
        () => allCategories.map((cat) => ({ value: String(cat.id), label: cat.name })),
        [allCategories]
    );

    const packageOptions = useMemo(
        () => filteredPackages.map((pkg) => ({ value: String(pkg.id), label: pkg.name ?? pkg.title })),
        [filteredPackages]
    );

    const selectedCategory = categoryOptions.find((o) => o.value === String(categoryId)) || null;
    const selectedPackage = packageOptions.find((o) => o.value === String(packageId)) || null;

    const resetForm = () => {
        setCategoryId("");
        setPackageId("");
        setQaList([{ ...EMPTY_QA }]);
    };

    const handleClose = () => {
        setShowForm(false);
        resetForm();
    };

    const handleQaChange = (index, field, value) => {
        setQaList((prev) =>
            prev.map((qa, i) => (i === index ? { ...qa, [field]: value } : qa))
        );
    };

    const addQa = () => setQaList((prev) => [...prev, { ...EMPTY_QA }]);
    const removeQa = (index) => setQaList((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            alert("Please select a category.");
            return;
        }

        try {
            setSubmitting(true);

            const validQa = qaList.filter(
                (qa) => qa.question.trim() && qa.answer.trim()
            );
            if (validQa.length === 0) return;

            await Promise.all(
                validQa.map((qa) => {
                    const formData = new FormData();
                    formData.append("question", qa.question);
                    formData.append("answer", qa.answer);
                    formData.append("category_id", categoryId);
                    if (packageId) formData.append("package_id", packageId);
                    return axios.post(route("ourfaqs.store"), formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                })
            );
            setReloadTrigger((prev) => !prev);
            handleClose();
        } catch (err) {
            console.error("Save error", err);
            console.error("Validation errors:", err.response?.data?.errors);
        } finally {
            setSubmitting(false);
        }
    };

    const validCount = qaList.filter((q) => q.question.trim()).length;
    const noPackages = !!categoryId && filteredPackages.length === 0;

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
                        <HelpCircle size={17} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">
                            Add new FAQ
                        </span>
                        {qaList.length > 1 && (
                            <span className="text-xs text-gray-400 ml-2">
                                ({qaList.length} Q&amp;A pairs)
                            </span>
                        )}
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
                                    setCategoryId(selected ? selected.value : "");
                                    setPackageId("");
                                }}
                                placeholder="— Select category —"
                                isClearable
                                styles={makeSelectStyles()}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                            {noPackages && (
                                <p className="text-xs text-amber-500">
                                    No packages available for this category
                                </p>
                            )}
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
                                placeholder="— Select package —"
                                isClearable
                                isDisabled={!categoryId || noPackages}
                                styles={makeSelectStyles(false, !categoryId || noPackages)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                            />
                        </div>
                    </div>

                    {/* Questions & Answers */}
                    <SectionHeading>Questions & Answers</SectionHeading>
                    <div className="flex flex-col gap-3">
                        {qaList.map((qa, index) => (
                            <div
                                key={index}
                                className="relative p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                {qaList.length > 1 && (
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-medium text-gray-400">
                                            FAQ #{index + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeQa(index)}
                                            className="p-1 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-500">
                                            Question <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={qa.question}
                                            onChange={(e) => handleQaChange(index, "question", e.target.value)}
                                            required
                                            placeholder="e.g. What is included in the package?"
                                            className={inputBase}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-gray-500">
                                            Answer <span className="text-red-400">*</span>
                                        </label>
                                        <RichTextEditor
                                            value={qa.answer}
                                            onChange={(value) => handleQaChange(index, "answer", value)}
                                            placeholder="Write a clear, helpful answer..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addQa}
                            className="flex items-center gap-2 w-fit px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Plus size={15} />
                            Add another Q&amp;A
                        </button>
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
                            {submitting
                                ? "Saving..."
                                : validCount > 1
                                ? `Save ${validCount} FAQs`
                                : "Create FAQ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFAQForm;

// import React, { useEffect, useState, useMemo } from "react";
// import { X, Plus, Trash2, HelpCircle } from "lucide-react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const EMPTY_QA = { question: "", answer: "" };

// const quillModules = {
//     toolbar: [
//         [{ header: [1, 2, 3, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link", "clean"],
//     ],
// };

// const quillFormats = [
//     "header", "bold", "italic", "underline", "strike",
//     "list", "bullet", "link",
// ];

// const inputBase = "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";
// const selectBase = `${inputBase} bg-gray-50`;

// const SectionHeading = ({ children }) => (
//     <div className="flex items-center gap-2 mt-1">
//         <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
//             {children}
//         </span>
//         <div className="flex-1 h-px bg-gray-100" />
//     </div>
// );

// const AddFAQForm = ({
//     showForm,
//     setShowForm,
//     setReloadTrigger,
//     editingFaq,
//     setEditingFaq,
//     handleUpdate,
//     allCategories = [],
//     allPackages = [],
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [categoryId, setCategoryId] = useState("");
//     const [packageId, setPackageId] = useState("");
//     const [qaList, setQaList] = useState([{ ...EMPTY_QA }]);
//     const [editQa, setEditQa] = useState({ question: "", answer: "" });

//     const isEditing = !!editingFaq;

//     // const filteredPackages = useMemo(() => {
//     //     if (!categoryId) return [];
//     //     return allPackages.filter(
//     //         (pkg) => String(pkg.category_id) === String(categoryId)
//     //     );
//     // }, [categoryId, allPackages]);

//     const filteredPackages = useMemo(() => {
//     if (!categoryId) return [];
//     return allPackages.filter((pkg) =>
//         pkg.categories?.some(
//             (cat) => String(cat.id) === String(categoryId)
//         )
//     );
// }, [categoryId, allPackages]);

//     useEffect(() => {
//         if (editingFaq) {
//             setCategoryId(String(editingFaq.category_id ?? ""));
//             setPackageId(String(editingFaq.package_id ?? ""));
//             setEditQa({
//                 question: editingFaq.question ?? "",
//                 answer: editingFaq.answer ?? "",
//             });
//         } else {
//             resetForm();
//         }
//     }, [editingFaq]);

//     useEffect(() => {
//         if (!isEditing) return;
//         const stillValid = allPackages.some(
//             (pkg) =>
//                 String(pkg.id) === String(packageId) &&
//                 String(pkg.category_id) === String(categoryId)
//         );
//         if (!stillValid) setPackageId("");
//     }, [categoryId]);

//     const resetForm = () => {
//         setCategoryId("");
//         setPackageId("");
//         setQaList([{ ...EMPTY_QA }]);
//         setEditQa({ question: "", answer: "" });
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingFaq(null);
//         resetForm();
//     };

//     const handleQaChange = (index, field, value) => {
//         setQaList((prev) =>
//             prev.map((qa, i) => (i === index ? { ...qa, [field]: value } : qa))
//         );
//     };

//     const addQa = () => setQaList((prev) => [...prev, { ...EMPTY_QA }]);
//     const removeQa = (index) =>
//         setQaList((prev) => prev.filter((_, i) => i !== index));

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!categoryId) {
//             alert("Please select a category.");
//             return;
//         }

//         try {
//             setSubmitting(true);

//             if (isEditing) {
//                 const formData = new FormData();
//                 formData.append("question", editQa.question);
//                 formData.append("answer", editQa.answer);
//                 formData.append("category_id", categoryId);
//                 if (packageId) formData.append("package_id", packageId);
//                 await handleUpdate(formData, editingFaq.id);
//             } else {
//                 const validQa = qaList.filter(
//                     (qa) => qa.question.trim() && qa.answer.trim()
//                 );
//                 if (validQa.length === 0) return;

//                 await Promise.all(
//                     validQa.map((qa) => {
//                         const formData = new FormData();
//                         formData.append("question", qa.question);
//                         formData.append("answer", qa.answer);
//                         formData.append("category_id", categoryId);
//                         if (packageId) formData.append("package_id", packageId);
//                         return axios.post(route("ourfaqs.store"), formData, {
//                             headers: { "Content-Type": "multipart/form-data" },
//                         });
//                     })
//                 );
//                 setReloadTrigger((prev) => !prev);
//             }

//             handleClose();
//         } catch (err) {
//             console.error("Save error", err);
//             console.error("Validation errors:", err.response?.data?.errors);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const validCount = qaList.filter((q) => q.question.trim()).length;

//     if (!showForm) return null;

//     return (
//         <>
//             <style>{`
//                 .quill-faq .ql-container { 
//                     min-height: 120px; 
//                     max-height: 220px; 
//                     overflow-y: auto; 
//                     font-size: 14px; 
//                     border-bottom-left-radius: 8px; 
//                     border-bottom-right-radius: 8px; 
//                 }
//                 .quill-faq .ql-editor { 
//                     min-height: 120px; 
//                 }
//                 .quill-faq .ql-toolbar.ql-snow { 
//                     border-top-left-radius: 8px; 
//                     border-top-right-radius: 8px; 
//                     border-color: #e5e7eb;
//                     background-color: #f9fafb;
//                 }
//                 .quill-faq .ql-container.ql-snow { 
//                     border-color: #e5e7eb;
//                     background-color: #ffffff;
//                 }
//                 .quill-faq .ql-toolbar.ql-snow + .ql-container.ql-snow { 
//                     border-top: none; 
//                 }
//                 .quill-faq .ql-editor.ql-blank::before {
//                     color: #9ca3af;
//                     font-style: normal;
//                 }
//             `}</style>

//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//                 <div
//                     className="bg-white rounded-xl w-full max-w-2xl border border-gray-200 overflow-hidden flex flex-col"
//                     style={{ maxHeight: "calc(100vh - 2rem)" }}
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     {/* Header */}
//                     <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
//                         <div className="flex items-center gap-2.5">
//                             <HelpCircle size={17} className="text-gray-400" />
//                             <span className="text-sm font-medium text-gray-800">
//                                 {isEditing ? "Edit FAQ" : "Add new FAQ"}
//                             </span>
//                             {!isEditing && qaList.length > 1 && (
//                                 <span className="text-xs text-gray-400 ml-2">
//                                     ({qaList.length} Q&amp;A pairs)
//                                 </span>
//                             )}
//                         </div>
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                         >
//                             <X size={18} />
//                         </button>
//                     </div>

//                     {/* Scrollable body */}
//                     <form
//                         onSubmit={handleSubmit}
//                         className="overflow-y-auto px-5 py-5 flex flex-col gap-4 flex-1 min-h-0"
//                     >
//                         {/* Category & Package Selection */}
//                         <SectionHeading>Assignment</SectionHeading>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {/* Category */}
//                             <div className="flex flex-col gap-1.5">
//                                 <label className="text-xs font-medium text-gray-500">
//                                     Category <span className="text-red-400">*</span>
//                                 </label>
//                                 <select
//                                     value={categoryId}
//                                     onChange={(e) => {
//                                         setCategoryId(e.target.value);
//                                         setPackageId("");
//                                     }}
//                                     required
//                                     className={selectBase}
//                                 >
//                                     <option value="">— Select category —</option>
//                                     {allCategories.map((cat) => (
//                                         <option key={cat.id} value={cat.id}>
//                                             {cat.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {categoryId && filteredPackages.length === 0 && (
//                                     <p className="text-xs text-amber-500">
//                                         No packages available for this category
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Package */}
//                             <div className="flex flex-col gap-1.5">
//                                 <label className="text-xs font-medium text-gray-500">
//                                     Package
//                                 </label>
//                                 <select
//                                     value={packageId}
//                                     onChange={(e) => setPackageId(e.target.value)}
//                                     disabled={!categoryId || filteredPackages.length === 0}
//                                     className={`${selectBase} disabled:opacity-50 disabled:cursor-not-allowed`}
//                                 >
//                                     <option value="">— Select package —</option>
//                                     {filteredPackages.map((pkg) => (
//                                         <option key={pkg.id} value={pkg.id}>
//                                             {pkg.name ?? pkg.title}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Edit Mode: Single Q&A */}
//                         {isEditing ? (
//                             <>
//                                 <SectionHeading>Question & Answer</SectionHeading>
//                                 <div className="flex flex-col gap-4">
//                                     <div className="flex flex-col gap-1.5">
//                                         <label className="text-xs font-medium text-gray-500">
//                                             Question <span className="text-red-400">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={editQa.question}
//                                             onChange={(e) =>
//                                                 setEditQa((prev) => ({ ...prev, question: e.target.value }))
//                                             }
//                                             required
//                                             placeholder="Enter the question"
//                                             className={inputBase}
//                                         />
//                                     </div>
//                                     <div className="flex flex-col gap-1.5">
//                                         <label className="text-xs font-medium text-gray-500">
//                                             Answer <span className="text-red-400">*</span>
//                                         </label>
//                                         <div className="quill-faq">
//                                             <ReactQuill
//                                                 theme="snow"
//                                                 value={editQa.answer}
//                                                 onChange={(value) =>
//                                                     setEditQa((prev) => ({ ...prev, answer: value }))
//                                                 }
//                                                 modules={quillModules}
//                                                 formats={quillFormats}
//                                                 placeholder="Write a clear, helpful answer..."
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </>
//                         ) : (
//                             /* Create Mode: Multiple Q&A Pairs */
//                             <>
//                                 <SectionHeading>Questions & Answers</SectionHeading>
//                                 <div className="flex flex-col gap-3">
//                                     {qaList.map((qa, index) => (
//                                         <div
//                                             key={index}
//                                             className="relative p-4 bg-gray-50 rounded-lg border border-gray-200"
//                                         >
//                                             {qaList.length > 1 && (
//                                                 <>
//                                                     <div className="flex items-center justify-between mb-3">
//                                                         <span className="text-xs font-medium text-gray-400">
//                                                             FAQ #{index + 1}
//                                                         </span>
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => removeQa(index)}
//                                                             className="p-1 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
//                                                         >
//                                                             <Trash2 size={14} />
//                                                         </button>
//                                                     </div>
//                                                 </>
//                                             )}
//                                             <div className="flex flex-col gap-3">
//                                                 <div className="flex flex-col gap-1.5">
//                                                     <label className="text-xs font-medium text-gray-500">
//                                                         Question <span className="text-red-400">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         value={qa.question}
//                                                         onChange={(e) => handleQaChange(index, "question", e.target.value)}
//                                                         required
//                                                         placeholder="e.g. What is included in the package?"
//                                                         className={inputBase}
//                                                     />
//                                                 </div>
//                                                 <div className="flex flex-col gap-1.5">
//                                                     <label className="text-xs font-medium text-gray-500">
//                                                         Answer <span className="text-red-400">*</span>
//                                                     </label>
//                                                     <div className="quill-faq">
//                                                         <ReactQuill
//                                                             theme="snow"
//                                                             value={qa.answer}
//                                                             onChange={(value) => handleQaChange(index, "answer", value)}
//                                                             modules={quillModules}
//                                                             formats={quillFormats}
//                                                             placeholder="Write a clear, helpful answer..."
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
                                    
//                                     <button
//                                         type="button"
//                                         onClick={addQa}
//                                         className="flex items-center gap-2 w-fit px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
//                                     >
//                                         <Plus size={15} />
//                                         Add another Q&amp;A
//                                     </button>
//                                 </div>
//                             </>
//                         )}

//                         {/* Footer Buttons */}
//                         <div className="flex gap-2.5 pt-3 mt-1 border-t border-gray-100 shrink-0">
//                             <button
//                                 type="button"
//                                 onClick={handleClose}
//                                 className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="flex-1 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {submitting
//                                     ? "Saving..."
//                                     : isEditing
//                                     ? "Save changes"
//                                     : validCount > 1
//                                     ? `Save ${validCount} FAQs`
//                                     : "Create FAQ"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddFAQForm;


// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddFAQForm = ({
//     editingFaq,
//     setEditingFaq,
//     setShowForm,
//     handleUpdate,
//     reloadTrigger,
//     setReloadTrigger,
//     showForm,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [faqForm, setFaqForm] = useState({
//         question: "",
//         answer: "",
//         category_id: "",
//         package_id: "",
//     });
//     //  Use Effect
//     useEffect(() => {
//         if (editingFaq) {
//             setFaqForm({
//                 ...editingFaq,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setFaqForm({
//                 question: "",
//                 answer: "",
//                 category_id: "",
//                 package_id: "",
//             });
//         }
//     }, [editingFaq]);

//     // Handle Create FAQ
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourfaqs.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating FAQ", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in faqForm) {
//             if (faqForm[key] !== null && faqForm[key] !== "") {
//                 formData.append(key, faqForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingFaq) {
//                 // Editing existing FAQ
//                 await handleUpdate(formData, editingFaq.id);
//             } else {
//                 // Creating new FAQ
//                 await handleCreate(formData);
//             }
//             setFaqForm({
//                 question: "",
//                 answer: "",
//                 category_id: "",
//                 package_id: "",
//             });

//             setShowForm(false);
//             setEditingFaq(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setFaqForm((prev) => ({
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
//                         Add New FAQ
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

// export default AddFAQForm;
