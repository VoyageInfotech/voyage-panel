import { useState, useEffect } from "react";
import axios from "axios";
import MDTypography from "components/MDTypography";

export default function Data() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("https://voyage-back.onrender.com/api/user/login-users");
        console.log(response?.data.users);
        setCandidates(Array.isArray(response?.data?.users) ? response.data.users : []);
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
    ],

    rows: candidates.map((candidate) => ({
      name: (
        <MDTypography variant="button" fontWeight="medium">
          {candidate?.name}
        </MDTypography>
      ),
      email: (
        <MDTypography component="a" variant="button" color="text" fontWeight="medium">
          {candidate?.email}
        </MDTypography>
      ),
    })),
  };
}
