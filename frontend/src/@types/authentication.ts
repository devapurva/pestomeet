export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type LoggedIn = {
  auth: boolean;
  iat: number;
  id: string;
  name: string;
  role: string;
};

export type AuthUser = null | Record<string, any>;

export type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
};

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUser;
  method: 'jwt';
  login: (email: string, password: string, phone: string | null) => Promise<void>;
  register: (
    name: string,
    role: string,
    phone: string,
    experience: string,
    email: string,
    password: string,
    approval: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => void;
  updateProfile: VoidFunction;
};
