import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "./styles/theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div>
                <p>A bare bones application!</p>
            </div>
        </ThemeProvider>
    );
}

export default App;
