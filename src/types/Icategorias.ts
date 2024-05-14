export interface categorias {
  id: string;
  denominacion: string;
  categorias_hijas: categorias[] | null;
}
