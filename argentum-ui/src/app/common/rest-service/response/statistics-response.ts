import { Statistics } from '../../model/statistics';
import { QuantitySalesResponse } from './quantity-sales-response';
export class StatisticsResponse {
  guestsTotal: number;
  guestsCheckedIn: number;
  cardsTotal: number;
  totalPositiveBalance: number;
  totalNegativeBalance: number;
  totalBonus: number;
  totalSpent: number;
  totalRefund: number;
  totalDeposited: number;
  totalWithdrawn: number;
  numProducts: number;
  numLegacyProducts: number;
  numRanges: number;
  numCategories: number;
  quantitySales: QuantitySalesResponse[];
}

export function toStatistics(response: StatisticsResponse): Statistics {
  return {
    guestsTotal: response.guestsTotal,
    guestsCheckedIn: response.guestsCheckedIn,
    cardsTotal: response.cardsTotal,
    totalPositiveBalance: response.totalPositiveBalance,
    totalNegativeBalance: response.totalNegativeBalance,
    totalBonus: response.totalBonus,
    totalSpent: response.totalSpent,
    totalRefund: response.totalRefund,
    totalDeposited: response.totalDeposited,
    totalWithdrawn: response.totalWithdrawn,
    numProducts: response.numProducts,
    numLegacyProducts: response.numLegacyProducts,
    numRanges: response.numRanges,
    numCategories: response.numCategories,
    quantitySales: response.quantitySales.map(
      (sales: QuantitySalesResponse) => [sales.product, sales.quantity] as [number, number]
    ).sort((a: [number, number], b: [number, number]) => a[1] - b[1])
  };
}
