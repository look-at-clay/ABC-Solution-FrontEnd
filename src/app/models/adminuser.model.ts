
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  isBlocked: boolean; // Primary blocking status flag
  phoneNumber: string;
  level: Level;
  levelAlias?: string;
  companyName?: string;
  addresses: Address[];
  wallet?: Wallet;
  rating?: number | null; // User rating
  referralCode?: string;
  referredBy?: string;
  rewardsAsReferrer?: any[];
  rewardsAsReferredUser?: any[];
  bankAccounts?: BankAccount[];
  kycVerification?: any;
  createdAt?: string;
  updatedAt?: string;
  isEmailVerified?: boolean;
  emailVerified?: boolean;
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

export interface BankAccount {
  id: number;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  accountType: string;
  upiId?: string;
  isPrimary?: boolean;
  isActive?: boolean;
  beneficiaryRegistered?: boolean;
  beneficiaryId?: string;
  updatedAt?: string;
  active?: boolean; // Legacy field
  primary?: boolean; // Legacy field
}
