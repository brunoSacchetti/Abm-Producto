import { IBase } from "./IBase";
import IUnidadMedida from "./IUnidadMedida";

export default interface IArticulo extends IBase<IArticulo>{
  denominacion: string;
  precioVenta: number;
  unidadMedida: IUnidadMedida;
}