/* eslint-disable no-console */
import React from "react";
import {
    Grid,
    TextField,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormHelperText,
    FormLabel,
} from "@material-ui/core";
import { Formik, Form, FormikProps } from "formik";
import { IRegister } from "../../../../global";
import { validate, handleSubmitting } from "../../../utils/form";
import { UserFormObject, INIT_VALUE, useStyles } from "./validationAndStyles";

const UserForm: React.FunctionComponent = () => {
    const classes = useStyles();

    const createNewUser = async (values: IRegister, { setSubmitting }) => {
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
                onSubmit={createNewUser}
                validate={validate(UserFormObject)}
                validateOnBlur={false}
            >
                {(props: FormikProps<IRegister>) => {
                    const { values, errors, handleChange, isSubmitting } =
                        props;
                    return (
                        <Form>
                            <h1 className={classes.title}>Sign Up</h1>
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
                                        name="fullName"
                                        id="fullName"
                                        label="Full Name"
                                        value={values?.fullName}
                                        type="text"
                                        helperText={errors?.fullName}
                                        error={errors?.fullName ? true : false}
                                        onChange={handleChange}
                                        // onBlur={handleBlur}
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
                                        name="email"
                                        id="email"
                                        label="Email ID"
                                        value={values?.email}
                                        type="email"
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
                                        name="phone"
                                        id="phone"
                                        label="Phone Number"
                                        value={values?.phone}
                                        type="text"
                                        helperText={errors?.phone}
                                        error={errors?.phone ? true : false}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={10}
                                    md={10}
                                    sm={10}
                                    xs={10}
                                    className={classes.radioClass}
                                >
                                    <FormLabel component="legend">
                                        Role:
                                    </FormLabel>
                                    <RadioGroup
                                        aria-label="role"
                                        name="role"
                                        id="role"
                                        value={values?.role}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel
                                            value="student"
                                            control={<Radio />}
                                            label="Student"
                                        />
                                        <FormControlLabel
                                            value="mentor"
                                            control={<Radio />}
                                            label="Mentor"
                                        />
                                    </RadioGroup>
                                    <FormHelperText>
                                        {errors?.role}
                                    </FormHelperText>
                                </Grid>
                                {values?.role === "student" && (
                                    <Grid
                                        item
                                        lg={10}
                                        md={10}
                                        sm={10}
                                        xs={10}
                                        className={classes.textField}
                                    >
                                        <TextField
                                            name="experience"
                                            id="experience"
                                            label="Experience"
                                            value={values?.experience}
                                            type="text"
                                            helperText={errors?.experience}
                                            error={
                                                errors?.experience
                                                    ? true
                                                    : false
                                            }
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                )}
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
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        label="Confirm password"
                                        value={values?.confirmPassword}
                                        type="password"
                                        helperText={errors?.confirmPassword}
                                        error={
                                            errors?.confirmPassword
                                                ? true
                                                : false
                                        }
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
                                        Sign Up
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

export default UserForm;
