import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { IInsumo } from "../../../../types/IInsumo";
import { handleConfirm } from "../../../../helpers/alerts";
import IProductoDetalle from "../../../../types/IProductoDetalle";

const columns = [
  {
    label: "Id",
    key: "id",
  },
  {
    label: "Ingrediente",
    key: "ingrediente",
    render: (element: IProductoDetalle) => element.insumo.denominacion,
  },
  {
    label: "Unidad de medida",
    key: "unidadMedida",
    render: (element: IProductoDetalle) => element.insumo.unidadMedida.denominacion,
  },
  {
    label: "Cantidad",
    key: "cantidad",
    render: (element: IProductoDetalle) =>
      `${element.cantidad} ${element.insumo.unidadMedida.denominacion}`,
  },
  {
    label: "Acciones",
    key: "actions",
  },
];

export interface ITableIngredients {
  handleDeleteItem: (indice: number) => void;
  dataIngredients: IProductoDetalle[];
}

export const TableInsumo = ({
  handleDeleteItem,
  dataIngredients,
}: ITableIngredients) => {
  // Estado para almacenar las filas de la tabla
  const [rows, setRows] = useState<IProductoDetalle[]>([]);

  useEffect(() => {
    setRows(dataIngredients);
  }, [dataIngredients]);

  const handleDelete = (index: number) => {
    handleConfirm("Seguro quieres eliminar el ingrediente", () => {
      handleDeleteItem(index);
    });
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: "25vh" }}>
      <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, i: number) => (
              <TableCell key={i} align={"center"}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow role="checkbox" tabIndex={-1} key={index}>
              {/* Celdas de la fila */}
              {columns.map((column, i: number) => {
                return (
                  <TableCell key={i} align={"center"}>
                    {column.render ? (
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
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
