import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography, Box } from "@mui/material";
import dashboardData from "./dashboardData";

const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { position: "top", align: "end", labels: { usePointStyle: true, pointStyle: "circle", boxWidth: 8, padding: 14, color: "#667085", font: { size: 10 } } },
    tooltip: { callbacks: { label: (context) => ` ${context.dataset.label}: ${context.parsed.y} candidates` } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#667085", font: { size: 10 } } },
    y: { beginAtZero: true, ticks: { precision: 0, color: "#667085", font: { size: 10 } }, title: { display: true, text: "Candidates", color: "#667085", font: { size: 10 } }, grid: { color: "#F2F4F7" } },
  },
};

export default function TalentQualityChart({ talent = dashboardData.talent }) {
  const data = {
    labels: talent.labels,
    datasets: [
      { label: "Matched", data: talent.matched, backgroundColor: "#FDBA74", borderRadius: 5, maxBarThickness: 18 },
      { label: "Hired", data: talent.hired, backgroundColor: "#F97316", borderRadius: 5, maxBarThickness: 18 },
    ],
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", border: "1px solid #EAECF0", borderRadius: 3, boxShadow: "0 2px 8px rgba(16,24,40,.04)" }}>
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontWeight={700} fontSize={14} color="#172033">
          Candidate pipeline trend
        </Typography>
        <Typography fontSize={10.5} color="#667085" sx={{ mb: 0.5 }}>Monthly matched and hired candidates · sample period Feb 2025–Jan 2026</Typography>

        <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
          <Bar data={data} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
}