// Table.tsx
import React, { useState } from "react";

export interface RowData {
  [key: string]: string;
}

interface TableProps {
  onRowSelection: (selectedRows: RowData[]) => void;
}

const Table: React.FC<TableProps> = ({ onRowSelection }) => {
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const data: RowData[] = [
    { "Columna 1": "Dato 1", "Columna 2": "Dato 2", "Columna 3": "Dato 3" },
    { "Columna 1": "Dato 4", "Columna 2": "Dato 5", "Columna 3": "Dato 6" }
  ];

  const toggleRow = (index: number) => {
    const rowData = data[index];
    const isSelected = selectedRows.some(row => compareRows(row, rowData));

    let newSelected: RowData[] = [];

    if (!isSelected) {
      newSelected = [...selectedRows, rowData];
    } else {
      newSelected = selectedRows.filter(row => !compareRows(row, rowData));
    }

    setSelectedRows(newSelected);

    onRowSelection(newSelected);
  };

  const compareRows = (row1: RowData, row2: RowData) => {
    const keys1 = Object.keys(row1);
    const keys2 = Object.keys(row2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (row1[key] !== row2[key]) return false;
    }

    return true;
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Seleccionar</th>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>
              <input
                type="checkbox"
                checked={selectedRows.some(row => compareRows(row, item))}
                onChange={() => toggleRow(index)}
              />
            </td>
            {Object.values(item).map((value, index) => (
              <td key={index}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;