import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
// utils
import { HTTPClient } from '../utils/axios';
import { setSession } from '../utils/jwt';
import { PATH_AUTH } from '../routes/paths';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType, LoggedIn } from '../@types/authentication';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER'
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: LoggedIn;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

const REGEX = /(\b[a-z](?!\s))/g;

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: false,
        user: action.payload.user
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken) {
          setSession(accessToken);
          const user: LoggedIn = jwt_decode(accessToken);

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: {
                ...user,
                name: user.name.replace(REGEX, (c) => c.toUpperCase()),
                role: user.role.replace(REGEX, (c) => c.toUpperCase())
              }
            }
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string, phone: string | null) => {
    const response = await HTTPClient.post('/login', {
      email,
      phone,
      password
    });
    if (response?.data?.statusCode) {
      const { result } = response.data;
      const user: LoggedIn = jwt_decode(result);
      window.localStorage.setItem('accessToken', result);
      setSession(result);
      dispatch({
        type: Types.Login,
        payload: {
          user: {
            ...user,
            name: user.name.replace(REGEX, (c) => c.toUpperCase()),
            role: user.role.replace(REGEX, (c) => c.toUpperCase())
          }
        }
      });
    }
    return response;
  };

  const register = async (
    name: string,
    role: string,
    phone: string,
    experience: string,
    email: string,
    password: string,
    approval: string
  ) => {
    const response = await HTTPClient.post('/register', {
      name,
      role,
      phone,
      experience,
      email,
      password,
      approval
    });
    if (response.data.statusCode) {
      const user = {
        name,
        role,
        phone,
        experience,
        email,
        password,
        approval
      };
      // window.localStorage.setItem('accessToken', accessToken);
      dispatch({
        type: Types.Register,
        payload: {
          user
        }
      });
      navigate(PATH_AUTH.login);
    }
    return response;
  };

  const logout = async () => {
    window.localStorage.removeItem('accessToken');
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  const resetPassword = (email: string) => console.log(email);

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
