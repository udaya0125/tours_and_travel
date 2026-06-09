// import AddPackageForm from "@/AddNavFormComponents/AddPackageForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Package = () => {
//     const [allPackages, setAllPackages] = useState([]);
//     const [allCountry, setAllCountry] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [allSubCategory, setAllSubCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingPackage, setEditingPackage] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [deletingId, setDeletingId] = useState(null);

//     useEffect(() => {
//         const fetchPackage = async () => {
//             try {
//                 const response = await axios.get(route("ourpackages.index"));
//                 setAllPackages(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         const fetchCountry = async () => {
//             try {
//                 const response = await axios.get(route("ourcountries.index"));
//                 setAllCountry(response.data.countries ?? response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.categories ?? response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         const fetchSubCategory = async () => {
//             try {
//                 const response = await axios.get(route("oursubcategories.index"));
//                 setAllSubCategory(response.data.sub_categories ?? response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchSubCategory();
//         fetchCategory();
//         fetchCountry();
//         fetchPackage();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this package?")) return;
//         setDeletingId(id);
//         try {
//             await axios.delete(route("ourpackages.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     const handleEdit = (pkg) => {
//         setEditingPackage(pkg);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourpackages.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating package", error);
//             throw error;
//         }
//     };

//     // Define columns for MyTable
//     const columns = [
//         {
//             Header: "#",
//             accessor: "index",
//             Cell: ({ row }) => <span className="text-gray-400">{row.index + 1}</span>
//         },
//         {
//             Header: "Package",
//             accessor: "title",
//             Cell: ({ row }) => (
//                 <div>
//                     <p className="font-medium text-gray-800">{row.original.title}</p>
//                     {row.original.difficulty && (
//                         <p className="text-xs text-gray-400 mt-0.5">
//                             {row.original.difficulty}
//                         </p>
//                     )}
//                 </div>
//             )
//         },
//         {
//             Header: "Country",
//             accessor: "country",
//             Cell: ({ row }) => (
//                 <span className="text-gray-600">
//                     {row.original.country?.name ?? "—"}
//                 </span>
//             )
//         },
//         {
//             Header: "Price",
//             accessor: "price",
//             Cell: ({ value }) => (
//                 <span className="text-gray-600 font-medium">
//                     {value != null ? `$${value}` : "—"}
//                 </span>
//             )
//         },
//         {
//             Header: "Duration",
//             accessor: "duration",
//             Cell: ({ value }) => (
//                 <span className="text-gray-600">
//                     {value ?? "—"}
//                 </span>
//             )
//         },
//         {
//             Header: "Categories",
//             accessor: "categories",
//             Cell: ({ row }) => (
//                 <div className="flex flex-wrap gap-1">
//                     {row.original.categories?.map((cat) => (
//                         <span
//                             key={cat.id}
//                             className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600"
//                         >
//                             {cat.name}
//                         </span>
//                     ))}
//                 </div>
//             )
//         },
//         {
//             Header: "Actions",
//             accessor: "actions",
//             Cell: ({ row }) => (
//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={() => handleEdit(row.original)}
//                         className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors"
//                         title="Edit"
//                     >
//                         <Pencil size={15} />
//                     </button>
//                     <button
//                         onClick={() => handleDelete(row.original.id)}
//                         disabled={deletingId === row.original.id}
//                         className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-40"
//                         title="Delete"
//                     >
//                         <Trash2 size={15} />
//                     </button>
//                 </div>
//             )
//         }
//     ];

//     return (
//         <AdminWrapper>
//             {/* Header */}
//             <div className="mb-8 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         Package Management
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         {allPackages.length}{" "}
//                         {allPackages.length === 1 ? "package" : "packages"}{" "}
//                         registered
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => {
//                         setEditingPackage(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* MyTable Component */}
//             <MyTable columns={columns} data={allPackages} />

//             <AddPackageForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingPackage={editingPackage}
//                 setEditingPackage={setEditingPackage}
//                 handleUpdate={handleUpdate}
//                 allCountry={allCountry}
//                 allCategory={allCategory}
//                 allSubCategory={allSubCategory}
//             />
//         </AdminWrapper>
//     );
// };

// export default Package;

// import AddPackageForm from "@/AddNavFormComponents/AddPackageForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import EditPackageForm from "@/EditNavFormComponents/EditPackageForm";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { BiSolidEdit, BiTrash } from "react-icons/bi";

// const Package = () => {
//     const [allPackages, setAllPackages] = useState([]);
//     const [allCountry, setAllCountry] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [allSubCategory, setAllSubCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingPackage, setEditingPackage] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [deletingId, setDeletingId] = useState(null);

//     useEffect(() => {
//         const fetchPackage = async () => {
//             try {
//                 const response = await axios.get(route("ourpackages.index"));
//                 setAllPackages(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         const fetchCountry = async () => {
//             try {
//                 const response = await axios.get(route("ourcountries.index"));
//                 setAllCountry(response.data.countries ?? response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.categories ?? response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         const fetchSubCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route("oursubcategories.index"),
//                 );
//                 setAllSubCategory(
//                     response.data.sub_categories ?? response.data,
//                 );
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchSubCategory();
//         fetchCategory();
//         fetchCountry();
//         fetchPackage();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this package?")) return;
//         setDeletingId(id);
//         try {
//             await axios.delete(route("ourpackages.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     const handleEdit = (pkg) => {
//         setEditingPackage(pkg);
//         setShowEditForm(true);
//     };

//     // const handleUpdate = async (formData, id) => {
//     //     try {
//     //         formData.append("_method", "PUT");
//     //         const response = await axios.post(
//     //             route("ourpackages.update", { id }),
//     //             formData,
//     //             { headers: { "Content-Type": "multipart/form-data" } }
//     //         );
//     //         setReloadTrigger((prev) => !prev);
//     //         return response.data;
//     //     } catch (error) {
//     //         console.error("Error updating package", error);
//     //         throw error;
//     //     }
//     // };

//     // Package.jsx
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourpackages.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } },
//             );
//             // ❌ Remove this line — EditPackageForm.handleSubmit already calls setReloadTrigger
//             // setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error updating package", error);
//             throw error;
//         }
//     };

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
//             Header: "Package",
//             accessor: "title",
//             Cell: ({ row }) => (
//                 <div>
//                     <p className="font-medium text-gray-800">
//                         {row.original.title}
//                     </p>
//                     {row.original.difficulty && (
//                         <p className="text-xs text-gray-400 mt-0.5">
//                             {row.original.difficulty}
//                         </p>
//                     )}
//                 </div>
//             ),
//         },
//         {
//             Header: "Country",
//             accessor: "country",
//             Cell: ({ row }) => (
//                 <span className="text-gray-600">
//                     {row.original.country?.name ?? "—"}
//                 </span>
//             ),
//         },
//         {
//             Header: "Categories",
//             accessor: "categories",
//             Cell: ({ row }) => (
//                 <div className="flex flex-wrap gap-1">
//                     {row.original.categories?.map((cat) => (
//                         <span
//                             key={cat.id}
//                             className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600"
//                         >
//                             {cat.name}
//                         </span>
//                     ))}
//                 </div>
//             ),
//         },
//         {
//             Header: "Created Time",
//             accessor: "created_at_time",
//             Cell: ({ row }) => (
//                 <span className="text-gray-400">
//                     {new Date(row.original.created_at).toLocaleTimeString(
//                         "en-US",
//                         {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             second: "2-digit",
//                             hour12: true,
//                         },
//                     )}
//                 </span>
//             ),
//         },
//         {
//             Header: "Created At",
//             accessor: "created_at",
//             Cell: ({ value }) => (
//                 <span className="text-gray-400">
//                     {new Date(value).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                     })}
//                 </span>
//             ),
//         },
//         {
//             Header: "Actions",
//             accessor: "actions",
//             Cell: ({ row }) => (
//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={() => handleEdit(row.original)}
//                         className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors"
//                         title="Edit"
//                     >
//                         <BiSolidEdit size={16} />
//                     </button>
//                     <button
//                         onClick={() => handleDelete(row.original.id)}
//                         disabled={deletingId === row.original.id}
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
//             {/* Header */}
//             <div className="mb-8 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         Package Management
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         {allPackages.length}{" "}
//                         {allPackages.length === 1 ? "package" : "packages"}{" "}
//                         registered
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => {
//                         setEditingPackage(null);
//                         setShowAddForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* MyTable Component */}
//             <MyTable columns={columns} data={allPackages} />

//             {/* Add Package Form */}
//             <AddPackageForm
//                 showForm={showAddForm}
//                 setShowForm={setShowAddForm}
//                 setReloadTrigger={setReloadTrigger}
//                 allCountry={allCountry}
//                 allCategory={allCategory}
//                 allSubCategory={allSubCategory}
//             />

//             {/* Edit Package Form */}
//             <EditPackageForm
//                 showForm={showEditForm}
//                 setShowForm={setShowEditForm}
//                 editingPackage={editingPackage}
//                 setEditingPackage={setEditingPackage}
//                 setReloadTrigger={setReloadTrigger}
//                 handleUpdate={handleUpdate}
//                 allCountry={allCountry}
//                 allCategory={allCategory}
//                 allSubCategory={allSubCategory}
//             />
//         </AdminWrapper>
//     );
// };

// export default Package;


import AddPackageForm from "@/AddNavFormComponents/AddPackageForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditPackageForm from "@/EditNavFormComponents/EditPackageForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";

const Package = () => {
    const [allPackages, setAllPackages] = useState([]);
    const [allCountry, setAllCountry] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await axios.get(route("ourpackages.index"));
                setAllPackages(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        const fetchCountry = async () => {
            try {
                const response = await axios.get(route("ourcountries.index"));
                setAllCountry(response.data.countries ?? response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        const fetchCategory = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategory(response.data.categories ?? response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        const fetchSubCategory = async () => {
            try {
                const response = await axios.get(route("oursubcategories.index"));
                setAllSubCategory(response.data.sub_categories ?? response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchSubCategory();
        fetchCategory();
        fetchCountry();
        fetchPackage();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this package?")) return;
        setDeletingId(id);
        try {
            await axios.delete(route("ourpackages.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourpackages.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            return response.data;
        } catch (error) {
            console.error("Error updating package", error);
            throw error;
        }
    };

    // Define columns for MyTable
    const columns = [
        {
            Header: "S.N.",
            accessor: "index",
            Cell: ({ row }) => (
                <span className="text-gray-400">{row.index + 1}</span>
            ),
        },
        {
            Header: "Package",
            accessor: "title",
            Cell: ({ row }) => (
                <div>
                    <p className="font-medium text-gray-800">
                        {row.original.title}
                    </p>
                    {row.original.difficulty && (
                        <p className="text-xs text-gray-400 mt-0.5">
                            {row.original.difficulty}
                        </p>
                    )}
                </div>
            ),
        },
        {
            Header: "Country",
            accessor: "country",
            Cell: ({ row }) => (
                <span className="text-gray-600">
                    {row.original.country?.name ?? "—"}
                </span>
            ),
        },
        {
            Header: "Categories",
            accessor: "categories",
            Cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.categories?.map((cat) => (
                        <span
                            key={cat.id}
                            className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600"
                        >
                            {cat.name}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            Header: "Created Time",
            accessor: "created_at_time",
            Cell: ({ row }) => (
                <span className="text-gray-400">
                    {new Date(row.original.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    })}
                </span>
            ),
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (
                <span className="text-gray-400">
                    {new Date(value).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            ),
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors"
                        title="Edit"
                    >
                        <BiSolidEdit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        disabled={deletingId === row.original.id}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-40"
                        title="Delete"
                    >
                        <BiTrash size={16} />
                    </button>
                </div>
            ),
        },
    ];

    // Filter by package title, country name, or category name
    const tableData = allPackages.filter((pkg) => {
        const query = searchQuery.toLowerCase();
        return (
            pkg.title?.toLowerCase().includes(query) ||
            (pkg.country?.name ?? "").toLowerCase().includes(query) ||
            pkg.categories?.some((cat) =>
                cat.name.toLowerCase().includes(query)
            )
        );
    });

    return (
        <AdminWrapper>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Package Management
                    </h1>
                    {/* <p className="text-sm text-gray-500 mt-1">
                        {allPackages.length}{" "}
                        {allPackages.length === 1 ? "package" : "packages"}{" "}
                        registered
                    </p> */}
                </div>
                <button
                    onClick={() => {
                        setEditingPackage(null);
                        setShowAddForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-5 relative w-full max-w-sm">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                />
            </div>

            {/* MyTable Component */}
            <MyTable columns={columns} data={tableData} />

            {/* Add Package Form */}
            <AddPackageForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
                allCountry={allCountry}
                allCategory={allCategory}
                allSubCategory={allSubCategory}
            />

            {/* Edit Package Form */}
            <EditPackageForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                editingPackage={editingPackage}
                setEditingPackage={setEditingPackage}
                setReloadTrigger={setReloadTrigger}
                handleUpdate={handleUpdate}
                allCountry={allCountry}
                allCategory={allCategory}
                allSubCategory={allSubCategory}
            />
        </AdminWrapper>
    );
};

export default Package;

// import AddPackageForm from "@/AddNavFormComponents/AddPackageForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Package = () => {
//     const [allPackages, setAllPackages] = useState([]);
//     const [allCountry, setAllCountry] = useState([]);
//     const [allCategory, setAllCategory] = useState([]);
//     const [allSubCategory, setAllSubCategory] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingPackage, setEditingPackage] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the package data
//     useEffect(() => {
//         const fetchPackage = async () => {
//             try {
//                 const response = await axios.get(route("ourpackages.index"));
//                 setAllPackages(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         const fetchCountry = async () => {
//             try {
//                 const response = await axios.get(route("ourcountries.index"));
//                 setAllCountry(response.data.countries ?? response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         const fetchCategory = async () => {
//             try {
//                 const response = await axios.get(route("ourcategories.index"));
//                 setAllCategory(response.data.categories);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         const fetchSubCategory = async () => {
//             try {
//                 const response = await axios.get(
//                     route("oursubcategories.index"),
//                 );
//                 setAllSubCategory(response.data.sub_categories);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchSubCategory();
//         fetchCategory();
//         fetchCountry();

//         fetchPackage();
//     }, [reloadTrigger]);

//     // For delete the package
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourpackages.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (packages) => {
//         setEditingPackage(packages);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourpackages.update", { id }),
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
//             console.log("Error updating package", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             Package Management
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

//                 <AddPackageForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingPackage={editingPackage}
//                     setEditingPackage={setEditingPackage}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//         </>
//     );
// };

// export default Package;
