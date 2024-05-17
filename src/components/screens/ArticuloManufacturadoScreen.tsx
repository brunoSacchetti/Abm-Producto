import { useEffect, useState } from "react";
/* import { MasterDetailModal } from "../ui/modals/MasterDetailModal/MasterDetailModal"; */
import { NavBar } from "../ui/NavBar/NavBar";
import { TableGeneric } from "../ui/tables/TableGeneric/TableGeneric";
import IProductoManufacturado from "../../types/IProductoManufacturado";
import { ProductoManufacturadoService } from "../../services/ProductoManufacturadoService";
import { useAppDispatch } from "../../hooks/redux";

import {
  removeElementActive,
  setDataTable,
} from "../../redux/slices/TablaReducer";
import { Button, CircularProgress, styled } from "@mui/material";
/* import { ProductoManufacturado } from "../ui/modals/ArticuloManufacturadoModal/ProductoManufacturado"; */
import { PruebaManufacturadoModal } from "../ui/modals/PruebaManufacturadoModal/PruebaManufacturadoModal";
import AddIcon from '@mui/icons-material/Add';

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

const StyledButton = styled(Button)({
  backgroundColor: '#607d8b', // Gris
  color: 'white',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  padding: '10px 20px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#455a64', // Gris más oscuro
  },
});

const ColumnsProductosManufacturados = [
  { label: "Id", key: "id" },
  { label: "Nombre", key: "denominacion" },
  {
    label: "Tiempo de cocina",
    key: "tiempoEstimadoMinutos",
  },
  {
    label: "Habilitado",
    key: "eliminado",
    render: (element: IProductoManufacturado) => (element.eliminado ? "Si" : "No"),
  },
  {
    label: "Precio",
    key: "precioVenta",
  },
  {
    label: "Acciones",
    key: "actions",
  },
];

export const ArticuloManufacturadoScreen = () => {
  //manejo de estado del modal
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(removeElementActive()); //al cerrar el modal siempre reseteamos el elemento activo
  };

  //instanciamos el loader de la carga de datos
  const [loading, setLoading] = useState<boolean>(false);

  //instanciamos el dispatch
  const dispatch = useAppDispatch();

  //instanciamos los servicios
  const productoManufacturadoService = new ProductoManufacturadoService(
    `${API_URL}/ArticuloManufacturado`
  );

  // Función para obtener los productos manufacturados
  const getDataTable = async () => {
    await productoManufacturadoService.getAll().then((dataTable) => {
      dispatch(setDataTable(dataTable));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getDataTable();
  }, []);

  //funcion para eleminar un elemento
  const handleDelete = async (id: number | string) => {
    await productoManufacturadoService.delete(id);
    dispatch(removeElementActive());
    getDataTable();
  };

  //funcion para dar de baja o alta un elemento
  const handleCancelOrRegister = async (
    id: number | string,
    data: IProductoManufacturado
  ) => {
    await productoManufacturadoService.put(id, data);
    dispatch(removeElementActive());
    getDataTable();
  };


  return (
    <div>
      <NavBar />
      <div
        style={{
          height: "6vh",
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "20%",
            padding: ".4rem",
          }}
        >
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />} // Agregar icono
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Agregar un producto manufacturado
          </StyledButton>
        </div>
      </div>

      {!loading ? (
        // Mostrar la tabla de personas una vez que los datos se han cargado
        <TableGeneric<IProductoManufacturado>
          handleDelete={handleDelete}
          columns={ColumnsProductosManufacturados}
          setOpenModal={setOpenModal}
          handleCancelOrRegister={handleCancelOrRegister}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      )}
      <PruebaManufacturadoModal         
        getData={getDataTable}
        open={openModal}
        handleClose={handleCloseModal}
      />
    </div>
  );
};
