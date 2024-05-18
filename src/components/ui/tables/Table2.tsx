// TableIngredients.tsx

import React from 'react';

interface Ingredient {
  name: string;
}

interface Props {
  ingredients: Ingredient[];
  onIngredientSelect: (ingredient: Ingredient) => void;
}

const TableIngredients: React.FC<Props> = ({ ingredients, onIngredientSelect }) => {
  const handleIngredientClick = (ingredient: Ingredient) => {
    // Llamar a la función de devolución de llamada para pasar el ingrediente seleccionado al modal
    onIngredientSelect(ingredient);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ingredient, index) => (
          <tr key={index} onClick={() => handleIngredientClick(ingredient)}>
            <td>{ingredient.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableIngredients;
