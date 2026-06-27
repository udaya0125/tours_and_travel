import AddFAQForm from "@/AddNavFormComponents/AddFAQForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditFAQForm from "@/EditNavFormComponents/EditFAQForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import PageLoader from "../PageLoader/PageLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchFaqs = () =>
    axios.get(route("ourfaqs.index")).then((r) => r.data.data ?? []);

const fetchCategories = () =>
    axios.get(route("ourcategories.index")).then((r) => {
        const raw = r.data.categories ?? r.data.data ?? r.data ?? [];
        return Array.isArray(raw) ? raw : Object.values(raw);
    });

const fetchPackages = () =>
    axios.get(route("ourpackages.index")).then((r) => {
        const raw = r.data.packages ?? r.data.data ?? r.data ?? [];
        return Array.isArray(raw) ? raw : Object.values(raw);
    });

const FAQ = () => {
    const queryClient = useQueryClient();

    const [editingFaq, setEditingFaq] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: allFaqs = [], isLoading } = useQuery({
        queryKey: ["faqs"],
        queryFn: fetchFaqs,
    });

    const { data: allCategories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const { data: allPackages = [] } = useQuery({
        queryKey: ["packages"],
        queryFn: fetchPackages,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(route("ourfaqs.destroy", { id })),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
    });

    const handleDelete = (id) => {
        if (!confirm("Delete this FAQ?")) return;
        deleteMutation.mutate(id);
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const res = await axios.post(
            route("ourfaqs.update", { id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        return res.data;
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
            Header: "Question",
            accessor: "question",
            Cell: ({ value }) => (
                <div className="max-w-xs">
                    <span className="text-gray-800 line-clamp-2">{value}</span>
                </div>
            ),
        },
        {
            Header: "Category",
            accessor: "category",
            Cell: ({ row }) => (
                <span className="text-gray-600">
                    {row.original.category?.name ?? (
                        <span className="text-gray-300">—</span>
                    )}
                </span>
            ),
        },
        {
            Header: "Package",
            accessor: "package",
            Cell: ({ row }) => (
                <span className="text-gray-600">
                    {row.original.package?.title ?? (
                        <span className="text-gray-300">—</span>
                    )}
                </span>
            ),
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (
                <span className="text-gray-400">
                    {value
                        ? new Date(value).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                          })
                        : "—"}
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
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Edit"
                    >
                        <BiSolidEdit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-40"
                        title="Delete"
                    >
                        <BiTrash size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const tableData = allFaqs.filter((faq) => {
        const query = searchQuery.toLowerCase();
        return (
            faq.question?.toLowerCase().includes(query) ||
            (faq.category?.name ?? "").toLowerCase().includes(query) ||
            (faq.package?.title ?? "").toLowerCase().includes(query)
        );
    });

    return (
        <AdminWrapper>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        FAQ Management
                    </h1>
                </div>
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

            {/* Search Bar */}
            <div className="mb-5 relative w-full max-w-sm">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                    type="text"
                    placeholder="Search FAQs..."
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

            <AddFAQForm
                showForm={showForm}
                setShowForm={setShowForm}
                allCategories={allCategories}
                allPackages={allPackages}
            />

            <EditFAQForm
                showForm={showForm}
                setShowForm={setShowForm}
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
