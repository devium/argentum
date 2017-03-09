import { ProductRange } from "../product-range";
import {
  SHOT,
  BEER,
  WATER,
  LONG_DRINK,
  TAP_WATER,
  COCKTAIL,
  SPRITE,
  COKE,
  PEPSI,
  TEA,
  CHAI_LATTE,
  COFFEE,
  RED_BULL,
  CAKE
} from "./mock-products";

export const PRODUCT_RANGES: ProductRange[] = [
  {
    id: 'bev', name: 'Beverages', products: [
    WATER,
    BEER,
    LONG_DRINK,
    TAP_WATER,
    COCKTAIL,
    SPRITE,
    COKE,
    PEPSI,
    TEA,
    CHAI_LATTE,
    COFFEE,
    RED_BULL,
    SHOT
  ]
  },
  {
    id: 'food', name: 'Food', products: [
    CAKE
  ]
  }
];
