import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Notifications() {
  const navigate = useNavigate();
  const [image, setImage] = useState({ url: "", public_id: "" });
  const [technology, setTechnology] = useState([]);

  const validationSchema = Yup.object({
    LanguagesLogo: Yup.string().url("Invalid URL format").required("Languages Logo is required"),
    LanguagesName: Yup.string().required("Languages Name is required"),
    Experience: Yup.string().required("Experience is required"),
  });

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      axios
        .post("http://localhost:8000/api/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          setImage({
            url: response.data.url,
            public_id: response.data.public_id,
          });
          setFieldValue("LanguagesLogo", response.data.url); // Ensure the field name matches
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          toast.error("Error uploading image");
        });
    }
  };

  const fetchTechnology = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/technology/view");
      setTechnology(response?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch technology");
    }
  };

  const handleDeleteTechnology = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/technology/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchTechnology();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete technology");
    }
  };

  useEffect(() => {
    fetchTechnology();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={10} justifyContent="center">
          <Grid item xs={12} lg={4}>
            <Formik
              initialValues={{
                LanguagesLogo: "",
                LanguagesName: "",
                Experience: "",
                workTime: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  console.log("Form values:", values); // Debugging
                  const response = await axios.post(
                    "http://localhost:8000/api/technology/add",
                    values
                  );
                  toast.success(response.data.message);
                  resetForm();
                  navigate("/technology");
                } catch (error) {
                  toast.error(error.response?.data?.message || "Failed to add technology");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      id="file-input"
                      style={{ display: "none" }}
                    />
                    <Avatar
                      alt="Avatar"
                      src={image?.url || ""}
                      onClick={() => document.getElementById("file-input").click()}
                      style={{
                        cursor: "pointer",
                        width: 96,
                        height: 96,
                        margin: "auto",
                      }}
                    />
                    <Field
                      name="LanguagesName"
                      as={TextField}
                      label="Languages Name"
                      size="small"
                      variant="filled"
                      error={touched.LanguagesName && !!errors.LanguagesName}
                      helperText={touched.LanguagesName && errors.LanguagesName}
                    />
                    <Field
                      name="Experience"
                      as={TextField}
                      label="Experience"
                      size="small"
                      variant="filled"
                      error={touched.Experience && !!errors.Experience}
                      helperText={touched.Experience && errors.Experience}
                    />
                    <Field
                      name="workTime"
                      as={TextField}
                      label="Work Time"
                      variant="filled"
                      size="small"
                      error={touched.workTime && !!errors.workTime}
                      helperText={touched.workTime && errors.workTime}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              {technology.map((tech) => (
                <Grid item xs={12} sm={6} md={3} key={tech._id}>
                  <Card>
                    <MDBox p={2} mx={3} display="flex" justifyContent="center">
                      <MDBox
                        display="grid"
                        justifyContent="center"
                        alignItems="center"
                        color="white"
                        width="5rem"
                        height="5rem"
                        shadow="md"
                        borderRadius="lg"
                        variant="gradient"
                      >
                        <img
                          src={tech.LanguagesLogo}
                          alt={tech.LanguagesName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "inherit",
                          }}
                        />
                      </MDBox>
                    </MDBox>
                    <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
                      <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                        {tech.LanguagesName}
                      </MDTypography>
                      <MDTypography variant="caption" color="text" fontWeight="regular">
                        {tech.Experience}
                      </MDTypography>
                      <MDTypography variant="h5" fontWeight="medium">
                        {tech.workTime}
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" justifyContent="center" mt={{ xs: 2, sm: 0 }}>
                      <MDButton
                        variant="text"
                        color="error"
                        onClick={() => handleDeleteTechnology(tech._id)}
                      >
                        <Icon>delete</Icon>&nbsp;delete
                      </MDButton>
                    </MDBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
