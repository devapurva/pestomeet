import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore } from "redux-persist";
// import logger from "redux-logger";
import { HTTPClient } from "../services";

import RootReducer from "./root.reducer";
import RootSaga from "./root.saga";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

// import { appConst_init } from "./appStore/appStore.action";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
    // middleware.push(logger)
}

const store = createStore(
    RootReducer,
    composeEnhancers(applyMiddleware(...middleware))
);

// eslint-disable-next-line import/exports-last
export const persistor = persistStore(store, {}, () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth }: { auth: any } = store.getState();
    if (auth.authToken) {
        HTTPClient.saveHeader({
            key: "Authorization",
            value: `Bearer ${auth.authToken}`,
        });
        // store.dispatch(appConst_init());
    }
});

sagaMiddleware.run(RootSaga);

export default store;
