import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
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

export interface ITableIngredients {
  handleDeleteItem: (indice: number) => void;
  dataIngredients: IInsumo[];
}

export const TableIngredients = ({
  handleDeleteItem,
  dataIngredients,
}: ITableIngredients) => {
  // Estado para almacenar las filas de la tabla
  const [rows, setRows] = useState<any[]>([]);

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
          {/* Celdas de la fila */}
          {columns.map((column, i: number) => (
            <TableCell key={i} align="center">
              {column.key === "seleccionar" ? ( // Verificar si la columna es la de "Seleccionar"
                <Checkbox
                  checked={row.selected} // Utiliza un estado "selected" en tu objeto de fila (row) para controlar el estado del checkbox
                  onChange={(event) => {
                    const updatedRows = [...rows];
                    updatedRows[index].selected = event.target.checked; // Actualiza el estado "selected" en la fila correspondiente
                    setRows(updatedRows); // Actualiza el estado de las filas
                  }}
                />
              ) : column.render ? (
                column.render(row)
              ) : column.key === "actions" ? (
                <Button
                  variant="text"
                  onClick={() => handleDelete(index)}
                >
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