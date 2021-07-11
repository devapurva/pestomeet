import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { LastLocationProvider } from "react-router-last-location";
import { IApp } from "../global";
import theme from "./styles/theme";
import SplashScreen from "./components/splashScreen";

const App: React.FC<IApp> = ({ store, persistor }) => {
    return (
        /* Provide Redux store */
        <Provider store={store}>
            {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
            <PersistGate persistor={persistor} loading={<SplashScreen />}>
                {/* Add high level `Suspense` in case if was not handled inside the React tree. */}
                <React.Suspense fallback={<SplashScreen />}>
                    {/* Override `basename` (e.g: `homepage` in `package.json`) */}
                    <BrowserRouter basename="/">
                        {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
                        <LastLocationProvider>
                            {/* Provide Material theme overrides. */}
                            <ThemeProvider theme={theme}>
                                <CssBaseline />
                                <div>
                                    <p>A bare bones application!</p>
                                </div>
                            </ThemeProvider>
                        </LastLocationProvider>
                    </BrowserRouter>
                </React.Suspense>
            </PersistGate>
        </Provider>
    );
};

export default App;
