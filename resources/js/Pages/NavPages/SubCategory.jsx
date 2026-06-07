import AddSubCategory from "@/AddNavFormComponents/AddSubCategory";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const SubCategory = () => {
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchSubCategory = async () => {
            try {
                const response = await axios.get(
                    route("oursubcategories.index"),
                );
                setAllSubCategory(response.data.sub_categories); // fixed: was response.data
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(route("ourcategories.index")); // adjust route name as needed
                setAllCategories(response.data.categories);
            } catch (error) {
                console.error("fetching categories error", error);
            }
        };

        fetchSubCategory();
        fetchCategories();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this subcategory?"))
            return;
        try {
            await axios.delete(route("oursubcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (subCategory) => {
        setEditingSubCategory(subCategory);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("oursubcategories.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating subcategory", error);
            throw error;
        }
    };

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    SubCategory Management
                </h1>
                <button
                    onClick={() => {
                        setEditingSubCategory(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created Time
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {allSubCategory.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-8 text-center text-gray-400"
                                >
                                    No subcategories found.
                                </td>
                            </tr>
                        ) : (
                            allSubCategory.map((sub, index) => (
                                <tr
                                    key={sub.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                        {sub.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {sub.category?.name ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(
                                            sub.created_at,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(
                                            sub.created_at,
                                        ).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(sub)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddSubCategory
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={setReloadTrigger}
                editingSubCategory={editingSubCategory}
                setEditingSubCategory={setEditingSubCategory}
                handleUpdate={handleUpdate}
                allCategories={allCategories}
            />
        </AdminWrapper>
    );
};

export default SubCategory;

// import AddSubCategory from "@/AddNavFormComponents/AddSubCategory";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const SubCategory = () => {
//     const [allSubCategory, setAllSubCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingSubCategory, setEditingSubCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the subcategory data
//     useEffect(() => {
//         const fetchSubCategory = async () => {
//             try {
//                 const response = await axios.get(route("subcategories.index"));
//                 setAllSubCategory(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchSubCategory();
//     }, [reloadTrigger]);

//     // For delete the subcategory
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("subcategories.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (subCategory) => {
//         setEditingSubCategory(subCategory);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("subcategories.update", { id }),
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
//             console.log("Error updating subcategory", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             SubCategory Management
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

//                 <AddSubCategory
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingSubCategory={editingSubCategory}
//                     setEditingSubCategory={setEditingSubCategory}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//         </>
//     );
// };

// export default SubCategory;
