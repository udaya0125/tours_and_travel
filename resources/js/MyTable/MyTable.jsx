// import React from "react";
// import { useTable, useSortBy, usePagination } from "react-table";

// const IconChevronDoubleLeft = () => (
//     <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
//         />
//     </svg>
// );

// const IconChevronLeft = () => (
//     <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//         />
//     </svg>
// );

// const IconChevronRight = () => (
//     <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 5l7 7-7 7"
//         />
//     </svg>
// );

// const IconChevronDoubleRight = () => (
//     <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M13 5l7 7-7 7M5 5l7 7-7 7"
//         />
//     </svg>
// );

// const IconChevronUp = () => (
//     <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M5 15l7-7 7 7"
//         />
//     </svg>
// );

// const IconChevronDown = () => (
//     <svg
//         className="w-4 h-4"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//         />
//     </svg>
// );

// const MyTable = ({ columns, data }) => {
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         prepareRow,
//         page,
//         canPreviousPage,
//         canNextPage,
//         pageOptions,
//         pageCount,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state: { pageIndex, pageSize },
//     } = useTable(
//         {
//             columns,
//             data,
//             initialState: { pageIndex: 0 },
//         },
//         useSortBy,
//         usePagination,
//     );

//     // Remove key from table props
//     const { key: tableKey, ...tableProps } = getTableProps();

//     return (
//         <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden mt-6 text-neutral">
//             {/* Table Container */}
//             <div className="overflow-x-auto">
//                 <table {...tableProps} className="w-full">
//                     <thead className="bg-blue-50/40">
//                         {headerGroups.map((headerGroup) => {
//                             const { key: headerGroupKey, ...headerGroupProps } =
//                                 headerGroup.getHeaderGroupProps();
//                             return (
//                                 <tr key={headerGroupKey} {...headerGroupProps}>
//                                     {headerGroup.headers.map((column) => {
//                                         const {
//                                             key: headerKey,
//                                             ...headerProps
//                                         } = {
//                                             ...column.getHeaderProps(
//                                                 column.getSortByToggleProps(),
//                                             ),
//                                         };
//                                         return (
//                                             <th
//                                                 key={headerKey}
//                                                 {...headerProps}
//                                                 className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase border-b border-blue-100 bg-blue-100 backdrop-blur-sm"
//                                             >
//                                                 <div className="flex items-center justify-between">
//                                                     <span className="font-medium">
//                                                         {column.render(
//                                                             "Header",
//                                                         )}
//                                                     </span>
//                                                     <span className="ml-2">
//                                                         {column.isSorted ? (
//                                                             column.isSortedDesc ? (
//                                                                 <IconChevronDown className="w-4 h-4" />
//                                                             ) : (
//                                                                 <IconChevronUp className="w-4 h-4" />
//                                                             )
//                                                         ) : (
//                                                             <span className="w-4 h-4" />
//                                                         )}
//                                                     </span>
//                                                 </div>
//                                             </th>
//                                         );
//                                     })}
//                                 </tr>
//                             );
//                         })}
//                     </thead>

//                     <tbody
//                         {...getTableBodyProps()}
//                         className="divide-y divide-blue-100/50"
//                     >
//                         {page.map((row, rowIndex) => {
//                             prepareRow(row);
//                             const { key: rowKey, ...rowProps } =
//                                 row.getRowProps();
//                             return (
//                                 <tr
//                                     key={row.original.id || rowKey}
//                                     {...rowProps}
//                                     className={`transition-colors duration-150 ${
//                                         rowIndex % 2 === 0
//                                             ? "bg-gray-100"
//                                             : "bg-gray-50"
//                                     } hover:bg-gray-200`}
//                                 >
//                                     {row.cells.map((cell) => {
//                                         const { key: cellKey, ...cellProps } =
//                                             cell.getCellProps();
//                                         return (
//                                             <td
//                                                 key={cellKey}
//                                                 {...cellProps}
//                                                 className="px-6 py-4 whitespace-nowrap text-sm"
//                                             >
//                                                 {cell.render("Cell")}
//                                             </td>
//                                         );
//                                     })}
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-gray-300 ">
//                 <div className=" flex items-center justify-between w-full">
//                     <div className="flex items-center sm:gap-2 gap-0.5">
//                         <button
//                             onClick={() => gotoPage(0)}
//                             disabled={!canPreviousPage}
//                             className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
//                         >
//                             {"<<"}
//                         </button>
//                         <button
//                             onClick={() => previousPage()}
//                             disabled={!canPreviousPage}
//                             className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
//                         >
//                             {"<"}
//                         </button>
//                         <button
//                             onClick={() => nextPage()}
//                             disabled={!canNextPage}
//                             className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
//                         >
//                             {">"}
//                         </button>
//                         <button
//                             onClick={() => gotoPage(pageOptions.length - 1)}
//                             disabled={!canNextPage}
//                             className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
//                         >
//                             {">>"}
//                         </button>
//                     </div>

//                     <span className="">
//                         Page <strong>{pageIndex + 1}</strong> of{" "}
//                         <strong>{pageOptions.length}</strong>
//                     </span>

//                     <select
//                         value={pageSize}
//                         onChange={(e) => setPageSize(Number(e.target.value))}
//                         className="border rounded-full p-1 pr-8 pl-4 bg-gray-200 text-sm"
//                     >
//                         {[10, 20, 30, 40, 50].map((size) => (
//                             <option key={size} value={size}>
//                                 Show {size}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyTable;


import React, { useState, useMemo } from "react";

const IconSort = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1L8 4H2L5 1Z" fill="currentColor" opacity="0.35" />
        <path d="M5 9L2 6H8L5 9Z" fill="currentColor" opacity="0.35" />
    </svg>
);

const IconSortAsc = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1L8 4H2L5 1Z" fill="currentColor" />
        <path d="M5 9L2 6H8L5 9Z" fill="currentColor" opacity="0.2" />
    </svg>
);

const IconSortDesc = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 1L8 4H2L5 1Z" fill="currentColor" opacity="0.2" />
        <path d="M5 9L2 6H8L5 9Z" fill="currentColor" />
    </svg>
);

const MyTable = ({ columns, data }) => {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState(1);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const sorted = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            if (typeof av === "number") return (av - bv) * sortDir;
            return String(av).localeCompare(String(bv)) * sortDir;
        });
    }, [data, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, totalPages - 1);
    const slice = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

    const canPreviousPage = safePage > 0;
    const canNextPage = safePage < totalPages - 1;

    const handleSort = (key) => {
        if (sortKey === key) setSortDir((d) => d * -1);
        else { setSortKey(key); setSortDir(1); }
        setPage(0);
    };

    return (
        <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden mt-6">

            {/* ── Table ── */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {columns.map((col) => {
                                const key = col.accessor;
                                const isSorted = sortKey === key;
                                return (
                                    <th
                                        key={key}
                                        onClick={() => handleSort(key)}
                                        className="px-6 py-4 text-left cursor-pointer select-none border-b border-blue-100 bg-blue-100 group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-semibold tracking-wider uppercase transition-colors ${
                                                isSorted ? "text-gray-800" : "text-gray-500 group-hover:text-gray-700"
                                            }`}>
                                                {col.Header}
                                            </span>
                                            <span className={`ml-2 transition-opacity ${isSorted ? "opacity-100 text-gray-700" : "opacity-40 text-gray-400"}`}>
                                                {isSorted
                                                    ? sortDir === 1 ? <IconSortAsc /> : <IconSortDesc />
                                                    : <IconSort />
                                                }
                                            </span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-blue-100/50">
                        {slice.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center text-base text-gray-400"
                                >
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            slice.map((row, rowIdx) => (
                                <tr
                                    key={row.id ?? rowIdx}
                                    className={`transition-colors duration-150 hover:bg-gray-200 ${
                                        rowIdx % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                                    }`}
                                >
                                    {columns.map((col, colIdx) => {
                                        const value = col.Cell
                                            ? col.Cell({ value: row[col.accessor], row: { original: row } })
                                            : row[col.accessor];
                                        return (
                                            <td
                                                key={col.accessor}
                                                className="px-6 py-4 text-sm whitespace-nowrap text-neutral"
                                            >
                                                {value}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-gray-300">
                <div className="flex items-center justify-between w-full">

                    {/* Nav buttons */}
                    <div className="flex items-center sm:gap-2 gap-0.5">
                        <button
                            onClick={() => setPage(0)}
                            disabled={!canPreviousPage}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition text-sm"
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={!canPreviousPage}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition text-sm"
                        >
                            {"<"}
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={!canNextPage}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition text-sm"
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => setPage(totalPages - 1)}
                            disabled={!canNextPage}
                            className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition text-sm"
                        >
                            {">>"}
                        </button>
                    </div>

                    {/* Page info */}
                    <span className="text-sm">
                        Page <strong>{safePage + 1}</strong> of{" "}
                        <strong>{totalPages}</strong>
                    </span>

                    {/* Page size */}
                    <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                        className="border rounded-full p-1 pr-8 pl-4 bg-gray-200 text-sm"
                    >
                        {[10, 20, 30, 40, 50].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default MyTable;