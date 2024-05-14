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
import { categorias } from "../../../../types/Icategorias";
import { CategoriaComidaService } from "../../../../services/CategoriaComidaService";
import { ProductoManufacturadoService } from "../../../../services/ProductoManufacturadoService";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { InsumoServices } from "../../../../services/InsumosServices";
import { IProductoManufacturado } from "../../../../types/IProductoManufacturado";
import { handleSuccess } from "../../../../helpers/alerts";

const API_URL = import.meta.env.VITE_API_URL;
//valores iniciales del modal
const initialValues: IProductoManufacturado = {
  id: "0",
  alta: true,
  categoria: {
    id: "0",
    denominacion: "Seleccione una categoria",
    categorias_hijas: null,
  },
  denominacion: "",
  precioVenta: 100,
  tiempoEstimadoMinutos: 10,
  descripción: "",
  receta: "",
  ingredientes: [],
};
const initialIngredients = {
  categoriaInsumo: "Categoria",
  ingrediente: {
    id: "0",
    denominacion: "Ingrediente",
    unidadMedida: {
      id: 1,
      denominacion: "",
      abreviatura: "",
    },
    categoria: {
      id: 1,
      denominacion: "",
    },
    cantidad: 0,
  },
  cantidad: 1,
};

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const MasterDetailModal: FC<IMasterDetailModal> = ({
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
  const [categoriaComidas, setcategoriaComidas] = useState<categorias[]>([]);

  //realizamos el cambio de categoria en articuloManufacturado TODO: REVISAR Otra alternativa a mui
  const handleChangeCategorieArticuloManufacturado = async (
    e: SelectChangeEvent
  ) => {
    const denominacion = e.target.value;
    const res = await categoriaComidaService
      .getById(denominacion)
      .then((data) => data);
    if (res) {
      setItemValue({ ...itemValue, categoria: res });
    }
  };

  //============INGREDIENTES DEL ARTICULO MANUFACTURADO
  //contiene el estado de nuestra manera de agregar los ingredientes
  const [valueInsumos, setvaluesInsumo] = useState<any>(initialIngredients);
  const resetValueInsumos = () => {
    setvaluesInsumo(initialIngredients);
  };
  //trae las categorias del apartado insumos
  const [insumosCategories, setInsumosCategories] = useState<categorias[]>([]);

  //seleccionamos una categoria del apartado insumos y se setean todos los ingredientes que vayan con ella
  const handleChangeinsumosCategories = async (e: SelectChangeEvent) => {
    const insumos = await insumosServices.getAll().then((data) => data);
    const denominacion = e.target.value;
    setvaluesInsumo({ ...initialIngredients, categoriaInsumo: denominacion });
    const result = insumos.filter(
      (el) => el.categoria.denominacion === denominacion
    );
    setInsumosByCategorie(result);
  };

  //estado que almacena ingredientes segun la categoria activa
  const [insumosByCategorie, setInsumosByCategorie] = useState<IInsumo[]>([]);

  //realizamos el cambio del ingrediente actual
  const handleChangeInsumosValues = async (e: SelectChangeEvent) => {
    const { value } = e.target;
    const res = await insumosServices.getById(value).then((data) => data);
    if (res) setvaluesInsumo({ ...valueInsumos, ingrediente: res });
  };

  //realizamos el cambio de la cantidad del ingrediente
  const handleAmountInsumoValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setvaluesInsumo({ ...valueInsumos, cantidad: value });
  };

  //añadimos un nuevo ingrediente a nuestro articulo manufacturado
  const handleNewIngredient = () => {
    const parse = {
      ...valueInsumos.ingrediente,
      id: itemValue.ingredientes.length + 1,
      cantidad: parseInt(valueInsumos.cantidad),
    };
    setItemValue({
      ...itemValue,
      ingredientes: [...itemValue.ingredientes, parse],
    });
    resetValueInsumos();
    setInsumosByCategorie([]);
  };

  //eliminamos un ingrediente
  const deleteIngredient = (indice: number) => {
    setItemValue({
      ...itemValue,
      ingredientes: itemValue.ingredientes.filter(
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
      const parseNewId = { ...itemValue, id: `${amountItems + 1}` };
      await productoManufacturadoService.post(parseNewId);
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
    `${API_URL}/categorias_comida`
  );

  const categoriaInsumosService = new CategoriaComidaService(
    `${API_URL}/categorias_insumos`
  );

  const productoManufacturadoService = new ProductoManufacturadoService(
    `${API_URL}/producto_manufacturado`
  );

  const insumosServices = new InsumoServices(`${API_URL}/insumos`);

  //funciones para traer los elementos
  const getCategoriasInsumos = async () => {
    await categoriaInsumosService.getAll().then((data) => {
      setInsumosCategories(data);
    });
  };

  const getCategories = async () => {
    await categoriaComidaService.getAll().then((data) => {
      setcategoriaComidas(data);
    });
  };

  useEffect(() => {
    if (data) {
      setItemValue({
        id: data.id,
        categoria: data.categoria,
        denominacion: data.denominacion,
        alta: data.alta,
        precioVenta: data.precioVenta,
        tiempoEstimadoMinutos: data.tiempoEstimadoMinutos,
        descripción: data.descripción,
        receta: data.receta,
        ingredientes: data.ingredientes,
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
                <Select
                  variant="filled"
                  value={itemValue.categoria.id}
                  onChange={handleChangeCategorieArticuloManufacturado}
                >
                  <MenuItem selected value={"0"}>
                    Seleccione una categoria
                  </MenuItem>
                  {categoriaComidas.map((el, index) => (
                    <MenuItem key={index} id={`${el.id}`} value={`${el.id}`}>
                      {el.denominacion}
                    </MenuItem>
                  ))}
                </Select>
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
                  value={valueInsumos.ingrediente.id}
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
                {valueInsumos.ingrediente.denominacion !== "Ingrediente" && (
                  <TextField
                    type="text"
                    label={valueInsumos.ingrediente.unidadMedida.denominacion}
                    value={valueInsumos.ingrediente.unidadMedida.abreviatura}
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
              {itemValue.ingredientes.length > 0 && (
                <div className={styles.ingredientesTableContainerItem}>
                  <TableIngredients
                    dataIngredients={itemValue.ingredientes}
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
