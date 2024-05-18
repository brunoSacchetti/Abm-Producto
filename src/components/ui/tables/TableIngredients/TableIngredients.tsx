import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Checkbox } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
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
    render: (element: IInsumo) =>
      `${element?.cantidad ?? "N/A"} ${element?.unidadMedida?.denominacion ?? "N/A"}`,
  },
  {
    label: "Acciones",
    key: "actions",
  },
  {label:"Seleccionar",
    key:"seleccionar"
  }
];

interface ITableIngredients {
  handleDeleteItem: (indice: number) => void;
  dataIngredients: IInsumo[];
  onSelect: (selectedData: any) => void; // Agrega el tipo y la prop para la función de devolución de llamada
}

export const TableIngredients = ({
  handleDeleteItem,
  dataIngredients,
  onSelect, // Asegúrate de recibir la prop de la función de devolución de llamada
}: ITableIngredients) => {
  // Estado para almacenar las filas de la tabla
  const [rows, setRows] = useState<any[]>([]);
  const handleSelect = (selectedData: any) => {
    // Llama a la función de devolución de llamada con los datos seleccionados
    onSelect(selectedData);
  };
  useEffect(() => {
    // Asignar IDs automáticamente basados en el índice
    const updatedRows = dataIngredients.map((ingredient, index) => ({
      ...ingredient,
      id: index + 1,
    }));
    setRows(updatedRows);
  }, [dataIngredients]);

  const handleDelete = (index: number) => {
    const handleDelete = () => {
      handleDeleteItem(index);
    };
    handleConfirm("¿Seguro quieres eliminar este insumo?", handleDelete);
  };


  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, rowData: any) => {
    const updatedRows = rows.map((row) => {
      if (row === rowData) {
        // Si es la fila seleccionada, actualiza su propiedad selected
        return { ...row, selected: event.target.checked };
      }
      return row;
    });
    setRows(updatedRows);
    onSelect(rowData); // Llama a la función de devolución de llamada con los datos de la fila seleccionada
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
                      checked={row.selected}
                      onChange={(event) => handleCheckboxChange(event, row)} // Pasa los datos de la fila al cambiar el estado del Checkbox
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