import AddFAQForm from "@/AddNavFormComponents/AddFAQForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";

const FAQ = () => {
    const [allFaqs, setAllFaqs] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [allPackages, setAllPackages] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await axios.get(route("ourfaqs.index"));
                setAllFaqs(res.data.data ?? []);
            } catch (err) {
                console.error("FAQ fetch error", err);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await axios.get(route("ourcategories.index"));
                const raw = res.data.categories ?? res.data.data ?? res.data ?? [];
                setAllCategories(Array.isArray(raw) ? raw : Object.values(raw));
            } catch (err) {
                console.error("Category fetch error", err);
            }
        };

        const fetchPackages = async () => {
            try {
                // const res = await axios.get(route("ourpackages.index"));
                // const raw = res.data.packages ?? res.data.data ?? res.data ?? [];
                const res = await axios.get(route("ourpackages.index"));
const raw = res.data.packages ?? res.data.data ?? res.data ?? [];
                setAllPackages(Array.isArray(raw) ? raw : Object.values(raw));
            } catch (err) {
                console.error("Package fetch error", err);
            }
        };

        fetchCategories();
        fetchPackages();
        fetchFaqs();
    }, [reloadTrigger]);

    console.log("Fetched FAQs:", allFaqs);
    console.log("Fetched Categories:", allCategories);
    console.log("Fetched Packages:", allPackages);

    const handleDelete = async (id) => {
        if (!confirm("Delete this FAQ?")) return;
        try {
            await axios.delete(route("ourfaqs.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const res = await axios.post(
                route("ourfaqs.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return res.data;
        } catch (err) {
            console.error("Update error", err);
            throw err;
        }
    };

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    FAQ Management
                </h1>
                <button
                    onClick={() => {
                        setEditingFaq(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <MdAdd size={18} />
                    <span>Create</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">S.N</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Question</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Package</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allFaqs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                                    No FAQs found.
                                </td>
                            </tr>
                        ) : (
                            allFaqs.map((faq, index) => (
                                <tr key={faq.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 text-gray-800 max-w-xs truncate">
                                        {faq.question}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {faq.category?.name ?? <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {faq.package?.title ?? <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(faq)}
                                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                        >
                                            <MdEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(faq.id)}
                                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                        >
                                            <MdDelete size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddFAQForm
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={setReloadTrigger}
                editingFaq={editingFaq}
                setEditingFaq={setEditingFaq}
                handleUpdate={handleUpdate}
                allCategories={allCategories}
                allPackages={allPackages}
            />
        </AdminWrapper>
    );
};

export default FAQ;

// import AddFAQForm from "@/AddNavFormComponents/AddFAQForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const FAQ = () => {
//     const [allFaqs, setAllFaqs] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [allPackages, setAllPackages] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingFaq, setEditingFaq] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the FAQ data
//     useEffect(() => {
//         const fetchFaq = async () => {
//             try {
//                 const response = await axios.get(route("ourfaqs.index"));
//                 setAllFaqs(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//          const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.categories ?? response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchPackage = async () => {
//             try {
//                 const response = await axios.get(route("ourpackages.index"));
//                 setAllPackages(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchCategory();
//         fetchPackage();
//         fetchFaq();
//     }, [reloadTrigger]);

//     // For delete the FAQ
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourfaqs.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (faq) => {
//         setEditingFaq(faq);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourfaqs.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating FAQ", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             FAQ Management
//                         </h1>
//                     </div>
//                     <button
//                         onClick={() => setShowForm(true)}
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                     >
//                         <Plus size={18} />
//                         <span>Create</span>
//                     </button>
//                 </div>

//                 <AddFAQForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingFaq={editingFaq}
//                     setEditingFaq={setEditingFaq}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//         </>
//     );
// };

// export default FAQ;
