import { categorias } from "./Icategorias";
import { IUnidadaMedida } from "./IUnidadMedida";
export interface IInsumo {
  id: string;
  denominacion: string;
  unidadMedida: IUnidadaMedida;
  categoria: categorias;
  cantidad?: number;
}
