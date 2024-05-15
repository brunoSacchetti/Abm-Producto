import IArticulo from "./IArticulo";
/* import IProductoDetalle from "./IProductoDetalle";
import IUnidadMedida from "./IUnidadMedida"; */
/* import { IInsumo } from "./IInsumo";
import { categorias } from "./Icategorias"; */

export default interface IProducto extends IArticulo{
  descripcion: string;
  preparacion: string;
  tiempoEstimadoMinutos: number;
  idsArticuloManufacturadoDetalles: number[]; 
}
/* idUnidadMedida: number; */
  /* productoDetalle: IProductoDetalle[]; */

/* denominacion: string;
  precioVenta: number;
  unidadMedida: IUnidadMedida;
  categoria: categorias; */


  
  /* descripción: string;
  alta: boolean;
  receta: string;
  tiempoEstimadoMinutos: number;
  precioVenta: number;
  denominacion: string;
  ingredientes: IInsumo[];
  categoria: categorias; */

