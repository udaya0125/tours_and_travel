import AddCountryForm from "@/AddNavFormComponents/AddCountryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Country = () => {
    const [allCountry, setAllCountry] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingCountry, setEditingCountry] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the country data
    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await axios.get(route("ourcountries.index"));
                setAllCountry(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchCountry();
    }, [reloadTrigger]);

    // For delete the country
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("ourcountries.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (country) => {
        setEditingCountry(country);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourcountries.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating country", error);
            throw error;
        }
    };
    return (
        <>
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

                <AddCountryForm
                    showForm={showForm}
                    setShowForm={setShowForm}
                    setReloadTrigger={setReloadTrigger}
                    editingCountry={editingCountry}
                    setEditingCountry={setEditingCountry}
                    handleUpdate={handleUpdate}
                />
            </AdminWrapper>
        </>
    );
};

export default Country;
