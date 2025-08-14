export interface NegotiationResponse {
  id: number;
  responseText: string;
  templateKey: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  question?: {
    id: number;
    questionText?: string;
    templateKey?: string;
    displayOrder?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    category?: any;
    responses?: any;
  };
}

export interface NegotiationQuestion {
  id: number;
  questionText: string;
  templateKey: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    categoryName?: string;
    displayOrder?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    questions?: any;
  };
  responses: NegotiationResponse[];
}

export interface NegotiationCategory {
  id: number;
  categoryName: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions: NegotiationQuestion[];
}

export interface CreateCategoryRequest {
  categoryName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateQuestionRequest {
  questionText: string;
  templateKey: string;
  displayOrder: number;
  isActive: boolean;
  category: {
    id: number;
  };
}

export interface CreateResponseRequest {
  responseText: string;
  templateKey: string;
  displayOrder: number;
  isActive: boolean;
  question: {
    id: number;
  };
}