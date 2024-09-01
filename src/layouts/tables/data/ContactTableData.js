import { useState, useEffect } from "react";
import axios from "axios";
import MDTypography from "components/MDTypography";

export default function Data() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/contact/view");
        setCandidates(response?.data?.data);
        console.log("resume", response.data?.data); // Logging the fetched data
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchCandidates();
  }, []);

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "30%", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Mobile", accessor: "mobile", align: "center" },
      { Header: "Subject", accessor: "subject", align: "center" },
      { Header: "Message", accessor: "message", align: "center" },
    ],

    rows: candidates?.map((candidate) => ({
      name: (
        <MDTypography variant="button" fontWeight="medium">
          {candidate?.name}
        </MDTypography>
      ),
      email: (
        <MDTypography component="a" variant="button" color="text" fontWeight="medium">
          {candidate.email}
        </MDTypography>
      ),
      mobile: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.mobile}
        </MDTypography>
      ),
      subject: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.subject}
        </MDTypography>
      ),
      message: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.message}
        </MDTypography>
      ),
    })),
  };
}
