import IArticulo from "./IArticulo";
import { IBase } from "./IBase";
import IUnidadMedida from "./IUnidadMedida";
import { categorias } from "./Icategorias";

export interface IInsumo extends IArticulo {
  esParaElaborar: boolean;
  //categoria: categorias; 

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

