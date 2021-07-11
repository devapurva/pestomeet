import { PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { IAuthInit, IAuthReducer } from "../../../global";
import { authActionTypes } from "./auth.actiontype";

const INIT_STATE: IAuthInit = {
    authToken: null,
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
        whitelist: ["user", "authToken", "userType"],
    },
    (state = INIT_STATE, action: PayloadAction<IAuthReducer>) => {
        switch (action.type) {
            case authActionTypes.LOGIN_INIT:
                return Object.assign({}, state, {
                    loginProcess: true,
                });
            case authActionTypes.LOGIN_SUCCESS:
                return Object.assign({}, state, {
                    loginProcess: false,
                    authToken: action.payload.authToken,
                });
            case authActionTypes.LOGIN_FAIL:
                return Object.assign({}, state, {
                    loginProcess: false,
                    loginError: action.payload,
                });
            case authActionTypes.LOGOUT_INIT:
                return INIT_STATE;
            case authActionTypes.FRGTPASS_EMAILINIT:
                return Object.assign({}, state, {
                    apiProcess: true,
                });
            case authActionTypes.FRGTPASS_EMAILSUCCESS:
                return Object.assign({}, state, {
                    apiProcess: false,
                    frgtPassEmailSent: true,
                });
            case authActionTypes.FRGTPASS_EMAILFAIL:
                return Object.assign({}, state, {
                    apiProcess: false,
                    frgtPassEmailError: true,
                });
            case authActionTypes.REGISTER_INIT:
                return Object.assign({}, state, {
                    apiProcess: true,
                });
            case authActionTypes.REGISTER_SUCCESS:
                return Object.assign({}, state, {
                    apiProcess: false,
                });
            case authActionTypes.REGISTER_FAIL:
                return Object.assign({}, state, {
                    apiProcess: false,
                });
            case authActionTypes.LOGOUT:
                return INIT_STATE;
            default:
                return state;
        }
    }
);

export default authReducer;
