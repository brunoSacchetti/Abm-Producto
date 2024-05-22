import { IBase } from "./IBase";

export interface ICategoria extends IBase<ICategoria> {
  denominacion: string; 
  esInsumo:boolean;
  subCategoria: ICategoria[] | null;
  idArticulos:number
}

/* export interface categorias {
  id: string;
  denominacion: string;
  categorias_hijas: categorias[] | null;
} */


