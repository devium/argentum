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

  private recalculate(): { total: number, totalEffective: number } {
    const total = this.quantity * this.product.price;
    const totalEffective = (this.quantity - this.cancelled) * this.product.price;
    return { total, totalEffective };
  }

  update() {
    Object.assign(this, this.recalculate());
  }

  validate(): boolean {
    const expected = this.recalculate();
    return (
      this.total === expected.total &&
      this.totalEffective === expected.totalEffective
    );
  }
}
