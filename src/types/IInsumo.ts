import { IBase } from "./IBase";
import IUnidadMedida from "./IUnidadMedida";
import { categorias } from "./Icategorias";

export interface IInsumo extends IBase<IInsumo> {
  denominacion: string;
  precioVenta:number;
  unidadMedida: IUnidadMedida;
  esParaElaborar: boolean;
  categoria: categorias; 

}



/* import { categorias } from "./Icategorias";
import { IUnidadaMedida } from "./IUnidadMedida";
export interface IInsumo {
  id: string;
  denominacion: string;
  unidadMedida: IUnidadaMedida;
  categoria: categorias;
  cantidad?: number;
} */

