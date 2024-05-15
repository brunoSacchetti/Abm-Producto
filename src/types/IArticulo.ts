import { IBase } from "./IBase";
import IUnidadMedida from "./IUnidadMedida";
import { categorias } from "./Icategorias";

export default interface IArticulo extends IBase<IArticulo>{
  denominacion: string;
  precioVenta: number;
  /* unidadMedida: IUnidadMedida; */
  unidadMedida: IUnidadMedida;
  categoria: categorias;
}