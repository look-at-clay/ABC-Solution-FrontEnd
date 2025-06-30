export interface RequestStatusCount {
  status: string;
  count: number;
}

export interface BuyerStats {
  totalBuyerRequests: number;
  statusCounts: RequestStatusCount[];
}

export interface SellerStats {
  totalSellerRequests: number;
  statusCounts: RequestStatusCount[];
}

export interface CombinedRequestStats {
  buyerStats: BuyerStats;
  sellerStats: SellerStats;
}
