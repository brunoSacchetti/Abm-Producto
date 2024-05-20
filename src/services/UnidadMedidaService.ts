import IUnidadMedida from "../types/IUnidadMedida";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class UnidadMedidaService extends BackendClient<IUnidadMedida> {}
