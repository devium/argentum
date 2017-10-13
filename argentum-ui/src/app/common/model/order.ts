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
}
