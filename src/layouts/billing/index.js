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

function Testimonial() {
  const [image, setImage] = useState({ url: "", public_id: "" });
  const [testimonials, setTestimonials] = useState([]);

  const validationSchema = Yup.object({
    ClientName: Yup.string().required("Client Name is required"),
    ClientImage: Yup.string().required("Client Image is required"),
    Review: Yup.string().required("Review is required"),
  });

  const handleFileChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          "https://voyage-back.onrender.com/api/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setImage({
          url: response.data.url,
          public_id: response.data.public_id,
        });
        setFieldValue("ClientImage", response.data.url);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get("https://voyage-back.onrender.com/api/testimonial/view");
      setTestimonials(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch testimonials");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await axios.delete(`https://voyage-back.onrender.com/api/testimonial/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete testimonial");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
      <MDBox mt={6} mb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Formik
              initialValues={{
                ClientName: "",
                ClientImage: "",
                Review: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const response = await axios.post(
                    "https://voyage-back.onrender.com/api/testimonial/add",
                    values
                  );
                  toast.success(response.data.message);
                  resetForm();
                  setImage({ url: "", public_id: "" });
                  fetchTestimonials();
                } catch (error) {
                  toast.error(error.response?.data?.message || "Failed to add testimonial");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      id="file-input"
                      style={{ display: "none" }}
                    />
                    <Avatar
                      alt="Client Image"
                      src={image.url}
                      onClick={() => document.getElementById("file-input").click()}
                      sx={{
                        cursor: "pointer",
                        width: 96,
                        height: 96,
                      }}
                    />
                    {errors.ClientImage && touched.ClientImage && (
                      <MDTypography color="error" variant="caption">
                        {errors.ClientImage}
                      </MDTypography>
                    )}
                    <Field
                      name="ClientName"
                      as={TextField}
                      fullWidth
                      label="Client Name"
                      placeholder="Enter client name"
                      variant="filled"
                      error={touched.ClientName && !!errors.ClientName}
                      helperText={touched.ClientName && errors.ClientName}
                    />
                    <Field
                      name="Review"
                      as={TextField}
                      fullWidth
                      placeholder="Enter your review"
                      label="Review"
                      variant="filled"
                      multiline
                      rows={4}
                      error={touched.Review && !!errors.Review}
                      helperText={touched.Review && errors.Review}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      sx={{
                        color: "#fff",
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <Grid item xs={12} sm={6} md={6} lg={6} key={testimonial._id}>
                    <Card>
                      <MDBox
                        p={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                      >
                        <Avatar
                          src={testimonial.ClientImage}
                          alt={testimonial.ClientName}
                          sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          {testimonial.ClientName}
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {testimonial.Review}
                        </MDTypography>
                        <MDButton
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteTestimonial(testimonial._id)}
                          startIcon={<Icon>delete</Icon>}
                          sx={{ mt: 2 }}
                        >
                          Delete
                        </MDButton>
                      </MDBox>
                    </Card>
                  </Grid>
                ))
              ) : (
                <MDTypography variant="h6" textAlign="center" width="100%">
                  No testimonials available.
                </MDTypography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Testimonial;
