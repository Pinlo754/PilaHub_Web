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

export type PageResponseExtra<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  pageable: any;
  sort: any;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export const mapPageResponse = <T>(
  data?: PageResponseExtra<T> | null
): PageResponse<T> => {
  return {
    content: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    size: data?.size ?? 0,
    number: data?.number ?? 0,
  };
};
