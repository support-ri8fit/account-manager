import { Avatar, Card, CardContent, Chip, Typography } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import dashboardData from "./dashboardData";

export default function RecentlyHired({ hires = dashboardData.recentHires }) {
  return (
    <Card sx={{ borderRadius: 3, border: "1px solid #EAECF0", boxShadow: "0 2px 8px rgba(16,24,40,.04)", height: "100%" }}>
      <CardContent sx={{ pt: 1.75, pb: 1.5 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: "#FFF0E6",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PeopleAltOutlinedIcon sx={{ fontSize: 18, color: "#FB923C" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Recent hires</div>
              <div style={{ color: "#667085", fontSize: 10.5, marginTop: 1 }}>Illustrative sample records</div>
            </div>
          </div>
          <Chip label={`${hires.length} hires`} size="small" sx={{ height: 24, bgcolor: "#FFF4EF", color: "#C2410C", fontWeight: 700, fontSize: 10.5 }} />
        </div>

        {hires.map((item, i) => (
          <div key={`${item.name}-${item.hired}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
              <Avatar sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: ["#E0F2FE", "#FCE7F3", "#EDE9FE", "#DCFCE7", "#FEF3C7"][i % 5], color: ["#0369A1", "#BE185D", "#6D28D9", "#15803D", "#B45309"][i % 5], fontWeight: 700, fontSize: 13 }}>
                {item.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
              </Avatar>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 650, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#172033" }}>
                  {item.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 10.5, color: "#667085", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.country} · {item.role}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 11.5, color: "#344054", whiteSpace: "nowrap" }}>{item.salary}</div>
                <div style={{ fontSize: 10, color: "#98A2B3", marginTop: 2 }}>{item.hired}</div>
              </div>
            </div>

            {i < hires.length - 1 && (
              <div style={{ height: 1, backgroundColor: "#F3F4F6" }} />
            )}
          </div>
        ))}

      </CardContent>
    </Card>
  );
}