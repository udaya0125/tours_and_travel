import axios from "axios";
import React from "react";

const AddCountryForm = ({ showForm, setShowForm, editingCountry, setEditingCountry, handleUpdate }) => {
    const [submitting, setSubmitting] = useState(false);
    const [CountryForm, setCountryForm] = useState({
        name: "",
    });
    //  Use Effect
    useEffect(() => {
        if (editingCountry) {
            setCountryForm({
                ...editingCountry,
                image: null,
            });
            setShowForm(true);
        } else {
            setCountryForm({
                name: "",
            });
        }
    }, [editingCountry]);

    // Handle Create Country
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourcountries.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating country", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in CountryForm) {
            if (CountryForm[key] !== null && CountryForm[key] !== "") {
                formData.append(key, CountryForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingCountry) {
                // Editing existing country
                await handleUpdate(formData, editingCountry.id);
            } else {
                // Creating new country
                await handleCreate(formData);
            }
            setCountryForm({
                name: "",
            });

            setShowForm(false);
            setEditingCountry(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setCountryForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    if (!showForm) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Country
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCountryForm;
