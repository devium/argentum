export class Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  rangeIds: Set<number>;
  legacy: boolean;
}
