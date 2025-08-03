import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { ConfigService } from './config.service';
import { Result } from '../common/ApiResponse';
import { CommonService } from './common.service';

// Type aliases for optional request headers and query parameters
export type ApiHeaders = Record<string, string>;
export type ApiParams = Record<
  string,
  string | number | boolean | Array<string | number | boolean>
>;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Inject HttpClient and ConfigService using Angular's inject() API
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);
  private readonly commonService = inject(CommonService);

  /**
   * Builds HttpHeaders with optional custom headers and Authorization token.
   */
  private createHeaders(headers?: ApiHeaders, isFormData: boolean = false): HttpHeaders {
    let httpHeaders = new HttpHeaders();

    // ❗️Only set Content-Type to application/json if not sending FormData
    if (!isFormData) {
      httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    }

    const token = localStorage.getItem('token');
    if (token) {
      httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
    }

    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        httpHeaders = httpHeaders.set(key, value);
      }
    }

  return httpHeaders;
}


  /**
   * Converts object-based query parameters to HttpParams.
   */
  private createParams(params?: ApiParams): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          // Append multiple values for array-based params
          value.forEach(val => {
            httpParams = httpParams.append(key, String(val));
          });
        } else {
          httpParams = httpParams.set(key, String(value));
        }
      }
    }

    return httpParams;
  }

  /**
   * Centralized HTTP error handling. Can be extended for logging or retry logic.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }

  /**
   * HTTP GET request
   */
  get<T>(
    url: string,
    params?: ApiParams,
    headers?: ApiHeaders
  ): Observable<Result<T>> {
    return this.http
      .get<Result<T>>(`${this.config.baseUrl}${url}`, {
        headers: this.createHeaders(headers),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * HTTP POST request
   */
  post<TRequest, TResponse>(
    url: string,
    body?: TRequest,
    params?: ApiParams,
    headers?: ApiHeaders,
    isFormData?: boolean
  ): Observable<Result<TResponse>> {
    return this.http
      .post<Result<TResponse>>(`${this.config.baseUrl}${url}`, body ?? {}, {
        headers: this.createHeaders(headers,isFormData),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }

  downloadSqlFile(url: string): Observable<Blob> {
    return this.http.post<Blob>(`${this.config.baseUrl}${url}`, {}, { responseType: 'blob' as 'json' })
      .pipe(catchError(this.handleError));
  }

  /**
   * HTTP PUT request
   */
  put<TRequest, TResponse>(
    url: string,
    body: TRequest,
    params?: ApiParams,
    headers?: ApiHeaders,
    isFormData?: boolean
  ): Observable<Result<TResponse>> {
    return this.http
      .put<Result<TResponse>>(`${this.config.baseUrl}${url}`, body, {
        headers: this.createHeaders(headers, isFormData),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * HTTP PATCH request
   */
  patch<TRequest, TResponse>(
    url: string,
    body: TRequest,
    params?: ApiParams,
    headers?: ApiHeaders
  ): Observable<Result<TResponse>> {
    return this.http
      .patch<Result<TResponse>>(`${this.config.baseUrl}${url}`, body, {
        headers: this.createHeaders(headers),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * HTTP DELETE request
   */
  delete<TResponse>(
    url: string,
    params?: ApiParams,
    headers?: ApiHeaders
  ): Observable<Result<TResponse>> {
    return this.http
      .delete<Result<TResponse>>(`${this.config.baseUrl}${url}`, {
        headers: this.createHeaders(headers),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Unwraps a Result<T> type. Throws if the result is an error.
   * Usage: .pipe(map(res => this.handleResult(res)))
   */
  public handleResult<T>(res: Result<T>): T {
    if (!res.isSuccess) {
      //  this.commonService.showWarning(res.error);
      throw new Error(res.error || 'Unexpected error');
    }
    return res.value;
  }
}
