import * as Yup from "yup";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
    root: {
        maxWidth: "450px",
        display: "block",
        margin: "0 auto",
    },
    textField: {
        "& > *": {
            width: "100%",
        },
    },
    radioClass: {
        marginTop: "16px",
    },
    submitButton: {
        marginTop: "24px",
        textAlign: "center",
    },
    title: { textAlign: "center" },
    successMessage: { color: "green" },
    errorMessage: { color: "red" },
});

export const INIT_VALUE = {
    email: "",
    phone: null,
    password: "",
};

export const UserFormObject = function () {
    return Yup.object().shape(
        {
            phone: Yup.string().when("email", {
                is: (email) => email?.length > 0,
                then: Yup.string()
                    .matches(/^([7-9][0-9]{9})$/, "Enter valid phone number")
                    .required("Phone number is required for registration")
                    .nullable(),
                otherwise: Yup.string(),
            }),
            email: Yup.string().when("phone", {
                is: (phone) => phone?.length > 0,
                then: Yup.string()
                    .email()
                    .required("Enter valid email-id")
                    .nullable(),
                otherwise: Yup.string(),
            }),
            password: Yup.string()
                .min(8, `Password must be atleast ${8} characters`)
                .max(20, `Password cannot be more than ${20} characters`)
                .matches(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/,
                    `Password must contain - One uppercase, one lowercase, one special character and no spaces.`
                )
                .required(
                    `Enter valid password. One uppercase, one lowercase, one special character and no spaces`
                ),
        },
        [["email", "phone"]]
    );
};
