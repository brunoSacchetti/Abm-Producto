import { categorias } from "../types/Icategorias";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class CategoriaComidaService extends BackendClient<categorias> {}
