import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Grid,
  Card,
  TextField,
  Button,
  Box,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

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
        const response = await axios.post("https://voyage-back.onrender.com/api/user/register", {
          ...values,
          role: 1,
        });
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
        closeOnClick
        pauseOnHover
      />
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} md={4} lg={3}>
            <Card>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                p={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Box mb={2} width="100%">
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    name="name"
                    {...formik.getFieldProps("name")}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Box>
                <Box mb={2} width="100%">
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Box>
                <Box mb={2} width="100%">
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    name="password"
                    {...formik.getFieldProps("password")}
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
                </Box>
                <Box mt={2} width="100%">
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                  </Button>
                </Box>
                <Box mt={3}>
                  <Link href="/login" variant="body2">
                    Already have an account? Login
                  </Link>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Register;
