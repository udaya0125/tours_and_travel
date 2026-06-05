import AddCountryForm from "@/AddNavFormComponents/AddCountryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const Country = () => {
    const [allCountry, setAllCountry] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCountry, setEditingCountry] = useState(null);
    const [showForm, setShowForm] = useState(false);
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
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourcountries.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating country", error);
            throw error;
        }
    };

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
                    onClick={() => {
                        setEditingCountry(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-6 py-4 font-semibold text-gray-600 w-12">
                                #
                            </th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                Country Name
                            </th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                Created At
                            </th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">
                                Created Time
                            </th>
                            <th className="text-right px-6 py-4 font-semibold text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCountry.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center py-16 text-gray-400"
                                >
                                    No countries found. Click{" "}
                                    <strong>Create</strong> to add one.
                                </td>
                            </tr>
                        ) : (
                            allCountry.map((country, index) => (
                                <tr
                                    key={country.id}
                                    className="border-b border-gray-50 hover:bg-indigo-50/40 transition-colors"
                                >
                                    <td className="px-6 py-4 text-gray-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {country.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(
                                            country.created_at,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(
                                            country.created_at,
                                        ).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(country)
                                                }
                                                className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(country.id)
                                                }
                                                disabled={
                                                    deletingId === country.id
                                                }
                                                className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-40"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddCountryForm
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={setReloadTrigger}
                editingCountry={editingCountry}
                setEditingCountry={setEditingCountry}
                handleUpdate={handleUpdate}
            />
        </AdminWrapper>
    );
};

export default Country;

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
