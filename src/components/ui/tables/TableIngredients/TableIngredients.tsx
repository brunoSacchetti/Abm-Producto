import React, { ChangeEvent, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Checkbox, TextField } from "@mui/material";
import { IInsumo } from "../../../../types/IInsumo";
import { handleConfirm } from "../../../../helpers/alerts";

const columns = [
  {
    label: "Id",
    key: "id",
  },
  {
    label: "Ingrediente",
    key: "ingrediente",
    render: (element: IInsumo) => element?.denominacion ?? "N/A",
  },
  {
    label: "Unidad de medida",
    key: "unidadMedida",
    render: (element: IInsumo) => element?.unidadMedida?.denominacion ?? "N/A",
  },
  {
    label: "Cantidad",
    key: "cantidad",
  },
  {
    label: "Acciones",
    key: "actions",
  },
  {
    label: "Seleccionar",
    key: "seleccionar"
  }
];

interface ITableIngredients {
  handleDeleteItem: (indice: number) => void;
  dataIngredients: IInsumo[];
  onSelect: (selectedData: any[]) => void;
}

export const TableIngredients = ({
  handleDeleteItem,
  dataIngredients,
  onSelect,
}: ITableIngredients) => {
  const [rows, setRows] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  useEffect(() => {
    const updatedRows = dataIngredients.map((ingredient, index) => ({
      ...ingredient,
      id: index + 1,
      cantidad: ingredient.cantidad || 0,
    }));
    setRows(updatedRows);
  }, [dataIngredients]);

  const handleDelete = (index: number) => {
    const deleteCallback = () => {
      handleDeleteItem(index);
    };
    handleConfirm("¿Seguro quieres eliminar este insumo?", deleteCallback);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, rowData: any) => {
    const checked = event.target.checked;
    let updatedSelectedRows;
    if (checked) {
      updatedSelectedRows = [...selectedRows, rowData];
    } else {
      updatedSelectedRows = selectedRows.filter(row => row.id !== rowData.id);
    }
    setSelectedRows(updatedSelectedRows);
    onSelect(updatedSelectedRows);
  };

  const handleCantidadChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rowData: any) => {
    const newCantidad = event.target.value;
    const updatedRows = rows.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, cantidad: newCantidad };
      }
      return row;
    });
    setRows(updatedRows);

    const updatedSelectedRows = selectedRows.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, cantidad: newCantidad };
      }
      return row;
    });
    setSelectedRows(updatedSelectedRows);
    onSelect(updatedSelectedRows);
  };
  

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "25vh" }}>
      <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, i: number) => (
              <TableCell key={i} align="center">
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow role="checkbox" tabIndex={-1} key={index}>
              {columns.map((column, i: number) => (
                <TableCell key={i} align="center">
                  {column.key === "seleccionar" ? (
                    <Checkbox
                      checked={selectedRows.some(selectedRow => selectedRow.id === row.id)}
                      onChange={(event) => handleCheckboxChange(event, row)}
                    />
                  ) : column.key === "cantidad" ? (
                    <TextField
                      type="number"
                      value={row.cantidad}
                      onChange={(event) => handleCantidadChange(event, row)}
                      variant="filled"
                    />
                  ) : column.render ? (
                    column.render(row)
                  ) : column.key === "actions" ? (
                    <Button variant="text" onClick={() => handleDelete(index)}>
                      Eliminar
                    </Button>
                  ) : (
                    row[column.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
