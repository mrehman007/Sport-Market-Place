import { createContext } from 'react';

const defaultValue = {
  isLoggedIn: false,

  login: async (address) => { },
  logout: async () => { },
  register: async (nickname, address) => { },
  loadUser: async (token) => { },
};

export const AuthContext = createContext(defaultValue);
