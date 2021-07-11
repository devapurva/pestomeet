/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { takeLatest, put, call, all } from "redux-saga/effects";
import { authService, HTTPClient } from "../../services";
import { ILogin, IAuthReducer } from "../../../global";
import { authActionTypes } from "./auth.actiontype";
import { loginSucess, loginFail } from "./auth.action";
// import { forgotLastLocation } from "../../router/RouterHelpers";
// import { appConstOnLogout, appConst_init } from "../appStore/appStore.action";
// import { onUserLogin, onUserLogout } from "../userStore/user.action";
// import {
//     logoutAction,
// } from "../modules_mallsStore/mm.actions";

export function* handleLogin({
    type,
    payload: { email, password },
}: {
    type: typeof authActionTypes.LOGIN_INIT;
    payload: ILogin;
}) {
    try {
        const userData = yield authService.login({ email, password });
        HTTPClient.saveHeader({
            key: "Authorization",
            value: `Bearer ${userData.authToken}`,
        });
        yield all([
            put(loginSucess(userData)),
            // put(onUserLogin(userData)),
            // put(appConst_init()),
            // put(modules_allowed(userData.permissions)),
            //
        ]);
    } catch (error) {
        const {
            data: { status },
        } = error;
        console.log(status);
        yield put(loginFail(status));
    }
}

export function* loginSaga() {
    yield takeLatest(authActionTypes.LOGIN_INIT, handleLogin);
}

export function* handleLogout() {
    // yield forgotLastLocation();
    // yield put(appConstOnLogout());
    // yield put(onUserLogout());
    // yield put(logoutAction());
    yield HTTPClient.deleteHeader("Authorization");
}

export function* logoutSaga() {
    yield takeLatest(authActionTypes.LOGOUT_INIT, handleLogout);
}

export function* handleFrgtPassSendEmail({
    type,
    payload: email,
}: {
    type: typeof authActionTypes.FRGTPASS_EMAILINIT;
    payload: string;
}) {
    try {
        const response = yield authService.forgotPass_sendEmail(email);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

export function* frgtPassEmailSend() {
    yield takeLatest(
        authActionTypes.FRGTPASS_EMAILINIT,
        handleFrgtPassSendEmail
    );
}

export function* frgtPassSaga() {
    yield all([call(frgtPassEmailSend)]);
}

export function* handleRegisterUser({
    type,
    payload: { email, password, authToken, fullName, phone, experience, role },
}: {
    type: typeof authActionTypes.REGISTER_INIT;
    payload: IAuthReducer;
}) {
    try {
        const response = yield authService.registerUser({
            email,
            password,
            authToken,
            fullName,
            phone,
            experience,
            role,
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

export function* registerSagar() {
    yield takeLatest(authActionTypes.REGISTER_INIT, handleRegisterUser);
}

export function* authSaga() {
    yield all([
        call(loginSaga),
        call(logoutSaga),
        call(frgtPassSaga),
        call(registerSagar),
    ]);
}
