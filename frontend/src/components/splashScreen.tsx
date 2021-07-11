import React from "react";
import { CircularProgress } from "@material-ui/core";

const SplashScreen = () => {
    return (
        <>
            <div>
                <CircularProgress className="kt-splash-screen__spinner" />
            </div>
        </>
    );
};

export default SplashScreen;
