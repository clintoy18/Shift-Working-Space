import { admin } from "../lib/api";
import type { ICreateAdminUserRequest, IUser } from "@interfaces";

const roleMap: { [key: string]: number } = {
  Shifty: 0,
  Cashier: 1,
  Admin: 2,
};

type TUserWithOptionalPassword = IUser & {
  password?: string;
  confirmPassword?: string;
};

export const fetchAllUsersAdmin = async () => {
  const response = await admin.get("/user");
  return response.data;
};

export const createNewUserAdmin = async (newUser: ICreateAdminUserRequest) => {
  const roleNumber = roleMap[newUser.role];

  const response = await admin.post("/user/create", {
    ...newUser,
    Role: roleNumber,
  });
  return response.data;
};

export const updateUserAdmin = async (user: TUserWithOptionalPassword) => {
  const roleNumber = roleMap[user.role];

  const response = await admin.put(`/user/update/${user.id}`, {
    ...user,
    Role: roleNumber,
  });
  return response.data;
};

export const deleteUserAdmin = async (userId: string) => {
  const response = await admin.delete(`/user/delete/${userId}`);
  return response.data;
};

export const getUserAdmin = async (userId: string) => {
  const response = await admin.get(`/user/${userId}`);

  return response.data;
};

export const getRecentUsers = async (userCount: number) => {
  const response = await admin.get(`/user/recent?count=${userCount}`)
  return response.data
}

export const fetchStats = async() => {
  const response = await admin.get('/dashboard-stats')
  return response.data
}
export const assignTeacherToCourse = async (courseId: number, teacherId: string) => {
  const response = await admin.put(`/course/assign-teacher/${courseId}`, null, {
    params: { teacherId }
  });
  return response.data;
};

export const exportDashboardPDF = async (role: string) => {
  const response = await admin.get(
    "/pdf/dashboard-summary",{
      params: { role },           
      responseType: "blob" } 
  );
  return response.data;
};

export const exportCourseGradesSummaryPDF = async () => {
  const response = await admin.get("/pdf/course-grade-summary", {
    responseType: "blob",
  });
  return response.data;
};


/// must implemet backend for this.
export const exportGradesPerCoursePDF = async (courseCode: string) => {
  const response = await admin.get("/pdf/grades-per-course", {
    params: {courseCode},
    responseType: "blob",
  });
  return response.data;
};

// export const exportGradesByCoursePDF = async ()
