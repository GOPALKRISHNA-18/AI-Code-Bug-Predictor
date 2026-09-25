import api from "./api";
export const analyzeCode = async (analysisData) => {
  const response = await api.post(
    "/analysis/analyze",
    analysisData
  );
  return response.data;
};
export const getAnalysisById = async (analysisId) => {
  const response = await api.get(
    `/analysis/${analysisId}`
  );
  return response.data;
};
export const getAnalysisHistory = async () => {
  const response = await api.get(
    "/analysis/history"
  );
  return response.data;
};
export const deleteAnalysis = async (analysisId) => {
  const response = await api.delete(
    `/analysis/${analysisId}`
  );
  return response.data;
};
export const deleteAnalysisHistory = async () => {
  const response = await api.delete(
    "/analysis/history"
  );
  return response.data;
};
export const getDashboardStats = async () => {
  const response = await api.get(
    "/dashboard/stats"
  );
  return response.data;
};
export const getDashboardTrend = async () => {
  const response = await api.get(
    "/dashboard/trend"
  );
  return response.data;
};
export const getBugAnalytics = async () => {
  const response = await api.get(
    "/dashboard/bug-analytics"
  );
  return response.data;
};