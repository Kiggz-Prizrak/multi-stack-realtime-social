export type Id = number | string;

export type PaginatedParams = {
  limit?: number;
  offset?: number;
};

export type CursorParams = {
  limit?: number;
  before?: string;
};

export type ApiMessageResponse = {
  message: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type CursorResponse<T> = {
  items: T[];
  nextCursor: string | null;
};
