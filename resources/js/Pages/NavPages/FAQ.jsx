import AddFAQForm from "@/AddNavFormComponents/AddFAQForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditFAQForm from "@/EditNavFormComponents/EditFAQForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import { MdAdd } from "react-icons/md";

const FAQ = () => {
    const [allFaqs, setAllFaqs] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [allPackages, setAllPackages] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await axios.get(route("ourfaqs.index"));
                setAllFaqs(res.data.data ?? []);
            } catch (err) {
                console.error("FAQ fetch error", err);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await axios.get(route("ourcategories.index"));
                const raw = res.data.categories ?? res.data.data ?? res.data ?? [];
                setAllCategories(Array.isArray(raw) ? raw : Object.values(raw));
            } catch (err) {
                console.error("Category fetch error", err);
            }
        };

        const fetchPackages = async () => {
            try {
                const res = await axios.get(route("ourpackages.index"));
                const raw = res.data.packages ?? res.data.data ?? res.data ?? [];
                setAllPackages(Array.isArray(raw) ? raw : Object.values(raw));
            } catch (err) {
                console.error("Package fetch error", err);
            }
        };

        fetchCategories();
        fetchPackages();
        fetchFaqs();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this FAQ?")) return;
        setDeletingId(id);
        try {
            await axios.delete(route("ourfaqs.destroy", { id }));
            setReloadTrigger((prev) => !prev);
        } catch (err) {
            console.error("Delete error", err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setShowEditForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const res = await axios.post(
                route("ourfaqs.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            return res.data;
        } catch (err) {
            console.error("Update error", err);
            throw err;
        }
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
            ),
        },
    ];

    // Filter by question, category name, or package title
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
                    {/* <p className="text-sm text-gray-500 mt-1">
                        {allFaqs.length}{" "}
                        {allFaqs.length === 1 ? "FAQ" : "FAQs"} registered
                    </p> */}
                </div>
                <button
                    onClick={() => {
                        setEditingFaq(null);
                        setShowAddForm(true);
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

            {/* MyTable Component */}
            <MyTable columns={columns} data={tableData} />

            {/* Add FAQ Form */}
            <AddFAQForm
                showForm={showAddForm}
                setShowForm={setShowAddForm}
                setReloadTrigger={setReloadTrigger}
                allCategories={allCategories}
                allPackages={allPackages}
            />

            {/* Edit FAQ Form */}
            <EditFAQForm
                showForm={showEditForm}
                setShowForm={setShowEditForm}
                setReloadTrigger={setReloadTrigger}
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
