/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React, { useEffect } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch, connect } from "react-redux";
import { useLastLocation } from "react-router-last-location";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import DefaultPage from "../pages/DefaultPage";
// import ErrorsPage from "../pages/errors/ErrorsPage";
// import LogoutPage from "../pages/auth/Logout";
// // import * as routerHelpers from "../router/RouterHelpers";
// import AuthPage from "../pages/auth/AuthPage";
// import {
//     appConstClearError,
//     clearToastMessage,
// } from "../store/appStore/appStore.action";

const Routes = withRouter(({ history, apiErrors, toastMessage }) => {
    const lastLocation = useLastLocation();
    const dispatch = useDispatch();
    routerHelpers.saveLastLocation(lastLocation);
    // const { isAuthorized, menuConfig, userLastLocation } = useSelector(
    //     ({ auth, urls, builder: { menuConfig }, user, appData }) => {
    //         return {
    //             menuConfig,
    //             isAuthorized: user.userData !== undefined,
    //             userLastLocation: "/",
    //         }; /* routerHelpers.getLastLocation() */
    //     },
    //     shallowEqual
    // );
    // useEffect(() => {
    //     console.log(toastMessage);
    //     if (apiErrors) {
    //         toast.error(apiErrors.message);
    //         dispatch(appConstClearError());
    //     }
    //     if (toastMessage) {
    //         toast[toastMessage.type](toastMessage.message);
    //         dispatch(clearToastMessage());
    //     }
    // }, [apiErrors, toastMessage]);
    return (
        <>
            <Switch>
                {!isAuthorized ? (
                    /* Render auth page when user at `/auth` and not authorized. */
                    <AuthPage />
                ) : (
                    /* Otherwise redirect to root page (`/`) */
                    <Redirect from="/auth" to={userLastLocation} />
                )}

                <Route path="/error" component={ErrorsPage} />
                <Route path="/logout" component={LogoutPage} />

                {!isAuthorized ? (
                    /* Redirect to `/auth` when user is not authorized */
                    <Redirect to="/auth/login" />
                ) : (
                    <Layout>
                        <DefaultPage userLastLocation={userLastLocation} />
                    </Layout>
                )}
            </Switch>
            <ToastContainer />
        </>
    );
}

// const mapStateToProps = ({ appData }) => ({
//     apiErrors: appData.apiErrors,
//     toastMessage: appData.toastObj,
// });

export default Routes;
