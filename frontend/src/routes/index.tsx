// /**
//  * High level router.
//  *
//  * Note: It's recommended to compose related routes in internal router
//  * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
//  */

// import React, { useEffect } from "react";
// import { Redirect, Route, Switch, withRouter } from "react-router-dom";
// import { shallowEqual, useSelector, useDispatch, connect } from "react-redux";
// import { useLastLocation } from "react-router-last-location";
// import { IRoutes } from "../../global";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import DefaultRoutes from "./defaultRoutes";
// // import ErrorsPage from "../pages/errors/ErrorsPage";
// // import LogoutPage from "../pages/auth/Logout";
// // // import * as routerHelpers from "../router/RouterHelpers";
// // import AuthPage from "../pages/auth/AuthPage";
// // import {
// //     appConstClearError,
// //     clearToastMessage,
// // } from "../store/appStore/appStore.action";
// import Snackbar from "@material-ui/core/Snackbar";
// import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

// function Alert(props: AlertProps) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

// const Routes = () => {
//     // const lastLocation = useLastLocation();
//     // const dispatch = useDispatch();
//     // const { toastMessages } = useSelector ( ({ appData }) => return toastMessages);
//     const [open, setOpen] = React.useState<boolean>(false);

//     const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
//         if (reason === "clickaway") {
//             return;
//         }

//         setOpen(false);
//     };
//     // routerHelpers.saveLastLocation(lastLocation);
//     // const { isAuthorized, menuConfig, userLastLocation } = useSelector(
//     //     ({ auth, urls, builder: { menuConfig }, user, appData }) => {
//     //         return {
//     //             menuConfig,
//     //             isAuthorized: user.userData !== undefined,
//     //             userLastLocation: "/",
//     //         }; /* routerHelpers.getLastLocation() */
//     //     },
//     //     shallowEqual
//     // );
//     useEffect(() => {
//         if (toastMessage) {
//             setOpen(true);
//         }
//     }, [toastMessage]);
//     return (
//         <>
//             <Switch>
//                 {!isAuthorized ? (
//                     /* Render auth page when user at `/auth` and not authorized. */
//                     <AuthPage />
//                 ) : (
//                     /* Otherwise redirect to root page (`/`) */
//                     <Redirect from="/auth" to={userLastLocation} />
//                 )}

//                 <Route path="/error" component={ErrorsPage} />
//                 <Route path="/logout" component={LogoutPage} />

//                 {!isAuthorized ? (
//                     /* Redirect to `/auth` when user is not authorized */
//                     <Redirect to="/auth/login" />
//                 ) : (
//                     <Layout>
//                         <DefaultRoutes userLastLocation={userLastLocation} />
//                     </Layout>
//                 )}
//             </Switch>

//             <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//                 <Alert onClose={handleClose} severity={toastMessage?.type}>
//                     {toastMessage?.message}
//                 </Alert>
//             </Snackbar>
//         </>
//     );
// };

// export default withRouter(Routes);
