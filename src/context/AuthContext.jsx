import {createContext,useContext,useEffect,useState,} from "react";
import {getCurrentUser,getToken,logoutUser,saveAuthData,} from "../services/authService";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getCurrentUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);
  const login = (authData) => {
    saveAuthData(authData);
    setToken(authData.token);
    setUser({
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
    });
  };
  const logout = () => {
    logoutUser();
    setToken(null);
    setUser(null);
  };
  const isAuthenticated = Boolean(
    token && user
  );
  return (
    <AuthContext.Provider
      value={{user,token,loading,isAuthenticated,login,logout, }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
