//#region IMPORTS
import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import styles from "./MasterDetailModal.module.css";
import { TableIngredients } from "../../tables/TableIngredients/TableIngredients";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { ProductoManufacturadoService } from "../../../../services/ProductoManufacturadoService";
import { InsumoServices } from "../../../../services/InsumosServices";
import { handleSuccess } from "../../../../helpers/alerts";
/* import IProductoDetalle from "../../../../types/IProductoDetalle"; */
import ProductoPost from "../../../../types/typesPrueba/post/ProductoPost";
import { IInsumo } from "../../../../types/IInsumo";
import { ProductoDetalleService } from "../../../../services/ProductoDetalleService";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import IUnidadMedida from "../../../../types/IUnidadMedida";

const API_URL = import.meta.env.VITE_API_URL;
//#endregion

const initialValues: ProductoPost = {
  id: 0,
  denominacion: "",
  descripcion: "",
  tiempoEstimadoMinutos: 10,
  precioVenta: 100,
  preparacion: "",
  idUnidadMedida: 4,
  idsArticuloManufacturadoDetalles: [],
};

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const PruebaManufacturadoModal: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {
  
  //#region States                                                                                                
  const [itemValue, setItemValue] = useState<ProductoPost>(initialValues);
  const [selectedInsumoId, setSelectedInsumoId] = useState<number | null>(null);
  const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] = useState<number | null>(null); //SELECTED UNIDAD MEDIDA ID 
  const [cantidadInsumo, setCantidadInsumo] = useState<number>(0);
  const [unidadMedidaInsumo, setUnidadMedidaInsumo] = useState<string>("N/A");
  const [dataIngredients, setDataIngredients] = useState<any[]>([]);
  const [insumos, /* setInsumos */] = useState<IInsumo[]>([]);
  const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);
  const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);
/* TODOS LOS SERVICES */
  const unidadMedidaService = new UnidadMedidaService(`${API_URL}/UnidadMedida`);
  const productoManufacturadoService = new ProductoManufacturadoService(`${API_URL}/ArticuloManufacturado`);
  const productoDetalleService = new ProductoDetalleService(`${API_URL}/ArticuloManufacturadoDetalle`);
  const insumosServices = new InsumoServices(`${API_URL}/ArticuloInsumo`);
  //#endregion
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.tablaReducer.elementActive);

  //#region GetAllUnidadMedida-Insumos
  const getUnidadMedida = async () => {
    try {
      const data = await unidadMedidaService.getAll();
      setUnidadMedida(data);
    } catch (error) {
      console.error("Error al obtener insumos:", error);
    }
  };
  //GET ALL INSUNMOS
  const getInsumos = async () => {
    try {
      const data = await insumosServices.getAll();
      setDataIngredients(
        data.map((insumo) => ({
          cantidad: 0,
          insumo: insumo,
        }))
      );
    } catch (error) {
      console.error("Error al obtener insumos:", error);
    }
  };
//#endregion
  
  //#region UseEffect SetData And GetData[] methods
useEffect(() => {
    if (data) {
      const productoData: ProductoPost = data as ProductoPost;
      setItemValue({
        id: productoData.id,
        denominacion: productoData.denominacion,
        precioVenta: productoData.precioVenta,
        tiempoEstimadoMinutos: productoData.tiempoEstimadoMinutos,
        descripcion: productoData.descripcion,
        preparacion: productoData.preparacion,
        idsArticuloManufacturadoDetalles:
          productoData.idsArticuloManufacturadoDetalles,
        idUnidadMedida: productoData.idUnidadMedida,
      });
      setSelectedUnidadMedidaId(productoData.idUnidadMedida); //PARA SETEAR EL ID DE UNIDAD DE
    } else {
      resetValues();
    }
  }, [data]);

  useEffect(() => {
    getInsumos();
    getUnidadMedida();
  }, [,dataIngredients]);
  //#endregion
  
  //#region ResetValues

  const resetValues = () => {
    setItemValue(initialValues);
    setSelectedInsumoId(null);
    setCantidadInsumo(0);
    setUnidadMedidaInsumo("N/A");
    setDataIngredients([]);
  };
//#endregion
  

const handlePropsElementsInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setItemValue({
      ...itemValue,
      [name]: value,
    });
  };

  const handleAmountInsumoValue = (e: ChangeEvent<HTMLInputElement>) => {
    const cantidad = parseInt(e.target.value);
    setCantidadInsumo(cantidad);
  };

  /* const handleNewIngredient = () => {
    if (selectedInsumoId !== null && cantidadInsumo > 0) {
      const selectedInsumo = insumos.find(
        (insumo) => insumo.id === selectedInsumoId
      );
      if (selectedInsumo) {
        const newDetalle = {
          cantidad: cantidadInsumo,
          insumo: selectedInsumo,
        };
        setDataIngredients([...dataIngredients, newDetalle]);
        setSelectedInsumoId(null);
        setCantidadInsumo(0);
        setUnidadMedidaInsumo("N/A");
      }
    }
  }; */

  //#region CONFIRMACION-ENVIO
  const handleConfirmModal = async () => {
    try {
      let productoId: number;
      let detallesIds: number[] = []; // Array para almacenar los IDs de los detalles
  
      // Verificar si el producto ya existe o es nuevo
      if (data) {
        // Si el producto ya existe, actualizamos sus detalles
        await productoManufacturadoService.put(itemValue.id, itemValue);
        productoId = itemValue.id;
      } else {
        // Si el producto es nuevo, lo creamos y obtenemos su ID
        const newProducto = await productoManufacturadoService.post(itemValue);
        productoId = newProducto.id;
      }
  
      // Guardar los detalles de los insumos y obtener sus IDs de la base de datos
      await Promise.all(
        selectedDetalle.map(async (detalle) => {
          const newDetalle = {
            id: 0,
            cantidad: detalle.cantidad,
            idArticuloInsumo: detalle.id, // Usar el ID del insumo desde selectedDetalle
            idArticuloManufacturado: productoId, // Asignar el ID del producto
          };
          const createdDetalle = await productoDetalleService.post(newDetalle);
          detallesIds.push(createdDetalle.id); // Almacenar el ID del detalle
        })
      );
  
      // Asignar los IDs de los detalles al producto principal
      await productoManufacturadoService.put(productoId, {
        ...itemValue,
        idsArticuloManufacturadoDetalles: detallesIds, // Usar los IDs de los detalles
      });
  
      handleSuccess("Elemento guardado correctamente");
      handleClose();
      resetValues();
      getData();
      getUnidadMedida();
      dispatch(removeElementActive());
      getInsumos();
    } catch (error) {
      console.error("Error al confirmar modal:", error);
    }
  };
  //#endregion

  /* const deleteIngredient = (indice: number) => {
    setDataIngredients(
      dataIngredients.filter((_el, index) => index !== indice)
    );
  }; */

  const handleTableIngredientSelect = (selectedData: any) => {
    // Filtrar datos necesarios de cada objeto en el array
    const filteredData = selectedData.map((item: any) => ({
      id: item.id,
      cantidad: item.cantidad,
      denominacion: item.denominacion
    }));
    // Setear el estado con los datos filtrados
    setSelectedDetalle(filteredData);
  };

  // #region HandleChangeEventIngredientesUnidadMedida
  
const handleChangeInsumosValues = async (e: SelectChangeEvent<number>) => {
    const insumoId = e.target.value as number;
    setSelectedInsumoId(insumoId);
    const selectedInsumo = insumos.find((insumo) => insumo.id === insumoId);
    if (selectedInsumo) {
      setUnidadMedidaInsumo(selectedInsumo.unidadMedida.denominacion);
    }
  };

  const handleChangeUnidadMedidaValues = async (e: SelectChangeEvent<number>) => {
    const unidadMedidaId = e.target.value as number;
    setSelectedUnidadMedidaId(unidadMedidaId);
    setItemValue({
      ...itemValue,
      idUnidadMedida: unidadMedidaId,
    });
  };
// #endregion HandleChangeEvent
  
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
              <h1>Unidad De Medida</h1>
               <Select
              label="Unidad de Medida"
              value={selectedUnidadMedidaId ?? ""}
              onChange={handleChangeUnidadMedidaValues}
              variant="filled"
            >
              {unidadMedida.map((unidad) => (
                <MenuItem key={unidad.id} value={unidad.id}>
                  {unidad.denominacion}
                </MenuItem>
              ))}
            </Select>
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
                  label="Receta"
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
                <Select
                  variant="filled"
                  label="Ingrediente"
                  name="Ingrediente"
                  value={selectedInsumoId ?? ""}
                  onChange={handleChangeInsumosValues}
                >
                  <MenuItem value={""} disabled>
                    Insumo
                  </MenuItem>
                  {insumos.map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.denominacion}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  type="text"
                  label={unidadMedidaInsumo}
                  value={unidadMedidaInsumo}
                  variant="filled"
                  disabled
                />
                <TextField
                  type="number"
                  name="cantidad"
                  label="IngreseCantidad"
                  onChange={handleAmountInsumoValue}
                  value={cantidadInsumo}
                  variant="filled"
                  defaultValue={10}
                />
{/*                 <Button onClick={handleNewIngredient} variant="text">
                  Añadir
                </Button> */}
              </div>
            </div>
            <div className={styles.ingredientesTableContainer}>
              {dataIngredients.length > 0 ? (
                <div className={styles.ingredientesTableContainerItem}>
                  <TableIngredients
                    dataIngredients={dataIngredients.map((detalle, index) => ({
                      id: index + 1,
                      ...detalle.insumo,
                      cantidad: detalle.cantidad,
                    }))}
/*                     handleDeleteItem={deleteIngredient} */
                    onSelect={handleTableIngredientSelect} // Pasa la función de devolución de llamada
                  />
                </div>
              ) : (
                <div>No hay insumos agregados</div>
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
