import { call, all } from "redux-saga/effects";
import { authSaga } from "./auth/auth.saga";

function* RootSaga() {
    yield all([call(authSaga)]);
}

export default RootSaga;
