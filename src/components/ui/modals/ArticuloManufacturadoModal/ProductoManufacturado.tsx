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
import { TableInsumo } from "../../tables/TableInsumo/TableInsumo";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { IInsumo } from "../../../../types/IInsumo";
import { categorias } from "../../../../types/Icategorias";
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
    id: 5,
    eliminado: false,
    denominacion: "",
    descripcion: "",
    tiempoEstimadoMinutos: 10,
    precioVenta: 100,
    preparacion: "",
    unidadMedida: {
      id:4,
      eliminado:false,
      denominacion:"Porciones" //cambiar para poder elegir unidad medida producto
    },
    productoDetalle: [
    {
      id:0,
      eliminado:false,
      cantidad:1,
      insumo:{
        id:0,
        eliminado:false,
        denominacion:"Ingrediente",
        precioVenta:0,
        unidadMedida:{
          id:0,
          eliminado:false,
          denominacion:""
        },
        esParaElaborar:true
      }
    }
  ],
  };

  const initialIngredients: IProductoDetalle = {
    id: 0,
    eliminado: false,
    cantidad: 0,
    insumo: {
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
      },
  };

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const ProductoManufacturado: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {
  //======= PROPIEDADES ARTICULO MANUFACTURADO =========
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

  //============INGREDIENTES DEL ARTICULO MANUFACTURADO
  //contiene el estado de nuestra manera de agregar los ingredientes
  const [valueInsumos, setvaluesInsumo] = useState<IProductoDetalle>(initialIngredients);
  const resetValueInsumos = () => {
    setvaluesInsumo(initialIngredients);
  };

  const[insumos, setInsumos] = useState<IInsumo[]>();

  //realizamos el cambio del ingrediente actual
  const handleChangeInsumosValues = async (e: SelectChangeEvent) => {
    const { value } = e.target;
    const res = await insumosServices.getById(value).then((data) => data);
    if (res) setvaluesInsumo({ ...valueInsumos, insumo: res });
  };

  //realizamos el cambio de la cantidad del ingrediente
  const handleAmountInsumoValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setvaluesInsumo({ ...valueInsumos, cantidad: value });
  };

  //añadimos un nuevo ingrediente a nuestro articulo manufacturado
  const handleNewIngredient = () => {
    const newIngredient: IProductoDetalle = {
      ...valueInsumos,
      id: itemValue.productoDetalle.length + 1,
      cantidad: Number(valueInsumos.cantidad),
    };

    setItemValue((prev) => ({
      ...prev,
      productoDetalle: [...prev.productoDetalle, newIngredient],
    }));

    resetValueInsumos();
  };

  //eliminamos un ingrediente
  /* const deleteIngredient = (indice: number) => {
    setItemValue({
      ...itemValue,
      insumos: itemValue.productoDetalle.filter(
        (_el, index) => index !== indice
      ),
    });
  };
 */
  // eliminamos un ingrediente
const deleteIngredient = (indice: number) => {
    setItemValue((prev) => ({
      ...prev,
      productoDetalle: prev.productoDetalle.filter((_, index) => index !== indice),
    }));
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
      const parseNewId = { ...itemValue };
      console.log(parseNewId);
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

  const insumosServices = new InsumoServices(`${API_URL}/ArticuloInsumo`)

  const productoManufacturadoService = new ProductoManufacturadoService(
    `${API_URL}/ArticuloManufacturado`
  );

  //funciones para traer los elementos
  const getInsumos = async () => {
    await insumosServices.getAll().then((data) => {
      setInsumos(data);
    });
  };

  useEffect(() => {
    if (data) {
      setItemValue({
        id: data.id,
        eliminado: data.eliminado,
        denominacion: data.denominacion,
        descripcion: data.descripcion,
        tiempoEstimadoMinutos: data.tiempoEstimadoMinutos,
        precioVenta: data.precioVenta,
        preparacion: data.preparacion,
        unidadMedida: data.unidadMedida,
        productoDetalle: data.productoDetalle,
      });
      console.log("ID DE DATA: " + data.id);
      
    } else {
      resetValues();
    }
  }, [data]);

  // cuando entramos al componente si existe un elemento activo lo setea, si no carga los valores por defecto
  useEffect(() => {
    getInsumos();
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
                  value={itemValue.descripcion}
                  name="descripcion"
                  variant="filled"
                  multiline
                  rows={4}
                />

                
              </div>
            </div>
            <div>
              <div style={{ textAlign: "center" }}>
                <h1>Ingresa la preparacion</h1>
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
                  label="Forma de Preparacion"
                  type="text"
                  value={itemValue.preparacion}
                  onChange={handlePropsElementsInputs}
                  name="preparacion"
                  variant="filled"
                  multiline
                  rows={4}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h1>Insumos</h1>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "2vh",
                }}
              >
                {/* <Select
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
                </Select> */}

                <Select
                  variant="filled"
                  label="Ingrediente"
                  name="Ingrediente"
                  value={valueInsumos.insumo.id.toString()}
                  onChange={handleChangeInsumosValues}
                >
                  <MenuItem selected value={"0"}>
                    Insumo
                  </MenuItem>
                  {insumos?.map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.denominacion}
                    </MenuItem>
                  ))}
                </Select>
                {valueInsumos.insumo.denominacion !== "Ingrediente" && (
                  <TextField
                    type="text"
                    label={valueInsumos.insumo.unidadMedida.denominacion}
                    value={valueInsumos.insumo.unidadMedida.denominacion}
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
              {itemValue.productoDetalle.length > 0 && (
                <div className={styles.ingredientesTableContainerItem}>
                  <TableInsumo
                    dataIngredients={itemValue.productoDetalle}
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
