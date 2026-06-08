import AddCategoryForm from "@/AddNavFormComponents/AddCategoryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditCategoryForm from "@/EditNavFormComponents/EditCategoryForm";
import MyTable from "@/MyTable.jsx/MyTable";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const Category = () => {
    const [allCategory, setAllCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategory(response.data.categories);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchCategory();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await axios.delete(route("ourcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourcategories.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating category", error);
            throw error;
        }
    };

    // Prepare data for MyTable
    const tableData = allCategory.map((category, index) => ({
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

    // Define columns for MyTable
    const columns = [
        {
            Header: "S.N.",
            accessor: "serialNumber",
            Cell: ({ value }) => <span className="text-gray-500">{value}</span>,
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
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.original.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                    >
                        <Trash2 size={16} />
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

            {/* MyTable Component */}
            <MyTable columns={columns} data={tableData} />

            {/* Add Category Form */}
            <AddCategoryForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
            />

            {/* Edit Category Form */}
            <EditCategoryForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                setReloadTrigger={setReloadTrigger}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
                handleUpdate={handleUpdate}
            />
        </AdminWrapper>
    );
};

export default Category;


// import AddCategoryForm from "@/AddNavFormComponents/AddCategoryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/MyTable.jsx/MyTable";
// import axios from "axios";
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Category = () => {
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.categories);
//             } catch (error) {
//                 console.error("fetching error ", error);
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
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcategories.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating category", error);
//             throw error;
//         }
//     };

//     // Prepare data for MyTable
//     const tableData = allCategory.map((category, index) => ({
//         id: category.id,
//         serialNumber: index + 1,
//         name: category.name,
//         createdDate: new Date(category.created_at).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         }),
//         createdTime: new Date(category.created_at).toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: true,
//         }),
//         original: category,
//     }));

//     // Define columns for MyTable
//     const columns = [
//         {
//             Header: "S.N.",
//             accessor: "serialNumber",
//             Cell: ({ value }) => <span className="text-gray-500">{value}</span>,
//         },
//         {
//             Header: "Name",
//             accessor: "name",
//             Cell: ({ value }) => <span className="font-medium text-gray-800">{value}</span>,
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
//                 <div className="flex  gap-2">
//                     <button
//                         onClick={() => handleEdit(row.original.original)}
//                         className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
//                         title="Edit"
//                     >
//                         <Pencil size={16} />
//                     </button>
//                     <button
//                         onClick={() => handleDelete(row.original.original.id)}
//                         className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                         title="Delete"
//                     >
//                         <Trash2 size={16} />
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
//                         setShowForm(true);
//                         setEditingCategory(null);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* MyTable Component */}
//             <MyTable columns={columns} data={tableData} />

//             <AddCategoryForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingCategory={editingCategory}
//                 setEditingCategory={setEditingCategory}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default Category;


// import AddCategoryForm from "@/AddNavFormComponents/AddCategoryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Category = () => {
//     const [allCategory, setAllCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the category data
//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchCategory();
//     }, [reloadTrigger]);

//     // For delete the category
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourcategories.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (category) => {
//         setEditingCategory(category);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcategories.update", { id }),
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
//             console.log("Error updating category", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             Category Management
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

//                 <AddCategoryForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingCategory={editingCategory}
//                     setEditingCategory={setEditingCategory}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//         </>
//     );
// };

// export default Category;
