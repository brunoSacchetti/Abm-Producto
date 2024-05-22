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
import { ButtonsTable } from "../../buttons/ButtonsTable/ButtonsTable";
import { useAppSelector } from "../../../../hooks/redux";
import IProductoManufacturado from "../../../../types/IProductoManufacturado";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { CategoriaService } from "../../../../services/CategoriaService";
import { ICategoria } from "../../../../types/ICategoria";

const API_URL = import.meta.env.VITE_API_URL;

interface ITableColumn<T> {
  label: string;
  key: string;
  render?: (item: T) => React.ReactNode;
}

export interface ITableProps<T> {
  columns: ITableColumn<T>[];
  handleDelete: (id: number | string) => void;
  setOpenModal: (state: boolean) => void;
  handleCancelOrRegister: (
    id: number | string,
    data: IProductoManufacturado
  ) => void;
}

export const TableGeneric = <T extends { id: any }>({
  columns,
  handleDelete,
  setOpenModal,
  handleCancelOrRegister,
}: ITableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //SEARCH
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  const [categoria, setCategoria] = useState<ICategoria[]>([]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const dataTable = useAppSelector((state) => state.tablaReducer.dataTable);

  useEffect(() => {
    setFilteredRows(dataTable);
  }, [dataTable]);

  useEffect(() => {
    const results = dataTable.filter((row) =>
      row.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(results);
    setPage(0);
  }, [searchTerm, dataTable]);

  // #region Categoria Service
  const categoriaService = new CategoriaService(API_URL + "/categoria");

  useEffect(() => {
    categoriaService.getAll().then((data) => {
      setCategoria(data);
    });
  }, []);


  const getCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
    }
  };
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(1);

  const handleChangeCateogiras = async (
    e: SelectChangeEvent<number>
  ) => {
    const categoriaId = e.target.value as number;
    setSelectedCategoriaId(categoriaId);

  };
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", marginBottom: 20 }}>
        <TextField
          label="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: 20 }}
        />

        <Select
          label="Categorias"
          value={selectedCategoriaId ?? ""}
          onChange={handleChangeCateogiras}
          variant="filled"
        >
          {categoria.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.denominacion}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Paper sx={{ width: "90%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader aria-label="sticky table">
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
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index: number) => (
                  <TableRow role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column, i: number) => (
                      <TableCell key={i} align={"center"}>
                        {column.render ? (
                          column.render(row)
                        ) : column.label === "Acciones" ? (
                          <ButtonsTable
                            el={row}
                            handleDelete={handleDelete}
                            setOpenModal={setOpenModal}
                            handleCancelOrRegister={handleCancelOrRegister}
                          />
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
