// import AddCategoryForm from "@/AddNavFormComponents/AddCategoryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import EditCategoryForm from "@/EditNavFormComponents/EditCategoryForm";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Plus, Search } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { BiSolidEdit, BiTrash } from "react-icons/bi";
// import PageLoader from "../PageLoader/PageLoader";

// const Category = () => {
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchCategory = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.categories);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setIsLoading(false); // ← this MUST be in finally, not try
//             }
//         };
//         fetchCategory();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this category?")) return;
//         try {
//             await axios.delete(route("ourcategories.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setShowEditForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcategories.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } },
//             );
//             // setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating category", error);
//             throw error;
//         }
//     };

//     // Prepare data for MyTable
//     const tableData = allCategory
//         .filter((category) =>
//             category.name.toLowerCase().includes(searchQuery.toLowerCase()),
//         )
//         .map((category, index) => ({
//             id: category.id,
//             serialNumber: index + 1,
//             name: category.name,
//             createdDate: new Date(category.created_at).toLocaleDateString(
//                 "en-US",
//                 {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                 },
//             ),
//             createdTime: new Date(category.created_at).toLocaleTimeString(
//                 "en-US",
//                 {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                     hour12: true,
//                 },
//             ),
//             original: category,
//         }));

//     // Define columns for MyTable
//     const columns = [
//         {
//             Header: "S.N.",
//             accessor: "index",
//             Cell: ({ row }) => (
//                 <span className="text-gray-400">{row.index + 1}</span>
//             ),
//         },
//         {
//             Header: "Name",
//             accessor: "name",
//             Cell: ({ value }) => (
//                 <span className="font-medium text-gray-800">{value}</span>
//             ),
//         },
//         {
//             Header: "Created Date",
//             accessor: "createdDate",
//             Cell: ({ value }) => <span className="text-gray-400">{value}</span>,
//         },
//         {
//             Header: "Created Time",
//             accessor: "createdTime",
//             Cell: ({ value }) => <span className="text-gray-400">{value}</span>,
//         },
//         {
//             Header: "Actions",
//             accessor: "id",
//             Cell: ({ row }) => (
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => handleEdit(row.original.original)}
//                         className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                         title="Edit"
//                     >
//                         <BiSolidEdit size={16} />
//                     </button>
//                     <button
//                         onClick={() => handleDelete(row.original.original.id)}
//                         className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-40"
//                         title="Delete"
//                     >
//                         <BiTrash size={16} />
//                     </button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <AdminWrapper>
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     Category Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setShowAddForm(true);
//                         setEditingCategory(null);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Search Bar */}
//             <div className="mb-5 relative w-full max-w-sm">
//                 <Search
//                     size={16}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                 />
//                 <input
//                     type="text"
//                     placeholder="Search categories..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
//                 />
//             </div>

//             {/* MyTable Component */}
//             {isLoading ? (
//                 <PageLoader />
//             ) : (
//                 <MyTable columns={columns} data={tableData} />
//             )}
//             {/* <MyTable columns={columns} data={tableData} /> */}

//             {/* Add Category Form */}
//             <AddCategoryForm
//                 showForm={showAddForm}
//                 setShowForm={setShowAddForm}
//                 setReloadTrigger={setReloadTrigger}
//             />

//             {/* Edit Category Form */}
//             <EditCategoryForm
//                 showForm={showEditForm}
//                 setShowForm={setShowEditForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingCategory={editingCategory}
//                 setEditingCategory={setEditingCategory}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default Category;

import AddCategoryForm from "@/AddNavFormComponents/AddCategoryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditCategoryForm from "@/EditNavFormComponents/EditCategoryForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import PageLoader from "../PageLoader/PageLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Category = () => {
    const queryClient = useQueryClient();
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: allCategory = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await axios.get(route("ourcategories.index"));
            return response.data.categories;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(route("ourcategories.destroy", { id })),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
        onError: (error) => console.error(error),
    });

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        deleteMutation.mutate(id);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowEditForm(true);
    };

    const tableData = allCategory
        .filter((category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .map((category, index) => ({
            id: category.id,
            serialNumber: index + 1,
            name: category.name,
            createdDate: new Date(category.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }),
            createdTime: new Date(category.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }),
            original: category,
        }));

    const columns = [
        {
            Header: "S.N.",
            accessor: "index",
            Cell: ({ row }) => <span className="text-gray-400">{row.index + 1}</span>,
        },
        {
            Header: "Name",
            accessor: "name",
            Cell: ({ value }) => <span className="font-medium text-gray-800">{value}</span>,
        },
        {
            Header: "Created Date",
            accessor: "createdDate",
            Cell: ({ value }) => <span className="text-gray-400">{value}</span>,
        },
        {
            Header: "Created Time",
            accessor: "createdTime",
            Cell: ({ value }) => <span className="text-gray-400">{value}</span>,
        },
        {
            Header: "Actions",
            accessor: "id",
            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row.original.original)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit"
                    >
                        <BiSolidEdit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.original.id)}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-40"
                        title="Delete"
                    >
                        <BiTrash size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    Category Management
                </h1>
                <button
                    onClick={() => {
                        setShowAddForm(true);
                        setEditingCategory(null);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            <div className="mb-5 relative w-full max-w-sm">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                />
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <MyTable columns={columns} data={tableData} />
            )}

            <AddCategoryForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
            />

            <EditCategoryForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
            />
        </AdminWrapper>
    );
};

export default Category;


// import AddCategoryForm from "@/AddNavFormComponents/AddCategoryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import EditCategoryForm from "@/EditNavFormComponents/EditCategoryForm";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Plus, Search } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { BiSolidEdit, BiTrash } from "react-icons/bi";
// import PageLoader from "../PageLoader/PageLoader";
// import DeleteConfirmDialog from "@/DeleteConfirmDialog/DeleteConfirmDialog";

// const Category = () => {
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//     const [showForm, setShowForm] = useState(false); // For DeleteConfirmDialog to disable background scroll

//     // Delete dialog state
//     const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

//     useEffect(() => {
//         const fetchCategory = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.categories);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchCategory();
//     }, [reloadTrigger]);

//     // Opens the dialog instead of browser confirm()
//     const handleDeleteClick = (id) => {
//         setDeleteDialog({ open: true, id });
//     };

//     // Called when user confirms deletion
//     const handleDeleteConfirm = async () => {
//         const id = deleteDialog.id;
//         setDeleteDialog({ open: false, id: null });
//         try {
//             await axios.delete(route("ourcategories.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleDeleteCancel = () => {
//         setDeleteDialog({ open: false, id: null });
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setShowEditForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcategories.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating category", error);
//             throw error;
//         }
//     };

//     // Prepare data for MyTable
//     const tableData = allCategory
//         .filter((category) =>
//             category.name.toLowerCase().includes(searchQuery.toLowerCase()),
//         )
//         .map((category, index) => ({
//             id: category.id,
//             serialNumber: index + 1,
//             name: category.name,
//             createdDate: new Date(category.created_at).toLocaleDateString(
//                 "en-US",
//                 {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                 },
//             ),
//             createdTime: new Date(category.created_at).toLocaleTimeString(
//                 "en-US",
//                 {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                     hour12: true,
//                 },
//             ),
//             original: category,
//         }));

//     // Define columns for MyTable
//     const columns = [
//         {
//             Header: "S.N.",
//             accessor: "index",
//             Cell: ({ row }) => (
//                 <span className="text-gray-400">{row.index + 1}</span>
//             ),
//         },
//         {
//             Header: "Name",
//             accessor: "name",
//             Cell: ({ value }) => (
//                 <span className="font-medium text-gray-800">{value}</span>
//             ),
//         },
//         {
//             Header: "Created Date",
//             accessor: "createdDate",
//             Cell: ({ value }) => <span className="text-gray-400">{value}</span>,
//         },
//         {
//             Header: "Created Time",
//             accessor: "createdTime",
//             Cell: ({ value }) => <span className="text-gray-400">{value}</span>,
//         },
//         {
//             Header: "Actions",
//             accessor: "id",
//             Cell: ({ row }) => (
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => handleEdit(row.original.original)}
//                         className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                         title="Edit"
//                     >
//                         <BiSolidEdit size={16} />
//                     </button>
//                     <button
//                         onClick={() => handleDeleteClick(row.original.original.id)}
//                         className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-40"
//                         title="Delete"
//                     >
//                         <BiTrash size={16} />
//                     </button>
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <AdminWrapper>
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     Category Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setShowAddForm(true);
//                         setEditingCategory(null);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Search Bar */}
//             <div className="mb-5 relative w-full max-w-sm">
//                 <Search
//                     size={16}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                 />
//                 <input
//                     type="text"
//                     placeholder="Search categories..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
//                 />
//             </div>

//             {/* MyTable Component */}
//             {isLoading ? (
//                 <PageLoader />
//             ) : (
//                 <MyTable columns={columns} data={tableData} />
//             )}

//             {/* Add Category Form */}
//             <AddCategoryForm
//                 showForm={showAddForm}
//                 setShowForm={setShowAddForm}
//                 setReloadTrigger={setReloadTrigger}
//             />

//             {/* Edit Category Form */}
//             <EditCategoryForm
//                 showForm={showEditForm}
//                 setShowForm={setShowEditForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingCategory={editingCategory}
//                 setEditingCategory={setEditingCategory}
//                 handleUpdate={handleUpdate}
//             />

//             {/* Delete Confirm Dialog */}
//             <DeleteConfirmDialog
//                 isOpen={deleteDialog.open}
//                 showForm= {showForm} 
//                 onClose={handleDeleteCancel}
//                 onConfirm={handleDeleteConfirm}
//                 title="Are you sure you want to delete this category?"
//             />
//         </AdminWrapper>
//     );
// };

// export default Category;