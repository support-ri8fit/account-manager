import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

export default function StatsCards({ statusCards = [] }) {
  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {statusCards.map((s, i) => (
        <Grid
          key={i}
          item
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Card
            sx={{
              position: "relative",
              overflow: "hidden",
              bgcolor: "#fff",
              color: "#172033",
              border: "1px solid #EAECF0",
              borderTop: `3px solid ${s.color}`,
              borderRadius: 2.5,
              flex: 1,        // 🔑 stretch horizontally
              width: "100%", // 🔑 required
              height: "100%",
              minWidth: 0,    // 🔑 prevents overflow
              boxShadow: "0 2px 8px rgba(16,24,40,.035)",
            }}
          >
            <CardContent sx={{ p: 1.8, "&:last-child": { pb: 1.8 } }}>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: s.color, mb: 0.8 }} />
              <Typography fontSize={11.5} color="#667085" fontWeight={600} noWrap>
                {s.title}
              </Typography>
              <Typography fontWeight={750} fontSize={20} color="#172033" noWrap sx={{ mt: 0.35, letterSpacing: "-.35px" }}>
                {s.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}