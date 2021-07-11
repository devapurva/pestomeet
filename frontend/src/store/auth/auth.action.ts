import { IError, ILogin, IRegister } from "../../../global";
import { authActionTypes } from "./auth.actiontype";

export const loginStart = (emailAndPassoword: ILogin) => ({
    type: authActionTypes.LOGIN_INIT,
    payload: emailAndPassoword,
});

export const loginSucess = (userData: ILogin) => ({
    type: authActionTypes.LOGIN_SUCCESS,
    payload: { userData },
});

export const loginFail = (error: IError) => ({
    type: authActionTypes.LOGIN_FAIL,
    payload: error,
});

export const logoutStart = () => ({
    type: authActionTypes.LOGOUT_INIT,
});

export const frtPassSendEmail = (email: string) => ({
    type: authActionTypes.FRGTPASS_EMAILINIT,
    payload: email,
});

export const frtPassEmailSuccess = () => ({
    type: authActionTypes.FRGTPASS_EMAILSUCCESS,
});

export const frtPassEmailError = () => ({
    type: authActionTypes.FRGTPASS_EMAILFAIL,
});

export const registerStart = (userData: IRegister) => ({
    type: authActionTypes.REGISTER_INIT,
    payload: userData,
});
export const registerSuccess = () => ({
    type: authActionTypes.REGISTER_SUCCESS,
});
export const registerFail = () => ({
    type: authActionTypes.REGISTER_FAIL,
});
export const logoutAction = () => ({
    type: authActionTypes.LOGOUT,
});
