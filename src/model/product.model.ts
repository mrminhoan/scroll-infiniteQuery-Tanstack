export interface ProductsQuery {
  limit: number;
  skip: number;
  total: number;
  products: ProductModel[];
}

export interface ProductModel {
  id: number;
  price: number;
  title: string;
}
