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
import { Box, Link, InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "https://voyage-back.onrender.com/api/user/register",
          values
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        toast.success(response.data.message);
        navigate("/login");
      } catch (error) {
        toast.error("Registration failed: " + (error.response?.data?.message || error.message));
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <MDBox
        pt={6}
        pb={3}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
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
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </MDBox>
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
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                    Register
                  </Button>
                </MDBox>
                <MDBox mt={3}>
                  <MDTypography variant="body2">
                    Already have an account?{" "}
                    <Link href="/login" variant="body2" underline="hover">
                      Login
                    </Link>
                  </MDTypography>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </>
  );
}

export default Register;
