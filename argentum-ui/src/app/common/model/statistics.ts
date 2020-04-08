import {AbstractModel} from './abstract-model';
import {Product} from './product';

export namespace QuantitySales {
  export interface Dto {
    product: number;
    quantity: number;
    value: string;
  }
}

export namespace StatTransaction {
  export interface Dto {
    time: string;
    value: string;
  }
}

export namespace Statistics {
  export interface Dto {
    guests_total: number;
    guests_checked_in: number;
    cards_total: number;
    total_positive_balance: string;
    total_negative_balance: string;
    total_bonus: string;
    total_spent: string;
    total_refund: string;
    total_deposited: string;
    total_withdrawn: string;
    num_products: number;
    num_legacy_products: number;
    num_product_ranges: number;
    num_categories: number;
    quantity_sales: QuantitySales.Dto[];
    check_ins: string[];
    deposits: StatTransaction.Dto[];
    withdrawals: StatTransaction.Dto[];
    orders: StatTransaction.Dto[];
  }
}

export class QuantitySales extends AbstractModel {
  constructor(
    public product: Product,
    public quantity: number,
    public value: number
  ) {
    super(undefined);
  }

  static fromDto(dto: QuantitySales.Dto, products: Product[]): QuantitySales {
    return new QuantitySales(
      products.find((product: Product) => product.id === dto.product),
      dto.quantity,
      parseFloat(dto.value)
    );
  }
}

export class StatTransaction extends AbstractModel {
  constructor(
    public time: Date,
    public value: number
  ) {
    super(undefined);
  }

  static fromDto(dto: StatTransaction.Dto): StatTransaction {
    return new StatTransaction(new Date(dto.time), parseFloat(dto.value));
  }
}

export class Statistics extends AbstractModel {
  constructor(
    public guestsTotal: number,
    public guestsCheckedIn: number,
    public cardsTotal: number,
    public totalPositiveBalance: number,
    public totalNegativeBalance: number,
    public totalBonus: number,
    public totalSpent: number,
    public totalRefund: number,
    public totalDeposited: number,
    public totalWithdrawn: number,
    public numProducts: number,
    public numLegacyProducts: number,
    public numProductRanges: number,
    public numCategories: number,
    public quantitySales: QuantitySales[],
    public checkIns: Date[],
    public deposits: StatTransaction[],
    public withdrawals: StatTransaction[],
    public orders: StatTransaction[]
  ) {
    super(undefined);
  }

  static fromDto(dto: Statistics.Dto, products: Product[]): Statistics {
    return new Statistics(
      dto.guests_total,
      dto.guests_checked_in,
      dto.cards_total,
      parseFloat(dto.total_positive_balance),
      parseFloat(dto.total_negative_balance),
      parseFloat(dto.total_bonus),
      parseFloat(dto.total_spent),
      parseFloat(dto.total_refund),
      parseFloat(dto.total_deposited),
      parseFloat(dto.total_withdrawn),
      dto.num_products,
      dto.num_legacy_products,
      dto.num_product_ranges,
      dto.num_categories,
      dto.quantity_sales.map((qsDto: QuantitySales.Dto) => QuantitySales.fromDto(qsDto, products)),
      dto.check_ins.map((time: string) => new Date(time)),
      dto.deposits.map((dDto: StatTransaction.Dto) => StatTransaction.fromDto(dDto)),
      dto.withdrawals.map((wDto: StatTransaction.Dto) => StatTransaction.fromDto(wDto)),
      dto.orders.map((oDto: StatTransaction.Dto) => StatTransaction.fromDto(oDto))
    );
  }
}
