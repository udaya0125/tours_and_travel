// import React, { useEffect, useState, useMemo } from "react";
// import { X, Plus, Trash2, Loader2 } from "lucide-react";
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

//     // For create: multiple Q&A pairs
//     const [qaList, setQaList] = useState([{ ...EMPTY_QA }]);

//     // For edit: single Q&A
//     const [editQa, setEditQa] = useState({ question: "", answer: "" });

//     const isEditing = !!editingFaq;

//     // Packages filtered by selected category
//     const filteredPackages = useMemo(() => {
//         if (!categoryId) return [];
//         return allPackages.filter(
//             (pkg) => String(pkg.category_id) === String(categoryId)
//         );
//     }, [categoryId, allPackages]);

//     // Populate form when editing
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

//     // When category changes during edit, clear package if it no longer belongs
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

//     // Q&A list handlers (create mode)
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
//                 // Single FAQ update
//                 const formData = new FormData();
//                 formData.append("question", editQa.question);
//                 formData.append("answer", editQa.answer);
//                 formData.append("category_id", categoryId);
//                 if (packageId) formData.append("package_id", packageId);
//                 await handleUpdate(formData, editingFaq.id);
//             } else {
//                 // Create multiple FAQs — all share same category + package
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
//                 .quill-faq .ql-container { min-height: 120px; max-height: 220px; overflow-y: auto; font-size: 14px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
//                 .quill-faq .ql-editor { min-height: 120px; }
//                 .quill-faq .ql-toolbar.ql-snow { border-top-left-radius: 8px; border-top-right-radius: 8px; border-color: #e5e7eb; }
//                 .quill-faq .ql-container.ql-snow { border-color: #e5e7eb; }
//                 .quill-faq .ql-toolbar.ql-snow + .ql-container.ql-snow { border-top: none; }
//             `}</style>

//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                 <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[92vh]">

//                     {/* Header */}
//                     <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0">
//                         <div>
//                             <h2 className="text-xl font-bold text-gray-800">
//                                 {isEditing ? "Edit FAQ" : "Add New FAQ"}
//                             </h2>
//                             {!isEditing && qaList.length > 1 && (
//                                 <p className="text-xs text-gray-400 mt-0.5">
//                                     {qaList.length} Q&amp;A pairs — all share the same category &amp; package
//                                 </p>
//                             )}
//                         </div>
//                         <button type="button" onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                             <X size={20} />
//                         </button>
//                     </div>

//                     <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
//                         <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

//                             {/* Category + Package row */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {/* Category */}
//                                 <div className="space-y-1.5">
//                                     <label className="block text-sm font-semibold text-gray-700">
//                                         Category <span className="text-red-500">*</span>
//                                     </label>
//                                     <select
//                                         value={categoryId}
//                                         onChange={(e) => {
//                                             setCategoryId(e.target.value);
//                                             setPackageId("");
//                                         }}
//                                         required
//                                         className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
//                                     >
//                                         <option value="">— Select category —</option>
//                                         {allCategories.map((cat) => (
//                                             <option key={cat.id} value={cat.id}>
//                                                 {cat.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 {/* Package — filtered by category */}
//                                 <div className="space-y-1.5">
//                                     <label className="block text-sm font-semibold text-gray-700">
//                                         Package
//                                         {categoryId && filteredPackages.length === 0 && (
//                                             <span className="text-xs text-amber-500 ml-2 font-normal">
//                                                 No packages for this category
//                                             </span>
//                                         )}
//                                     </label>
//                                     <select
//                                         value={packageId}
//                                         onChange={(e) => setPackageId(e.target.value)}
//                                         disabled={!categoryId || filteredPackages.length === 0}
//                                         className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-400"
//                                     >
//                                         <option value="">— Select package —</option>
//                                         {filteredPackages.map((pkg) => (
//                                             <option key={pkg.id} value={pkg.id}>
//                                                 {pkg.name ?? pkg.title}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Edit mode: single Q&A */}
//                             {isEditing ? (
//                                 <div className="space-y-4">
//                                     <div className="space-y-1.5">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Question <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={editQa.question}
//                                             onChange={(e) =>
//                                                 setEditQa((prev) => ({ ...prev, question: e.target.value }))
//                                             }
//                                             required
//                                             placeholder="Enter the question"
//                                             className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
//                                         />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Answer <span className="text-red-500">*</span>
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
//                             ) : (
//                                 /* Create mode: multiple Q&A pairs */
//                                 <div className="space-y-4">
//                                     <div className="flex items-center justify-between">
//                                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                             Questions &amp; Answers
//                                         </p>
//                                         <button
//                                             type="button"
//                                             onClick={addQa}
//                                             className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
//                                         >
//                                             <Plus size={13} />
//                                             Add another
//                                         </button>
//                                     </div>

//                                     {qaList.map((qa, index) => (
//                                         <div
//                                             key={index}
//                                             className="border border-gray-200 rounded-xl p-4 space-y-3 relative"
//                                         >
//                                             {qaList.length > 1 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeQa(index)}
//                                                     className="absolute top-3 right-3 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                                                 >
//                                                     <Trash2 size={14} />
//                                                 </button>
//                                             )}
//                                             {qaList.length > 1 && (
//                                                 <p className="text-xs font-semibold text-gray-400">
//                                                     FAQ #{index + 1}
//                                                 </p>
//                                             )}
//                                             <div className="space-y-1.5">
//                                                 <label className="block text-sm font-semibold text-gray-700">
//                                                     Question <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     value={qa.question}
//                                                     onChange={(e) => handleQaChange(index, "question", e.target.value)}
//                                                     required
//                                                     placeholder="e.g. What is included in the package?"
//                                                     className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
//                                                 />
//                                             </div>
//                                             <div className="space-y-1.5">
//                                                 <label className="block text-sm font-semibold text-gray-700">
//                                                     Answer <span className="text-red-500">*</span>
//                                                 </label>
//                                                 <div className="quill-faq">
//                                                     <ReactQuill
//                                                         theme="snow"
//                                                         value={qa.answer}
//                                                         onChange={(value) => handleQaChange(index, "answer", value)}
//                                                         modules={quillModules}
//                                                         formats={quillFormats}
//                                                         placeholder="Write a clear, helpful answer..."
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}

//                                     <button
//                                         type="button"
//                                         onClick={addQa}
//                                         className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
//                                     >
//                                         <Plus size={15} />
//                                         Add another Q&amp;A
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Footer */}
//                         <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
//                             <button
//                                 type="button"
//                                 onClick={handleClose}
//                                 className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2 min-w-[120px] justify-center"
//                             >
//                                 {submitting && <Loader2 size={15} className="animate-spin" />}
//                                 {submitting
//                                     ? "Saving..."
//                                     : isEditing
//                                     ? "Update FAQ"
//                                     : validCount > 1
//                                     ? `Save ${validCount} FAQs`
//                                     : "Save FAQ"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddFAQForm;

import React, { useEffect, useState, useMemo } from "react";
import { X, Plus, Trash2, HelpCircle } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EMPTY_QA = { question: "", answer: "" };

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
    ],
};

const quillFormats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "link",
];

const inputBase = "w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";
const selectBase = `${inputBase} bg-gray-50`;

const SectionHeading = ({ children }) => (
    <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {children}
        </span>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

const AddFAQForm = ({
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
    const [qaList, setQaList] = useState([{ ...EMPTY_QA }]);
    const [editQa, setEditQa] = useState({ question: "", answer: "" });

    const isEditing = !!editingFaq;

    // const filteredPackages = useMemo(() => {
    //     if (!categoryId) return [];
    //     return allPackages.filter(
    //         (pkg) => String(pkg.category_id) === String(categoryId)
    //     );
    // }, [categoryId, allPackages]);

    const filteredPackages = useMemo(() => {
    if (!categoryId) return [];
    return allPackages.filter((pkg) =>
        pkg.categories?.some(
            (cat) => String(cat.id) === String(categoryId)
        )
    );
}, [categoryId, allPackages]);

    useEffect(() => {
        if (editingFaq) {
            setCategoryId(String(editingFaq.category_id ?? ""));
            setPackageId(String(editingFaq.package_id ?? ""));
            setEditQa({
                question: editingFaq.question ?? "",
                answer: editingFaq.answer ?? "",
            });
        } else {
            resetForm();
        }
    }, [editingFaq]);

    useEffect(() => {
        if (!isEditing) return;
        const stillValid = allPackages.some(
            (pkg) =>
                String(pkg.id) === String(packageId) &&
                String(pkg.category_id) === String(categoryId)
        );
        if (!stillValid) setPackageId("");
    }, [categoryId]);

    const resetForm = () => {
        setCategoryId("");
        setPackageId("");
        setQaList([{ ...EMPTY_QA }]);
        setEditQa({ question: "", answer: "" });
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingFaq(null);
        resetForm();
    };

    const handleQaChange = (index, field, value) => {
        setQaList((prev) =>
            prev.map((qa, i) => (i === index ? { ...qa, [field]: value } : qa))
        );
    };

    const addQa = () => setQaList((prev) => [...prev, { ...EMPTY_QA }]);
    const removeQa = (index) =>
        setQaList((prev) => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryId) {
            alert("Please select a category.");
            return;
        }

        try {
            setSubmitting(true);

            if (isEditing) {
                const formData = new FormData();
                formData.append("question", editQa.question);
                formData.append("answer", editQa.answer);
                formData.append("category_id", categoryId);
                if (packageId) formData.append("package_id", packageId);
                await handleUpdate(formData, editingFaq.id);
            } else {
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
            }

            handleClose();
        } catch (err) {
            console.error("Save error", err);
            console.error("Validation errors:", err.response?.data?.errors);
        } finally {
            setSubmitting(false);
        }
    };

    const validCount = qaList.filter((q) => q.question.trim()).length;

    if (!showForm) return null;

    return (
        <>
            <style>{`
                .quill-faq .ql-container { 
                    min-height: 120px; 
                    max-height: 220px; 
                    overflow-y: auto; 
                    font-size: 14px; 
                    border-bottom-left-radius: 8px; 
                    border-bottom-right-radius: 8px; 
                }
                .quill-faq .ql-editor { 
                    min-height: 120px; 
                }
                .quill-faq .ql-toolbar.ql-snow { 
                    border-top-left-radius: 8px; 
                    border-top-right-radius: 8px; 
                    border-color: #e5e7eb;
                    background-color: #f9fafb;
                }
                .quill-faq .ql-container.ql-snow { 
                    border-color: #e5e7eb;
                    background-color: #ffffff;
                }
                .quill-faq .ql-toolbar.ql-snow + .ql-container.ql-snow { 
                    border-top: none; 
                }
                .quill-faq .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
            `}</style>

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
                                {isEditing ? "Edit FAQ" : "Add new FAQ"}
                            </span>
                            {!isEditing && qaList.length > 1 && (
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
                        {/* Category & Package Selection */}
                        <SectionHeading>Assignment</SectionHeading>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Category */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500">
                                    Category <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => {
                                        setCategoryId(e.target.value);
                                        setPackageId("");
                                    }}
                                    required
                                    className={selectBase}
                                >
                                    <option value="">— Select category —</option>
                                    {allCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {categoryId && filteredPackages.length === 0 && (
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
                                <select
                                    value={packageId}
                                    onChange={(e) => setPackageId(e.target.value)}
                                    disabled={!categoryId || filteredPackages.length === 0}
                                    className={`${selectBase} disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <option value="">— Select package —</option>
                                    {filteredPackages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name ?? pkg.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Edit Mode: Single Q&A */}
                        {isEditing ? (
                            <>
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
                                                setEditQa((prev) => ({ ...prev, question: e.target.value }))
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
                                        <div className="quill-faq">
                                            <ReactQuill
                                                theme="snow"
                                                value={editQa.answer}
                                                onChange={(value) =>
                                                    setEditQa((prev) => ({ ...prev, answer: value }))
                                                }
                                                modules={quillModules}
                                                formats={quillFormats}
                                                placeholder="Write a clear, helpful answer..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Create Mode: Multiple Q&A Pairs */
                            <>
                                <SectionHeading>Questions & Answers</SectionHeading>
                                <div className="flex flex-col gap-3">
                                    {qaList.map((qa, index) => (
                                        <div
                                            key={index}
                                            className="relative p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            {qaList.length > 1 && (
                                                <>
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
                                                </>
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
                                                    <div className="quill-faq">
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={qa.answer}
                                                            onChange={(value) => handleQaChange(index, "answer", value)}
                                                            modules={quillModules}
                                                            formats={quillFormats}
                                                            placeholder="Write a clear, helpful answer..."
                                                        />
                                                    </div>
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
                            </>
                        )}

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
                                    : isEditing
                                    ? "Save changes"
                                    : validCount > 1
                                    ? `Save ${validCount} FAQs`
                                    : "Create FAQ"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddFAQForm;


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
