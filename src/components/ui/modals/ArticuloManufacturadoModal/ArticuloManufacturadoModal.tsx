import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import styles from "./MasterDetailModal.module.css";
import { TableIngredients } from "../../tables/TableIngredients/TableIngredients";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { IInsumo } from "../../../../types/IInsumo";
import { categorias } from "../../../../types/ICategoria";
import { CategoriaComidaService } from "../../../../services/CategoriaComidaService";
import { ProductoManufacturadoService } from "../../../../services/ProductoManufacturadoService";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { InsumoServices } from "../../../../services/InsumosServices";
import IProducto from "../../../../types/IProductoManufacturado";
import { handleSuccess } from "../../../../helpers/alerts";
import IProductoDetalle from "../../../../types/IProductoDetalle";

const API_URL = import.meta.env.VITE_API_URL;
//valores iniciales del modal
const initialValues: IProducto = {
  id: 0,
  eliminado: false,
  denominacion: "",
  descripcion: "",
  tiempoEstimadoMinutos: 10,
  precioVenta: 100,
  preparacion: "",
  unidadMedida: {
    id: 0,
    eliminado: false,
    denominacion: "Pizzas", //cambiar para poder elegir unidad medida producto
  },
  productoDetalle: [
    {
      id: 0,
      eliminado: false,
      cantidad: 1,
      insumo: {
        id: 0,
        eliminado: false,
        denominacion: "Ingrediente",
        precioVenta: 0,
        unidadMedida: {
          id: 0,
          eliminado: false,
          denominacion: "",
        },
        esParaElaborar: true,
      },
    },
  ],
};
const initialIngredients: IInsumo = {
  id: 0,
  eliminado: false,
  denominacion: "",
  precioVenta: 0,
  unidadMedida: {
    id: 0,
    eliminado: false,
    denominacion: "",
  },
  esParaElaborar: true,
};

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const ArticuloManufacturadoModal: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {
  //======= PROPIEDADES ARTICULO MANUFACTURADO=========
  const [itemValue, setItemValue] = useState(initialValues); //state del articulo manufacturado

  const resetValues = () => {
    setItemValue(initialValues);
  };

  //maneja los cambios de los inputs del articulo manufacturado (nombre, precio, tiempo, descripcion, receta)
  const handlePropsElementsInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const copyValues = { ...itemValue };

    setItemValue({
      ...copyValues,
      [`${name}`]: value,
    });
  };

  //traemos categorias del apartado comida
  //const [categoriaComidas, setcategoriaComidas] = useState<categorias[]>([]);

  //ACA TRAEMOS TODAS LOS PRODUCTOS MANUFACTURADOS (esInsumo= FALSE)
  /* const handleChangeCategorieArticuloManufacturado = async (
    e: SelectChangeEvent
  ) => {
    const idDenominacion = parseInt(e.target.value);

    try {
      const response = await fetch("http://localhost:8080/categorias");
      const data = await response.json();

      const categoriaEncontrada = data.find(
        (categoria: categorias) => categoria.id === idDenominacion
      );
      //1 objeto el cual seleccionamos
      if (categoriaEncontrada && !categoriaEncontrada.esInsumo) {
        setItemValue({ ...itemValue, categoria: categoriaEncontrada });
      } else {
        console.log("La categoría no es válida o es un insumo.");
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  }; */

  //============INGREDIENTES DEL ARTICULO MANUFACTURADO
  //contiene el estado de nuestra manera de agregar los ingredientes
  const [valueInsumos, setvaluesInsumo] = useState<IInsumo>(initialIngredients);
  const resetValueInsumos = () => {
    setvaluesInsumo(initialIngredients);
  };
  //trae las categorias del apartado insumos
  //const [insumosCategories, setInsumosCategories] = useState<categorias[]>([]);

  //seleccionamos una categoria del apartado insumos y se setean todos los ingredientes que vayan con ella
  /* const handleChangeinsumosCategories = async (e: SelectChangeEvent) => {
    try {
      const response = await fetch("http://localhost:8080/categorias");
      const data = await response.json();

      // Filtrar las categorías que tienen esInsumo igual a true
      const insumosCategorias = data.filter(
        (categoria: categorias) => categoria.esInsumo
      );

      // Filtrar las subcategorías que tienen esInsumo igual a true
      const subCategoriasInsumo: any[] = data.reduce(
        (acc: categorias[], categoria: categorias) => {
          acc.push(
            ...categoria.subCategorias.filter(
              (subCategoria: categorias) => subCategoria.esInsumo
            )
          );
          return acc;
        },
        []
      );

      // Obtener las denominaciones de las categorías y subcategorías filtradas
      const denominaciones: string[] = [
        ...insumosCategorias,
        ...subCategoriasInsumo,
      ].map((item: any) => item.denominacion);
      console.log(denominaciones);

      const denominacion: string = e.target.value;
      setvaluesInsumo({ ...initialIngredients, categoriaInsumo: denominacion });

      const result = insumosCategorias.filter(
        (el: any) => el.denominacion === denominacion
      );
      setInsumosByCategorie(result);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      // Manejar el error de la petición HTTP o de parseo JSON.
    }
  }; */

  //estado que almacena ingredientes segun la categoria activa
  //const [insumosByCategorie, setInsumosByCategorie] = useState<IInsumo[]>([]);

  //realizamos el cambio del ingrediente actual
  const handleChangeInsumosValues = async (e: SelectChangeEvent) => {
    const { value } = e.target;
    const res = await insumosServices.getById(value).then((data) => data);
    if (res) setvaluesInsumo({ ...valueInsumos, insumo: res });
  };

  //realizamos el cambio de la cantidad del ingrediente
  const handleAmountInsumoValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setvaluesInsumo({ ...valueInsumos, cantidad: parseInt(value) });
    console.log(value);
  };

  //añadimos un nuevo ingrediente a nuestro articulo manufacturado
  /* const handleNewIngredient = () => {
    const parse = {
      ...valueInsumos.ingrediente,
      id: itemValue.idsArticuloManufacturadoDetalles.length + 1,
      cantidad: Number(valueInsumos.cantidad),
    };
    setItemValue({
      ...itemValue,
      idsArticuloManufacturadoDetalles: [...itemValue.idsArticuloManufacturadoDetalles, parse],
    });
    resetValueInsumos();
    setInsumosByCategorie([]);
  }; */
  const handleNewIngredient = () => {
    // Generamos un nuevo detalle de producto manufacturado
    const newIngredientDetail: IProductoDetalle = {
      id: itemValue.idsArticuloManufacturadoDetalles.length + 1, // Generamos un nuevo ID
      eliminado: false, // Por defecto no está eliminado
      cantidad: valueInsumos.cantidad, // Asignamos la cantidad
      insumo: valueInsumos.insumo, // Asignamos el insumo seleccionado
    };

    // Creamos una copia del arreglo de detalles actual
    const updatedDetails = [...itemValue.idsArticuloManufacturadoDetalles];

    // Agregamos el ID del nuevo detalle al arreglo
    updatedDetails.push(newIngredientDetail.id);

    // Actualizamos el estado con el nuevo arreglo de detalles
    setItemValue({
      ...itemValue,
      idsArticuloManufacturadoDetalles: updatedDetails,
    });

    // Reiniciamos el estado de los valores de insumos para preparar el próximo ingreso
    resetValueInsumos();
  };
  //eliminamos un ingrediente
  const deleteIngredient = (indice: number) => {
    setItemValue({
      ...itemValue,
      idsArticuloManufacturadoDetalles:
        itemValue.idsArticuloManufacturadoDetalles.filter(
          (_el, index) => index !== indice
        ),
    });
  };

  //========LOGICA DEL MODAL==================
  //TODO: NO HACER
  const amountItems = useAppSelector(
    (state) => state.tablaReducer.dataTable.length
  );
  //si se confirma edita o agrega un nuevo elemento
  const handleConfirmModal = async () => {
    if (data) {
      await productoManufacturadoService.put(data.id, itemValue);
    } else {
      const itemsValue = { ...itemValue };
      await productoManufacturadoService.post(itemsValue);
    }
    handleSuccess("Elemento guardado correctamente");
    handleClose();
    resetValues();
    getData(); //trae nuevamente los elementos
    dispatch(removeElementActive()); //remueve el activo
  };

  //======== REDUX ==================

  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.tablaReducer.elementActive);

  //========SERVICIOS==================

  const categoriaComidaService = new CategoriaComidaService(
    `${API_URL}/categorias`
  );

  const categoriaInsumosService = new CategoriaComidaService(
    `${API_URL}/categorias`
  );

  const productoManufacturadoService = new ProductoManufacturadoService(
    `${API_URL}/ArticuloManufacturado`
  );

  const insumosServices = new InsumoServices(`${API_URL}/ArticuloInsumo`);

  useEffect(() => {
    if (data) {
      const productoData: IProducto = data as IProducto; // Realiza un cast a IProducto
      setItemValue({
        id: productoData.id,
        categoria: productoData.categoria,
        denominacion: productoData.denominacion,
        alta: productoData.alta,
        precioVenta: productoData.precioVenta,
        tiempoEstimadoMinutos: productoData.tiempoEstimadoMinutos,
        descripcion: productoData.descripcion,
        preparacion: productoData.preparacion,
        idsArticuloManufacturadoDetalles:
          productoData.idsArticuloManufacturadoDetalles,
        unidadMedida: productoData.unidadMedida,
        eliminado: productoData.eliminado,
      });
    } else {
      resetValues();
    }
  }, [data]);

  // cuando entramos al componente si existe un elemento activo lo setea, si no carga los valores por defecto
  useEffect(() => {
    getCategories();
    getCategoriasInsumos();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        style={{ zIndex: 200 }}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalContainerContent}>
            <div style={{ textAlign: "center" }}>
              <h1>{`${
                data ? "Editar" : "Crear"
              } un producto manufacturado`}</h1>
            </div>

            <div className={styles.productContainer}>
              <div className={styles.productContainerInputs}>
                {/* <Select
                  variant="filled"
                  value={itemValue.categoria.id.toString()}
                  onChange={handleChangeCategorieArticuloManufacturado}
                >
                  <MenuItem selected value={"0"}>
                    Seleccione una categoria
                  </MenuItem>
                  {categoriaComidas.map(
                    (el, index) =>
                      el.esInsumo === false && (
                        <MenuItem
                          key={index}
                          id={`${el.id}`}
                          value={`${el.id}`}
                        >
                          {el.denominacion}
                        </MenuItem>
                      )
                  )}
                </Select> */}
                <TextField
                  label="Nombre"
                  type="text"
                  name="denominacion"
                  onChange={handlePropsElementsInputs}
                  value={itemValue.denominacion}
                  variant="filled"
                />
                <TextField
                  type="number"
                  value={itemValue.precioVenta}
                  onChange={handlePropsElementsInputs}
                  name="precioVenta"
                  label="Precio"
                  variant="filled"
                  defaultValue={0}
                />
                <TextField
                  type="number"
                  onChange={handlePropsElementsInputs}
                  name="tiempoEstimadoMinutos"
                  value={itemValue.tiempoEstimadoMinutos}
                  label="Tiempo estimado de preparacion"
                  variant="filled"
                  defaultValue={0}
                />
                <TextField
                  onChange={handlePropsElementsInputs}
                  label="Descripción"
                  type="text"
                  value={itemValue.descripción}
                  name="descripción"
                  variant="filled"
                  multiline
                  rows={4}
                />
              </div>
            </div>
            <div>
              <div style={{ textAlign: "center" }}>
                <h1>Ingresa la receta</h1>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "2vh",
                }}
              >
                <TextField
                  style={{ width: "90%" }}
                  label="Receta"
                  type="text"
                  value={itemValue.receta}
                  onChange={handlePropsElementsInputs}
                  name="receta"
                  variant="filled"
                  multiline
                  rows={4}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h1>Ingredientes</h1>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "2vh",
                }}
              >
                <Select
                  variant="filled"
                  value={valueInsumos.categoriaInsumo}
                  label="Categoria"
                  onChange={handleChangeinsumosCategories}
                >
                  <MenuItem selected value={"Categoria"}>
                    Categoria
                  </MenuItem>
                  {insumosCategories.map((el, index) => (
                    <MenuItem key={index} value={el.denominacion}>
                      {el.denominacion}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  variant="filled"
                  label="Ingrediente"
                  name="Ingrediente"
                  value={valueInsumos.insumo.id.toString()}
                  onChange={handleChangeInsumosValues}
                >
                  <MenuItem selected value={"0"}>
                    Ingrediente
                  </MenuItem>
                  {insumosByCategorie.map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.denominacion}
                    </MenuItem>
                  ))}
                </Select>
                {valueInsumos.insumo.denominacion !== "Ingrediente" && (
                  <TextField
                    type="text"
                    label={valueInsumos.insumo.denominacion}
                    value={valueInsumos.insumo.unidadMedida.denominacion.toString()}
                    variant="filled"
                    disabled
                  />
                )}
                <TextField
                  type="number"
                  name="cantidad"
                  label="IngreseCantidad"
                  onChange={handleAmountInsumoValue}
                  value={valueInsumos.cantidad}
                  variant="filled"
                  defaultValue={10}
                />
                <Button onClick={handleNewIngredient} variant="text">
                  Añadir
                </Button>
              </div>
            </div>

            <div className={styles.ingredientesTableContainer}>
              {itemValue.idsArticuloManufacturadoDetalles.length > 0 && (
                <div className={styles.ingredientesTableContainerItem}>
                  <TableIngredients
                    dataIngredients={itemValue.idsArticuloManufacturadoDetalles}
                    handleDeleteItem={deleteIngredient}
                  />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Button variant="contained" color="error" onClick={handleClose}>
                  Cerrar Modal
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmModal}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
