import * as React from 'react';

export interface DataTableProps{
    columns: string[];
    rows: Record<string, string>[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    onNextPageChange: (page: number) => void;
    onPreviousPageChange: (page: number) => void;
}

export const ReactDataSetControl: React.FC<DataTableProps> = ({
    columns,
    rows,
    totalCount,
    currentPage,
    pageSize,
    onNextPageChange,
    onPreviousPageChange
}) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    return (
        <div>
            <div style={{ fontFamily: "Segoe UI, sans-serif", padding: "16px" }}>
            <p style={{ color: "#666", marginBottom: "8px" }}>
                Showing page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong> ({totalCount} total records)
            </p>
            <table style={{backgroundColor:'#0078d4', color: 'white', width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column} style={{ border: '1px solid #fff', padding: '8px' }}>
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '16px' }}>
                                    No records to display
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => (
                                    <tr key={index}>
                                        {   
                                            columns.map((column) => (
                                                <td key={column} style={{ border: '1px solid #fff', padding: '8px' }}>
                                                    {row[column]}
                                                </td>
                                            ))
                                        }
                                    </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
            </div>
        </div>
    );
}