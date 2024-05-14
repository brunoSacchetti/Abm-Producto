import { IInsumo } from "./IInsumo";
import { categorias } from "./Icategorias";

export interface IProductoManufacturado {
  id: string;
  descripción: string;
  alta: boolean;
  receta: string;
  tiempoEstimadoMinutos: number;
  precioVenta: number;
  denominacion: string;
  ingredientes: IInsumo[];
  categoria: categorias;
}
