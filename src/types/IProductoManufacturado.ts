import IArticulo from "./IArticulo";
import IProductoDetalle from "./IProductoDetalle";

export default interface IProductoManufacturado extends IArticulo{
  descripcion: string;
  preparacion: string;
  tiempoEstimadoMinutos: number;
  productoDetalle: IProductoDetalle[];
}

