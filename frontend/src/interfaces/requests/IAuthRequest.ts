export interface ILoginRequest {
    userIdentifier: string;
    password: string;
}

export interface IRegisterRequest {
    userId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email : string;
    password: string;
    confirmPassword: string;
    // program: string;
}

export interface IForgotPasswordRequest {
    email: string;
}

export interface IResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}