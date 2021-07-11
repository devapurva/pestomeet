import { authActionTypes } from "./auth.actiontype";

export const loginStart = (emailAndPassoword) => ({
    type: authActionTypes.LOGIN_INIT,
    payload: emailAndPassoword,
});

export const loginSucess = (userData) => ({
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

export const frtPass_SendEmail = (email) => ({
    type: authActionTypes.FRGTPASS_EMAILINIT,
    payload: email,
});

export const frtPass_EmailSuccess = () => ({
    type: authActionTypes.FRGTPASS_EMAILSUCCESS,
});

export const frtPass_EmailError = () => ({
    type: authActionTypes.FRGTPASS_EMAILFAIL,
});

export const register_start = (payload) => ({
    type: authActionTypes.REGISTER_INIT,
    payload,
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
