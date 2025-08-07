// models/news.model.ts
export interface News {
  id?: number;
  title: string;
  content: string;
  imageUrl: string;
  publishedAt?: string;
  createdBy?: any;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  imageUrl: string;
}

export interface UpdateNewsRequest {
  title: string;
  content: string;
  imageUrl: string;
}
