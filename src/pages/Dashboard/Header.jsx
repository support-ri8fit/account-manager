import { Box, Typography, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getItem } from "../../utils/constants";

export default function Header({ periodLabel = "Illustrative sample data" }) {
  let userName = "there";
  try {
    const savedUser = getItem("am_user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    userName = user?.name || user?.full_name || user?.username || userName;
  } catch {
    // Keep a friendly fallback if stored profile data is unavailable.
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={750} letterSpacing="-.35px">Welcome, {userName}</Typography>
        <Typography color="text.secondary" fontSize={13}>
          A snapshot of hiring activity, pipeline health, and team outcomes.
        </Typography>
      </Box>

      <Chip
        icon={<CalendarMonthIcon sx={{ fontSize: "17px !important" }} />}
        label={periodLabel}
        variant="outlined"
        sx={{ borderRadius: 2, color: "#475467", bgcolor: "#fff", borderColor: "#E4E7EC", fontWeight: 600, fontSize: 11.5 }}
      />
    </Box>
  );
}