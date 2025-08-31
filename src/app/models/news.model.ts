// models/news.model.ts
export interface News {
  id?: number;
  title: string;
  content: string;
  imageUrl?: string; // Keep for backward compatibility
  imageUrls?: string[]; // New field for multiple images
  publishedAt?: string;
  createdBy?: any;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  imageUrl?: string; // Keep for backward compatibility
}

export interface UpdateNewsRequest {
  title: string;
  content: string;
  imageUrl?: string; // Keep for backward compatibility
}
