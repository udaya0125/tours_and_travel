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

import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";

const IconSortAsc = () => (
    <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
        />
    </svg>
);

const IconSortDesc = () => (
    <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

const IconSelector = () => (
    <svg
        className="w-3.5 h-3.5 opacity-30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4M8 15l4 4 4-4"
        />
    </svg>
);

const IconChevronsLeft = () => (
    <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
        />
    </svg>
);

const IconChevronLeft = () => (
    <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
        />
    </svg>
);

const IconChevronRight = () => (
    <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
        />
    </svg>
);

const IconChevronsRight = () => (
    <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
    </svg>
);

const MyTable = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination,
    );

    const { key: tableKey, ...tableProps } = getTableProps();

    return (
        <div className="w-full mt-6 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            {/* Table scroll container */}
            <div className="overflow-x-auto">
                <table
                    {...tableProps}
                    className="w-full border-collapse text-sm"
                >
                    {/* Header */}
                    <thead>
                        {headerGroups.map((headerGroup) => {
                            const { key: hgKey, ...hgProps } =
                                headerGroup.getHeaderGroupProps();
                            return (
                                <tr
                                    key={hgKey}
                                    {...hgProps}
                                    className="border-b border-gray-200 bg-gray-50"
                                >
                                    {headerGroup.headers.map((column) => {
                                        const { key: hKey, ...hProps } =
                                            column.getHeaderProps(
                                                column.getSortByToggleProps(),
                                            );
                                        return (
                                            <th
                                                key={hKey}
                                                {...hProps}
                                                className="px-4 py-3 text-left text-[11px] font-medium tracking-[0.06em] uppercase text-gray-400 select-none hover:text-gray-600 transition-colors duration-100"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span>
                                                        {column.render(
                                                            "Header",
                                                        )}
                                                    </span>
                                                    <span
                                                        className={
                                                            column.isSorted
                                                                ? "text-blue-500"
                                                                : ""
                                                        }
                                                    >
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <IconSortDesc />
                                                            ) : (
                                                                <IconSortAsc />
                                                            )
                                                        ) : (
                                                            <IconSelector />
                                                        )}
                                                    </span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </thead>

                    {/* Body */}
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, rowIndex) => {
                            prepareRow(row);
                            const { key: rowKey, ...rowProps } =
                                row.getRowProps();
                            return (
                                <tr
                                    key={row.original.id || rowKey}
                                    {...rowProps}
                                    className={[
                                        "border-b border-gray-100 last:border-b-0 transition-colors duration-100 hover:bg-blue-50/60",
                                        rowIndex % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50/60",
                                    ].join(" ")}
                                >
                                    {row.cells.map((cell) => {
                                        const { key: cellKey, ...cellProps } =
                                            cell.getCellProps();
                                        return (
                                            <td
                                                key={cellKey}
                                                {...cellProps}
                                                className="px-4 py-3 text-gray-700 whitespace-nowrap text-[13.5px]"
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex-wrap gap-2">
                {/* Prev/Next buttons */}
                <div className="flex items-center gap-1">
                    {[
                        {
                            onClick: () => gotoPage(0),
                            disabled: !canPreviousPage,
                            Icon: IconChevronsLeft,
                            label: "First page",
                        },
                        {
                            onClick: () => previousPage(),
                            disabled: !canPreviousPage,
                            Icon: IconChevronLeft,
                            label: "Previous page",
                        },
                        {
                            onClick: () => nextPage(),
                            disabled: !canNextPage,
                            Icon: IconChevronRight,
                            label: "Next page",
                        },
                        {
                            onClick: () => gotoPage(pageCount - 1),
                            disabled: !canNextPage,
                            Icon: IconChevronsRight,
                            label: "Last page",
                        },
                    ].map(({ onClick, disabled, Icon, label }) => (
                        <button
                            key={label}
                            onClick={onClick}
                            disabled={disabled}
                            aria-label={label}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-default transition-colors duration-100"
                        >
                            <Icon />
                        </button>
                    ))}
                </div>

                {/* Page indicator */}
                <span className="text-xs text-gray-400">
                    Page{" "}
                    <span className="font-medium text-gray-700">
                        {pageIndex + 1}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
                        {pageOptions.length}
                    </span>
                </span>

                {/* Page size */}
                <div className="relative inline-flex items-center">
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="text-xs pl-3 pr-8 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 appearance-none"
                    >
                        {[10, 20, 30, 40, 50].map((size) => (
                            <option key={size} value={size}>
                                {size} rows
                            </option>
                        ))}
                    </select>

                    {/* Dropdown chevron icon — pointer-events-none so clicks pass through to select */}
                    {/* <span className="pointer-events-none absolute right-2 text-gray-400">
                        <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </span> */}
                </div>
            </div>
        </div>
    );
};

export default MyTable;

// import React, { useState, useMemo } from "react";

// const IconSort = () => (
//     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
//         <path d="M5 1L8 4H2L5 1Z" fill="currentColor" opacity="0.35" />
//         <path d="M5 9L2 6H8L5 9Z" fill="currentColor" opacity="0.35" />
//     </svg>
// );

// const IconSortAsc = () => (
//     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
//         <path d="M5 1L8 4H2L5 1Z" fill="currentColor" />
//         <path d="M5 9L2 6H8L5 9Z" fill="currentColor" opacity="0.2" />
//     </svg>
// );

// const IconSortDesc = () => (
//     <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
//         <path d="M5 1L8 4H2L5 1Z" fill="currentColor" opacity="0.2" />
//         <path d="M5 9L2 6H8L5 9Z" fill="currentColor" />
//     </svg>
// );

// const MyTable = ({ columns, data }) => {
//     const [sortKey, setSortKey] = useState(null);
//     const [sortDir, setSortDir] = useState(1);
//     const [page, setPage] = useState(0);
//     const [pageSize, setPageSize] = useState(10);

//     const sorted = useMemo(() => {
//         if (!sortKey) return data;
//         return [...data].sort((a, b) => {
//             const av = a[sortKey], bv = b[sortKey];
//             if (typeof av === "number") return (av - bv) * sortDir;
//             return String(av).localeCompare(String(bv)) * sortDir;
//         });
//     }, [data, sortKey, sortDir]);

//     const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
//     const safePage = Math.min(page, totalPages - 1);
//     const slice = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

//     const canPreviousPage = safePage > 0;
//     const canNextPage = safePage < totalPages - 1;

//     const handleSort = (key) => {
//         if (sortKey === key) setSortDir((d) => d * -1);
//         else { setSortKey(key); setSortDir(1); }
//         setPage(0);
//     };

//     return (
//         <div className="w-full bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden mt-6">

//             {/* ── Table ── */}
//             <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr>
//                             {columns.map((col) => {
//                                 const key = col.accessor;
//                                 const isSorted = sortKey === key;
//                                 return (
//                                     <th
//                                         key={key}
//                                         onClick={() => handleSort(key)}
//                                         className="px-6 py-4 text-left cursor-pointer select-none border-b border-blue-100 bg-blue-100 group"
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <span className={`text-xs font-semibold tracking-wider uppercase transition-colors ${
//                                                 isSorted ? "text-gray-800" : "text-gray-500 group-hover:text-gray-700"
//                                             }`}>
//                                                 {col.Header}
//                                             </span>
//                                             <span className={`ml-2 transition-opacity ${isSorted ? "opacity-100 text-gray-700" : "opacity-40 text-gray-400"}`}>
//                                                 {isSorted
//                                                     ? sortDir === 1 ? <IconSortAsc /> : <IconSortDesc />
//                                                     : <IconSort />
//                                                 }
//                                             </span>
//                                         </div>
//                                     </th>
//                                 );
//                             })}
//                         </tr>
//                     </thead>

//                     <tbody className="divide-y divide-blue-100/50">
//                         {slice.length === 0 ? (
//                             <tr>
//                                 <td
//                                     colSpan={columns.length}
//                                     className="px-6 py-8 text-center text-base text-gray-400"
//                                 >
//                                     No records found
//                                 </td>
//                             </tr>
//                         ) : (
//                             slice.map((row, rowIdx) => (
//                                 <tr
//                                     key={row.id ?? rowIdx}
//                                     className={`transition-colors duration-150 hover:bg-gray-200 ${
//                                         rowIdx % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
//                                     }`}
//                                 >
//                                     {columns.map((col) => {
//                                         const value = col.Cell
//                                             ? col.Cell({
//                                                 value: row[col.accessor],
//                                                 row: {
//                                                     original: row,
//                                                     index: safePage * pageSize + rowIdx,
//                                                 },
//                                               })
//                                             : row[col.accessor];
//                                         return (
//                                             <td
//                                                 key={col.accessor}
//                                                 className="px-6 py-4 text-sm whitespace-nowrap text-neutral"
//                                             >
//                                                 {value}
//                                             </td>
//                                         );
//                                     })}
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* ── Pagination ── */}
//             <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-gray-300">
//                 <div className="flex items-center justify-between w-full">

//                     {/* Nav buttons */}
//                     <div className="flex items-center sm:gap-2 gap-0.5">
//                         <button
//                             onClick={() => setPage(0)}
//                             disabled={!canPreviousPage}
//                             className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition text-sm"
//                         >
//                             {"<<"}
//                         </button>
//                         <button
//                             onClick={() => setPage((p) => Math.max(0, p - 1))}
//                             disabled={!canPreviousPage}
//                             className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition text-sm"
//                         >
//                             {"<"}
//                         </button>
//                         <button
//                             onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
//                             disabled={!canNextPage}
//                             className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition text-sm"
//                         >
//                             {">"}
//                         </button>
//                         <button
//                             onClick={() => setPage(totalPages - 1)}
//                             disabled={!canNextPage}
//                             className="sm:px-3 px-1.5 py-1.5 border-2 border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition text-sm"
//                         >
//                             {">>"}
//                         </button>
//                     </div>

//                     {/* Page info */}
//                     <span className="text-sm">
//                         Page <strong>{safePage + 1}</strong> of{" "}
//                         <strong>{totalPages}</strong>
//                     </span>

//                     {/* Page size */}
//                     <select
//                         value={pageSize}
//                         onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
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
