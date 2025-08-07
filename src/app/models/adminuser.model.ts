
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  isBlocked: boolean; // Primary blocking status flag
  phoneNumber: string;
  level: Level;
  addresses: Address[];
  wallet?: Wallet;
  referralCode?: string;
  referredBy?: string;
  blocked?: boolean; // Legacy blocking status flag, kept for backward compatibility
}

export interface Level {
  id: number;
  name: string;
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
