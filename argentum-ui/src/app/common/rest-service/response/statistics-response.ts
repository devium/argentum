import { Statistics } from '../../model/statistics';
export class StatisticsResponse {
  guestsTotal: number;
  guestsCheckedIn: number;
  cardsTotal: number;
  totalBalance: number;
  totalBonus: number;
  totalSpent: number;
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
    totalBalance: response.totalBalance,
    totalBonus: response.totalBonus,
    totalSpent: response.totalSpent,
    numProducts: response.numProducts,
    numLegacyProducts: response.numLegacyProducts,
    numRanges: response.numRanges,
    numCategories: response.numCategories
  };
}
