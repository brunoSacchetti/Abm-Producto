
import ProductoDetallePost from "../types/typesPrueba/post/ProductoDetallePost";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class ProductoDetalleService extends BackendClient<ProductoDetallePost> {}
