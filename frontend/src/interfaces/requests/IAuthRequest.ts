export interface ILoginRequest {
    // Your backend controller destructures { email, password }
    email: string; 
    password: string;
}

export interface IRegisterRequest {
    // ✅ userId is REMOVED: Backend now generates this as a MongoDB ObjectId
    firstName: string;
    middleName?: string; // Optional in backend schema
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string; // Used for frontend validation logic
}

export interface IForgotPasswordRequest {
    email: string;
}

export interface IResetPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}