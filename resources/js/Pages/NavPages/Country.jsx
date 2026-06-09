import AddCountryForm from "@/AddNavFormComponents/AddCountryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditCountryForm from "@/EditNavFormComponents/EditCountryForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Edit, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";

const Country = () => {
    const [allCountry, setAllCountry] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCountry, setEditingCountry] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await axios.get(route("ourcountries.index"));
                setAllCountry(response.data.countries ?? response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchCountry();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this country?")) return;
        setDeletingId(id);
        try {
            await axios.delete(route("ourcountries.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (country) => {
        setEditingCountry(country);
        setShowEditForm(true);
    };

    // Define columns for MyTable
    const columns = [
        {
            Header: "S.N.",
            accessor: "index",
            Cell: ({ row }) => <span className="text-gray-400">{row.index + 1}</span>
        },
        {
            Header: "Country Name",
            accessor: "name",
            Cell: ({ value }) => <span className="font-medium text-gray-800">{value}</span>
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
            )
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
            )
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
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
            )
        }
    ];

    // Prepare data with index
    const tableData = allCountry.map((country, index) => ({
        ...country,
        index: index
    }));

    return (
        <AdminWrapper>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Country Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {allCountry.length}{" "}
                        {allCountry.length === 1 ? "country" : "countries"}{" "}
                        registered
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* MyTable Component */}
            <MyTable 
                columns={columns} 
                data={tableData} 
            />

            <AddCountryForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
            />

            <EditCountryForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                setReloadTrigger={setReloadTrigger}
                editingCountry={editingCountry}
                setEditingCountry={setEditingCountry}
            />
        </AdminWrapper>
    );
};

export default Country;

// import AddCountryForm from "@/AddNavFormComponents/AddCountryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Country = () => {
//     const [allCountry, setAllCountry] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCountry, setEditingCountry] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [deletingId, setDeletingId] = useState(null);

//     useEffect(() => {
//         const fetchCountry = async () => {
//             try {
//                 const response = await axios.get(route("ourcountries.index"));
//                 setAllCountry(response.data.countries ?? response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchCountry();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this country?")) return;
//         setDeletingId(id);
//         try {
//             await axios.delete(route("ourcountries.destroy", { id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     const handleEdit = (country) => {
//         setEditingCountry(country);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcountries.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating country", error);
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
//             Header: "Country Name",
//             accessor: "name",
//             Cell: ({ value }) => <span className="font-medium text-gray-800">{value}</span>
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
//             )
//         },
//         {
//             Header: "Created Time",
//             accessor: "created_at_time",
//             Cell: ({ row }) => (
//                 <span className="text-gray-400">
//                     {new Date(row.original.created_at).toLocaleTimeString("en-US", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         second: "2-digit",
//                         hour12: true,
//                     })}
//                 </span>
//             )
//         },
//         {
//             Header: "Actions",
//             accessor: "actions",
//             Cell: ({ row }) => (
//                 <div className="flex items-center  gap-2">
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

//     // Prepare data with index
//     const tableData = allCountry.map((country, index) => ({
//         ...country,
//         index: index
//     }));

//     return (
//         <AdminWrapper>
//             {/* Header */}
//             <div className="mb-8 flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                         Country Management
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         {allCountry.length}{" "}
//                         {allCountry.length === 1 ? "country" : "countries"}{" "}
//                         registered
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => {
//                         setEditingCountry(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* MyTable Component */}
//             <MyTable 
//                 columns={columns} 
//                 data={tableData} 
//             />

//             <AddCountryForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingCountry={editingCountry}
//                 setEditingCountry={setEditingCountry}
//                 handleUpdate={handleUpdate}
//             />
//         </AdminWrapper>
//     );
// };

// export default Country;

// import AddCountryForm from "@/AddNavFormComponents/AddCountryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Country = () => {
//     const [allCountry, setAllCountry] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingCountry, setEditingCountry] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the country data
//     useEffect(() => {
//         const fetchCountry = async () => {
//             try {
//                 const response = await axios.get(route("ourcountries.index"));
//                 setAllCountry(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchCountry();
//     }, [reloadTrigger]);

//     // For delete the country
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourcountries.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (country) => {
//         setEditingCountry(country);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourcountries.update", { id }),
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
//             console.log("Error updating country", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
//                 <div className="mb-8 flex justify-between items-center">
//                     <div>
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                             Country Management
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

//                 <AddCountryForm
//                     showForm={showForm}
//                     setShowForm={setShowForm}
//                     setReloadTrigger={setReloadTrigger}
//                     editingCountry={editingCountry}
//                     setEditingCountry={setEditingCountry}
//                     handleUpdate={handleUpdate}
//                 />
//             </AdminWrapper>
//         </>
//     );
// };

// export default Country;
