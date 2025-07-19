import API from "../utils/axios"
import { SignupDto, LoginDto, VerifySignupLoginOtpDto, ForgotPasswordDto, ResendVerifyOtpDto, ResetPasswordDto, UpdateProfileDto, ChangePasswordDto} from "../types/authType"

const getToken = () => localStorage.getItem("accessToken");
// This function is used to get the token from localStorage


export const signup = async (data: SignupDto) => {
  const res = await API.post("/auth/signup", data)
  return res.data
}

export const login = async (data: LoginDto) => {
  const res = await API.post("/auth/login", data)
  return res.data
}

export const verifyOtp = async (data: VerifySignupLoginOtpDto) => {
  const res = await API.post("/auth/verify-signup-login-otp", data)
  return res.data
}

export const resendVerifyOtp = async (data: ResendVerifyOtpDto) => {
  const res = await API.post("/auth/resend-verify-otp", data)
  return res.data
}

export const forgotPassword = async (data: ForgotPasswordDto) => {
  const response = await API.post('/auth/forgot-password', data)
  return response.data
}

export const resetPassword = async(data: ResetPasswordDto) => {
    const response = await API.post('/auth/reset-password', data);
    return response.data;
}


export const getProfile = async () => {

  const response = await API.get('/auth/view-my-profile', {
     headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};


export const updateProfile = async (data: UpdateProfileDto) => {

  const response = await API.put('/auth/update-profile', data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
}

export const changePassword = async (data: ChangePasswordDto) => {
  
  const response = await API.put("/auth/change-password", data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return response.data;
};

export const getAllUsers = async () => {
 
  const response = await API.get("/auth/view-all-users", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const toggleUserSuspension = async (userId: string) => {
  const response = await API.patch(`/auth/suspend-a-user/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};


export const toggleUserRole = async (userId: string) => {
  const res = await API.put(`/auth/change-user-role/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;

};

export const deleteUser = async (userId: string) => {
  const res = await API.delete(`/auth/delete-user/${userId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};