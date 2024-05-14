import { IProductoManufacturado } from "../types/IProductoManufacturado";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class ProductoManufacturadoService extends BackendClient<IProductoManufacturado> {}
