import { Product } from './product';

export class OrderItem {
  id: number;
  product: Product;
  quantity: number;
  cancelled: number;
  total: number;
  totalEffective: number;


  constructor(id: number, product: Product, quantity: number, cancelled: number) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
    this.cancelled = cancelled;

    this.update();
  }

  update() {
    this.total = this.quantity * this.product.price;
    this.totalEffective = (this.quantity - this.cancelled) * this.product.price;
  }

  validate(): boolean {
    return (
      this.total === this.quantity * this.product.price &&
      this.totalEffective === (this.quantity - this.cancelled) * this.product.price
    );
  }
}
