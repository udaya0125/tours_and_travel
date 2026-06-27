import AddSubCategory from "@/AddNavFormComponents/AddSubCategory";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditSubCategory from "@/EditNavFormComponents/EditSubCategory";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import PageLoader from "../PageLoader/PageLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const SubCategory = () => {
    const queryClient = useQueryClient();
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: allSubCategory = [], isLoading: loadingSubCats } = useQuery({
        queryKey: ["subcategories"],
        queryFn: async () => {
            const res = await axios.get(route("oursubcategories.index"));
            return res.data.sub_categories;
        },
    });

    const { data: allCategories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axios.get(route("ourcategories.index"));
            return res.data.categories;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) =>
            axios.delete(route("oursubcategories.destroy", { id })),
        onMutate: (id) => setDeletingId(id),
        onSettled: () => {
            setDeletingId(null);
            queryClient.invalidateQueries({ queryKey: ["subcategories"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ formData, id }) => {
            formData.append("_method", "PUT");
            return axios.post(
                route("oursubcategories.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subcategories"] });
        },
    });

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this subcategory?"))
            return;
        deleteMutation.mutate(id);
    };

    const handleEdit = (subCategory) => {
        setEditingSubCategory(subCategory);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        return updateMutation.mutateAsync({ formData, id });
    };

    const columns = [
        {
            Header: "S.N.",
            accessor: "index",
            Cell: ({ row }) => (
                <span className="text-gray-400">{row.index + 1}</span>
            ),
        },
        {
            Header: "SubCategory",
            accessor: "name",
            Cell: ({ value }) => (
                <span className="font-medium text-gray-800">{value}</span>
            ),
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
                    {new Date(row.original.created_at).toLocaleTimeString(
                        "en-US",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        },
                    )}
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

    const tableData = allSubCategory.filter((sub) => {
        const query = searchQuery.toLowerCase();
        return (
            sub.name.toLowerCase().includes(query) ||
            (sub.category?.name ?? "").toLowerCase().includes(query)
        );
    });

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        SubCategory Management
                    </h1>
                </div>
                <button
                    onClick={() => setShowForm(true)}
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
                    placeholder="Search subcategories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                />
            </div>

            {loadingSubCats ? (
                <PageLoader />
            ) : (
                <MyTable columns={columns} data={tableData} />
            )}

            <AddSubCategory
                showForm={showForm}
                setShowForm={setShowForm}
                allCategories={allCategories}
            />

            <EditSubCategory
                showForm={showForm}
                setShowForm={setShowForm}
                editingSubCategory={editingSubCategory}
                setEditingSubCategory={setEditingSubCategory}
                handleUpdate={handleUpdate}
                allCategories={allCategories}
            />
        </AdminWrapper>
    );
};

export default SubCategory;
