export interface Product {
  name: string;
  description: string;
  unit: string;
  expiryInDays: number;
  gstPercentage: number;
  category: {
    id: number;
  };
  levelPrices: LevelPrice[];
}

export interface LevelPrice {
  level: {
    name: number;
  };
  minPrice: number;
  maxPrice: number;
  minQuantity: number;
  maxQuantity: number;
  platformFeeBuyer: number;
  platformFeeSeller: number;
  platformFeeType: string;
  gstPercentage: number;
}
  