import api from "./api";
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register",userData);
  return response.data;
};
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login",loginData);
  return response.data;
};
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
      email,
    }
  );
  return response.data;
};
export const resetPassword = async (token,newPassword) => {
  const response = await api.post("/auth/reset-password", {
      token,newPassword,
    }
  );
  return response.data;
};
export const saveAuthData = (authData) => {
  localStorage.setItem("aiBugPredictorToken",authData.token);
  localStorage.setItem("aiBugPredictorUser",JSON.stringify({
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
    })
  );
};

export const getToken = () => {
  return localStorage.getItem("aiBugPredictorToken");
};
export const getCurrentUser = () => {
  const user = localStorage.getItem("aiBugPredictorUser");
  return user
    ? JSON.parse(user)
    : null;
};
export const logoutUser = () => {
  localStorage.removeItem("aiBugPredictorToken");
  localStorage.removeItem("aiBugPredictorUser");
};

