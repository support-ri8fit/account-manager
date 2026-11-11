import { Card, Box, Typography, Chip } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import PersonOffOutlined from "@mui/icons-material/PersonOffOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import dashboardData from "./dashboardData";

const donutOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

export default function HiringRisk({ risk = dashboardData.hiringRisk }) {
  const donutData = {
    labels: ["At risk", "On track"],
    datasets: [{ data: [risk.atRiskRequisitions, risk.onTrackRequisitions], backgroundColor: ["#F97316", "#D1FAE5"], borderWidth: 0 }],
  };
  const donutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => ` ${context.label}: ${context.parsed} requisitions` } },
    },
    cutout: "68%",
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #E5E7EB",
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, flexShrink: 0 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1,
            bgcolor: "#EEF2FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InfoOutlined fontSize="small" />
        </Box>
        <Box>
          <Typography fontWeight={700} fontSize={14} color="#172033">Hiring risk & requisition health</Typography>
          <Typography fontSize={10.5} color="#667085">Illustrative account snapshot</Typography>
        </Box>
      </Box>

      {/* Risk Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <RiskTile
          icon={<GroupsOutlined />}
          label="Serving notice"
          value={risk.noticePeriod}
          bg="#E0ECFF"
          color="#2563EB"
        />
        <RiskTile
          icon={<PersonOffOutlined />}
          label="Candidate drop-offs"
          value={risk.candidateDropoffs}
          bg="#FFF1E6"
          color="#F97316"
        />
        <RiskTile
          icon={<WarningAmberOutlined />}
          label="Delayed roles"
          value={risk.delayedRequisitions}
          bg="#ECFDF5"
          color="#059669"
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5} flexShrink={0}>
        <Box>
          <Typography fontWeight={650} fontSize={12.5} color="#344054">Requisition status</Typography>
          <Typography fontSize={10.5} color="#667085">At-risk vs. on-track roles</Typography>
        </Box>
        <Chip size="small" icon={<WarningAmberOutlined />} label={`${risk.atRiskRequisitions} at risk`} sx={{ bgcolor: "#FFF4E5", color: "#B54708", borderColor: "#FEDF89", fontSize: 10.5, fontWeight: 700 }} variant="outlined" />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
        <Box sx={{ width: 112, height: 112, flexShrink: 0, position: "relative" }}>
          <Doughnut data={donutData} options={donutOptions} />
          <Box sx={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", textAlign: "center", pointerEvents: "none" }}>
            <Typography fontSize={19} fontWeight={750} lineHeight={1.1}>{risk.atRiskRequisitions + risk.onTrackRequisitions}</Typography>
            <Typography fontSize={9.5} color="#667085">roles</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gap: 1.1 }}>
          <LegendStat value={risk.atRiskRequisitions} label="At risk" color="#F97316" />
          <LegendStat value={risk.onTrackRequisitions} label="On track" color="#059669" />
        </Box>
      </Box>
    </Card>
  );
}

function RiskTile({ icon, label, value, bg, color }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        border: "1px solid #E5E7EB",
        borderRadius: 2,
        p: 1.5,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          mx: "auto",
          bgcolor: bg,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography fontSize={13} color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography fontWeight={700}>{value}</Typography>
      </Box>
    </Box>
  );
}

function LegendStat({ value, label, color }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: color }} />
      <Typography fontSize={12} color="#667085">{label}</Typography>
      <Typography fontSize={13} fontWeight={750} color="#344054">{value}</Typography>
    </Box>
  );
}