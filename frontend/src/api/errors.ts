import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

export class AppError extends Error {
  public code: string;
  public status: number;
  public fields?: Record<string, string[]>;

  constructor(message: string, code: string, status: number, fields?: Record<string, string[]>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof AxiosError && error.response) {
    const data = error.response.data as ApiErrorResponse;
    const errObj = data.error;
    
    if (errObj) {
      throw new AppError(
        errObj.message || 'An unexpected error occurred',
        errObj.code || 'UNKNOWN_ERROR',
        error.response.status,
        errObj.fields
      );
    }
  }

  // Fallback for network errors or unhandled cases
  throw new AppError(
    'Network Error. Please check your connection.',
    'NETWORK_ERROR',
    0
  );
};
