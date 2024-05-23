import { useEffect, useState } from "react";
import { NavBar } from "../ui/NavBar/NavBar";
import { TableGeneric } from "../ui/tables/TableGeneric/TableGeneric";
import { ProductoManufacturadoService } from "../../services/ProductoManufacturadoService";
import { useAppDispatch } from "../../hooks/redux";
import {
  removeElementActive,
  setDataTable,
} from "../../redux/slices/TablaReducer";
import { Button, CircularProgress, styled } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { PruebaManufacturadoModal } from "../ui/modals/PruebaManufacturadoModal/PruebaManufacturadoModal";
import { CategoriaService } from "../../services/CategoriaService";
import { ICategoria } from "../../types/ICategoria";
import IProductoManufacturado from "../../types/IProductoManufacturado";
import { PruebaModal2 } from "../ui/modals/PruebaManufacturadoModal2/PruebaModal2";

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

const ColumnsProductosManufacturados = (categorias: ICategoria[]) => [
  { label: "Id", key: "id" },
  { label: "Nombre", key: "denominacion" },
  { 
    label: "Categoria", 
    key: "categoria",
    render: (element: IProductoManufacturado) => {
      // Buscar la categoría correspondiente al artículo manufacturado
      const categoria = categorias.find(cat =>
        cat.articulosManufacturados.some((am: IProductoManufacturado) => am.id === element.id)
      );
      return categoria ? categoria.denominacion : 'Categoría no encontrada';
    },
  },
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
  // manejo de estado del modal
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(removeElementActive()); // al cerrar el modal siempre reseteamos el elemento activo
  };

  // instanciamos el loader de la carga de datos
  const [loading, setLoading] = useState<boolean>(true);

  // useState para categorias
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  // instanciamos el dispatch
  const dispatch = useAppDispatch();

  // #region SERVICIOS
  const productoManufacturadoService = new ProductoManufacturadoService(
    `${API_URL}/ArticuloManufacturado`
  );

  const categoriaService = new CategoriaService(`${API_URL}/categoria`);

  // Función para obtener las categorías
  const fetchCategorias = async () => {
    const data = await categoriaService.getAll();
    setCategorias(data);
  };

  // Función para obtener los productos manufacturados
  const getDataTable = async () => {
    await productoManufacturadoService.getAll().then((dataTable) => {
      const productoPosts = dataTable.map((item) => item as IProductoManufacturado);
      dispatch(setDataTable(productoPosts));
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCategorias(), getDataTable()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Funcion para recargar datos (categorías y productos)
  const reloadData = async () => {
    setLoading(true);
    await Promise.all([fetchCategorias(), getDataTable()]);
    setLoading(false);
  };

  // función para eliminar un elemento
  const handleDelete = async (id: number | string) => {
    await productoManufacturadoService.delete(id);
    dispatch(removeElementActive());
    reloadData();
  };

  // función para dar de baja o alta un elemento
  const handleCancelOrRegister = async (
    id: number | string,
    data: IProductoManufacturado
  ) => {
    await productoManufacturadoService.put(id, data);
    dispatch(removeElementActive());
    reloadData();
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Añadir Producto
          </Button>
        </div>
      </div>

      {!loading ? (
        <TableGeneric<IProductoManufacturado>
        handleDelete={handleDelete}
        columns={ColumnsProductosManufacturados(categorias)}
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
      {/* <PruebaManufacturadoModal         
        getData={reloadData}
        open={openModal}
        handleClose={handleCloseModal}
      /> */}
      <PruebaModal2         
        getData={reloadData}
        open={openModal}
        handleClose={handleCloseModal}
      />
    </div>
  );
};
