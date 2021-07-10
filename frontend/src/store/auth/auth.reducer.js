import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authActionTypes } from "./auth.actiontype";

const INIT_STATE = {
    authToken: undefined,
    loginProcess: false,
    loginError: null,
    frgtPassEmailSent: false,
    frgtPassEmailError: false,
    apiProcess: false,
};

const authReducer = persistReducer(
    {
        storage,
        key: "demo1-auth",
        whitelist: ["user", "authToken", "userMall"],
    },
    (state = INIT_STATE, { type, payload }) => {
        switch (type) {
            case authActionTypes.LOGIN_INIT:
                return {
                    ...state,
                    loginProcess: true,
                };
            case authActionTypes.LOGIN_SUCCESS:
                return {
                    ...state,
                    loginProcess: false,
                    authToken: payload.userData.authToken,
                };
            case authActionTypes.LOGIN_FAIL:
                return {
                    ...state,
                    loginProcess: false,
                    loginError: payload,
                };
            case authActionTypes.LOGOUT_INIT:
                return INIT_STATE;
            case authActionTypes.FRGTPASS_EMAILINIT:
                return {
                    ...state,
                    apiProcess: true,
                };
            case authActionTypes.FRGTPASS_EMAILSUCCESS:
                return {
                    ...state,
                    apiProcess: false,
                    frgtPassEmailSent: true,
                };
            case authActionTypes.FRGTPASS_EMAILFAIL:
                return {
                    ...state,
                    apiProcess: false,
                    frgtPassEmailError: true,
                };
            case authActionTypes.REGISTER_INIT:
                return {
                    ...state,
                    apiProcess: true,
                };
            case authActionTypes.REGISTER_SUCCESS:
                return {
                    ...state,
                    apiProcess: false,
                };
            case authActionTypes.REGISTER_FAIL:
                return {
                    ...state,
                    apiProcess: false,
                };
            case authActionTypes.LOGOUT:
                return INIT_STATE;
            default:
                return state;
        }
    }
);

export default authReducer;
