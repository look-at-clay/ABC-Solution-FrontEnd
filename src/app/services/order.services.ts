import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Level {
  id: number;
  name: number;
}

export interface Address {
  id: number;
  address: string;
  pincode: string;
  state: string;
  city: string;
  landmark: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  isBlocked: boolean;
  phoneNumber: string;
  level: Level;
  blocked: boolean;
  password?: string;
  addresses?: Address[];
  wallet?: any;
}

export interface LevelPrice {
  level: Level;
  minPrice: number;
  maxPrice: number;
  minQuantity: number;
  maxQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  levelPrices: LevelPrice[];
}

export interface Order {
  id: number;
  buyer: User;
  seller: User;
  product: Product;
  buyerQuantity: number;
  sellerPrice: number;
  totalAmount: number;
  status: string;
  orderDate: string;
  orderType: string | null;
  acceptedQuantity: number;
  acceptedPrice: number;
  deliveryDate: string | null;
  deliveryAddress: any | null;
  acceptedTotalAmount: number;
  isBuyerOrderCancel: boolean;
  isSellerOrderCancel: boolean;
  buyerPlatformFeePaid: boolean;
  sellerPlatformFeePaid: boolean;
  buyerProvidedQualityScore: number | null;
  buyerProvidedQualityProofUrl: string | null;
  isQualityChecked: boolean;
  isQualityCheckRequired: boolean;
  transportBy: User | null;
  productQualityProofUrl: string | null;
  minimumUpfrontPayment: boolean;
  minimumUpfrontPaymentPercent: number | null;
  productDeliveredDateAndTime: string | null;
  buyerOrderCancel?: boolean;
  sellerOrderCancel?: boolean;
  qualityCheckRequired?: boolean;
  qualityChecked?: boolean;
}

export interface OrderResponse {
  data: Order[];
  status: number;
}

// For direct array responses
export type OrderArrayResponse = Order[];

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.baseUrl}/api/v1/orders`; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getAllOrders(searchTerm?: string): Observable<OrderResponse | OrderArrayResponse> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<OrderResponse | OrderArrayResponse>(`${this.baseUrl}/getAllOrders`, { params });
  }

  getBuyerOrders(buyerId: number, searchTerm?: string): Observable<OrderResponse | OrderArrayResponse> {
    let params = new HttpParams().set('buyerId', buyerId.toString());
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<OrderResponse | OrderArrayResponse>(`${this.baseUrl}/getBuyerOrders`, { params });
  }

  getSellerOrders(sellerId: number, searchTerm?: string): Observable<OrderResponse | OrderArrayResponse> {
    let params = new HttpParams().set('sellerId', sellerId.toString());
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<OrderResponse | OrderArrayResponse>(`${this.baseUrl}/getSellerOrders`, { params });
  }

  exportOrdersToExcel(): Observable<Blob> {
    const adminUrl = `${environment.baseUrl}/admin/v1/order-excel`;
    return this.http.get(adminUrl, { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
  }
}