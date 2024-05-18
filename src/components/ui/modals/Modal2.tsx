import React, { useState } from 'react';
import TableIngredients from '../tables/Table2';

interface Ingredient {
  name: string;
}

interface Props {
  listaDeIngredientes: Ingredient[];
}

const Modal: React.FC<Props> = ({ listaDeIngredientes }) => {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="cerrar">&times;</span>
        <div>
          {/* Renderizar el componente TableIngredients y pasar la lista de ingredientes y la función de devolución de llamada */}
          <TableIngredients ingredients={listaDeIngredientes} onIngredientSelect={handleIngredientSelect} />
        </div>
        {/* Mostrar el ingrediente seleccionado en el modal */}
        {selectedIngredient && (
          <div>
            <h3>Ingrediente Seleccionado:</h3>
            <p>Nombre: {selectedIngredient.name}</p>
            {/* Otros detalles del ingrediente si es necesario */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;