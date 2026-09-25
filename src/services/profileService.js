import api from "./api";
export const getProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data;

};
export const updateProfile = async (profileData) => {
  const response = await api.put("/profile",profileData);
  return response.data;
};
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error("Unable to read image file."));
      };
      reader.readAsDataURL(file);
    }
  );

};
export const uploadProfileImage = async (file) => {
  const imageData = await convertImageToBase64(file);
  const response = await api.post("/profile/image",{
      image: imageData,
    }
  );
  return response.data;
};
export const removeProfileImage = async () => {
  const response = await api.delete("/profile/image");
  return response.data;
};