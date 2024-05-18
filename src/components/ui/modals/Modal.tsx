import React, { useState } from "react";
import Table, { RowData } from "../tables/Table";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedRows: number[]) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, setSelectedRows }) => {
  const [selectedRows, setSelectedRowsInternal] = useState<RowData[]>([]);

  const handleRowSelection = (selectedRows: RowData[]) => {
    setSelectedRowsInternal(selectedRows);
    console.log("Datos seleccionados en Modal:", selectedRows);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedRowIndices = selectedRows.map((row, index) => index);
    setSelectedRows(selectedRowIndices);
    onSubmit(selectedRowIndices);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
            <div className="modal-content">
              <h2>Tabla en el Modal</h2>
              <form onSubmit={handleFormSubmit}>
                <Table onRowSelection={handleRowSelection} />
                <button type="submit">Enviar</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;