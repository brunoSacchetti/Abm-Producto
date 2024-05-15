import { IBase } from "./IBase";

export interface categorias extends IBase<categorias> {
  denominacion: string; 
  esInsumo:boolean;
  subCategoria: categorias[] | null;
  /*   idArticulos:number; */
}

/* export interface categorias {
  id: string;
  denominacion: string;
  categorias_hijas: categorias[] | null;
} */


