// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const ActivityLogs = () => {
//     const [allLogs, setAllLogs] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);

//     // For fetching the Logs data
//     useEffect(() => {
//         const fetchLog = async () => {
//             try {
//                 const response = await axios.get(route("ourlogs.index"));
//                 setAllLogs(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchLog();
//     }, [reloadTrigger]);
//     return (
//         <>
//             <AdminWrapper>
//                 <h2 className="text-2xl font-bold text-center justify-between">
//                     Activity Logs
//                 </h2>
//                 <p className="text-center text-gray-500 mt-4">
//                     This is where you can view all the activity logs of the
//                     admin dashboard.
//                 </p>
//             </AdminWrapper>
//         </>
//     );
// };

// export default ActivityLogs;

import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import PageLoader from "../PageLoader/PageLoader";

const ActivityLogs = () => {
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLog = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route("ourlogs.index"));
            setAllLogs(response.data.activity_logs); // ← no .data at the end
        } catch (error) {
            console.error("Fetching error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLog();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const columns = useMemo(
        () => [
            {
                Header: "S.N.",
                id: "row_number",
                Cell: ({ row }) => (
                    <span className="text-gray-400 font-mono text-xs">
                        {row.index + 1}
                    </span>
                ),
                disableSortBy: true,
            },
            {
                Header: "User",
                accessor: "name",
                Cell: ({ value }) => (
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs uppercase shrink-0">
                            {value?.charAt(0) ?? "?"}
                        </div>
                        <span className="font-medium text-gray-800">
                            {value ?? "—"}
                        </span>
                    </div>
                ),
            },
            {
                Header: "Action",
                accessor: "title",
                Cell: ({ value }) => (
                    <span className="text-gray-700">{value ?? "—"}</span>
                ),
            },
            {
                Header: "IP Address",
                accessor: "ip_address",
                Cell: ({ value }) => (
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {value ?? "—"}
                    </span>
                ),
            },
            {
                Header: "Date & Time",
                accessor: "created_at",
                Cell: ({ value }) => (
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(value)}
                    </span>
                ),
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    Activity Logs
                </h2>
                {/* <p className="text-gray-500 mt-1 text-sm">
                    Track all admin dashboard activity and actions.
                </p> */}
            </div>

            {/* Loading state */}
            {loading ? (
                <PageLoader />
            ) : (
                <MyTable columns={columns} data={allLogs} />
            )}
        </AdminWrapper>
    );
};

export default ActivityLogs;
