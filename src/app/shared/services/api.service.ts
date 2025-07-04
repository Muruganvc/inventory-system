import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../common/ApiResponse';
import { ConfigService } from './config.service';

export type ApiHeaders = Record<string, string>;
export type ApiParams = Record<string, string | number | boolean | Array<string | number | boolean>>;

@Injectable({
  providedIn: 'root'
})
export class ApiService{ 
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

 
  private createHeaders(headers?: ApiHeaders): HttpHeaders {
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('token');
    if (token) {
      httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
    }

    // Add any additional headers
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        httpHeaders = httpHeaders.set(key, value);
      });
    }

    return httpHeaders;
  }



  private createParams(params?: ApiParams): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => httpParams = httpParams.append(key, String(val)));
        } else {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return httpParams;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // You can extend this to include error logging or custom formatting
    return throwError(() => error);
  }

  get<TResponse>(
    url: string,
    params?: ApiParams,
    headers?: ApiHeaders
  ): Observable<ApiResponse<TResponse>> { 
    return this.http
      .get<ApiResponse<TResponse>>(`${this.configService.baseUrl}${url}`, {
        headers: this.createHeaders(headers),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }

  post<TRequest, TResponse>(
    url: string,
    body?: TRequest,
    params?: ApiParams,
    headers?: ApiHeaders
  ): Observable<ApiResponse<TResponse>> {
    return this.http
      .post<ApiResponse<TResponse>>(`${this.configService.baseUrl}${url}`, body ?? {}, {
        headers: this.createHeaders(headers),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }

  put<TRequest, TResponse>(
    url: string,
    body: TRequest,
    params?: ApiParams,
    headers?: ApiHeaders
  ): Observable<ApiResponse<TResponse>> {
    const options = {
      headers: this.createHeaders(headers),
      params: this.createParams(params),
    };

    return this.http
      .put<ApiResponse<TResponse>>(`${this.configService.baseUrl}${url}`, body ?? {}, options)
      .pipe(catchError(this.handleError));
  }

  patch<TRequest, TResponse>(
    url: string,
    body: TRequest,
    params?: ApiParams,
    headers?: ApiHeaders
  ): Observable<ApiResponse<TResponse>> {
    return this.http
      .patch<ApiResponse<TResponse>>(`${this.configService.baseUrl}${url}`, body, {
        headers: this.createHeaders(headers),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }

  delete<TResponse>(
    url: string,
    params?: ApiParams,
    headers?: ApiHeaders
  ): Observable<ApiResponse<TResponse>> {
    return this.http
      .delete<ApiResponse<TResponse>>(`${this.configService.baseUrl}${url}`, {
        headers: this.createHeaders(headers),
        params: this.createParams(params),
      })
      .pipe(catchError(this.handleError));
  }
}
