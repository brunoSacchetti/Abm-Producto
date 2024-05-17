import IProductoManufacturado from "../types/IProductoManufacturado";
import ProductoPost from "../types/typesPrueba/post/ProductoPost";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class ProductoManufacturadoService extends BackendClient<IProductoManufacturado | ProductoPost> {}
