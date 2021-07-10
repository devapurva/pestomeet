import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
    breakpoints: {
        keys: ["xs", "sm", "sm", "lg", "xl"],
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    direction: "ltr",
    mixins: {
        toolbar: {
            minHeight: 56,
            "@media (min-width:0px) and (Screen.orientation: landscape)": {
                minHeight: 48,
            },
            "@media (min-width:600px)": {
                minHeight: 64,
            },
        },
    },
    palette: {
        common: {
            black: "#000",
            white: "#fff",
        },
        type: "light",
        primary: {
            light: "#7986cb",
            main: "#3f51b5",
            dark: "#303f9f",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff4081",
            main: "#f50057",
            dark: "#c51162",
            contrastText: "#fff",
        },
        error: {
            light: "#e57373",
            main: "#f44336",
            dark: "#d32f2f",
            contrastText: "#fff",
        },
    },
});

export default theme;
