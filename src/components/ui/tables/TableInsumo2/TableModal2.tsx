import { ChangeEvent, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IInsumo } from "../../../../types/IInsumo";
import { CategoriaService } from "../../../../services/CategoriaService";

const API_URL = import.meta.env.VITE_API_URL;

const columns = [
  { label: "Id", key: "id" },
  {
    label: "Ingrediente",
    key: "denominacion",
  },
  {
    label: "Unidad de medida",
    key: "unidadMedida",
    render: (element: IInsumo) =>
      element?.unidadMedida?.denominacion ?? "N/A",
  },
  { label: "Cantidad", key: "cantidad" },
  { label: "Seleccionar", key: "seleccionar" },
];

interface ITableIngredients {
  dataIngredients: IInsumo[];
  onSelect: (selectedData: any[]) => void;
}

export const TableModal2 = ({
  dataIngredients,
  onSelect,
}: ITableIngredients) => {
  const [rows, setRows] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoria, setCategoria] = useState<any[]>([]);

  useEffect(() => {
    const updatedRows = dataIngredients.map((ingredient, index) => ({
      ...ingredient,
      id: index + 1,
      cantidad: ingredient.cantidad || 0,
    }));
    setRows(updatedRows);
  }, [dataIngredients]);

  useEffect(() => {
    const categoriaService = new CategoriaService(API_URL + "/categoria");
    categoriaService.getAll().then((data) => {
      setCategoria(data);
    });
  }, []);

  const handleCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    rowData: any
  ) => {
    const checked = event.target.checked;
    let updatedSelectedRows;
    if (checked) {
      updatedSelectedRows = [...selectedRows, rowData];
    } else {
      updatedSelectedRows = selectedRows.filter(
        (row) => row.id !== rowData.id
      );
    }
    setSelectedRows(updatedSelectedRows);
    onSelect(updatedSelectedRows);
  };

  const handleCantidadChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    rowData: any
  ) => {
    const newCantidad = parseFloat(event.target.value);
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

  useEffect(() => {
    const results = dataIngredients.filter((ingredient) =>
      ingredient.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRows(results);
  }, [dataIngredients, searchTerm]);

  return (
    <div>
      <TextField
        label="Buscar ingrediente"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20, width: "30%" }}
      />
      <Select
        style={{ marginLeft: 40 }}
        label="Categorias"
        variant="filled"
      >
        {categoria.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.denominacion}
          </MenuItem>
        ))}
      </Select>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "55vh", height: "600px" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column, i) => (
                <TableCell key={i} align="center">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column, i) => (
                  <TableCell key={i} align="center">
                    {column.key === "seleccionar" ? (
                      <Checkbox
                        checked={selectedRows.some(
                          (selectedRow) => selectedRow.id === row.id
                        )}
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
    </div>
  );
};
