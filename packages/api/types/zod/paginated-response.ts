export interface PaginatedResponse<T> {
  data: T;
  meta: {
    per_page: number;
    current_page: number;
    has_next_page: boolean;
  };
}
