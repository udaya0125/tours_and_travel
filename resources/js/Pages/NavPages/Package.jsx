import AddPackageForm from "@/AddNavFormComponents/AddPackageForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const Package = () => {
    const [allPackages, setAllPackages] = useState([]);
    const [allCountry, setAllCountry] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [showForm, setShowForm] = useState(false);

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
                const response = await axios.get(
                    route("oursubcategories.index")
                );
                setAllSubCategory(
                    response.data.sub_categories ?? response.data
                );
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
        try {
            await axios.delete(route("ourpackages.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourpackages.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating package", error);
            throw error;
        }
    };

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Package Management
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setEditingPackage(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Package Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Country</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Duration</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {allPackages.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                    No packages found.
                                </td>
                            </tr>
                        ) : (
                            allPackages.map((pkg, index) => (
                                <tr key={pkg.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{pkg.title}</td>
                                    <td className="px-4 py-3 text-gray-600">{pkg.country?.name ?? "—"}</td>
                                    <td className="px-4 py-3 text-gray-600">{pkg.category?.name ?? "—"}</td>
                                    <td className="px-4 py-3 text-gray-600">{pkg.duration ?? "—"}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {pkg.price ? `$${pkg.price}` : "—"}
                                    </td>
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(pkg)}
                                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
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

            <AddPackageForm
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={setReloadTrigger}
                editingPackage={editingPackage}
                setEditingPackage={setEditingPackage}
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
