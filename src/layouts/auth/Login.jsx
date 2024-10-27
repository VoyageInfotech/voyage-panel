import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import colors from "assets/theme/base/colors";
import MDTypography from "components/MDTypography";
import { Box, Link } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "https://voyage-back.onrender.com/api/user/login",
          values
        );
        const { token, message, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("name", user);
        navigate("/resume");
      } catch (error) {
        toast.error(error.response?.data?.message || "Login Failed. Please try again.");
        console.error("Login error:", error.response.data.message);
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <ToastContainer />
      <MDBox pt={6} pb={3} width="100%">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={4} lg={3}>
            <Card>
              <MDBox>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <img
                    src="https://i.postimg.cc/0QyCcTMZ/voyage.png"
                    alt="login"
                    style={{
                      width: "40%",
                      height: "30%",
                    }}
                  />
                </Box>
              </MDBox>
              <MDBox
                component="form"
                role="form"
                onSubmit={formik.handleSubmit}
                p={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <MDBox mb={2} width="100%">
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </MDBox>
                <MDBox mb={2} width="100%">
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                  />
                </MDBox>
                <MDBox mt={2} width="100%">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      width: "100%",
                      color: colors.white.main,
                    }}
                  >
                    Login
                  </Button>
                </MDBox>
                <MDBox mt={3}>
                  <MDTypography variant="body2">
                    Don’t have an account?{" "}
                    <Link href="/register" variant="body2" underline="hover">
                      Register
                    </Link>
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </Box>
  );
}

export default Login;
