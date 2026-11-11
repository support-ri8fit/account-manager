import { Doughnut } from "react-chartjs-2";
import { Card, CardContent, Typography, Box } from "@mui/material";
import dashboardData from "./dashboardData";

const options = {
  maintainAspectRatio: false,
  responsive: true,
  cutout: "68%",
  plugins: {
    legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", boxWidth: 8, padding: 14, color: "#667085", font: { size: 10 } } },
    tooltip: { callbacks: { label: (context) => ` ${context.label}: ${context.parsed} candidates` } },
  },
};

export default function ExperienceDonut({ experience = dashboardData.experience }) {
  const total = experience.values.reduce((sum, value) => sum + value, 0);
  const data = {
    labels: experience.labels,
    datasets: [{ data: experience.values, backgroundColor: ["#1E3A8A", "#F97316", "#FDBA74"], borderWidth: 0 }],
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3, border: "1px solid #EAECF0", boxShadow: "0 2px 8px rgba(16,24,40,.04)" }}>
      <CardContent
        sx={{
          pb: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontWeight={700} fontSize={14} color="#172033" mb={0.25}>
          Candidate experience
        </Typography>
        <Typography fontSize={10.5} color="#667085" mb={0.5}>
          {total} candidates · years of experience
        </Typography>

        <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
          <Doughnut data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}