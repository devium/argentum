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

  update() {
    this.orderItems.forEach((orderItem: OrderItem) => orderItem.update());
    this.customTotal = this.total - this.orderItems.map((orderItem: OrderItem) => orderItem.total).reduce(
      (totalA: number, totalB: number) => totalA + totalB, 0
    );
    this.customTotalEffective = this.customTotal - this.customCancelled;
    this.totalEffective = this.customTotalEffective + this.orderItems.map(
      (orderItem: OrderItem) => orderItem.totalEffective
    ).reduce((totalA: number, totalB: number) => totalA + totalB, 0);
  }

  validate(): boolean {
    return (
      this.orderItems.map((orderItem: OrderItem) => orderItem.validate()).reduce(
        (validA: boolean, validB: boolean) => validA && validB
      ) &&
      this.customTotal === this.total - this.orderItems.map((orderItem: OrderItem) => orderItem.total).reduce(
        (totalA: number, totalB: number) => totalA + totalB, 0
      ) &&
      this.customTotalEffective === this.customTotal - this.customCancelled &&
      this.totalEffective === this.customTotalEffective + this.orderItems.map(
        (orderItem: OrderItem) => orderItem.totalEffective
      ).reduce((totalA: number, totalB: number) => totalA + totalB, 0)
    );
  }
}
