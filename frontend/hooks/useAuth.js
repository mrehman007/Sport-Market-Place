import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { humanizeAddress, setAuthToken } from '../helpers';
import { GlobalContext } from '../context';
import { config } from '../config';

export const useAuth = () => {
  const { setIsLoading, setUserName, setAddress, setBalances } =
    useContext(GlobalContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    localStorage.getItem('token') &&
      setAuthToken(localStorage.getItem('token'));

    const token = localStorage.getItem('token');
    token && loadUser(token);

    setIsLoading(false);
    // eslint-disable-next-line
  }, []);

  const register = async (nickname, address) => {
    setIsLoading(true);

    try {
      let { data } = await config.axios.post(
        `/api/users/register`,
        JSON.stringify({
          nickname,
          address,
        })
      );
      let { token, success, msg } = JSON.parse(data);
      if (success && token) {
        localStorage.setItem('token', token);
        setAuthToken(token);
        await loadUser(token);
      } else {
        toast.error(String(msg));
      }
    } catch (error) {
      toast.error(`Error: ${error?.data?.message || error?.message}`);
    }
  };

  const login = async (address) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        setIsLoading(true);
        try {
          const { data } = await config.axios.post(
            `/api/auth/login`,
            JSON.stringify({ address })
          );

          const { token, success, msg } = JSON.parse(data);
          if (success && token) {
            localStorage.setItem('token', token);
            setAuthToken(token);
            await loadUser(token);
            resolve('Log in successful!');
          } else {
            reject(msg.msg);
          }
          setIsLoading(false);
        } catch (error) {
          reject(error);
          setIsLoading(false);
        }
      }),
      {
        loading: 'Logging in...',
        success: (msg) => `${String(msg)}`,
        error: (msg) => `${String(msg)}`,
      }
    );
  };

  const loadUser = async (token) => {
    try {
      const { data } = await config.axios.get(`/api/auth`, {
        headers: {
          Authorization: `x-auth-token ${token}`,
        },
      });

      const { success, msg, user } = JSON.parse(data);
      if (success && user) {
        setIsLoggedIn(true);
        setUserName(humanizeAddress(user.address));
        setAddress(user.address);
        setBalances(user.balances);
        setIsLoading(false);
      } else {
        toast.error(String(msg));
      }
    } catch (error) {
      localStorage.removeItem('token');
      toast.error(`Error: ${error?.data?.message || error?.message}`);
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName(null);
    setAddress(null);
  };

  return {
    isLoggedIn,
    register,
    login,
    logout,
    loadUser,
  };
};
