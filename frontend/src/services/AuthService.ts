import { auth } from "../lib/api";
import type { ILoginRequest, IRegisterRequest, IUser } from "@interfaces";
import { fetchAllUsersAdmin } from "./AdminService";

export const loginUser = async (credentials: ILoginRequest) => {
    const response = await auth.post('/login', credentials);
    
    const { token } = response.data;
    if (token) {
      sessionStorage.setItem('accessToken', token);
    }
  
    return response.data;
  };

export const logoutUser = async () => {
  sessionStorage.removeItem('accessToken')
}

export const registerStudent = async(userData: IRegisterRequest) => {
    const response = await auth.post('/register', userData);
    return response.data;
}

export const fetchUser = async() => {
    const response = await auth.get('/me')
    return response.data
}

export const isAccessTokenInSession = () => {
  const token = sessionStorage.getItem('accessToken') 
  if (token) return true
  else return false
}

export const updateSelf = async(userData: IUser, password: string, confirmPassword: string) => {
  const updatedData = {
    ...userData,
    Password: password ?? null,
    ConfirmPassword: confirmPassword ?? null
  }
  const response = await auth.put('/me/update/', updatedData)
  return response.data
}

export const getActiveMembersCount = async () => {
  try {
    const users = await fetchAllUsersAdmin();
    // Filter users with "shifty" role (case-insensitive)
    const shiftyMembers = users.filter(
      (user: IUser) => user.role?.toLowerCase() === "shifty"
    );
    return shiftyMembers.length;
  } catch (error) {
    console.error("Error fetching active members count:", error);
    return 0;
  }
}