import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, FormControl } from "@mui/material";
import HelperText from "../shared/HelperText";
import TextInput from "../shared/TextInput";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import GoogleSignIn from "./GoogleSignIn";
import ForgotPasswordForm from "./ForgotPasswordForm";

const initialFormValues = {
    email: "",
    password: "",
};

const emailRegExp =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const Login = () => {
    const [formValues, setFormValues] = useState(initialFormValues);
    const [formErrors, setFormErrors] = useState({});
    const [hasErrors, setHasErrors] = useState(true);
    const [showLoginForm, setShowLoginForm] = useState(true);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { t } = useTranslation(["auth"]);

    const validateInput = (name, value) => {
        if (name === "email" && !emailRegExp.test(value)) {
            return `Invalid ${name}`;
        }

        if (name === "password" && value.length < 8) {
            return `${name} must be longer than 8 characters`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormValues({
            ...formValues,
            [name]: value,
        });

        setFormErrors({
            ...formErrors,
            [name]: validateInput(name, value),
        });
    };

    useEffect(() => {
        setHasErrors(
            Object.keys(formErrors).some((key) => {
                return !!formErrors[key];
            })
        );
    }, [formErrors]);

    const handleRegularLogin = (e) => {
        e.preventDefault();

        axios
            .post(`http://localhost:5001/user/auth/login`, {
                ...formValues,
            })
            .then((response) => {
                let bearer = {
                    login_type: "normal",
                    token: response.data.token,
                };
                window.localStorage.setItem("bearer", JSON.stringify(bearer));
                enqueueSnackbar("Login Successful!", {
                    variant: "success",
                });
                return navigate("/home");
            })
            .catch((err) => {
                console.error("Error while Logging in", err?.response.data);
                return enqueueSnackbar(
                    err?.response?.data?.message ?? "Please try again!",
                    { variant: "error" }
                );
            });
    };

    return (
        <Grid container>
            <Grid
                item
                xs={12}
                md={12}
                sm={12}
                sx={{
                    backgroundColor: 'black',
                    p: 2,
                    display: "grid",
                    minHeight: "100vh",
                    alignContent: "center",
                }}
            >
                {/* Login Form */}
                {showLoginForm ? (
                    <form method="POST" onSubmit={handleRegularLogin}>
                        <Typography variant="h4" textAlign="center" my={2} color='#00FF00'>
                            {t("login")}
                        </Typography>

                        <center>
                            <FormControl fullWidth sx={{ width: "80%" }}>
                                <TextInput
                                    name="email"
                                    placeholder={t("emailAddress")}
                                    type="email"
                                    label={t("emailAddress")}
                                    value={formValues.email}
                                    onChange={handleInputChange}
                                    error={!!formErrors.email}
                                />
                            </FormControl>
                            <HelperText
                                text={formErrors.email}
                                style={{ width: "80%" }}
                            />

                            <FormControl fullWidth sx={{ width: "80%" }}>
                                <TextInput
                                    name="password"
                                    placeholder={t("password")}
                                    type="password"
                                    label={t("password")}
                                    value={formValues.password}
                                    onChange={handleInputChange}
                                    error={!!formErrors.password}
                                />
                            </FormControl>
                            <HelperText
                                text={formErrors.password}
                                style={{ width: "80%",}}
                            />

                            <FormControl fullWidth sx={{ width: "80%" }}>
                                <Typography textAlign="end">
                                    <Button
                                        onClick={() => {
                                            setShowLoginForm(false);
                                        }}
                                        sx={{color: '#00FF00'}}
                                    >
                                        {t("forgotPassword")}
                                    </Button>
                                </Typography>
                            </FormControl>

                            <FormControl fullWidth sx={{ width: "80%" }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        backgroundColor: "#00FF00",
                                        mt: 2,
                                    }}
                                    type="submit"
                                    disabled={hasErrors}
                                >
                                    {t("login")}
                                </Button>
                            </FormControl>
                        </center>
                    </form>
                ) : (
                    <ForgotPasswordForm setShowLoginForm={setShowLoginForm} />
                )}

                <center>
                    <FormControl fullWidth sx={{ width: "30%", m: 2 }}>
                        <GoogleSignIn />
                    </FormControl>

                    <FormControl fullWidth sx={{ width: "80%" }}>
                        <Typography variant="body1" color='white'>
                            Don't have an account?{" "}
                            <Link to="/signup" style={{color:'#00FF00'}}>Sign Up here</Link>
                        </Typography>
                    </FormControl>
                </center>
            </Grid>
        </Grid>
    );
};

export default Login;
