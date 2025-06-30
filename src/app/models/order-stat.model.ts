export interface OrderStatistics {
  totalOrders: number;
  statusCounts: OrderStatusCount[];
}

export interface OrderStatusCount {
  status: string;
  count: number;
}
