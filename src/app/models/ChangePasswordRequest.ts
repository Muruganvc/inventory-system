export interface ChangePasswordRequest {
    passwordHash: string;
    currentPassword: string;
}