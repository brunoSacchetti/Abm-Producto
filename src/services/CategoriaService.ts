import { ICategoria } from "../types/ICategoria";
import { BackendClient } from "./BackendClient";

export class CategoriaService extends BackendClient<ICategoria> {

    async addArticuloManufacturado(idCategoria: number, idArticulo: number): Promise<ICategoria> {
        const response = await fetch(`${this.baseUrl}/addArticuloManufacturado/${idCategoria}/${idArticulo}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        return data as ICategoria;
      }

      async deleteArticuloManufacturado(idCategoria: number | string, idArticulo: number | string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/addArticuloManufacturado/${idCategoria}/${idArticulo}`, {
          method: "DELETE",
          
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar el artículo manufacturado con ID ${idArticulo} de la categoría con ID ${idCategoria}`);
        }
      }
}
