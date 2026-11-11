import { Card, CardContent, Typography, Box, Tooltip, Chip } from "@mui/material";
import { Fragment } from "react";
import dashboardData from "./dashboardData";

export default function InterviewHeatmap({ interviews = dashboardData.interviews }) {
  const maxCount = Math.max(1, ...interviews.slots.flatMap((slot) => slot.counts));
  const getCellColor = (count) => count === 0
    ? "#F2F4F7"
    : `rgba(249, 115, 22, ${0.2 + (count / maxCount) * 0.75})`;

  return (
    <Card sx={{ width: "100%", height: "100%", borderRadius: 3, border: "1px solid #EAECF0", boxShadow: "0 2px 8px rgba(16,24,40,.04)" }}>
      <CardContent sx={{ p: 1.75 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.4}>
          <Box>
            <Typography fontSize={14} fontWeight={700} color="#172033">Interviews this week</Typography>
            <Typography fontSize={10.5} color="#667085" sx={{ mt: 0.2 }}>Illustrative weekly schedule</Typography>
          </Box>
          <Chip label={`${interviews.total} interviews`} size="small" sx={{ height: 24, bgcolor: "#FFF4EF", color: "#C2410C", fontWeight: 700, fontSize: 10.5 }} />
        </Box>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "42px repeat(7, minmax(0, 1fr))",
            rowGap: "5px",
            columnGap: "4px",
          }}
        >
          <div />
          {interviews.days.map((d) => (
            <div
              key={d}
              style={{
                fontSize: 11,
                textAlign: "center",
                color: "#6b7280",
                fontWeight: 500,
              }}
            >
              {d}
            </div>
          ))}

          {interviews.slots.map(({ label, counts }) => (
            <Fragment key={label}>
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  lineHeight: "20px",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
              {counts.map((count, i) => (
                <Tooltip key={`${label}-${interviews.days[i]}`} title={`${count} interview${count === 1 ? "" : "s"} · ${interviews.days[i]} at ${label}`} arrow>
                  <Box
                    role="img"
                    aria-label={`${count} interviews, ${interviews.days[i]} at ${label}`}
                    sx={{ height: 18, borderRadius: 1, bgcolor: getCellColor(count), transition: "transform .15s ease, box-shadow .15s ease", "&:hover": { transform: "scaleY(1.16)", boxShadow: "0 2px 5px rgba(16,24,40,.14)" } }}
                  />
                </Tooltip>
              ))}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}