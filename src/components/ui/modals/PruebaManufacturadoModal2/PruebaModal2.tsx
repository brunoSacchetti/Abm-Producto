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
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { ProductoManufacturadoService } from "../../../../services/ProductoManufacturadoService";
import { InsumoServices } from "../../../../services/InsumoServices";
import { handleSuccess } from "../../../../helpers/alerts";
import ProductoPost from "../../../../types/typesPrueba/post/ProductoPost";
import { ProductoDetalleService } from "../../../../services/ProductoDetalleService";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import IUnidadMedida from "../../../../types/IUnidadMedida";
import { ICategoria } from "../../../../types/ICategoria";
import { CategoriaService } from "../../../../services/CategoriaService";
import { InsumosModal } from "./InsumosModal"; // Importamos el modal secundario
import { TablePruebaModal2 } from "../../tables/TablePruebaModal2/TablePruebaModal2";

const API_URL = import.meta.env.VITE_API_URL;

const initialValues: ProductoPost = {
  id: 0,
  denominacion: "",
  descripcion: "",
  tiempoEstimadoMinutos: 10,
  precioVenta: 100,
  preparacion: "",
  idUnidadMedida: 1,
  idsArticuloManufacturadoDetalles: [],
};

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const PruebaModal2: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {
  const [itemValue, setItemValue] = useState<ProductoPost>(initialValues);
  const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] =
    useState<number>(1);
  const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);
  const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);
  const [categoria, setCategoria] = useState<ICategoria[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(1);
  const [openInsumosModal, setOpenInsumosModal] = useState<boolean>(false); // Estado para controlar el modal de insumos
  const [dataIngredients, setDataIngredients] = useState<any[]>([]); // Datos de insumos

  const unidadMedidaService = new UnidadMedidaService(
    `${API_URL}/UnidadMedida`
  );
  const productoManufacturadoService = new ProductoManufacturadoService(
    `${API_URL}/ArticuloManufacturado`
  );
  const productoDetalleService = new ProductoDetalleService(
    `${API_URL}/ArticuloManufacturadoDetalle`
  );
  const insumosServices = new InsumoServices(`${API_URL}/ArticuloInsumo`);
  const categoriaService = new CategoriaService(`${API_URL}/categoria`);

  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.tablaReducer.elementActive);

  const getUnidadMedida = async () => {
    try {
      const data = await unidadMedidaService.getAll();
      setUnidadMedida(data);
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
    }
  };

  const getCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const getInsumos = async () => {
    try {
      const data = await insumosServices.getAll();
      const insumosNoElaborar = data.filter((insumo) => insumo.esParaElaborar);
      setDataIngredients(
        insumosNoElaborar.map((insumo) => ({
          cantidad: 0,
          insumo: insumo,
        }))
      );
    } catch (error) {
      console.error("Error al obtener insumos:", error);
    }
  };

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
      setSelectedUnidadMedidaId(productoData.idUnidadMedida);
    } else {
      resetValues();
    }
  }, [data]);

  useEffect(() => {
    if (open) {
      getInsumos();
      getUnidadMedida();
      getCategorias();
    }
  }, [open]);

  const resetValues = () => {
    setItemValue(initialValues);
    setSelectedDetalle([]);
  };

  const handlePropsElementsInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setItemValue({
      ...itemValue,
      [name]: value,
    });
  };

  const handleConfirmModal = async () => {
    try {
      let productoId: number;
      let detallesIds: number[] = [];

      if (data) {
        await productoManufacturadoService.put(itemValue.id, itemValue);
        productoId = itemValue.id;
      } else {
        const newProducto = await productoManufacturadoService.post(itemValue);
        productoId = newProducto.id;
      }

      await categoriaService.addArticuloManufacturado(
        selectedCategoriaId,
        productoId
      );

      await Promise.all(
        selectedDetalle.map(async (detalle) => {
          const newDetalle = {
            id: 0,
            cantidad: detalle.cantidad,
            idArticuloInsumo: detalle.id,
            idArticuloManufacturado: productoId,
          };
          const createdDetalle = await productoDetalleService.post(newDetalle);
          detallesIds.push(createdDetalle.id);
        })
      );

      await productoManufacturadoService.put(productoId, {
        ...itemValue,
        idsArticuloManufacturadoDetalles: detallesIds,
      });

      handleSuccess("Elemento guardado correctamente");
      handleClose();
      resetValues();
      getData();
      getUnidadMedida();
      getInsumos();
      dispatch(removeElementActive());
    } catch (error) {
      console.error("Error al confirmar modal:", error);
    }
  };

  const handleTableIngredientSelect = (selectedData: any) => {
    const filteredData = selectedData.map((item: any) => ({
      id: item.id,
      cantidad: item.cantidad,
      denominacion: item.denominacion,
    }));
    setSelectedDetalle(filteredData);
  };

  const handleChangeUnidadMedidaValues = async (
    e: SelectChangeEvent<number>
  ) => {
    const unidadMedidaId = e.target.value as number;
    setSelectedUnidadMedidaId(unidadMedidaId);
    setItemValue({
      ...itemValue,
      idUnidadMedida: unidadMedidaId,
    });
  };

  const handleChangeCategoriaValues = async (e: SelectChangeEvent<number>) => {
    const categoriaId = e.target.value as number;
    setSelectedCategoriaId(categoriaId);
  };

  const handleOpenInsumosModal = () => {
    setOpenInsumosModal(true);
  };

  const handleCloseInsumosModal = () => {
    setOpenInsumosModal(false);
  };

  const handleAddInsumos = (selectedInsumos: any[]) => {
    setSelectedDetalle([...selectedDetalle, ...selectedInsumos]);
    handleCloseInsumosModal();
  };
  
  const handleRemoveInsumo = (id: number) => {
    const updatedDetalle = selectedDetalle.filter(
      (detalle) => detalle.id !== id
    );
    setSelectedDetalle(updatedDetalle);
  };

  console.log(selectedDetalle);
  

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
              <h1>{data ? "Editar" : "Crear"} un producto manufacturado</h1>
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
              <h1>Categoria</h1>
              <Select
                label="Categoria"
                value={selectedCategoriaId ?? ""}
                onChange={handleChangeCategoriaValues}
                variant="filled"
              >
                {categoria.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.denominacion}
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenInsumosModal}
                >
                  Agregar Insumos
                </Button>
              </div>
            </div>
            
            <div className={styles.ingredientesTableContainer}>
              {selectedDetalle.length > 0 ? (
                <div className={styles.ingredientesTableContainerItem}>
                  <TablePruebaModal2
                    dataIngredients={selectedDetalle.map((detalle, index) => ({
                      id: index + 1,
                      ...detalle.insumo,
                      cantidad: detalle.cantidad,
                    }))}
                    //onSelect={handleTableIngredientSelect}
                  />
                </div>
              ) : (
                <div>No hay insumos agregados</div>
              )}
            </div>


            <div className={styles.ingredientesTableContainer}>
              {selectedDetalle.length > 0 ? (
                <div className={styles.ingredientesTableContainerItem}>
                  {selectedDetalle.map((detalle) => (
                    <div key={detalle.id} className={styles.ingredientItem}>
                      <span className={styles.ingredientName}>
                        {detalle.denominacion}
                      </span>
                      <span className={styles.ingredientQuantity}>
                        {detalle.cantidad}
                      </span>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRemoveInsumo(detalle.id)}
                      >
                        Quitar
                      </Button>
                    </div>
                  ))}
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
      <InsumosModal
        open={openInsumosModal}
        handleClose={handleCloseInsumosModal}
        handleAddInsumos={handleAddInsumos} // Cambiar 'onConfirm' a 'handleAddInsumos'
      />
    </div>
  );
};
