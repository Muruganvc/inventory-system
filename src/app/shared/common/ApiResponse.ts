// shared/common/ApiResponse.ts
export type Result<T> =
  | { isSuccess: true; value: T; error: null }
  | { isSuccess: false; value: null; error: string };
