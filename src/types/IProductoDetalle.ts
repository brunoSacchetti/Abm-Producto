import { IBase } from "./IBase";
import { IInsumo } from "./IInsumo";

export default interface IProductoDetalle extends IBase<IProductoDetalle>{
    cantidad: number | string;
    insumo: IInsumo;
}