export interface ILoginRequest {
  email:    string;
  password: string;
}

export interface IRegisterRequest {
  firstName:              string;
  middleName?:            string;
  lastName:               string;
  email:                  string;
  password:               string;
  confirmPassword:        string;
  termsAccepted:          boolean;
  privacyPolicyAccepted:  boolean;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token:           string;
  newPassword:     string;
  confirmPassword: string;
}

export interface ICreateAdminUserRequest {
  firstName:         string;
  middleName?:       string;
  lastName:          string;
  email:             string;
  password:          string;
  role:              "shifty" | "cashier" | "admin";
  membershipType?:   string;
  membershipStatus?: string;
}

export interface IUpdateUserRequest {
  firstName?:        string;
  middleName?:       string;
  lastName?:         string;
  role?:             "shifty" | "cashier" | "admin";
  password?:         string;
  membershipType?:   string;
  membershipStatus?: string;
}

export interface IUpdateMeRequest {
  firstName?:  string;
  middleName?: string;
  lastName?:   string;
  password?:   string;
}