import { OrderItem } from './order-item';

export class Order {
  id: number;
  time: Date;
  orderItems: OrderItem[];
  total: number;
  customCancelled: number;
  customTotal: number;
  customTotalEffective: number;
  totalEffective: number;

  constructor(id: number, time: Date, orderItems: OrderItem[], total: number, customCancelled: number) {
    this.id = id;
    this.time = time;
    this.orderItems = orderItems;
    this.total = total;
    this.customCancelled = customCancelled;

    this.update();
  }

  private recalculate(): { customTotal: number, customTotalEffective: number, totalEffective: number } {
    const customTotal = this.total - this.orderItems.map((orderItem: OrderItem) => orderItem.total).reduce(
      (totalA: number, totalB: number) => totalA + totalB, 0
    );
    const customTotalEffective = customTotal - this.customCancelled;
    const totalEffective = customTotalEffective + this.orderItems.map(
      (orderItem: OrderItem) => orderItem.totalEffective
    ).reduce((totalA: number, totalB: number) => totalA + totalB, 0);
    return { customTotal, customTotalEffective, totalEffective };
  }

  update() {
    this.orderItems.forEach((orderItem: OrderItem) => orderItem.update());
    Object.assign(this, this.recalculate());
  }

  validate(): boolean {
    const expected = this.recalculate();
    return (
      this.customTotal === expected.customTotal &&
      this.customTotalEffective === expected.customTotalEffective &&
      this.totalEffective === expected.totalEffective
    );
  }
}
