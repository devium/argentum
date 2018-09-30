import { Statistics } from '../../model/statistics';
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
    numCategories: response.numCategories
  };
}
