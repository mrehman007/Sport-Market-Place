import { useAuth } from '../../hooks';
import { AuthContext } from './authContext';

export const AuthProvider = ({
  children,
}) => {
  const { isLoggedIn, login, logout, register, loadUser, joinWaitList } =
    useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        register,
        loadUser,
        joinWaitList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
