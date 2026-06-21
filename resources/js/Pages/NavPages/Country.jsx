import AddCountryForm from "@/AddNavFormComponents/AddCountryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditCountryForm from "@/EditNavFormComponents/EditCountryForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import PageLoader from "../PageLoader/PageLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Country = () => {
    const queryClient = useQueryClient();
    const [editingCountry, setEditingCountry] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: allCountry = [], isLoading } = useQuery({
        queryKey: ["countries"],
        queryFn: async () => {
            const res = await axios.get(route("ourcountries.index"));
            return res.data.countries ?? res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(route("ourcountries.destroy", { id })),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["countries"] }),
    });

    const handleDelete = (id) => {
        if (!confirm("Are you sure you want to delete this country?")) return;
        deleteMutation.mutate(id);
    };

    const handleEdit = (country) => {
        setEditingCountry(country);
        setShowForm(true);
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
            Header: "Country Name",
            accessor: "name",
            Cell: ({ value }) => (
                <span className="font-medium text-gray-800">{value}</span>
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
                        disabled={deleteMutation.isPending && deleteMutation.variables === row.original.id}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-40"
                        title="Delete"
                    >
                        <BiTrash size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const tableData = allCountry
        .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((c, index) => ({ ...c, index }));

    return (
        <AdminWrapper>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                        Country Management
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
                    placeholder="Search countries..."
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

            <AddCountryForm
                showForm={showForm}
                setShowForm={setShowForm}
            />

            <EditCountryForm
                showForm={showForm}
                setShowForm={setShowForm}
                editingCountry={editingCountry}
                setEditingCountry={setEditingCountry}
            />
        </AdminWrapper>
    );
};

export default Country;
