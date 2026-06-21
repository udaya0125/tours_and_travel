import AddPackageForm from "@/AddNavFormComponents/AddPackageForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditPackageForm from "@/EditNavFormComponents/EditPackageForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import PageLoader from "../PageLoader/PageLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Fetchers ────────────────────────────────────────────────────────────────

const fetchPackages = () =>
    axios.get(route("ourpackages.index")).then((r) => r.data);
const fetchCountries = () =>
    axios
        .get(route("ourcountries.index"))
        .then((r) => r.data.countries ?? r.data);
const fetchCategories = () =>
    axios
        .get(route("ourcategories.index"))
        .then((r) => r.data.categories ?? r.data);
const fetchSubCategories = () =>
    axios
        .get(route("oursubcategories.index"))
        .then((r) => r.data.sub_categories ?? r.data);

// ─── Component ───────────────────────────────────────────────────────────────

const Package = () => {
    const queryClient = useQueryClient();

    const [editingPackage, setEditingPackage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // ── Queries ──────────────────────────────────────────────────────────────

    const { data: allPackages = [], isLoading } = useQuery({
        queryKey: ["packages"],
        queryFn: fetchPackages,
    });

    const { data: allCountry = [] } = useQuery({
        queryKey: ["countries"],
        queryFn: fetchCountries,
        staleTime: Infinity, // reference data — rarely changes
    });

    const { data: allCategory = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: Infinity,
    });

    const { data: allSubCategory = [] } = useQuery({
        queryKey: ["subCategories"],
        queryFn: fetchSubCategories,
        staleTime: Infinity,
    });

    // ── Mutations ────────────────────────────────────────────────────────────

    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(route("ourpackages.destroy", { id })),
        onMutate: (id) => setDeletingId(id),
        onSettled: () => {
            setDeletingId(null);
            queryClient.invalidateQueries({ queryKey: ["packages"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ formData, id }) => {
            formData.append("_method", "PUT");
            return axios.post(route("ourpackages.update", { id }), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["packages"] }),
    });

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this package?")) return;
        deleteMutation.mutate(id);
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setShowForm(true);
    };

    // handleUpdate is passed into EditPackageForm — keep the same signature
    // so neither form file needs touching.
    const handleUpdate = async (formData, id) => {
        const response = await updateMutation.mutateAsync({ formData, id });
        return response.data;
    };

    // AddPackageForm calls setReloadTrigger after a successful store.
    // We replace that with a plain cache invalidation.
    const invalidatePackages = () =>
        queryClient.invalidateQueries({ queryKey: ["packages"] });

    // ── Table ────────────────────────────────────────────────────────────────

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

    const tableData = allPackages.filter((pkg) => {
        const q = searchQuery.toLowerCase();
        return (
            pkg.title?.toLowerCase().includes(q) ||
            (pkg.country?.name ?? "").toLowerCase().includes(q) ||
            pkg.categories?.some((cat) => cat.name.toLowerCase().includes(q))
        );
    });

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <AdminWrapper>
            {/* Header */}
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

            {/* Search */}
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

            {/* Table */}
            {isLoading ? (
                <PageLoader />
            ) : (
                <MyTable columns={columns} data={tableData} />
            )}

            {/* Add Form */}
            <AddPackageForm
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={invalidatePackages} // ← swapped in
                allCountry={allCountry}
                allCategory={allCategory}
                allSubCategory={allSubCategory}
            />

            {/* Edit Form */}
            <EditPackageForm
                showForm={showForm}
                setShowForm={setShowForm}
                editingPackage={editingPackage}
                setEditingPackage={setEditingPackage}
                setReloadTrigger={invalidatePackages} // ← swapped in
                handleUpdate={handleUpdate}
                allCountry={allCountry}
                allCategory={allCategory}
                allSubCategory={allSubCategory}
            />
        </AdminWrapper>
    );
};

export default Package;
