import { GetInventoryCompanyInfo } from "./GetInventoryCompanyInfo";

export interface LoginRequest {
    userName: string;
    password: string;
}


export interface LoginResponse {
    fistName: string;
    lastName: string;
    token: string;
    invCompanyInfo?: GetInventoryCompanyInfo,
    refreshToken : string;
}