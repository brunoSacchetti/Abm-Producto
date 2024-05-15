/* export interface IUnidadaMedida {
  id: string;
  denominacion: string;
  abreviatura: string;
} */

import { IBase } from "./IBase";

export default interface IUnidadMedida extends IBase<IUnidadMedida>{
  denominacion: string;
}