import IProductoManufacturado from "../types/IProductoManufacturado";
import { BackendClient } from "./BackendClient";

export class ProductoGet extends BackendClient<IProductoManufacturado> {}