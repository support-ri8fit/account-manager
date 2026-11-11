import { Box, Grid } from "@mui/material";
import Header from "./Header";
import AlertBanner from "./AlertBanner";
import RecentlyHired from "./RecentlyHired";
import ExperienceDonut from "./ExperienceDonut";
import InterviewHeatmap from "./InterviewHeatmap";
import StatsCards from "./StatsCards";
import TalentQualityChart from "./TalentQualityChart";
import HiringRisk from "./HiringRisk";
import KpiCards from "./Kpi.jsx";
import dashboardData from "./dashboardData";

export default function AmDashboard() {
  return (
    <Box p={1}>
      <Header periodLabel={dashboardData.periodLabel} />
      {/* <AlertBanner /> */}

      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentlyHired hires={dashboardData.recentHires} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ExperienceDonut experience={dashboardData.experience} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <InterviewHeatmap interviews={dashboardData.interviews} />
        </Grid>
      </Grid>
      <Grid container size={{ xs: 12, md: 12 }} sx={{mt:2}}>
        <StatsCards statusCards={dashboardData.summary} />
      </Grid>
      <Grid container size={{ xs: 12, md: 12 }} sx={{mt:2}}>
        <KpiCards cards={dashboardData.jobs} />
      </Grid>
      <Grid container sx={{display:'flex',justifyContent:"space-between",gap:1,mt:2}}>
        <Grid size={{ xs: 12, md: 5.9 }}>
          <TalentQualityChart talent={dashboardData.talent} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <HiringRisk risk={dashboardData.hiringRisk} />
        </Grid>
      </Grid>
    </Box>
  );
}
