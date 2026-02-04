export class ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
  status: number;
  cause?: any;

  constructor(
    success: boolean,
    message: string,
    data: T,
    status: number,
    cause?: any,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.status = status;
    this.cause = cause;
  }
}

export class PaginationResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
