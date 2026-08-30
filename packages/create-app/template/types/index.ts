export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
