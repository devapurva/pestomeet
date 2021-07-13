/* eslint-disable no-console */
import React from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import { ILogin } from "../../../../global";
import { validate, handleSubmitting } from "../../../utils/form";
import { UserFormObject, INIT_VALUE, useStyles } from "./validationAndStyles";

const LoginForm: React.FunctionComponent = () => {
    const classes = useStyles();

    const loginUser = async (values: ILogin, { setSubmitting }) => {
        try {
            // API call integration will be here. Handle success / error response accordingly.
            if (values) {
                console.log(values);
            }
        } catch (error) {
            const { response } = error;
            handleSubmitting({ setSubmitting });
        } finally {
            console.log("inside");
        }
    };

    return (
        <div className={classes.root}>
            <Formik
                initialValues={INIT_VALUE}
                onSubmit={loginUser}
                validate={validate(UserFormObject)}
                validateOnBlur={false}
            >
                {(props: FormikProps<ILogin>) => {
                    const { values, errors, handleChange, isSubmitting } =
                        props;
                    return (
                        <Form>
                            <h1 className={classes.title}>Login</h1>
                            <Grid
                                container
                                justify="space-around"
                                direction="row"
                            >
                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="email"
                                        id="email"
                                        label="Email ID/Phone Number"
                                        value={values?.email}
                                        type="text"
                                        helperText={errors?.email}
                                        error={errors?.email ? true : false}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="password"
                                        id="password"
                                        label="Password"
                                        value={values?.password}
                                        type="password"
                                        helperText={errors?.password}
                                        error={errors?.password ? true : false}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.submitButton}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        disabled={isSubmitting}
                                    >
                                        Login
                                    </Button>
                                    {/* {displayFormStatus && (
                                        <div className="formStatus">
                                            {formStatus.type === "error" ? (
                                                <p
                                                    className={
                                                        classes.errorMessage
                                                    }
                                                >
                                                    {formStatus.message}
                                                </p>
                                            ) : formStatus.type ===
                                              "success" ? (
                                                <p
                                                    className={
                                                        classes.successMessage
                                                    }
                                                >
                                                    {formStatus.message}
                                                </p>
                                            ) : null}
                                        </div>
                                    )} */}
                                </Grid>
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default LoginForm;
