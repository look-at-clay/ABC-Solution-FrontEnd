export interface ProductTradingData {
  productId: number;
  productName: string;
  totalVolumeTraded: number;
  totalAmountTraded: number;
}

export interface ReportsStatsResponse {
  totalUsersCreated: number;
  productTradingData: ProductTradingData[];
}