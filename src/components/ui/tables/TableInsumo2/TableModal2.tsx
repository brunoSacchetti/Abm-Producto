import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { MenuItem, Select } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { IInsumo } from "../../../../types/IInsumo";
import { CategoriaService } from "../../../../services/CategoriaService";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(-1);
  const [categoria, setCategoria] = useState<any[]>([]);
  const [selectedCategoryInsumos, setSelectedCategoryInsumos] = useState<any[]>([]);

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
    event: React.ChangeEvent<HTMLInputElement>,
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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const onSelectCategory = async (categoryId: number) => {
    setSelectedCategoriaId(categoryId);
    if (categoryId === -1) {
      setRows(dataIngredients);
    } else {
      const categoriaService = new CategoriaService(API_URL + "/categoria");
      const selectedCategory = await categoriaService.getById(categoryId);
      setSelectedCategoryInsumos(selectedCategory?.insumos);
    }
  };
  

  useEffect(() => {
    let results = selectedCategoryInsumos;

    // Filtrar por término de búsqueda
    results = results.filter((ingredient) =>
      ingredient.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setRows(results);
  }, [searchTerm, selectedCategoryInsumos]);

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
        label="Categorías"
        variant="filled"
        value={selectedCategoriaId}
        onChange={(e) => onSelectCategory(e.target.value as number)}
      >
        <MenuItem value={-1}>Todas las Categorias</MenuItem>
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
              <TableCell align="center">Id</TableCell>
              <TableCell align="center">Ingrediente</TableCell>
              <TableCell align="center">Unidad de medida</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Seleccionar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow role="checkbox" tabIndex={-1} key={index}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.denominacion}</TableCell>
                <TableCell align="center">{row.unidadMedida?.denominacion ?? "N/A"}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={row.cantidad}
                    onChange={(event) => handleCantidadChange(event, row)}
                    variant="filled"
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={selectedRows.some(
                      (selectedRow) => selectedRow.id === row.id
                    )}
                    onChange={(event) => handleCheckboxChange(event, row)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
