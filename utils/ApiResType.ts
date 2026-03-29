export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  timestamp: number;
};

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};
