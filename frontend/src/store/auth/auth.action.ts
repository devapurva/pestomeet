import { ILogin, IRegister } from "../../../global";
import { authActionTypes } from "./auth.actiontype";

export const loginStart = (emailAndPassoword: ILogin) => ({
    type: authActionTypes.LOGIN_INIT,
    payload: emailAndPassoword,
});

export const loginSucess = (userData: ILogin) => ({
    type: authActionTypes.LOGIN_SUCCESS,
    payload: { userData },
});

export const loginFail = (error) => ({
    type: authActionTypes.LOGIN_FAIL,
    payload: error,
});

export const logoutStart = () => ({
    type: authActionTypes.LOGOUT_INIT,
});

export const frtPass_SendEmail = (email: string) => ({
    type: authActionTypes.FRGTPASS_EMAILINIT,
    payload: email,
});

export const frtPass_EmailSuccess = () => ({
    type: authActionTypes.FRGTPASS_EMAILSUCCESS,
});

export const frtPass_EmailError = () => ({
    type: authActionTypes.FRGTPASS_EMAILFAIL,
});

export const register_start = (userData: IRegister) => ({
    type: authActionTypes.REGISTER_INIT,
    payload: userData,
});
export const register_success = () => ({
    type: authActionTypes.REGISTER_SUCCESS,
});
export const register_fail = () => ({
    type: authActionTypes.REGISTER_FAIL,
});
export const logoutAction = () => ({
    type: authActionTypes.LOGOUT,
});
