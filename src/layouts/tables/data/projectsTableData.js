import { useState, useEffect } from "react";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { Avatar, Tooltip } from "@mui/material";

export default function Data() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("https://voyage-back.onrender.com/api/resume/view");
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
      { Header: "Position", accessor: "position", align: "center" },
      { Header: "ETC", accessor: "etc", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: candidates?.map((candidate) => ({
      name: (
        <MDTypography variant="button" fontWeight="medium">
          {candidate.firstName} {candidate.lastName}
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
      position: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.applyForPosition}
        </MDTypography>
      ),
      etc: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.year} years, {candidate.month} months
        </MDTypography>
      ),
      action: (
        <Tooltip
          title={
            <MDTypography variant="body2">{`${candidate.firstName} ${candidate.lastName}`}</MDTypography>
          }
          arrow
        >
          <MDTypography component="a" href={candidate?.resumeImage} target="_blank" color="text">
            <Avatar
              alt={`${candidate.firstName} ${candidate.lastName}`}
              src={candidate?.resumeImage}
              sx={{
                borderRadius: "50%",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                  cursor: "pointer",
                },
              }}
            />
          </MDTypography>
        </Tooltip>
      ),
    })),
  };
}
