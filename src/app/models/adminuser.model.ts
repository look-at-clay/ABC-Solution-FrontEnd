// models/user.model.ts
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  isBlocked: boolean;
  phoneNumber: string;
  level: Level;
  addresses: Address[];
  wallet?: Wallet;
  referralCode?: string;
  referredBy?: string;
  blocked: boolean;
}

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
  defaultAddress?: boolean;
}

export interface Wallet {
  id: number;
  balance: number;
}
