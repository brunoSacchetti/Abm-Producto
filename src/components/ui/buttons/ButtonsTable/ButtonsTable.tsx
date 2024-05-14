import { Button } from "@mui/material";
import { useAppDispatch } from "../../../../hooks/redux";
import { setElementActive } from "../../../../redux/slices/TablaReducer";
import { IProductoManufacturado } from "../../../../types/IProductoManufacturado";
import { handleConfirm } from "../../../../helpers/alerts";

// Interfaz para los props del componente
interface IButtonsTable {
  el: IProductoManufacturado; // Elemento de tipo IPersona
  handleDelete: (id: number | string) => void; // Función para manejar la eliminación de un elemento
  setOpenModal: (state: boolean) => void; // Función para manejar la eliminación de un elemento
  handleCancelOrRegister: (
    id: number | string,
    el: IProductoManufacturado
  ) => void;
}

export const ButtonsTable = ({
  el,
  handleDelete,
  setOpenModal,
  handleCancelOrRegister,
}: IButtonsTable) => {
  const dispatch = useAppDispatch();

  // Función para manejar la selección del modal para editar
  const handleModalSelected = () => {
    // Establecer el elemento activo en el estado
    dispatch(setElementActive({ element: el }));
    // Mostrar el modal para editar el elemento
    setOpenModal(true);
  };

  // Función para manejar la eliminación de un elemento
  const handleDeleteItem = () => {
    const handleDeleteElement = () => {
      handleDelete(el.id); // Llamar a la función handleDelete con el ID del elemento
    };
    handleConfirm(
      "Seguro quieres eliminar el articulo manufacturado",
      handleDeleteElement
    );
  };

  const handleChangeRegisterOrCancelItem = () => {
    handleCancelOrRegister(el.id, { ...el, alta: !el.alta });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/* ALTA Y BAJA */}
      {el.alta === true ? (
        <Button
          onClick={handleChangeRegisterOrCancelItem}
          variant="contained"
          color="error"
        >
          Deshabilitar
          <span className="material-symbols-outlined">block</span>
        </Button>
      ) : (
        <Button
          onClick={handleChangeRegisterOrCancelItem}
          variant="contained"
          color="success"
        >
          Habilitar
          <span className="material-symbols-outlined">check</span>
        </Button>
      )}
      {/* Botón para editar el elemento */}
      <Button variant="contained" onClick={handleModalSelected}>
        <span className="material-symbols-outlined">edit</span>
      </Button>
      {/* Botón para eliminar el elemento */}
      <Button variant="contained" color="error" onClick={handleDeleteItem}>
        <span className="material-symbols-outlined">delete_forever</span>
      </Button>
    </div>
  );
};
