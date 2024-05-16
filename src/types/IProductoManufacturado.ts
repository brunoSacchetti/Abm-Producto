import IArticulo from "./IArticulo";
import IProductoDetalle from "./IProductoDetalle";
/* import IProductoDetalle from "./IProductoDetalle";
import IUnidadMedida from "./IUnidadMedida"; */
/* import { IInsumo } from "./IInsumo";
import { categorias } from "./Icategorias"; */

export default interface IProducto extends IArticulo{
  descripcion: string;
  preparacion: string;
  tiempoEstimadoMinutos: number;
  productoDetalle: IProductoDetalle[];
  //idsArticuloManufacturadoDetalles: number[]; 
}

