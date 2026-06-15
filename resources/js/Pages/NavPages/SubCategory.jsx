import AddSubCategory from "@/AddNavFormComponents/AddSubCategory";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditSubCategory from "@/EditNavFormComponents/EditSubCategory";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";

const SubCategory = () => {
    const [allSubCategory, setAllSubCategory] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSubCategory = async () => {
            try {
                const response = await axios.get(route("oursubcategories.index"));
                setAllSubCategory(response.data.sub_categories);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(route("ourcategories.index"));
                setAllCategories(response.data.categories);
            } catch (error) {
                console.error("fetching categories error", error);
            }
        };

        fetchSubCategory();
        fetchCategories();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this subcategory?")) return;
        setDeletingId(id);
        try {
            await axios.delete(route("oursubcategories.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (subCategory) => {
        setEditingSubCategory(subCategory);
        setShowEditForm(true);
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

    // Define columns for MyTable
    const columns = [
        {
            Header: "S.N.",
            accessor: "index",
            Cell: ({ row }) => <span className="text-gray-400">{row.index + 1}</span>,
        },
        {
            Header: "SubCategory",
            accessor: "name",
            Cell: ({ value }) => <span className="font-medium text-gray-800">{value}</span>,
        },
        {
            Header: "Category",
            accessor: "category",
            Cell: ({ row }) => (
                <span className="text-gray-500">
                    {row.original.category?.name ?? "—"}
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
            Header: "Actions",
            accessor: "actions",
            Cell: ({ row }) => (
                <div className="flex items-center  gap-2">
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

    // Filter by subcategory name or parent category name
    const tableData = allSubCategory.filter((sub) => {
        const query = searchQuery.toLowerCase();
        return (
            sub.name.toLowerCase().includes(query) ||
            (sub.category?.name ?? "").toLowerCase().includes(query)
        );
    });

    return (
        <AdminWrapper>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        SubCategory Management
                    </h1>
                    {/* <p className="text-sm text-gray-500 mt-1">
                        {allSubCategory.length}{" "}
                        {allSubCategory.length === 1 ? "subcategory" : "subcategories"}{" "}
                        registered
                    </p> */}
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
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
                    placeholder="Search subcategories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                />
            </div>

            {/* MyTable Component */}
            <MyTable columns={columns} data={tableData} />

            <AddSubCategory
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
                allCategories={allCategories}
            />

            <EditSubCategory
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                editingSubCategory={editingSubCategory}
                setEditingSubCategory={setEditingSubCategory}
                handleUpdate={handleUpdate}
                allCategories={allCategories}
            />
        </AdminWrapper>
    );
};

export default SubCategory;