# Candidate Management Forms

Generated Date: 2026-11-03T09:30:42.939Z

Total Source Files: 18

---

## File: pages/1dashboard1/CandidatePipelineFunnel.jsx

```javascript
import React from "react";
import { Box, Typography } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import { COLORS, Dashboard_STATUS_COLORS } from "../../theme/index.js";
import CandidateFunnelChart from "./charts/CandidateFunnelChart";
import CandidateStageColumnChart from "./charts/CandidateStageColumnChart";

// Helper to safely get nested values
const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

// Get count safely from flat or nested structure. When the API returns a
// stage as an object (e.g. { total, current, ... }) instead of a plain
// number, prefer the field matching the selected Cumulative/Current toggle
// before falling back to .total/.value.
const getStageCount = (data, key, countsType) => {
    if (!data) return 0;
    const val = getNestedValue(data, key);

    if (typeof val === "number") return val;
    if (typeof val === "object" && val !== null) {
        if (countsType === "current" && val.current !== undefined) return val.current;
        return val.total ?? val.value ?? 0;
    }
    return 0;
};

// ─── Main funnel sequence ──────────────────────────────────────────────────
const MAIN_FLOW_STAGES = [
    { key: "matched", label: "Matched", Icon: GroupsOutlinedIcon, bg: Dashboard_STATUS_COLORS.matched.bg, color: Dashboard_STATUS_COLORS.matched.color },
    { key: "shortlisted", label: "Shortlisted", Icon: FactCheckOutlinedIcon, bg: Dashboard_STATUS_COLORS.shortlisted.bg, color: Dashboard_STATUS_COLORS.shortlisted.color },
    { key: "interviewing", label: "Interviewing", Icon: EventAvailableOutlinedIcon, bg: Dashboard_STATUS_COLORS.interviewing.bg, color: Dashboard_STATUS_COLORS.interviewing.color },
    { key: "selected", label: "Selected", Icon: HowToRegOutlinedIcon, bg: Dashboard_STATUS_COLORS.selected.bg, color: Dashboard_STATUS_COLORS.selected.color },
    {
        key: "offers.offer_released",
        stageKey: "offer_released",
        label: "Offer Released",
        Icon: DescriptionOutlinedIcon,
        bg: Dashboard_STATUS_COLORS.offer_released.bg,
        color: Dashboard_STATUS_COLORS.offer_released.color,
    },
    { key: "onboarded", label: "Onboarded", Icon: VerifiedOutlinedIcon, bg: Dashboard_STATUS_COLORS.onboarded.bg, color: Dashboard_STATUS_COLORS.onboarded.color },
];

const REJECTED_STAGE = {
    key: "rejected", label: "Rejected", Icon: PersonRemoveOutlinedIcon,
    bg: Dashboard_STATUS_COLORS.rejected.bg, color: Dashboard_STATUS_COLORS.rejected.color, textDark: Dashboard_STATUS_COLORS.rejected.color,
};

const SectionLabel = ({ children }) => (
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.75 }}>
        {children}
    </Typography>
);

// ── Header Suffix ───────────────────────────────────────────────────────
const HEADER_SUFFIX = {
    cumulative: "Pipeline Analytics",   // Keep this as is
    current: "Current Pipeline",
};

export default function CandidatePipelineFunnel({
    data, totalCount, loading, onStageClick, countsType,
}) {
    const rejectedCount = getStageCount(data, "rejected");

    const funnelData = MAIN_FLOW_STAGES.map((stage) => ({
        key: stage.stageKey || stage.key,
        name: stage.label,
        value: getStageCount(data, stage.key, countsType),
        fill: stage.color,
    }));

    return (
        <Box sx={{ bgcolor: "#fff", borderRadius: "12px", p: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 12px rgba(23,79,223,0.07)", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, gap: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>
                    Candidate Pipeline
                    <Box component="span" sx={{ color: COLORS.textSecondary, fontWeight: 500 }}>
                        {" "}: {HEADER_SUFFIX[countsType] || HEADER_SUFFIX.cumulative}
                    </Box>
                </Typography>
                {totalCount > 0 && (
                    <Box sx={{ bgcolor: "#EEF3FF", borderRadius: "20px", px: 1.5, py: 0.4 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: COLORS.royalBlue }}>
                            {totalCount} total candidates
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Main Flow — "Cumulative" counts strictly narrow stage-over-stage, so a
                funnel's tapering shape fits; "Current" counts are an independent
                snapshot per stage (not monotonically decreasing), so it switches to
                a column chart instead of implying a shrinkage that isn't there. */}
            <SectionLabel>Main Flow</SectionLabel>
            {countsType === "current" ? (
                <CandidateStageColumnChart
                    data={funnelData}
                    loading={loading}
                    onSegmentClick={(stageKey) => onStageClick?.(`candidate_stage_breakdown.${stageKey}`)}
                />
            ) : (
                <CandidateFunnelChart
                    data={funnelData}
                    loading={loading}
                    onSegmentClick={(stageKey) => onStageClick?.(`candidate_stage_breakdown.${stageKey}`)}
                />
            )}

            {/* Rejected — shown as its own stat box rather than a drop-off footnote */}
            {!loading && (
                <Box sx={{ pt: 1, mt: 1, borderTop: `1px solid ${COLORS.border}` }}>
                    {/* <SectionLabel>Dropped Off</SectionLabel> */}
                    <Box
                        onClick={() => rejectedCount > 0 && onStageClick?.("candidate_stage_breakdown.rejected")}
                        sx={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            bgcolor: REJECTED_STAGE.bg, border: `1px solid ${REJECTED_STAGE.color}33`,
                            borderRadius: "10px", px: 1.5, py: 1,
                            cursor: rejectedCount > 0 ? "pointer" : "default",
                            transition: "box-shadow 0.15s",
                            "&:hover": rejectedCount > 0 ? { boxShadow: `0 2px 10px ${REJECTED_STAGE.color}22` } : {},
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 26, height: 26, borderRadius: "50%", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <PersonRemoveOutlinedIcon sx={{ fontSize: 14, color: REJECTED_STAGE.color }} />
                            </Box>
                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: REJECTED_STAGE.textDark }}>
                                Rejected Candidates
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: REJECTED_STAGE.color }}>
                            {rejectedCount}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

```

---

## File: pages/1dashboard1/charts/CandidateFunnelChart.jsx

```javascript
import React from "react";
import { Box, Typography } from "@mui/material";
import { FunnelChart, Funnel, Cell, LabelList, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../../../theme/index.js";

const FunnelTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <Box sx={{ bgcolor: COLORS.navyBlue, color: "#fff", px: 1.2, py: 0.8, borderRadius: "8px", fontSize: 12, whiteSpace: "nowrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: fill, flexShrink: 0 }} />
        <Box component="span">{name}: <b>{value}</b></Box>
      </Box>
    </Box>
  );
};

// ── Candidate pipeline as a real funnel — click a segment to drill in ─────
const CandidateFunnelChart = ({ data = [], onSegmentClick, loading }) => {
  if (loading) {
    return <Box sx={{ flex: 1, minHeight: 200, borderRadius: "10px", bgcolor: COLORS.bgPage }} />;
  }

  const hasData = data.some((d) => d.value > 0);
  if (!hasData) {
    return (
      <Box sx={{ flex: 1, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>No pipeline data yet</Typography>
      </Box>
    );
  }

  // Real pipeline counts aren't strictly decreasing (e.g. "Offers" or
  // "Onboarded" can be >= "Selected", since not every offer/onboard traces
  // back through a "selected" marking) — recharts' Funnel assumes a
  // monotonically shrinking series and renders anything that isn't as a
  // flat, untapered rectangle. `sizeValue` drives the trapezoid width (never
  // widening past the narrowest stage so far) while the true count still
  // shows via the "value"-keyed labels/tooltip below.
  let runningMin = Infinity;
  const shapeData = data.map((d) => {
    runningMin = Math.min(runningMin, d.value);
    return { ...d, sizeValue: runningMin };
  });

  return (
    <Box sx={{ flex: 1, minHeight: 0, height: "100%", overflow: "hidden", pb: 0.5 }}>
      <ResponsiveContainer width="100%" height="100%" margin={1}>
        <FunnelChart margin={{ top: 2, right: 30, bottom: 18, left: 20 }}>
          <Tooltip content={<FunnelTooltip />} />
          <Funnel dataKey="sizeValue" data={shapeData} isAnimationActive animationDuration={700} lastShapeType="rectangle">
            <LabelList position="right" dataKey="name" stroke="none" fill={COLORS.textPrimary} fontSize={11} fontWeight={600} offset={12} />
            <LabelList position="left" dataKey="value" stroke="none" fill={COLORS.textSecondary} fontSize={10.5} offset={12} />
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={entry.fill}
                cursor={entry.value > 0 ? "pointer" : "default"}
                onClick={() => entry.value > 0 && onSegmentClick?.(entry.key)}
              />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CandidateFunnelChart;

```

---

## File: pages/1dashboard1/charts/CandidateStageColumnChart.jsx

```javascript
import React from "react";
import { Box, Typography } from "@mui/material";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from "recharts";
import { COLORS } from "../../../theme/index.js";

const ColumnTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <Box sx={{ bgcolor: COLORS.navyBlue, color: "#fff", px: 1.2, py: 0.8, borderRadius: "8px", fontSize: 12, whiteSpace: "nowrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: fill, flexShrink: 0 }} />
        <Box component="span">{name}: <b>{value}</b></Box>
      </Box>
    </Box>
  );
};

// ── Current-pipeline snapshot as independent columns — "Current" counts are
// candidates sitting in each stage right now, not a cumulative flow, so they
// aren't monotonically decreasing (e.g. "Onboarded" can be >= "Selected").
// A funnel's implied shrinkage would misrepresent that; plain columns show
// each stage's count on its own terms instead.
const CandidateStageColumnChart = ({ data = [], onSegmentClick, loading }) => {
  if (loading) {
    return <Box sx={{ flex: 1, minHeight: 200, borderRadius: "10px", bgcolor: COLORS.bgPage }} />;
  }

  const hasData = data.some((d) => d.value > 0);
  if (!hasData) {
    return (
      <Box sx={{ flex: 1, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>No pipeline data yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, height: "100%", overflow: "hidden", pb: 0.5 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 12, bottom: 4, left: 0 }} barCategoryGap="24%">
          <CartesianGrid vertical={false} stroke={COLORS.border} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10.5, fill: COLORS.textSecondary }}
            axisLine={{ stroke: COLORS.border }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10.5, fill: COLORS.textSecondary }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<ColumnTooltip />} cursor={{ fill: `${COLORS.royalBlue}0A` }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive animationDuration={700}>
            <LabelList dataKey="value" position="top" fill={COLORS.textPrimary} fontSize={11} fontWeight={600} />
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={entry.fill}
                cursor={entry.value > 0 ? "pointer" : "default"}
                onClick={() => entry.value > 0 && onSegmentClick?.(entry.key)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CandidateStageColumnChart;

```

---

## File: pages/Candidates/Candidate.jsx

```javascript
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Alert,
  Switch,
  Tooltip,
  InputAdornment,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { PersonOutlineOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useLazyGetImportedCandidatesQuery,
  useLazySearchCandidatesQuery,
  useLazyGetResumeViewQuery, // ← NEW  (see api slice patch below)
  useUpdateCandidateActiveStatusMutation,
  useUploadCandidateResumeMutation,
} from "../../redux/services/requisition/requisition";
import ReusableMRT from "../../components/table/index";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { useDeleteCandidateMutation } from "../../redux/services/candidates/candidate";
import CustomSelect from "../../components/Select";

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  accent: "#FF5F1F",
  accentSoft: "#FFF0E8",
  accentBorder: "#FFCFB3",
  green: "#0F6E56",
  greenSoft: "#E7F8EE",
  border: "#E8E8EC",
  textPrimary: "#111118",
  textSecondary: "#5C5C70",
  textTertiary: "#9696A6",
};

const PAGE_SIZE = 100;
const SEARCH_DEBOUNCE_MS = 350;

const DOMAIN_OPTIONS = ["clinical"];
const FUNCTION_OPTIONS = ["biostatistics", "clinical_data_management"];
const SUB_FUNCTION_MAP = {
  biostatistics: ["statistical_programmer"],
  clinical_data_management: [
    "clinical_programmer",
    "crf_developer",
    "clinical_data_manager",
  ],
  clinical_operations: [
    "clinical_research_associate",
    "clinical_trial_manager",
    "site_coordinator",
  ],
  medical_writing: ["medical_writer", "regulatory_writer"],
  pharmacovigilance: ["safety_associate", "pv_specialist"],
  regulatory_affairs: ["regulatory_specialist", "submissions_manager"],
};

/* ════════════════════════════════════════════════════════════════════════════════
   RESUME VIEWER MODAL
   • Calls GET /acc/resume_view_by_input/?candidate_id=X
   • Response: { presigned_url: "https://s3..." } or { data: { presigned_url } }
   • Renders the PDF inside an <iframe>; also offers an "Open in new tab" link
════════════════════════════════════════════════════════════════════════════════ */
function ResumeViewerModal({ open, onClose, candidateId, candidateName }) {
  const [fetchResume, { isFetching }] = useLazyGetResumeViewQuery();
  const [presignedUrl, setPresignedUrl] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!open || !candidateId) return;
    setPresignedUrl(null);
    setFetchError(false);

    fetchResume(candidateId, false)
      .unwrap()
      .then((result) => {
        const url =
          result?.resume_url ?? // ← your actual backend key
          result?.presigned_url ??
          result?.data?.resume_url ??
          result?.data?.presigned_url ??
          result?.url ??
          null;

        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
          onClose(); // close the modal immediately — no iframe needed
        } else {
          setFetchError(true);
        }
      })
      .catch(() => setFetchError(true));
  }, [open, candidateId]); // eslint-disable-line

  const handleClose = () => {
    setPresignedUrl(null);
    setFetchError(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "20px",
          py: "14px",
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              backgroundColor: C.accentSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 18, color: C.accent }} />
          </Box>
          <Box>
            <Typography fontSize={14} fontWeight={700} color={C.textPrimary}>
              Resume
            </Typography>
            {candidateName && (
              <Typography fontSize={11} color={C.textSecondary}>
                {candidateName}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {presignedUrl && (
            <Button
              size="small"
              variant="outlined"
              href={presignedUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: 12,
                borderColor: C.accent,
                color: C.accent,
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: C.accentSoft,
                  borderColor: C.accent,
                },
              }}
            >
              Open in new tab
            </Button>
          )}
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: "#9CA3AF", "&:hover": { backgroundColor: "#F3F4F6" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* ── Body ── */}
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {isFetching ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: C.accent }} />
            <Typography fontSize={13} color={C.textSecondary}>
              Opening resume…
            </Typography>
          </Box>
        ) : fetchError ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 48, color: "#D1D5DB" }} />
            <Typography fontSize={14} fontWeight={600} color={C.textPrimary}>
              Could not load resume
            </Typography>
            <Typography fontSize={12} color={C.textSecondary}>
              The file may have expired or is unavailable.
            </Typography>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   VIEW TOGGLE
════════════════════════════════════════════════════════════════════════════════ */
function ViewToggle({ view, onChange }) {
  const btn = (val, Icon, tip) => (
    <Tooltip title={tip} arrow>
      <IconButton
        size="small"
        onClick={() => onChange(val)}
        sx={{
          borderRadius: "7px",
          width: 30,
          height: 30,
          backgroundColor: view === val ? C.accent : "transparent",
          color: view === val ? "#fff" : "#9CA3AF",
          "&:hover": { backgroundColor: view === val ? C.accent : "#F3F4F6" },
          transition: "all 0.15s",
        }}
      >
        <Icon sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  );
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        border: `1px solid ${C.border}`,
        borderRadius: "9px",
        p: "3px",
        backgroundColor: "#F9FAFB",
      }}
    >
      {btn("grid", GridViewIcon, "Grid view")}
      {btn("list", ViewListIcon, "List view")}
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   MRT COLUMNS (list view)
   Resume cell calls the presigned URL API via the passed openResume callback.
════════════════════════════════════════════════════════════════════════════════ */
function buildColumns(handleToggleActive, navigate, openResume, onDelete) {
  return [
    {
      accessorKey: "full_name",
      header: "Name",
      size: 220,
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 12,
              fontWeight: 700,
              bgcolor: row.original.is_active ? C.accent : "#9CA3AF",
              flexShrink: 0,
            }}
          >
            {row.original.full_name
              ?.split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() ?? "?"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: C.textPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.original.full_name}
              
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: C.textSecondary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.original.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      size: 140,
      Cell: ({ cell }) => (
        <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
          {cell.getValue() ?? "—"}
        </Typography>
      ),
    },
    {
      accessorKey:"clin_id",
      header:"Clin ID",
      size: 120,
      Cell: ({ cell }) => (
        <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
          {cell.getValue() ?? "—"}
        </Typography>
      ),
    },
    {
      accessorKey: "domain",
      header: "Domain",
      size: 120,
      Cell: ({ cell }) => (
        <Typography
          sx={{
            fontSize: 12,
            color: C.textSecondary,
            textTransform: "capitalize",
          }}
        >
          {cell.getValue() ?? "—"}
        </Typography>
      ),
    },
    {
      accessorKey: "function",
      header: "Function",
      size: 190,
      Cell: ({ cell }) =>
        cell.getValue() ? (
          <Chip
            label={cell.getValue().replace(/_/g, " ")}
            size="small"
            sx={{
              fontSize: 11,
              fontFamily: "Helvetica",
              height: 20,
              textTransform: "capitalize",
              backgroundColor: "#EEF2FF",
              color: "#4338CA",
              "& .MuiChip-label": { px: "8px" },
            }}
          />
        ) : (
          <Typography sx={{ fontSize: 12, color: C.textTertiary }}>
            —
          </Typography>
        ),
    },
    {
      accessorKey: "sub_function",
      header: "Sub-function",
      size: 180,
      Cell: ({ cell }) =>
        cell.getValue() ? (
          <Chip
            label={cell.getValue().replace(/_/g, " ")}
            size="small"
            sx={{
              fontSize: 11,
              fontFamily: "Helvetica",
              height: 20,
              textTransform: "capitalize",
              backgroundColor: "#F3F4F6",
              color: C.textSecondary,
              "& .MuiChip-label": { px: "8px" },
            }}
          />
        ) : (
          <Typography sx={{ fontSize: 12, color: C.textTertiary }}>
            —
          </Typography>
        ),
    },
    {
      accessorKey: "resume_url",
      header: "Resume",
      size: 100,
      enableColumnFilter: false,
      Cell: ({ row }) =>
        row.original.resume_url ? (
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              openResume(row.original.candidate_id, row.original.full_name);
            }}
            startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 13 }} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 11,
              borderColor: C.accent,
              color: C.accent,
              borderRadius: "7px",
              px: "10px",
              py: "3px",
              minWidth: "auto",
              "&:hover": {
                backgroundColor: C.accentSoft,
                borderColor: C.accent,
              },
            }}
          >
            View
          </Button>
        ) : (
          <Typography sx={{ fontSize: 11, color: C.textTertiary }}>
            —
          </Typography>
        ),
    },
    {
      id: "status",
      header: "Status",
      size: 160,
      enableColumnFilter: false,

      Cell: ({ row }) => {
        const candidate = row.original;
        const active = candidate.is_active;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Status Badge */}
            <Box
              component="span"
              sx={{
                fontSize: 10,
                fontWeight: 700,
                px: "8px",
                py: "3px",
                borderRadius: "10px",
                backgroundColor: active ? C.greenSoft : "#F3F4F6",
                color: active ? C.green : "#6B7280",
                minWidth: "64px",
                textAlign: "center",
              }}
            >
              {active ? "Active" : "Inactive"}
            </Box>

            {/* Toggle */}
            <ActiveToggleCell
              candidate={candidate}
              onStatusChange={handleToggleActive}
            />
          </Box>
        );
      },
    },
    {
      id: "delete",
      header: "Delete",
      size: 90,
      enableColumnFilter: false,

      Cell: ({ row }) => (
        <Tooltip title="Delete Candidate">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.original);
            }}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#E5541B",

              "&:hover": {
                backgroundColor: "#FEE2E2",
              },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
}

/* ── Inline active toggle (own optimistic state) ── */
function ActiveToggleCell({ candidate, onStatusChange }) {
  const [localActive, setLocalActive] = useState(candidate.is_active);
  const [updateStatus, { isLoading }] =
    useUpdateCandidateActiveStatusMutation();

  const handleToggle = async (e) => {
    e.stopPropagation();
    const next = !localActive;
    setLocalActive(next);
    onStatusChange(candidate.candidate_id, next);
    try {
      await updateStatus({
        candidate_id: candidate.candidate_id,
        is_active: next,
      }).unwrap();
    } catch {
      setLocalActive(!next);
      onStatusChange(candidate.candidate_id, !next);
    }
  };

  return isLoading ? (
    <CircularProgress size={16} sx={{ color: C.accent }} />
  ) : (
    <Switch
      checked={localActive}
      onChange={handleToggle}
      size="small"
      onClick={(e) => e.stopPropagation()}
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": { color: C.accent },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: C.accent,
        },
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════════════════════ */
export default function CandidatesPage() {
  const navigate = useNavigate();

  /* ── View ── */
  const [view, setView] = useState("list");

  /* ── Search ── */
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchMode = debouncedSearch.trim().length > 0;

  /* ── Browse filters ── */
  const [domain, setDomain] = useState("");
  const [func, setFunc] = useState("");
  const [subFunc, setSubFunc] = useState("");

  /* ── Active filter (client-side) ── */
  const [activeOnly, setActiveOnly] = useState(null);

  /* ── Browse pagination ── */
  const [nextCursor, setNextCursor] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [browseError, setBrowseError] = useState(false);

  /* ── Search state ── */
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  /* ── Resume modal ── */
  const [resumeModal, setResumeModal] = useState({
    open: false,
    candidateId: null,
    candidateName: null,
  });

  /* ── Upload dialog ── */
  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    domain: "",
    function: "",
    sub_function: "",
    availability: "",
    resume: null,
  });

  /* ── RTK hooks ── */
  const [triggerBrowse, { isFetching: isBrowsing }] =
    useLazyGetImportedCandidatesQuery();
  const [triggerSearch] = useLazySearchCandidatesQuery();
  const [uploadCandidateResume, { isLoading: uploading }] =
    useUploadCandidateResumeMutation();
  const searchTimer = useRef(null);

  /* ── Open resume modal ── */
  const openResume = useCallback((candidateId, candidateName) => {
    setResumeModal({ open: true, candidateId, candidateName });
  }, []);

  /* ── Browse: core fetch ── */
  const loadPage = useCallback(
    async ({ domain: d, func: f, subFunc: sf, cursor }) => {
      setBrowseError(false);
      try {
        const params = {
          limit: PAGE_SIZE,
          ...(d && { domain: d }),
          ...(f && { function: f }),
          ...(sf && { sub_function: sf }),
          ...(cursor && {
            cursor_created_at: cursor.cursor_created_at,
            cursor_id: cursor.cursor_id,
          }),
        };
        const result = await triggerBrowse(params, false).unwrap();
        const newRows = result?.data ?? [];
        const newCursor = result?.next_cursor ?? false;

        if (!cursor) {
          setCandidates(newRows);
          setIsFirstLoad(false);
        } else {
          setCandidates((prev) => {
            const seen = new Set(prev.map((c) => c.candidate_id));
            return [
              ...prev,
              ...newRows.filter((c) => !seen.has(c.candidate_id)),
            ];
          });
        }
        setNextCursor(newCursor);
      } catch {
        setBrowseError(true);
        setIsFirstLoad(false);
      }
    },
    [triggerBrowse],
  );
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    candidateId: null,
    candidateName: "",
  });

  const [deleteCandidate, { isLoading: deletingCandidate }] =
    useDeleteCandidateMutation();
  /* ─────────────────────────────────────────────
   DELETE CANDIDATE
───────────────────────────────────────────── */

  const handleOpenDelete = (candidate) => {
    setDeleteModal({
      open: true,
      candidateId: candidate.candidate_id,
      candidateName: candidate.full_name,
    });
  };

  const handleCloseDelete = () => {
    setDeleteModal({
      open: false,
      candidateId: null,
      candidateName: "",
    });
  };

  const handleDeleteCandidate = async () => {
    try {
      await deleteCandidate({
        candidate_id: deleteModal.candidateId,
        confirmation_text: "DELETE",
      }).unwrap();

      toast.success("Candidate deleted successfully");

      // remove from browse data
      setCandidates((prev) =>
        prev.filter((item) => item.candidate_id !== deleteModal.candidateId),
      );

      // remove from search data
      setSearchResults((prev) =>
        prev.filter((item) => item.candidate_id !== deleteModal.candidateId),
      );

      handleCloseDelete();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete candidate");
    }
  };

  /* ── Mount ── */
  useEffect(() => {
    loadPage({ domain: "", func: "", subFunc: "", cursor: null });
  }, []); // eslint-disable-line

  /* ── Filter changes ── */
  const prevFilters = useRef({ domain, func, subFunc });
  useEffect(() => {
    if (searchMode) return;
    const p = prevFilters.current;
    if (p.domain === domain && p.func === func && p.subFunc === subFunc) return;
    prevFilters.current = { domain, func, subFunc };
    setCandidates([]);
    setNextCursor(null);
    setIsFirstLoad(true);
    loadPage({ domain, func, subFunc, cursor: null });
  }, [domain, func, subFunc, searchMode, loadPage]);

  const handleShowMore = () => {
    if (!nextCursor || nextCursor === false || isBrowsing) return;
    loadPage({ domain, func, subFunc, cursor: nextCursor });
  };

  /* ── Search ── */
  const runSearch = useCallback(
    async (query) => {
      if (!query.trim()) return;
      setIsSearching(true);
      setSearchError(false);
      try {
        const result = await triggerSearch(query, false).unwrap();
        setSearchResults(Array.isArray(result) ? result : (result?.data ?? []));
      } catch {
        setSearchError(true);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [triggerSearch],
  );

  const handleSearchChange = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    if (!val.trim()) {
      setDebouncedSearch("");
      setSearchResults([]);
      return;
    }
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      runSearch(val);
    }, SEARCH_DEBOUNCE_MS);
  };

  const clearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setSearchResults([]);
    clearTimeout(searchTimer.current);
  };

  /* ── Filter handlers ── */
  const handleDomainChange = (v) => {
    setDomain(v);
    setFunc("");
    setSubFunc("");
  };
  const handleFuncChange = (v) => {
    setFunc(v);
    setSubFunc("");
  };
  const handleSubFuncChange = (v) => setSubFunc(v);
  const clearFilters = () => {
    setDomain("");
    setFunc("");
    setSubFunc("");
  };

  /* ── Optimistic status toggle ── */
  const handleStatusChange = useCallback((candidateId, newStatus) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.candidate_id === candidateId ? { ...c, is_active: newStatus } : c,
      ),
    );
    setSearchResults((prev) =>
      prev.map((c) =>
        c.candidate_id === candidateId ? { ...c, is_active: newStatus } : c,
      ),
    );
  }, []);

  /* ── Derived ── */
  const sourceList = searchMode ? searchResults : candidates;
  const displayed = useMemo(
    () =>
      activeOnly === null
        ? sourceList
        : sourceList.filter((c) => c.is_active === activeOnly),
    [sourceList, activeOnly],
  );
  const activeCount = useMemo(
    () => sourceList.filter((c) => c.is_active).length,
    [sourceList],
  );
  const inactiveCount = useMemo(
    () => sourceList.filter((c) => !c.is_active).length,
    [sourceList],
  );
  const hasFilters = domain || func || subFunc;
  const showMoreAvailable = !searchMode && nextCursor && nextCursor !== false;
  const isBusy = searchMode ? isSearching : isFirstLoad && isBrowsing;

  const columns = useMemo(
    () =>
      buildColumns(handleStatusChange, navigate, openResume, handleOpenDelete),
    [handleStatusChange, navigate, openResume],
  );

  /* ── Upload ── */
  const handleUploadSubmit = async () => {
    try {
      if (!candidateForm.availability?.trim()) {
        toast.error("Availability is required");
        return;
      }
      if (!candidateForm.resume) {
        toast.error("Resume is required");
        return;
      }
      const fd = new FormData();
      fd.append("availability", candidateForm.availability);
      fd.append("domain", candidateForm.domain);
      fd.append("function", candidateForm.function);
      fd.append("sub_function", candidateForm.sub_function);
      fd.append("resume", candidateForm.resume);
      await uploadCandidateResume(fd).unwrap();
      toast.success("Candidate uploaded successfully");
      setOpenAddCandidate(false);
      setCandidateForm({
        domain: "",
        function: "",
        sub_function: "",
        availability: "",
        resume: null,
      });
      setCandidates([]);
      setNextCursor(null);
      setIsFirstLoad(true);
      loadPage({ domain, func, subFunc, cursor: null });
    } catch (err) {
      toast.error(
        err?.data?.detail?.[0]?.msg || err?.data?.message || "Failed to upload",
      );
    }
  };

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <Box sx={{ p: 1, height: "100%" }}>
      {/* ══════════════════════════════════════════════════════
          TOOLBAR  — single row, all items baseline-aligned
      ══════════════════════════════════════════════════════ */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          mb: "14px",
          flexWrap: "nowrap",
          minHeight: 40,
          // border:1
        }}
      >
        {/* ── Search ── */}
        <TextField
          size="small"
          placeholder="Search.."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{
            width: 100,
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: 12,
              height: 36,
            },
          }}
          slotProps={{ input: {
            startAdornment: (
              <InputAdornment position="start">
                {isSearching ? (
                  <CircularProgress size={13} sx={{ color: C.accent }} />
                ) : (
                  <SearchIcon
                    sx={{
                      fontSize: 15,
                      color: searchMode ? "#6366F1" : C.textTertiary,
                    }}
                  />
                )}
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  sx={{ p: "1px" }}
                >
                  <CloseIcon sx={{ fontSize: 13, color: C.textTertiary }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          } }}
        />

        {/* Search mode pill */}
        {searchMode && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              px: "8px",
              py: "4px",
              borderRadius: "6px",
              backgroundColor: "#EEF2FF",
              border: "1px solid #C7D2FE",
              flexShrink: 0,
              height: 28,
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "#6366F1",
              }}
            />
            <Typography
              fontSize={10}
              fontWeight={700}
              color="#4338CA"
              sx={{ whiteSpace: "nowrap" }}
            >
              Search
            </Typography>
            <CloseIcon
              onClick={clearSearch}
              sx={{
                fontSize: 11,
                color: "#6366F1",
                cursor: "pointer",
                ml: "1px",
              }}
            />
          </Box>
        )}

        <Divider orientation="vertical" flexItem sx={{ mx: "2px" }} />

        {/* ── Browse filters — dimmed in search mode ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            opacity: searchMode ? 0.4 : 1,
            pointerEvents: searchMode ? "none" : "auto",
            transition: "opacity 0.2s",
            flexShrink: 0,
          }}
        >
          {/* <FilterListIcon sx={{ fontSize: 14, color: C.textTertiary }} /> */}

          {/* Domain */}
          <CustomSelect
            value={domain}
            onChange={handleDomainChange}
            options={DOMAIN_OPTIONS}
            placeholder="Domain"
            width={120}
            height={180}
          />

          {/* Function */}
          <CustomSelect
            value={func}
            onChange={handleFuncChange}
            options={FUNCTION_OPTIONS}
            placeholder="Function"
            width={140}
            height={180}
          />

          {/* Sub-function */}
          <CustomSelect
            value={subFunc}
            onChange={handleSubFuncChange}
            options={SUB_FUNCTION_MAP[func] ?? []}
            placeholder="Sub Function"
            width={160}
            height={180}
            disabled={!func}
          />

          {/* Applied chips */}
          {domain && (
            <Chip
              label={domain.replace(/_/g, " ")}
              size="small"
              onDelete={() => handleDomainChange("")}
              sx={{
                fontSize: 11,
                height: 22,
                textTransform: "capitalize",
                backgroundColor: C.accentSoft,
                color: C.accent,
                "& .MuiChip-deleteIcon": { fontSize: 13, color: C.accent },
              }}
            />
          )}
          {func && (
            <Chip
              label={func.replace(/_/g, " ")}
              size="small"
              onDelete={() => handleFuncChange("")}
              sx={{
                fontSize: 10,
                height: 22,
                textTransform: "capitalize",
                backgroundColor: C.accentSoft,
                color: C.accent,
                "& .MuiChip-deleteIcon": { fontSize: 13, color: C.accent },
              }}
            />
          )}
          {subFunc && (
            <Chip
              label={subFunc.replace(/_/g, " ")}
              size="small"
              onDelete={() => handleSubFuncChange("")}
              sx={{
                fontSize: 10,
                height: 22,
                textTransform: "capitalize",
                backgroundColor: C.accentSoft,
                color: C.accent,
                "& .MuiChip-deleteIcon": { fontSize: 13, color: C.accent },
              }}
            />
          )}

          {hasFilters && (
            <Box
              onClick={clearFilters}
              sx={{
                fontSize: 11,
                color: C.accent,
                cursor: "pointer",
                fontWeight: 600,
                whiteSpace: "nowrap",
                "&:hover": { textDecoration: "underline" },
                flexShrink: 0,
              }}
            >
              Clear
            </Box>
          )}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: "2px" }} />

        {/* ── Active / Inactive pills ── */}
        <Box sx={{ display: "flex", gap: "4px", flexShrink: 0 }}>
          {[
            { label: "All", value: null },
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ].map(({ label, value }) => (
            <Box
              key={String(value)}
              onClick={() => setActiveOnly(value)}
              sx={{
                px: "9px",
                py: "0px",
                height: 28,
                borderRadius: "7px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: 11,
                fontFamily: "Helvetica",
                fontWeight: 600,
                border: "1px solid",
                whiteSpace: "nowrap",
                borderColor: activeOnly === value ? C.accent : C.border,
                backgroundColor:
                  activeOnly === value ? C.accentSoft : "#F9FAFB",
                color: activeOnly === value ? C.accent : C.textSecondary,
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: C.accent,
                  color: C.accent,
                  backgroundColor: C.accentSoft,
                },
              }}
            >
              {label}
              {value === true && activeCount > 0 && (
                <Box
                  component="span"
                  sx={{ ml: "3px", fontSize: 10, opacity: 0.8 }}
                >
                  ({activeCount})
                </Box>
              )}
              {value === false && inactiveCount > 0 && (
                <Box
                  component="span"
                  sx={{ ml: "3px", fontSize: 10, opacity: 0.8 }}
                >
                  ({inactiveCount})
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* ── Spacer ── */}
        <Box sx={{ flex: 1 }} />

        {/* ── Right actions ── */}
        <ViewToggle view={view} onChange={setView} />

        <Button
          variant="contained"
          onClick={() => setOpenAddCandidate(true)}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: "14px",
            height: 36,
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: C.accent,
            boxShadow: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            "&:hover": { backgroundColor: "#E5541B", boxShadow: "none" },
          }}
        >
          + Add Candidate
        </Button>
      </Box>

      {/* ════════════════════════════════════════
          CONTENT
      ════════════════════════════════════════ */}
      {isBusy ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: C.accent }} />
          <Typography fontSize={13} color={C.textSecondary}>
            {searchMode
              ? `Searching for "${debouncedSearch}"…`
              : "Loading candidates…"}
          </Typography>
        </Box>
      ) : (searchMode ? searchError : browseError) && displayed.length === 0 ? (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>
          {searchMode
            ? "Search failed. Please try again."
            : "Failed to load candidates. Please try again."}
        </Alert>
      ) : displayed.length === 0 && !isBusy ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            backgroundColor: "#fff",
          }}
        >
          <PersonOutlineOutlined
            sx={{ fontSize: 42, color: C.textTertiary, mb: 1.5 }}
          />
          <Typography fontSize={15} fontWeight={600} color={C.textPrimary}>
            {searchMode
              ? `No results for "${debouncedSearch}"`
              : "No candidates found"}
          </Typography>
          <Typography fontSize={13} color={C.textSecondary} mt={0.5}>
            {searchMode
              ? "Try a different name or email."
              : "Try adjusting your filters."}
          </Typography>
          {searchMode && (
            <Button
              onClick={clearSearch}
              size="small"
              sx={{
                mt: 1.5,
                textTransform: "none",
                color: C.accent,
                fontWeight: 600,
              }}
            >
              Back to browse
            </Button>
          )}
        </Box>
      ) : view === "list" ? (
        /* ─── LIST VIEW ─── */
        <Box
          sx={{
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <ReusableMRT
            data={displayed}
            columnData={columns}
            enableRowActions={false}
            enableRowSelection={false}
            enableGlobalFilter={false}
            enableColumnFilters
            height="calc(100vh - 190px)"
            onRowClick={(row) =>
              navigate(`/account-manager/candidates/${row.candidate_id}`)
            }
          />

          {/* ── Unified smart footer ── */}
          <Box
            sx={{
              borderTop: `1px solid ${C.border}`,
              px: "20px",
              py: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FAFAFA",
            }}
          >
            {/* Left: count info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor:
                    !searchMode && nextCursor === false ? C.green : C.accent,
                  boxShadow:
                    !searchMode && nextCursor === false
                      ? `0 0 0 3px rgba(15,110,86,0.15)`
                      : `0 0 0 3px rgba(255,95,31,0.15)`,
                }}
              />
              <Typography fontSize={12} color={C.textSecondary}>
                {searchMode ? (
                  <>
                    <Box
                      component="span"
                      sx={{ fontWeight: 700, color: C.textPrimary }}
                    >
                      {displayed.length}
                    </Box>{" "}
                    result{displayed.length !== 1 ? "s" : ""} for &ldquo;
                    {debouncedSearch}&rdquo;
                  </>
                ) : (
                  <>
                    <Box
                      component="span"
                      sx={{ fontWeight: 700, color: C.textPrimary }}
                    >
                      {candidates.length}
                    </Box>{" "}
                    candidates loaded
                    {activeOnly !== null &&
                      displayed.length !== candidates.length && (
                        <>
                          {" · "}
                          <Box
                            component="span"
                            sx={{ fontWeight: 700, color: C.textPrimary }}
                          >
                            {displayed.length}
                          </Box>
                          {" shown"}
                        </>
                      )}
                  </>
                )}
              </Typography>

              {/* All loaded pill */}
              {!searchMode && nextCursor === false && candidates.length > 0 && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    px: "8px",
                    py: "2px",
                    borderRadius: "20px",
                    backgroundColor: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                  }}
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      backgroundColor: C.green,
                    }}
                  />
                  <Typography
                    fontSize={10}
                    fontWeight={700}
                    color={C.green}
                    sx={{ letterSpacing: "0.02em" }}
                  >
                    All loaded
                  </Typography>
                </Box>
              )}

              {/* Back to browse in search mode */}
              {searchMode && (
                <Box
                  onClick={clearSearch}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    px: "8px",
                    py: "2px",
                    borderRadius: "20px",
                    backgroundColor: "#EEF2FF",
                    border: "1px solid #C7D2FE",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#E0E7FF" },
                  }}
                >
                  <Typography fontSize={10} fontWeight={700} color="#4338CA">
                    ← Browse all
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Right: load more */}
            {showMoreAvailable && (
              <Button
                size="small"
                onClick={handleShowMore}
                disabled={isBrowsing}
                startIcon={
                  isBrowsing ? (
                    <CircularProgress size={11} sx={{ color: "#fff" }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 15 }} />
                  )
                }
                sx={{
                  textTransform: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: C.accent,
                  borderRadius: "8px",
                  px: "16px",
                  height: 32,
                  boxShadow: "0 2px 8px rgba(255,95,31,0.25)",
                  "&:hover": {
                    backgroundColor: "#E5541B",
                    boxShadow: "0 4px 12px rgba(255,95,31,0.35)",
                  },
                  "&:disabled": {
                    backgroundColor: "#FFCFB3",
                    color: "#fff",
                    boxShadow: "none",
                  },
                }}
              >
                {isBrowsing ? "Loading…" : `Load next ${PAGE_SIZE}`}
              </Button>
            )}
          </Box>
        </Box>
      ) : (
        /* ─── GRID VIEW ─── */
        <>
          <Grid container spacing={2}>
            {displayed.map((candidate) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
                key={candidate.candidate_id}
              >
                <CandidateCard
                  candidate={candidate}
                  onStatusChange={handleStatusChange}
                  onViewResume={openResume}
                  onDelete={handleOpenDelete}
                />
              </Grid>
            ))}

            {/* Skeleton cards while loading */}
            {isBrowsing &&
              !searchMode &&
              candidates.length > 0 &&
              Array.from({ length: 4 }).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={`sk-${i}`}>
                  <Box
                    sx={{
                      borderRadius: "12px",
                      border: `1px solid ${C.border}`,
                      height: 178,
                      backgroundColor: "#F9FAFB",
                      animation: "pulse 1.4s ease-in-out infinite",
                      "@keyframes pulse": {
                        "0%,100%": { opacity: 1 },
                        "50%": { opacity: 0.4 },
                      },
                    }}
                  />
                </Grid>
              ))}
          </Grid>

          {/* Grid footer */}
          <Box
            sx={{
              mt: "28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Typography fontSize={12} color={C.textSecondary}>
              {searchMode ? (
                <>
                  {displayed.length} result{displayed.length !== 1 ? "s" : ""}{" "}
                  for <strong>"{debouncedSearch}"</strong>
                </>
              ) : (
                <>
                  Showing <strong>{displayed.length}</strong> candidates
                  {activeOnly !== null &&
                    candidates.length !== displayed.length && (
                      <Box component="span" sx={{ color: C.textTertiary }}>
                        {" "}
                        · {candidates.length} total loaded
                      </Box>
                    )}
                </>
              )}
            </Typography>

            {showMoreAvailable && (
              <Button
                variant="outlined"
                onClick={handleShowMore}
                disabled={isBrowsing}
                startIcon={
                  isBrowsing ? (
                    <CircularProgress size={14} sx={{ color: C.accent }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 18 }} />
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  borderColor: C.accent,
                  color: C.accent,
                  borderRadius: "10px",
                  px: "28px",
                  py: "9px",
                  "&:hover": {
                    backgroundColor: C.accentSoft,
                    borderColor: C.accent,
                  },
                  "&:disabled": {
                    borderColor: C.border,
                    color: C.textTertiary,
                  },
                }}
              >
                {isBrowsing
                  ? "Loading…"
                  : `Show more · next ${PAGE_SIZE} candidates`}
              </Button>
            )}

            {!searchMode && nextCursor === false && candidates.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: "20px",
                  py: "8px",
                  borderRadius: "20px",
                  backgroundColor: "#F9FAFB",
                  border: `1px solid ${C.border}`,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: C.green,
                  }}
                />
                <Typography fontSize={12} color={C.textSecondary}>
                  All candidates loaded · {candidates.length} total
                </Typography>
              </Box>
            )}

            {searchMode && (
              <Button
                onClick={clearSearch}
                size="small"
                sx={{
                  textTransform: "none",
                  color: C.accent,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                ← Back to browse
              </Button>
            )}
          </Box>
        </>
      )}

      {/* ── Resume Viewer Modal ── */}
      <ResumeViewerModal
        open={resumeModal.open}
        onClose={() =>
          setResumeModal({
            open: false,
            candidateId: null,
            candidateName: null,
          })
        }
        candidateId={resumeModal.candidateId}
        candidateName={resumeModal.candidateName}
      />

      {/* ── Add Candidate Dialog ── */}
      <Dialog
        open={openAddCandidate}
        onClose={() => setOpenAddCandidate(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
      >
        <DialogTitle
          sx={{ fontWeight: 700, fontSize: 20, color: C.textPrimary, pb: 1 }}
        >
          Add Candidate
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <FormControl fullWidth size="small">
              <Select
                value={candidateForm.domain}
                displayEmpty
                renderValue={(v) =>
                  v ? v.replace(/_/g, " ") : "Select Domain"
                }
                onChange={(e) =>
                  setCandidateForm({ ...candidateForm, domain: e.target.value })
                }
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <Select
                value={candidateForm.function}
                displayEmpty
                renderValue={(v) =>
                  v ? v.replace(/_/g, " ") : "Select Function"
                }
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    function: e.target.value,
                    sub_function: "",
                  })
                }
              >
                {FUNCTION_OPTIONS.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              size="small"
              disabled={!candidateForm.function}
            >
              <Select
                value={candidateForm.sub_function}
                displayEmpty
                renderValue={(v) =>
                  v ? v.replace(/_/g, " ") : "Select Sub-function"
                }
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    sub_function: e.target.value,
                  })
                }
              >
                {(SUB_FUNCTION_MAP[candidateForm.function] ?? []).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Availability (days)"
              required
              fullWidth
              size="small"
              value={candidateForm.availability}
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  availability: e.target.value,
                })
              }
            />
            <Box
              sx={{
                border: `2px dashed ${C.border}`,
                borderRadius: "16px",
                py: 4,
                px: 2,
                textAlign: "center",
                backgroundColor: "#FAFAFA",
              }}
            >
              <Button
                component="label"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "100%",
                  textTransform: "none",
                  color: C.textPrimary,
                }}
              >
                <CloudUploadOutlinedIcon
                  sx={{ fontSize: 40, color: C.accent }}
                />
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  Browse Resume Here
                </Typography>
                <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                  PDF, DOC, DOCX supported
                </Typography>
                <input
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setCandidateForm({
                      ...candidateForm,
                      resume: e.target.files[0],
                    })
                  }
                />
              </Button>
              {candidateForm.resume && (
                <Typography
                  sx={{ mt: 2, fontSize: 13, fontWeight: 600, color: C.accent }}
                >
                  {candidateForm.resume.name}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setOpenAddCandidate(false)}
            sx={{ textTransform: "none", color: "#666" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={uploading}
            onClick={handleUploadSubmit}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              backgroundColor: C.accent,
              px: 3,
              "&:hover": { backgroundColor: "#E5541B" },
            }}
          >
            {uploading ? "Uploading..." : "Add Candidate"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* ─────────────────────────────────────────────
   DELETE MODAL
───────────────────────────────────────────── */}

      <Dialog
        open={deleteModal.open}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            p: 1,
          },
        }}
      >
        <DialogContent
          sx={{
            pt: 4,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              backgroundColor: "#FEF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <WarningAmberRoundedIcon
              sx={{
                fontSize: 22,
                color: "#DC2626",
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: 14,
              color: C.textSecondary,
              lineHeight: 1.7,
            }}
          >
            Are you sure you want to delete
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                color: C.textPrimary,
              }}
            >
              {" "}
              {deleteModal.candidateName}
            </Box>
            ?
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            gap: 1,
          }}
        >
          <Button
            fullWidth
            onClick={handleCloseDelete}
            disabled={deletingCandidate}
            sx={{
              height: 44,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              color: C.textSecondary,
              border: `1px solid ${C.border}`,
            }}
          >
            No
          </Button>

          <Button
            fullWidth
            variant="contained"
            disabled={deletingCandidate}
            onClick={handleDeleteCandidate}
            sx={{
              height: 44,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#E5541B",
              boxShadow: "none",

              "&:hover": {
                backgroundColor: "#E5541B",
                boxShadow: "none",
              },
            }}
          >
            {deletingCandidate ? (
              <CircularProgress size={18} sx={{ color: "#fff" }} />
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════
   CANDIDATE CARD (grid view) — resume button calls openResume
════════════════════════════════════════════════════════════════════════════════ */
function CandidateCard({ candidate, onStatusChange, onViewResume, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [localActive, setLocalActive] = useState(candidate.is_active);
  const [updateStatus, { isLoading: updating }] =
    useUpdateCandidateActiveStatusMutation();
  const navigate = useNavigate();
  console.log("From Candidate",candidate.clin_id)
  const handleToggle = async (e) => {
    e.stopPropagation();
    const next = !localActive;
    setLocalActive(next);
    onStatusChange(candidate.candidate_id, next);
    try {
      await updateStatus({
        candidate_id: candidate.candidate_id,
        is_active: next,
      }).unwrap();
    } catch {
      setLocalActive(!next);
      onStatusChange(candidate.candidate_id, !next);
    }
  };

  const initials = candidate.full_name
    ? candidate.full_name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() =>
        navigate(`/account-manager/candidates/${candidate.candidate_id}`)
      }
      sx={{
        borderRadius: "12px",
        border: `1px solid ${hovered ? C.accent : C.border}`,
        boxShadow: hovered ? "0 0 0 3px rgba(255,95,31,0.07)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        opacity: localActive ? 1 : 0.72,
        cursor: "pointer",
      }}
    >
      <CardContent
        sx={{
          p: "16px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            mb: "12px",
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              bgcolor: localActive ? C.accent : "#9CA3AF",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: C.textPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {candidate.full_name}
            </Typography>
              <Typography
              sx={{
                fontSize: 11}}>
                  {candidate.clin_id}
                </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: C.textSecondary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {candidate.email}
            </Typography>
          </Box>
          <Tooltip
            title={localActive ? "Mark inactive" : "Mark active"}
            placement="top"
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              {updating ? (
                <CircularProgress size={16} sx={{ color: C.accent }} />
              ) : (
                <Switch
                  checked={localActive}
                  onChange={handleToggle}
                  size="small"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: C.accent },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: C.accent,
                    },
                  }}
                />
              )}
            </Box>
          </Tooltip>
        </Box>

        <Divider sx={{ mb: "10px" }} />

        {/* Function chips */}
        <Box sx={{ display: "flex", gap: 0.6, mb: "10px", flexWrap: "wrap" }}>
          {candidate.function && (
            <Chip
              label={candidate.function.replace(/_/g, " ")}
              size="small"
              sx={{
                fontSize: 11,
                fontFamily: "Helvetica",
                height: 20,
                textTransform: "capitalize",
                backgroundColor: "#EEF2FF",
                color: "#4338CA",
                "& .MuiChip-label": { px: "8px" },
              }}
            />
          )}
          {candidate.sub_function && (
            <Chip
              label={candidate.sub_function.replace(/_/g, " ")}
              size="small"
              sx={{
                fontSize: 11,
                fontFamily: "Helvetica",
                height: 20,
                textTransform: "capitalize",
                backgroundColor: "#F3F4F6",
                color: C.textSecondary,
                "& .MuiChip-label": { px: "8px" },
              }}
            />
          )}
        </Box>

        {/* Info rows */}
        {[
          { label: "Phone", value: candidate.phone_number ?? "—" },
          { label: "Domain", value: candidate.domain ?? "—" },
        ].map(({ label, value }) => (
          <Box
            key={label}
            sx={{ display: "flex", justifyContent: "space-between", mb: "5px" }}
          >
            <Typography sx={{ fontSize: 11, color: C.textSecondary }}>
              {label}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: C.textPrimary,
                textTransform: "capitalize",
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mt:"6px"
          }}
        >
          {/* RESUME */}
          {candidate.resume_url && (
            <Button
              size="small"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();

                onViewResume(candidate.candidate_id, candidate.full_name);
              }}
              startIcon={<InsertDriveFileOutlinedIcon sx={{ fontSize: 13 }} />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: 11,
                borderColor: C.accent,
                color: C.accent,
                borderRadius: "7px",
                px: "10px",
                py: "3px",
                minWidth: "auto",

                "&:hover": {
                  backgroundColor: C.accentSoft,
                  borderColor: C.accent,
                },
              }}
            >
              Resume
            </Button>
          )}
          {/* DELETE */}
          <Tooltip title="Delete Candidate">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(candidate);
              }}
              sx={{
                width: 26,
                height: 26,
                borderRadius: "5px",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#E5541B",

                "&:hover": {
                  backgroundColor: "#FEE2E2",
                },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
/* ══════════════════════════════════════════════════════════
   ADD CANDIDATE DIALOG
══════════════════════════════════════════════════════════ */
function AddCandidateDialog({
  open,
  onClose,
  uploadMode,
  setUploadMode,
  candidateForm,
  setCandidateForm,
  uploading,
  onSubmit,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
    >
      <DialogTitle
        sx={{ fontWeight: 700, fontSize: 22, color: C.textPrimary, pb: 1 }}
      >
        Add Candidate
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3, mt: 1 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              px: 2.5,
              backgroundColor: C.accent,
              color: "#fff",
            }}
          >
            Add by Function
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Domain</InputLabel>
            <Select
              value={candidateForm.domain}
              label="Domain"
              onChange={(e) =>
                setCandidateForm({ ...candidateForm, domain: e.target.value })
              }
            >
              {DOMAIN_OPTIONS.map((d) => (
                <MenuItem key={d} value={d}>
                  {d.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Function</InputLabel>
            <Select
              value={candidateForm.function}
              label="Function"
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  function: e.target.value,
                  sub_function: "",
                })
              }
            >
              {FUNCTION_OPTIONS.map((f) => (
                <MenuItem key={f} value={f}>
                  {f.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            size="small"
            disabled={!candidateForm.function}
          >
            <InputLabel>Sub Function</InputLabel>
            <Select
              value={candidateForm.sub_function}
              label="Sub Function"
              onChange={(e) =>
                setCandidateForm({
                  ...candidateForm,
                  sub_function: e.target.value,
                })
              }
            >
              {(SUB_FUNCTION_MAP[candidateForm.function] ?? []).map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Availability"
            required
            fullWidth
            size="small"
            value={candidateForm.availability}
            onChange={(e) =>
              setCandidateForm({
                ...candidateForm,
                availability: e.target.value,
              })
            }
          />
          <Box
            sx={{
              border: `2px dashed ${C.border}`,
              borderRadius: "16px",
              py: 4,
              px: 2,
              textAlign: "center",
              backgroundColor: "#FAFAFA",
            }}
          >
            <Button
              component="label"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
                textTransform: "none",
                color: C.textPrimary,
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 42, color: C.accent }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                Browse Resume Here
              </Typography>
              <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                PDF, DOC, DOCX supported
              </Typography>
              <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setCandidateForm({
                    ...candidateForm,
                    resume: e.target.files[0],
                  })
                }
              />
            </Button>
            {candidateForm.resume && (
              <Typography
                sx={{ mt: 2, fontSize: 13, fontWeight: 600, color: C.accent }}
              >
                {candidateForm.resume.name}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#666" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={uploading}
          onClick={onSubmit}
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            backgroundColor: C.accent,
            px: 3,
            "&:hover": { backgroundColor: "#E5541B" },
          }}
        >
          {uploading ? "Uploading..." : "Add Candidate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

```

---

## File: pages/Candidates/CandidateDetailsPage.jsx

```javascript
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  Dialog,
  DialogContent,
  Button,
  TextField,
  Slider,
  CircularProgress,
  InputBase,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCandidateDetailsQuery,
  useGetCandidateSkillInfoQuery,
  useLazyGetResumeViewQuery,
  useUpdateCandidateSkillsMutation,
} from "../../redux/services/requisition/requisition";
import { useDispatch } from "react-redux";
import { setDynamicLabels } from "../../redux/slices/breadcrumbSlice";
import { toast } from "react-toastify";
import { useGetCandidateMatchedJobsQuery } from "../../redux/services/candidates/candidate";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SearchIcon from "@mui/icons-material/Search";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { WorkOutlineOutlined } from "@mui/icons-material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { PRIMARY } from "../../theme";
/* ══════════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════════ */
const C = {
  accent: "#FF5F1F",
  accentSoft: "#FFF0E8",
  accentBorder: "#FFCFB3",
  border: "#E8E8EC",
  borderStrong: "#D0D0DC",
  bg: "#F7F7F9",
  white: "#FFFFFF",
  primary: "#0D0D14",
  secondary: "#4A4A5E",
  tertiary: "#8888A0",
  green: "#059669",
  greenSoft: "#ECFDF5",
  greenBorder: "#A7F3D0",
  blue: "#2563EB",
  blueSoft: "#EFF6FF",
  blueBorder: "#BFDBFE",
  amber: "#D97706",
  amberSoft: "#FFFBEB",
  amberBorder: "#FDE68A",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  redBorder: "#FECACA",
  indigo: "#4338CA",
  indigoSoft: "#EEF2FF",
  purple: "#7C3AED",
  purpleSoft: "#F5F3FF",
};

const T = {
  label: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.tertiary,
  },
  value: { fontSize: 14, fontWeight: 600, color: C.primary },
  valueMd: { fontSize: 15, fontWeight: 700, color: C.primary },
  valueLg: { fontSize: 20, fontWeight: 700, color: C.primary, lineHeight: 1.2 },
  meta: { fontSize: 11, fontWeight: 500, color: C.secondary },
  caption: { fontSize: 10, fontWeight: 500, color: C.tertiary },
  tabLabel: { fontSize: 13, fontWeight: 600 },
  sectionHd: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: C.tertiary,
  },
  badge: { fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" },
};

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
const AVATAR_BG = [
  "#FF5F1F",
  "#4338CA",
  "#0F6E56",
  "#7C3AED",
  "#0EA5E9",
  "#EC4899",
  "#F59E0B",
  "#14B8A6",
];
function avatarBg(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_BG[Math.abs(h) % AVATAR_BG.length];
}
function fmt(v) {
  return v || "—";
}
function fmtDate(d) {
  if (!d || d === "present") return "Present";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}
function fmtDateFull(d) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}
function slug(s = "") {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function getNoteText(note) {
  if (note == null) return "";
  if (typeof note === "object") return String(note.value ?? "");
  return String(note);
}
function safeNum(v) {
  if (v == null) return 0;
  if (typeof v === "object") return Number(v.value ?? 0);
  return Number(v);
}

/* Score → visual tier */
function tier(v) {
  const n = typeof v === "number" ? v : safeNum(v);
  if (n >= 0.8)
    return {
      label: "Strong",
      color: C.green,
      soft: C.greenSoft,
      border: C.greenBorder,
      track: "#10B981",
    };
  if (n >= 0.5)
    return {
      label: "Moderate",
      color: C.amber,
      soft: C.amberSoft,
      border: C.amberBorder,
      track: "#F59E0B",
    };
  if (n >= 0.2)
    return {
      label: "Partial",
      color: C.accent,
      soft: C.accentSoft,
      border: C.accentBorder,
      track: C.accent,
    };
  return {
    label: "Low",
    color: C.red,
    soft: C.redSoft,
    border: C.redBorder,
    track: C.red,
  };
}

/* ══════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════ */
function TabPanel({ value, index, children }) {
  return value === index ? <Box>{children}</Box> : null;
}

function SectionHeading({ children, count }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: "16px" }}>
      <Typography sx={T.sectionHd}>{children}</Typography>
      {count != null && (
        <Box
          sx={{
            ...T.badge,
            px: "6px",
            py: "1px",
            borderRadius: "5px",
            backgroundColor: C.accentSoft,
            color: C.accent,
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  );
}

function Empty({ label }) {
  return (
    <Box sx={{ py: 6, textAlign: "center" }}>
      <Typography sx={{ ...T.meta, color: C.tertiary }}>{label}</Typography>
    </Box>
  );
}

function PageSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton width={120} height={32} sx={{ mb: 3 }} />
      <Skeleton
        variant="rectangular"
        height={140}
        sx={{ borderRadius: "14px", mb: 2 }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 1.5,
          mb: 2,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} height={72} sx={{ borderRadius: "10px" }} />
        ))}
      </Box>
      <Skeleton
        variant="rectangular"
        height={380}
        sx={{ borderRadius: "14px" }}
      />
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════
   INFO TILE SLIDER
══════════════════════════════════════════════════════════ */
function InfoTileSlider({ children, mb }) {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    const ro = new ResizeObserver(syncArrows);
    ro.observe(el);
    el.addEventListener("scroll", syncArrows, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", syncArrows);
    };
  }, [syncArrows]);

  const onMouseDown = (e) => {
    drag.current = {
      active: true,
      startX: e.pageX - trackRef.current.offsetLeft,
      scrollLeft: trackRef.current.scrollLeft,
    };
    trackRef.current.style.cursor = "grabbing";
    trackRef.current.style.userSelect = "none";
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    trackRef.current.scrollLeft =
      drag.current.scrollLeft -
      (e.pageX - trackRef.current.offsetLeft - drag.current.startX) * 1.2;
  };
  const stopDrag = () => {
    drag.current.active = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
      trackRef.current.style.userSelect = "";
    }
  };
  const onTouchStart = (e) => {
    drag.current = {
      active: true,
      startX: e.touches[0].pageX,
      scrollLeft: trackRef.current.scrollLeft,
    };
  };
  const onTouchMove = (e) => {
    if (!drag.current.active) return;
    trackRef.current.scrollLeft =
      drag.current.scrollLeft +
      (drag.current.startX - e.touches[0].pageX) * 1.2;
  };

  const NavBtn = ({ dir }) => (
    <IconButton
      size="small"
      onClick={() =>
        trackRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" })
      }
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        ...(dir === -1 ? { left: 0 } : { right: 0 }),
        zIndex: 2,
        width: 28,
        height: 28,
        backgroundColor: C.white,
        border: `1px solid ${C.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        color: C.secondary,
        transition: "all 0.15s",
        "&:hover": {
          backgroundColor: C.accentSoft,
          borderColor: C.accent,
          color: C.accent,
        },
        opacity: (dir === -1 ? canLeft : canRight) ? 1 : 0,
        pointerEvents: (dir === -1 ? canLeft : canRight) ? "auto" : "none",
      }}
    >
      {dir === -1 ? (
        <ArrowBackIosNewIcon sx={{ fontSize: 12 }} />
      ) : (
        <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
      )}
    </IconButton>
  );

  return (
    <Box sx={{ position: "relative", mb }}>
      {canLeft && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 48,
            zIndex: 1,
            background: `linear-gradient(to right, ${C.bg}, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}
      {canRight && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 48,
            zIndex: 1,
            background: `linear-gradient(to left,  ${C.bg}, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}
      <NavBtn dir={-1} />
      <NavBtn dir={1} />
      <Box
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrag}
        sx={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          cursor: "grab",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          px: "4px",
          py: "4px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════
   EXPERIENCE / EDUCATION / CERT CARDS
══════════════════════════════════════════════════════════ */
function ExperienceCard({ job, isLast }) {
  const skills = job.skills_used || [];
  const [expanded, setExpanded] = useState(false);
  const SHOW = 8;
  const visible = expanded ? skills : skills.slice(0, SHOW);
  return (
    <Box sx={{ display: "flex", gap: 2, position: "relative" }}>
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            left: 15,
            top: 36,
            bottom: -8,
            width: 2,
            backgroundColor: C.border,
            zIndex: 0,
          }}
        />
      )}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          flexShrink: 0,
          zIndex: 1,
          backgroundColor: job.is_current ? C.accent : "#E5E7EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: job.is_current ? `0 0 0 4px ${C.accentSoft}` : "none",
          mt: "2px",
        }}
      >
        <BusinessOutlinedIcon
          sx={{ fontSize: 15, color: job.is_current ? "#fff" : C.secondary }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          mb: isLast ? 0 : "16px",
          border: `1px solid ${job.is_current ? C.accentBorder : C.border}`,
          borderRadius: "12px",
          p: "16px",
          backgroundColor: job.is_current ? "#FFFAF7" : C.white,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
            mb: "12px",
          }}
        >
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: "2px" }}
            >
              <Typography sx={T.valueMd}>{job.job_title || "—"}</Typography>
              {job.is_current && (
                <Box
                  sx={{
                    ...T.badge,
                    px: "7px",
                    py: "2px",
                    borderRadius: "5px",
                    backgroundColor: C.accentSoft,
                    color: C.accent,
                  }}
                >
                  CURRENT
                </Box>
              )}
            </Box>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: C.accent, mb: "6px" }}
            >
              {job.company_name !== "Not specified" ? job.company_name : "—"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {job.location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: 11, color: C.tertiary }}
                  />
                  <Typography sx={T.meta}>{job.location}</Typography>
                </Box>
              )}
              {job.country && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                  <PublicOutlinedIcon
                    sx={{ fontSize: 11, color: C.tertiary }}
                  />
                  <Typography sx={T.meta}>{job.country}</Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Box
              sx={{
                fontSize: 12,
                fontWeight: 600,
                px: "8px",
                py: "3px",
                borderRadius: "6px",
                border: `1px solid ${C.border}`,
                color: C.secondary,
                backgroundColor: "#F9FAFB",
                whiteSpace: "nowrap",
              }}
            >
              {fmtDate(job.joining_date)} — {fmtDate(job.end_date)}
            </Box>
            {job.duration && (
              <Typography sx={{ ...T.caption, mt: "4px" }}>
                {job.duration}
              </Typography>
            )}
          </Box>
        </Box>
        {job.key_responsibilities && (
          <Box
            sx={{
              p: "12px 14px",
              borderRadius: "8px",
              backgroundColor: "#F9FAFB",
              border: `1px solid ${C.border}`,
              mb: "12px",
            }}
          >
            <Typography sx={{ ...T.label, mb: "5px" }}>
              Responsibilities
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 400,
                color: C.secondary,
                lineHeight: 1.75,
              }}
            >
              {job.key_responsibilities}
            </Typography>
          </Box>
        )}
        {skills.length > 0 && (
          <Box>
            <Typography sx={{ ...T.label, mb: "7px" }}>Skills used</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {visible.map((sk, i) => (
                <Box
                  key={i}
                  sx={{
                    fontSize:PRIMARY.label.fontSize,
                    fontFamily:PRIMARY.fontFamily,
                    fontWeight: 500,
                    px: "8px",
                    py: "3px",
                    borderRadius: "6px",
                    border: `1px solid ${C.border}`,
                    color: C.indigo,
                    backgroundColor: C.indigoSoft,
                  }}
                >
                  {sk}
                </Box>
              ))}
              {skills.length > SHOW && (
                <Box
                  onClick={() => setExpanded((e) => !e)}
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    px: "8px",
                    py: "3px",
                    borderRadius: "6px",
                    border: `1px solid ${C.accent}`,
                    color: C.accent,
                    backgroundColor: C.accentSoft,
                    cursor: "pointer",
                  }}
                >
                  {expanded ? "Show less" : `+${skills.length - SHOW} more`}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function EducationCard({ edu }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        p: "16px",
        borderRadius: "12px",
        border: `1px solid ${C.border}`,
        backgroundColor: C.white,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          flexShrink: 0,
          backgroundColor: C.greenSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SchoolOutlinedIcon sx={{ fontSize: 20, color: C.green }} />
      </Box>
      <Box>
        <Typography sx={{ ...T.value, mb: "3px" }}>
          {edu.course || "—"}
        </Typography>
        <Typography
          sx={{ fontSize: 13, fontWeight: 600, color: C.green, mb: "8px" }}
        >
          {edu.university || "—"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {edu.end_year && (
            <Box
              sx={{
                ...T.badge,
                px: "7px",
                py: "2px",
                borderRadius: "5px",
                backgroundColor: C.greenSoft,
                color: C.green,
                border: "1px solid #BBF7D0",
              }}
            >
              Graduated {edu.end_year}
            </Box>
          )}
          {edu.specialization && (
            <Box
              sx={{
                ...T.badge,
                px: "7px",
                py: "2px",
                borderRadius: "5px",
                backgroundColor: C.amberSoft,
                color: C.amber,
                border: `1px solid ${C.amberBorder}`,
              }}
            >
              {edu.specialization}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function CertCard({ cert }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        p: "16px",
        borderRadius: "12px",
        border: `1px solid ${C.border}`,
        backgroundColor: C.white,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          flexShrink: 0,
          backgroundColor: C.purpleSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VerifiedOutlinedIcon sx={{ fontSize: 20, color: C.purple }} />
      </Box>
      <Box>
        <Typography sx={{ ...T.value, mb: "3px" }}>
          {cert.certifications || "—"}
        </Typography>
        {cert.certification_issued_by && (
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: C.purple, mb: "8px" }}
          >
            {cert.certification_issued_by}
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {cert.certificate_issue_date && (
            <Box
              sx={{
                ...T.badge,
                px: "7px",
                py: "2px",
                borderRadius: "5px",
                backgroundColor: C.purpleSoft,
                color: C.purple,
                border: "1px solid #EDE9FE",
              }}
            >
              Issued {fmtDate(cert.certificate_issue_date)}
            </Box>
          )}
          {cert.certificate_expire_date && (
            <Box
              sx={{
                ...T.badge,
                px: "7px",
                py: "2px",
                borderRadius: "5px",
                backgroundColor: "#FFF7ED",
                color: "#C2410C",
                border: "1px solid #FED7AA",
              }}
            >
              Expires {fmtDate(cert.certificate_expire_date)}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════
   SKILL INFO — CIRCULAR SCORE RING
══════════════════════════════════════════════════════════ */
function ScoreRing({ value, size = 56 }) {
  const pct = Math.round(value * 100);
  const t = tier(value);

  const strokeWidth = 4; // ↓ reduced from 7
  const r = (size - strokeWidth - 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={t.soft}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={t.track}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </svg>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: size < 52 ? 8 : 10, // ↓ reduced
            fontWeight: 700,
            color: t.color,
            lineHeight: 1,
          }}
        >
          {pct}%
        </Typography>
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════
   SKILL INFO — EDIT DIALOG
══════════════════════════════════════════════════════════ */
function SkillEditDialog({ open, onClose, skillKey, item, onSave, saving }) {
  const origVal = safeNum(item?.original_llm_value ?? item?.value);
  const origNote = getNoteText(item?.original_llm_notes ?? item?.notes);
  const currVal =
    item?.updated_value != null ? safeNum(item.updated_value) : origVal;
  const currNote =
    item?.updated_notes != null ? getNoteText(item.updated_notes) : origNote;

  const [val, setVal] = useState(currVal);
  const [notes, setNotes] = useState(currNote);

  useEffect(() => {
    if (open) {
      setVal(currVal);
      setNotes(currNote);
    }
  }, [open, skillKey]);

  const t = tier(val);
  const pct = Math.round(val * 100);

  const QUICK = [
    { label: "No evidence", v: 0 },
    { label: "Low", v: 0.15 },
    { label: "Partial", v: 0.4 },
    { label: "Moderate", v: 0.6 },
    { label: "Strong", v: 0.8 },
    { label: "Full", v: 1.0 },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* ── Dialog Header ── */}
      <Box
        sx={{
          px: "24px",
          pt: "22px",
          pb: "18px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 800,
              color: C.primary,
              letterSpacing: "-0.02em",
            }}
          >
            Override Skill Score
          </Typography>
          <Typography sx={{ fontSize: 12, color: C.tertiary, mt: "3px" }}>
            {slug(skillKey ?? "")}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            mt: "-2px",
            color: C.tertiary,
            "&:hover": { color: C.primary },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          px: "24px",
          py: "22px",
          display: "flex",
          flexDirection: "column",
          gap: "22px",
        }}
      >
        {/* Score control */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: "14px",
            }}
          >
            <Typography sx={{ ...T.label }}>New Score</Typography>
            <Box
              sx={{
                px: "14px",
                py: "5px",
                borderRadius: "99px",
                backgroundColor: t.soft,
                border: `1px solid ${t.border}`,
              }}
            >
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: t.color }}
              >
                {pct}% · {t.label}
              </Typography>
            </Box>
          </Box>
          {/* Animated fill bar */}
          <Box
            sx={{
              height: 10,
              borderRadius: "99px",
              backgroundColor: C.border,
              mb: "12px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${pct}%`,
                borderRadius: "99px",
                backgroundColor: t.track,
                transition: "width 0.12s ease",
              }}
            />
          </Box>
          <Slider
            value={val}
            onChange={(_, v) => setVal(v)}
            min={0}
            max={1}
            step={0.01}
            sx={{
              color: t.track,
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
                boxShadow: `0 0 0 5px ${t.soft}`,
              },
              "& .MuiSlider-rail": { backgroundColor: C.border, height: 6 },
              "& .MuiSlider-track": { height: 6 },
            }}
          />
          {/* Quick-set pills */}
          <Box
            sx={{ display: "flex", gap: "6px", flexWrap: "wrap", mt: "12px" }}
          >
            {QUICK.map(({ label, v }) => {
              const active = Math.abs(val - v) < 0.02;
              const qt = tier(v);
              return (
                <Box
                  key={label}
                  onClick={() => setVal(v)}
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    px: "12px",
                    py: "5px",
                    borderRadius: "99px",
                    cursor: "pointer",
                    border: `1.5px solid ${active ? qt.color : C.border}`,
                    backgroundColor: active ? qt.soft : C.white,
                    color: active ? qt.color : C.tertiary,
                    transition: "all 0.12s",
                    "&:hover": {
                      borderColor: qt.color,
                      color: qt.color,
                      backgroundColor: qt.soft,
                    },
                  }}
                >
                  {label}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Original AI reference */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            p: "12px 14px",
            borderRadius: "12px",
            backgroundColor: C.blueSoft,
            border: `1px solid ${C.blueBorder}`,
          }}
        >
          <AutoAwesomeOutlinedIcon
            sx={{ fontSize: 15, color: C.blue, flexShrink: 0 }}
          />
          <Typography sx={{ fontSize: 12, color: C.secondary }}>
            AI extracted score:&nbsp;
            <Box
              component="span"
              sx={{ fontWeight: 700, color: tier(origVal).color }}
            >
              {Math.round(origVal * 100)}% · {tier(origVal).label}
            </Box>
          </Typography>
        </Box>

        {/* Notes */}
        <Box>
          <Typography sx={{ ...T.label, mb: "10px" }}>
            Reviewer Notes
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the evidence or reasoning for this override…"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontSize: 13,
                backgroundColor: C.white,
                "& fieldset": { borderColor: C.border },
                "&:hover fieldset": { borderColor: C.borderStrong },
                "&.Mui-focused fieldset": {
                  borderColor: C.blue,
                  borderWidth: "1.5px",
                },
              },
            }}
          />
          {origNote && (
            <Box
              sx={{
                mt: "10px",
                p: "12px 14px",
                borderRadius: "10px",
                backgroundColor: "#FAFAFA",
                border: `1px solid ${C.border}`,
              }}
            >
              <Typography sx={{ ...T.label, color: C.tertiary, mb: "4px" }}>
                AI note (reference)
              </Typography>
              <Typography
                sx={{ fontSize: 12, color: C.secondary, lineHeight: 1.6 }}
              >
                {origNote}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          px: "24px",
          py: "16px",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: 13,
            color: C.secondary,
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            px: "18px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saving}
          onClick={() => onSave({ skillKey, value: val, notes })}
          startIcon={
            saving ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <SaveOutlinedIcon sx={{ fontSize: 15 }} />
            )
          }
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: 13,
            borderRadius: "10px",
            px: "22px",
            backgroundColor: C.primary,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#222", boxShadow: "none" },
            "&:disabled": { opacity: 0.5 },
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Dialog>
  );
}

/* ══════════════════════════════════════════════════════════
   SKILL INFO — SINGLE ROW
══════════════════════════════════════════════════════════ */

function SkillRow({ skillKey, item, onEdit }) {
  const [open, setOpen] = useState(false);

  const origVal = safeNum(item?.original_llm_value ?? item?.value);
  const currVal =
    item?.updated_value != null ? safeNum(item.updated_value) : origVal;
  const origNote = getNoteText(item?.original_llm_notes ?? item?.notes);
  const currNote =
    item?.updated_notes != null ? getNoteText(item.updated_notes) : origNote;

  // ←←← UPDATED: Show "Reviewed" ONLY when actually updated
  const isOverridden =
    !!item?.value_updated_at ||
    (item?.updated_value != null && Math.abs(currVal - origVal) > 0.01) ||
    !!item?.notes_updated_at;

  const scoreChanged = isOverridden && Math.abs(currVal - origVal) > 0.01;
  const origT = tier(origVal);
  const currT = tier(currVal);

  const handleRowClick = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest("svg") ||
      e.target.closest("a")
    )
      return;
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        borderRadius: "14px",
        border: `1px solid ${isOverridden ? C.blueBorder : C.border}`,
        backgroundColor: C.white,
        overflow: "hidden",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.06)" },
      }}
    >
      <Box
        onClick={handleRowClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          p: "12px 16px",
          cursor: "pointer",
          backgroundColor: isOverridden ? "#F8FAFF" : C.white,
          userSelect: "none",
        }}
      >
        <ScoreRing value={currVal} size={42} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{ fontSize: 13, fontWeight: 700, color: C.primary }}
            >
              {slug(skillKey)}
            </Typography>

            {/* REVIEWED BADGE - ONLY WHEN ACTUALLY UPDATED */}
            {isOverridden && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  px: "7px",
                  py: "2px",
                  borderRadius: "99px",
                  backgroundColor: C.blueSoft,
                  border: `1px solid ${C.blueBorder}`,
                }}
              >
                <VerifiedOutlinedIcon sx={{ fontSize: 9, color: C.blue }} />
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: C.blue,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  REVIEWED
                </Typography>
              </Box>
            )}

            {scoreChanged && (
              <Box
                sx={{
                  px: "7px",
                  py: "2px",
                  borderRadius: "99px",
                  backgroundColor: origT.soft,
                  border: `1px solid ${origT.border}`,
                }}
              >
                <Typography
                  sx={{ fontSize: 9, fontWeight: 700, color: origT.color }}
                >
                  {Math.round(origVal * 100)}% → {Math.round(currVal * 100)}%
                </Typography>
              </Box>
            )}
          </Box>

          {/* Reviewed By - Only when updated */}
          {isOverridden && item.value_updated_by && (
            <Typography sx={{ fontSize: 10, color: C.tertiary, mt: "3px" }}>
              Reviewed by{" "}
              {typeof item.value_updated_by === "object"
                ? item.value_updated_by?.name || "Unknown"
                : String(item.value_updated_by || "Unknown")}{" "}
              · {fmtDateFull(item.value_updated_at) || ""}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          <Tooltip title="Edit override" placement="left">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEdit(skillKey);
              }}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                border: `1px solid ${C.border}`,
                color: C.tertiary,
                "&:hover": {
                  backgroundColor: C.accentSoft,
                  borderColor: C.accent,
                  color: C.accent,
                },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              color: C.tertiary,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Box>

      {/* Expanded Notes - FIXED */}
      {open && (
        <Box
          sx={{
            borderTop: `1px solid ${C.border}`,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {/* LEFT: AI Original Notes */}
          <Box
            sx={{
              p: "14px 16px",
              borderRight: `1px solid ${C.border}`,
              backgroundColor: "#FAFAFA",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                mb: "8px",
              }}
            >
              <AutoAwesomeOutlinedIcon sx={{ fontSize: 12, color: C.blue }} />
              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: C.blue,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                AI Skill Notes
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: 12, color: C.secondary, lineHeight: 1.7 }}
            >
              {origNote || (
                <Box
                  component="span"
                  sx={{ color: C.tertiary, fontStyle: "italic" }}
                >
                  No AI notes available.
                </Box>
              )}
            </Typography>
          </Box>

          {/* RIGHT: Reviewer / Current Notes */}
          <Box
            sx={{
              p: "14px 16px",
              backgroundColor: isOverridden ? C.blueSoft : "#FAFAFA",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                mb: "8px",
              }}
            >
              <VerifiedOutlinedIcon
                sx={{ fontSize: 12, color: isOverridden ? C.blue : C.tertiary }}
              />
              <Typography
                sx={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: isOverridden ? C.blue : C.tertiary,
                }}
              >
                {isOverridden ? "REVIEWER NOTES" : "NOTES"}
              </Typography>
            </Box>

            {isOverridden && currNote ? (
              <>
                <Typography
                  sx={{ fontSize: 12, color: C.secondary, lineHeight: 1.7 }}
                >
                  {currNote}
                </Typography>
                {item.notes_updated_by && (
                  <Typography
                    sx={{ fontSize: 10, color: C.tertiary, mt: "6px" }}
                  >
                    by{" "}
                    {typeof item.notes_updated_by === "object"
                      ? item.notes_updated_by?.name
                      : item.notes_updated_by}
                    · {fmtDateFull(item.notes_updated_at)}
                  </Typography>
                )}
              </>
            ) : (
              <Typography
                sx={{ fontSize: 12, color: C.secondary, lineHeight: 1.7 }}
              >
                {origNote || "No notes available."}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════
   SKILL INFO — STAT CARD
══════════════════════════════════════════════════════════ */
function StatCard({ label, value, sub, color, bg, border }) {
  return (
    <Box
      sx={{
        p: "18px 20px",
        borderRadius: "16px",
        backgroundColor: bg ?? "#FAFAFA",
        border: `1px solid ${border ?? C.border}`,
      }}
    >
      <Typography sx={{ ...T.label, color: color ?? C.tertiary, mb: "6px" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 30,
          fontWeight: 800,
          color: color ?? C.primary,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </Typography>
      {sub && <Typography sx={{ ...T.caption, mt: "5px" }}>{sub}</Typography>}
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════
   SKILL INFO — SKILL GROUP
══════════════════════════════════════════════════════════ */
function SkillGroupSection({ title, icon, items, emptyText, onEdit }) {
  return (
    <Box sx={{ mb: "28px" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "12px" }}
      >
        <Typography sx={{ fontSize: 14 }}>{icon}</Typography>
        <Typography sx={{ ...T.sectionHd }}>{title}</Typography>
        <Box sx={{ flex: 1, height: 1, backgroundColor: C.border }} />
        <Box
          sx={{
            px: "8px",
            py: "2px",
            borderRadius: "99px",
            backgroundColor: "#F3F4F6",
            border: `1px solid ${C.border}`,
          }}
        >
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: C.tertiary }}>
            {items.length}
          </Typography>
        </Box>
      </Box>
      {items.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map(([key, item]) => (
            <SkillRow key={key} skillKey={key} item={item} onEdit={onEdit} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            py: "24px",
            textAlign: "center",
            borderRadius: "12px",
            border: `1px dashed ${C.border}`,
            backgroundColor: "#FAFAFA",
          }}
        >
          <Typography sx={{ fontSize: 12, color: C.tertiary }}>
            {emptyText}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════
   SKILL INFO TAB  ← main component
══════════════════════════════════════════════════════════ */
function SkillInfoTab({ skillInfoData, skillLoading, candidateId }) {
  const [editKey, setEditKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterTier, setFilterTier] = useState("all");

  const [updateSkills] = useUpdateCandidateSkillsMutation();
  const { refetch } = useGetCandidateSkillInfoQuery(candidateId, {
    skip: !candidateId,
  });

  /* ── Loading ── */
  if (skillLoading) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "10px", py: 2 }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "10px",
            mb: "6px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              height={96}
              sx={{ borderRadius: "16px", transform: "none" }}
            />
          ))}
        </Box>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton
            key={i}
            height={76}
            sx={{ borderRadius: "14px", transform: "none" }}
          />
        ))}
      </Box>
    );
  }

  if (!skillInfoData) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          borderRadius: "14px",
          border: `1px dashed ${C.border}`,
        }}
      >
        <Typography sx={{ fontSize: 14, color: C.tertiary }}>
          No skill data available yet.
        </Typography>
      </Box>
    );
  }

  /* ── Normalise API shape ──
     v2: { skills: { key: { original_llm_value, updated_value, ... } } }
     v1: { original_data: { key: { value, notes } }, skill_overrides, notes_overrides }
  ── */
  const isV2 = !!skillInfoData?.skills;
  const rawSkills = isV2
    ? skillInfoData.skills
    : (skillInfoData?.original_data ?? {});
  const skillOvr = isV2 ? {} : (skillInfoData?.skill_overrides ?? {});
  const noteOvr = isV2 ? {} : (skillInfoData?.notes_overrides ?? {});

  const EXCLUDE = ["edc_system_expertise", "therapeutic_area_expertise"];

  const normalise = (key, raw) => {
    if (isV2) {
      return {
        original_llm_value: safeNum(raw?.original_llm_value),
        updated_value:
          raw?.updated_value != null ? safeNum(raw.updated_value) : null,
        original_llm_notes: getNoteText(raw?.original_llm_notes ?? raw?.notes),
        updated_notes:
          raw?.updated_notes != null ? getNoteText(raw.updated_notes) : null,
        value_updated_at: raw?.value_updated_at ?? null,
        value_updated_by: raw?.value_updated_by ?? null,
        notes_updated_at: raw?.notes_updated_at ?? null,
        notes_updated_by: raw?.notes_updated_by ?? null,
      };
    }
    /* v1 */
    const ov = skillOvr[key];
    const nov = noteOvr[key];
    return {
      original_llm_value: safeNum(raw?.value ?? raw),
      updated_value: ov ? safeNum(ov) : null,
      original_llm_notes: getNoteText(raw?.notes),
      updated_notes: nov ? getNoteText(nov) : null,
      value_updated_at: ov?.updated_at ?? null,
      value_updated_by: ov?.updated_by ?? null,
      notes_updated_at: nov?.updated_at ?? null,
      notes_updated_by: nov?.updated_by ?? null,
    };
  };

  const allEntries = Object.entries(rawSkills)
    .filter(
      ([k, v]) =>
        !EXCLUDE.includes(k) &&
        typeof safeNum(isV2 ? v?.original_llm_value : (v?.value ?? v)) ===
          "number",
    )
    .map(([k, v]) => [k, normalise(k, v)])
    .sort((a, b) => {
      const va = a[1].updated_value ?? a[1].original_llm_value;
      const vb = b[1].updated_value ?? b[1].original_llm_value;
      return vb - va;
    });

  const getScore = ([, v]) => v.updated_value ?? v.original_llm_value;

  const strong = allEntries.filter((e) => getScore(e) >= 0.8);
  const moderate = allEntries.filter((e) => {
    const s = getScore(e);
    return s >= 0.5 && s < 0.8;
  });
  const partial = allEntries.filter((e) => {
    const s = getScore(e);
    return s >= 0.2 && s < 0.5;
  });
  const low = allEntries.filter((e) => getScore(e) < 0.2);

  const filtered =
    filterTier === "all"
      ? allEntries
      : filterTier === "strong"
        ? strong
        : filterTier === "moderate"
          ? moderate
          : filterTier === "partial"
            ? partial
            : low;

  const overriddenCount = allEntries.filter(([, item]) => {
  const origVal =
    item?.original_llm_value ?? item?.value ?? 0;

  const currVal =
    item?.updated_value != null
      ? item.updated_value
      : origVal;

  return (
    !!item?.value_updated_at ||
    !!item?.notes_updated_at ||
    (item?.updated_value != null &&
      Math.abs(currVal - origVal) > 0.01)
  );
}).length;
  
  // console.log("Overridden count:", overriddenCount);
  const avgAI = allEntries.length
    ? Math.round(
        (allEntries.reduce((s, [, v]) => s + v.original_llm_value, 0) /
          allEntries.length) *
          100,
      )
    : 0;

  /* Tags */
  const rawData = skillInfoData?.original_data ?? {};
  const edcList = Array.isArray(rawData.edc_system_expertise?.value)
    ? rawData.edc_system_expertise.value.filter((s) => s && s !== "Not known")
    : [];
  const taList = Array.isArray(rawData.therapeutic_area_expertise?.value)
    ? rawData.therapeutic_area_expertise.value.filter(
        (s) => s && s !== "Not known",
      )
    : [];

  /* Save handler */
  const handleSave = async ({ skillKey, value, notes }) => {
    setSaving(true);

    try {
      const body = isV2
        ? {
            skills: {
              [skillKey]: {
                updated_value: value,
                updated_notes: notes,
              },
            },
          }
        : {
            skill_overrides: {
              [skillKey]: value,
            },
            notes_overrides: {
              [skillKey]: notes,
            },
          };

      await updateSkills({
        candidateId,
        body,
      }).unwrap();

      toast.success(`${slug(skillKey)} updated`);

      setEditKey(null);

      refetch();
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to update skill");
    } finally {
      setSaving(false);
    }
  };

  const editItem = editKey
    ? (allEntries.find(([k]) => k === editKey)?.[1] ?? null)
    : null;

  /* ── Render ── */
  return (
    <Box>
      {/* ══ HEADER ══ */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: "24px",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 800,
              color: C.primary,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            Skill Assessment
          </Typography>
          <Typography sx={{ ...T.meta, mt: "5px" }}>
            {skillInfoData?.sub_function
              ? `${slug(skillInfoData.sub_function)} · `
              : ""}
            {allEntries.length} competencies evaluated
            {overriddenCount > 0 && ` · ${overriddenCount} manually reviewed`}
          </Typography>
        </Box>
        {/* Tier summary pills */}
        <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {[
            { v: strong.length, t: tier(0.9), label: "Strong" },
            { v: moderate.length, t: tier(0.6), label: "Moderate" },
            { v: partial.length, t: tier(0.35), label: "Partial" },
            { v: low.length, t: tier(0.05), label: "Low" },
          ]
            .filter(({ v }) => v > 0)
            .map(({ v, t, label }) => (
              <Box
                key={label}
                sx={{
                  px: "12px",
                  py: "5px",
                  borderRadius: "99px",
                  backgroundColor: t.soft,
                  border: `1px solid ${t.border}`,
                }}
              >
                <Typography
                  sx={{ fontSize: 11, fontWeight: 700, color: t.color }}
                >
                  {v} {label}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>

      {/* ══ STAT CARDS ══ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" },
          gap: "10px",
          mb: "24px",
        }}
      >
        <StatCard
          label="AI Avg Score"
          value={`${avgAI}%`}
          sub="from resume extraction"
          color={tier(avgAI / 100).color}
          bg={tier(avgAI / 100).soft}
          border={tier(avgAI / 100).border}
        />
        <StatCard
          label="Strong Skills"
          value={strong.length}
          sub="score ≥ 80%"
          color={C.green}
          bg={C.greenSoft}
          border={C.greenBorder}
        />
        <StatCard
          label="Moderate"
          value={moderate.length}
          sub="score 50–79%"
          color={C.amber}
          bg={C.amberSoft}
          border={C.amberBorder}
        />
        <StatCard
          label="Reviewed"
          value={overriddenCount}
          sub={`of ${allEntries.length} manually overridden`}
          color={C.blue}
          bg={C.blueSoft}
          border={C.blueBorder}
        />
      </Box>

      {/* ══ EXPERTISE TAGS ══ */}
      {(edcList.length > 0 || taList.length > 0) && (
        <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mb: "24px" }}>
          {edcList.map((s, index) => (
            <Box
              key={s?.id || index}
              sx={{
                px: "12px",
                py: "5px",
                borderRadius: "8px",
                backgroundColor: C.blueSoft,
                border: `1px solid ${C.blueBorder}`,
              }}
            >
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.blue }}>
                EDC · {typeof s === "object" ? s.name : s}
              </Typography>
            </Box>
          ))}

          {taList.map((s, index) => (
            <Box
              key={s?.id || index}
              sx={{
                px: "12px",
                py: "5px",
                borderRadius: "8px",
                backgroundColor: "#F9FAFB",
                border: `1px solid ${C.border}`,
              }}
            >
              <Typography
                sx={{ fontSize: 11, fontWeight: 600, color: C.secondary }}
              >
                TA · {typeof s === "object" ? s.name : s}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* ══ FILTER BAR ══ */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          mb: "20px",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: "5px", mr: "4px" }}
        >
          <TuneOutlinedIcon sx={{ fontSize: 14, color: C.tertiary }} />
          <Typography sx={{ ...T.label }}>Filter</Typography>
        </Box>
        {[
          { key: "all", label: "All Skills", count: allEntries.length },
          {
            key: "strong",
            label: "Strong",
            count: strong.length,
            t: tier(0.9),
          },
          {
            key: "moderate",
            label: "Moderate",
            count: moderate.length,
            t: tier(0.6),
          },
          {
            key: "partial",
            label: "Partial",
            count: partial.length,
            t: tier(0.35),
          },
          { key: "low", label: "Low / None", count: low.length, t: tier(0.05) },
        ].map(({ key, label, count, t: ft }) => {
          const active = filterTier === key;
          const col = ft?.color ?? C.secondary;
          const bg = ft?.soft ?? "#F3F4F6";
          const bd = ft?.border ?? C.border;
          return (
            <Box
              key={key}
              onClick={() => setFilterTier(key)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                px: "12px",
                py: "5px",
                borderRadius: "99px",
                cursor: "pointer",
                border: `1.5px solid ${active ? (ft ? col : C.primary) : C.border}`,
                backgroundColor: active ? (ft ? bg : C.primary) : C.white,
                color: active ? (ft ? col : C.white) : C.tertiary,
                transition: "all 0.12s",
                "&:hover": {
                  borderColor: ft ? col : C.primary,
                  backgroundColor: ft ? bg : C.primary,
                  color: ft ? col : C.white,
                },
              }}
            >
              <Typography sx={{ fontSize: 11, fontWeight: 600 }}>
                {label}
              </Typography>
              <Box
                sx={{
                  px: "5px",
                  py: "1px",
                  borderRadius: "99px",
                  backgroundColor: active ? "rgba(255,255,255,0.3)" : "#F3F4F6",
                  minWidth: 18,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: active ? "inherit" : C.tertiary,
                  }}
                >
                  {count}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ══ SKILL ROWS ══ */}
      {filterTier === "all" ? (
        <>
          <SkillGroupSection
            title="Strong Evidence"
            icon="🟢"
            items={strong}
            emptyText="No strong skills."
            onEdit={setEditKey}
          />
          <SkillGroupSection
            title="Moderate Evidence"
            icon="🟡"
            items={moderate}
            emptyText="No moderate skills."
            onEdit={setEditKey}
          />
          <SkillGroupSection
            title="Partial Evidence"
            icon="🟠"
            items={partial}
            emptyText="No partial skills."
            onEdit={setEditKey}
          />
          <SkillGroupSection
            title="Low / No Evidence"
            icon="🔴"
            items={low}
            emptyText="No low skills."
            onEdit={setEditKey}
          />
        </>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.length > 0 ? (
            filtered.map(([key, item]) => (
              <SkillRow
                key={key}
                skillKey={key}
                item={item}
                onEdit={setEditKey}
              />
            ))
          ) : (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                borderRadius: "12px",
                border: `1px dashed ${C.border}`,
              }}
            >
              <Typography sx={{ fontSize: 12, color: C.tertiary }}>
                No skills in this category.
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ══ EDIT DIALOG ══ */}
      <SkillEditDialog
        open={!!editKey}
        onClose={() => !saving && setEditKey(null)}
        skillKey={editKey}
        item={editItem}
        onSave={handleSave}
        saving={saving}
      />
    </Box>
  );
}

const D = {
  // neutrals
  white: "#FFFFFF",
  bg: "#F9FAFB",
  border: "#E5E7EB",
  borderLight: "#F0F0F2",
  text: "#111827",
  mid: "#52525B",
  muted: "#9CA3AF",

  // semantic
  blue: "#185FA5",
  blueSoft: "#E6F1FB",
  blueBorder: "#B5D4F4",
  blueText: "#0C447C",

  teal: "#0F6E56",
  tealSoft: "#E1F5EE",
  tealBorder: "#6EE7B7",
  tealText: "#065F46",
  tealMid: "#059669",
  tealDot: "#10B981",

  amber: "#BA7517",
  amberSoft: "#FAEEDA",
  amberBorder: "#FAC775",
  amberText: "#633806",

  red: "#A32D2D",
  redSoft: "#FCEBEB",
  redBorder: "#F7C1C1",
  redText: "#791F1F",

  indigo: "#4338CA",
  indigoSoft: "#EEF2FF",
  indigoBorder: "#C7D2FE",
  indigoText: "#312E81",

  orange: "#C2410C",
  orangeSoft: "#FEF3EE",
  orangeBorder: "#FDBA74",

  r: "8px",
  rL: "12px",
};

/* ─────────────────────────────────────────────
   STAGE CONFIG
───────────────────────────────────────────── */
const STAGE_MAP = {
  matched: { label: "Matched", color: D.amber, dot: D.amber },
  shortlisted: { label: "Shortlisted", color: D.teal, dot: D.tealDot },
  interview_scheduled: {
    label: "Interview scheduled",
    color: D.indigo,
    dot: D.indigo,
  },
  interviewing: { label: "Interviewing", color: D.indigo, dot: D.indigo },
  selected: { label: "Selected", color: D.teal, dot: D.tealDot },
  offer_released: { label: "Offer released", color: D.teal, dot: D.tealDot },
  offer_accepted: { label: "Offer accepted", color: D.teal, dot: D.tealDot },
  onboarded: { label: "Onboarded", color: D.teal, dot: D.tealDot },
  rejected: { label: "Rejected", color: D.red, dot: D.red },
  offer_rejected: { label: "Offer rejected", color: D.red, dot: D.red },
};

function getStageCfg(s = "") {
  const key = s.toLowerCase().replace(/\s+/g, "_");
  return STAGE_MAP[key] ?? { label: s, color: D.muted, dot: D.muted };
}

function formatDate(d) {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function fmtTime(t) {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

/* ─────────────────────────────────────────────
   STAT GRID
   Four bordered cells — total / shortlisted / interviews / rejected
───────────────────────────────────────────── */
function StatGrid({ total, shortlisted, interviews, rejected }) {
  const cells = [
    { label: "Total matched", value: total, color: D.text },
    { label: "Shortlisted", value: shortlisted, color: D.blue },
    { label: "Interviews", value: interviews, color: D.teal },
    { label: "Rejected", value: rejected, color: D.red },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        border: `1px solid ${D.border}`,
        borderRadius: D.rL,
        overflow: "hidden",
        backgroundColor: D.white,
        mb: "18px",
      }}
    >
      {cells.map((c, i) => (
        <Box
          key={i}
          sx={{
            px: "20px",
            py: "16px",
            borderLeft: i > 0 ? `1px solid ${D.border}` : "none",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: D.muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              mb: "8px",
            }}
          >
            {c.label}
          </Typography>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 700,
              color: c.color,
              lineHeight: 1,
            }}
          >
            {c.value ?? 0}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

/* ─────────────────────────────────────────────
   MATCH SCORE BOX
   Color tier: ≥80 green · ≥55 amber · <55 red
───────────────────────────────────────────── */
function MatchBox({ score }) {
  const pct = Math.round(score ?? 0);
  const tier = pct >= 80 ? "high" : pct >= 55 ? "mid" : "low";
  const cfg = {
    high: {
      bg: D.tealSoft,
      border: D.tealBorder,
      pctColor: D.tealText,
      lblColor: D.tealMid,
    },
    mid: {
      bg: D.amberSoft,
      border: D.amberBorder,
      pctColor: D.amberText,
      lblColor: D.amber,
    },
    low: {
      bg: D.redSoft,
      border: D.redBorder,
      pctColor: D.redText,
      lblColor: D.red,
    },
  }[tier];

  return (
    <Box
      sx={{
        flexShrink: 0,
        width: 62,
        height: 62,
        borderRadius: "10px",
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1px",
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 800,
          color: cfg.pctColor,
          lineHeight: 1.1,
        }}
      >
        {pct}%
      </Typography>
      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 700,
          color: cfg.lblColor,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Match
      </Typography>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   INTERVIEW ROW
   Shown inside cards that have a current/upcoming interview
───────────────────────────────────────────── */
function InterviewRow({ iv }) {
  if (!iv) return null;
  const timeStr = [
    iv.date ? formatDate(iv.date) : null,
    iv.start_time ? fmtTime(iv.start_time) : null,
    iv.end_time ? `– ${fmtTime(iv.end_time)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Box
      sx={{
        mt: "12px",
        p: "10px 13px",
        borderRadius: D.r,
        backgroundColor: D.bg,
        border: `1px solid ${D.borderLight}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {/* Left: icon + round name */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "7px",
            backgroundColor: D.indigoSoft,
            border: `1px solid ${D.indigoBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: D.indigo }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: D.text,
              lineHeight: 1.2,
            }}
          >
            {iv.step_name ?? `Round ${iv.step_number ?? 1}`}
          </Typography>
          {iv.step_number != null && (
            <Typography
              sx={{ fontSize: 10.5, color: D.muted, fontWeight: 500 }}
            >
              Step {iv.step_number}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right: status badge + datetime */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Box
          sx={{
            fontSize: 11,
            fontWeight: 700,
            px: "10px",
            py: "3px",
            borderRadius: "999px",
            backgroundColor: D.indigoSoft,
            border: `1px solid ${D.indigoBorder}`,
            color: D.indigo,
          }}
        >
          {iv.status ?? "Scheduled"}
        </Box>
        {timeStr && (
          <Typography sx={{ fontSize: 11, color: D.muted }}>
            {timeStr}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   JOB CARD
───────────────────────────────────────────── */
function JobCard({ job }) {
  const sc = getStageCfg(job.current_stage);
  const isOpen = (job.job_status ?? "").toLowerCase() === "open";
  const hasIv = !!job.current_interview;

  return (
    <Box
      sx={{
        backgroundColor: D.white,
        border: `1px solid ${D.border}`,
        // accent left border for cards with live interview
        borderLeft: hasIv ? `3px solid ${D.indigo}` : `1px solid ${D.border}`,
        borderRadius: D.rL,
        p: "15px 17px",
        mb: "10px",
        transition: "border-color .15s, box-shadow .15s",
        "&:hover": {
          borderColor: hasIv ? D.indigo : "#D1D5DB",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "14px",
        }}
      >
        {/* ── Left column ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Title row: ID + open/closed pill */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              mb: "8px",
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: D.text }}>
              {job.job_title}
            </Typography>

            {/* open / closed badge */}
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: 11,
                px: "8px",
                py: "2px",
                borderRadius: "999px",
                ...(isOpen
                  ? {
                      backgroundColor: D.tealSoft,
                      border: `1px solid ${D.tealBorder}`,
                      color: D.tealText,
                    }
                  : {
                      backgroundColor: D.redSoft,
                      border: `1px solid ${D.redBorder}`,
                      color: D.redText,
                    }),
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: isOpen ? D.tealDot : D.red,
                }}
              />
              {isOpen ? "Open" : "Closed"}
            </Box>
          </Box>

          {/* Stage + dates row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {/* stage dot */}
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: sc.dot,
                flexShrink: 0,
              }}
            />

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: D.muted,
              }}
            >
              Stage
            </Typography>

            <Typography sx={{ fontSize: 11, fontWeight: 700, color: sc.color }}>
              {sc.label}
            </Typography>

            {job.matched_at && (
              <>
                <Typography sx={{ fontSize: 11, color: D.borderLight }}>
                  ·
                </Typography>
                <Typography sx={{ fontSize: 11, color: D.muted }}>
                  Matched {formatDate(job.matched_at)}
                </Typography>
              </>
            )}

            {job.shortlisted_at && (
              <>
                <Typography sx={{ fontSize: 11, color: D.borderLight }}>
                  ·
                </Typography>
                <Typography sx={{ fontSize: 11, color: D.muted }}>
                  Shortlisted {formatDate(job.shortlisted_at)}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* ── Match score ── */}
        <MatchBox score={job.match_score} />
      </Box>

      {/* Interview row — only when present */}
      {hasIv && <InterviewRow iv={job.current_interview} />}
    </Box>
  );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <Box
      sx={{
        backgroundColor: D.white,
        border: `1px solid ${D.border}`,
        borderRadius: D.rL,
        p: "15px 17px",
        mb: "10px",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: "14px" }}
      >
        <Box sx={{ flex: 1 }}>
          <Skeleton width="42%" height={16} sx={{ mb: "10px" }} />
          <Skeleton width="68%" height={13} />
        </Box>
        <Skeleton
          variant="rounded"
          width={62}
          height={62}
          sx={{ borderRadius: "10px", flexShrink: 0 }}
        />
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   FILTER PILL
───────────────────────────────────────────── */
function FilterPill({ label, active, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        fontSize: 12,
        px: "14px",
        py: "5px",
        borderRadius: "999px",
        cursor: "pointer",
        border: active
          ? `1px solid ${D.orangeBorder}`
          : `1px solid ${D.border}`,
        backgroundColor: active ? D.orangeSoft : D.white,
        color: active ? D.orange : D.mid,
        fontWeight: active ? 700 : 500,
        transition: "all .14s",
        "&:hover": { borderColor: D.orangeBorder, color: D.orange },
        userSelect: "none",
      }}
    >
      {label}
    </Box>
  );
}

/* ─────────────────────────────────────────────
   MAIN: MatchedJobsTab
───────────────────────────────────────────── */
export function MatchedJobsTab({ candidateId, tab }) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const { data, isLoading, isError } = useGetCandidateMatchedJobsQuery(
    candidateId,
    { skip: tab !== 5 || !candidateId },
  );

  const allJobs = data?.jobs ?? [];

  /* ── counts ── */
  const counts = useMemo(
    () => ({
      total: allJobs.length,
      shortlisted: allJobs.filter(
        (j) => (j.current_stage ?? "").toLowerCase() === "shortlisted",
      ).length,
      interviews: allJobs.filter((j) => {
        const k = (j.current_stage ?? "").toLowerCase().replace(/\s+/g, "_");
        return ["interview_scheduled", "interviewing"].includes(k);
      }).length,
      rejected: allJobs.filter((j) =>
        (j.current_stage ?? "").toLowerCase().includes("reject"),
      ).length,
    }),
    [allJobs],
  );

  /* ── filtered + sorted list ── */
  const displayed = useMemo(() => {
    let list = allJobs;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((j) => (j.job_title ?? "").toLowerCase().includes(q));
    }

    if (stageFilter !== "all") {
      list = list.filter((j) => {
        const k = (j.current_stage ?? "").toLowerCase().replace(/\s+/g, "_");
        if (stageFilter === "interview")
          return ["interview_scheduled", "interviewing"].includes(k);
        if (stageFilter === "rejected") return k.includes("reject");
        return k === stageFilter;
      });
    }

    if (sortBy === "score")
      list = [...list].sort(
        (a, b) => (b.match_score ?? 0) - (a.match_score ?? 0),
      );
    if (sortBy === "recent")
      list = [...list].sort(
        (a, b) => new Date(b.matched_at ?? 0) - new Date(a.matched_at ?? 0),
      );

    return list;
  }, [allJobs, search, stageFilter, sortBy]);

  /* ── loading ── */
  if (isLoading)
    return (
      <Box>
        <Skeleton
          variant="rounded"
          height={94}
          sx={{ borderRadius: D.rL, mb: "18px" }}
        />
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </Box>
    );

  /* ── error ── */
  if (isError)
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          border: `1px dashed ${D.border}`,
          borderRadius: D.rL,
        }}
      >
        <Typography sx={{ fontSize: 13, color: D.red }}>
          Failed to load matched jobs.
        </Typography>
      </Box>
    );

  /* ── empty ── */
  if (!allJobs.length)
    return (
      <Box
        sx={{
          py: 10,
          textAlign: "center",
          border: `1px dashed ${D.border}`,
          borderRadius: D.rL,
        }}
      >
        <Typography sx={{ fontSize: 13, color: D.muted }}>
          No matched jobs yet.
        </Typography>
      </Box>
    );

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "matched", label: "Matched" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "interview", label: "Interview" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <Box>
      {/* ── Stat grid ── */}
      <StatGrid
        total={counts.total}
        shortlisted={counts.shortlisted}
        interviews={counts.interviews}
        rejected={counts.rejected}
      />

      {/* ── Filter pills + count ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "14px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Box sx={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <FilterPill
              key={f.key}
              label={f.label}
              active={stageFilter === f.key}
              onClick={() => setStageFilter(f.key)}
            />
          ))}
        </Box>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: D.muted }}>
          {displayed.length} {displayed.length === 1 ? "job" : "jobs"}
        </Typography>
      </Box>

      {/* ── Search + sort toolbar ── */}
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          mb: "16px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: "1 1 180px",
            maxWidth: 260,
            px: "11px",
            py: "6px",
            borderRadius: D.r,
            border: `1px solid ${D.border}`,
            backgroundColor: D.white,
            "&:focus-within": { borderColor: "#9CA3AF" },
            transition: "border-color .15s",
          }}
        >
          <SearchIcon sx={{ fontSize: 15, color: D.muted, flexShrink: 0 }} />
          <InputBase
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs…"
            sx={{ flex: 1, fontSize: 12, "& input": { p: 0 }, color: D.text }}
          />
        </Box>

        {/* sort */}
        <FormControl size="small">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              fontSize: 12,
              borderRadius: D.r,
              height: 34,
              minWidth: 145,
              color: D.mid,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: D.border },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#9CA3AF",
              },
            }}
          >
            <MenuItem value="recent" sx={{ fontSize: 12 }}>
              Most recent
            </MenuItem>
            <MenuItem value="score" sx={{ fontSize: 12 }}>
              Highest match
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ── Cards ── */}
      {displayed.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
            border: `1px dashed ${D.border}`,
            borderRadius: D.rL,
          }}
        >
          <Typography sx={{ fontSize: 12, color: D.muted }}>
            No jobs match the current filters.
          </Typography>
        </Box>
      ) : (
        displayed.map((job) => (
          <JobCard key={job.job_matched_candidate_id ?? job.job_id} job={job} />
        ))
      )}
    </Box>
  );
}
/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);

  const { data, isLoading, isError } = useGetCandidateDetailsQuery(
    candidateId,
    { skip: !candidateId },
  );
  const { data: skillInfoData, isLoading: skillLoading } =
    useGetCandidateSkillInfoQuery(candidateId, { skip: !candidateId });

  console.log("data...", data?.data?.clin_id);
  console.log("jobs", data?.jobs);
  const clinId = data?.data?.clin_id || "";
  const c = data?.data || {};
  const name = c.full_name || "";
  const email = c.email || "";
  const phone = c.phone_number || "";
  const domain = c.domain || "";
  const fn = c.function || "";
  const subFn = c.sub_function || "";
  const employment = c.employment || [];
  const education = c.education || [];
  const certifications = c.certifications || [];
  const personal = c.personal_details || {};

  const currentJob =
    employment.find((e) => e.is_current) || employment[0] || {};
  const currentRole = currentJob.job_title || "";
  const currentComp =
    currentJob.company_name !== "Not specified"
      ? currentJob.company_name || ""
      : "";
  const relocate = personal.willing_to_relocate;
  const totalExp =
    currentJob.total_exp_years != null
      ? `${currentJob.total_exp_years}y ${currentJob.total_exp_months ?? 0}m`
      : "";
  const allSkills = [
    ...new Set(employment.flatMap((e) => e.skills_used || [])),
  ];
  const bg = avatarBg(name);

  const TABS = [
    { label: "Experience", count: employment.length },
    { label: "Education", count: education.length },
    { label: "Skills", count: allSkills.length },
    { label: "Certifications", count: certifications.length },
    { label: "Skill Info" },
    { label: "Matched Jobs" },
  ];
  const [getResumeView] = useLazyGetResumeViewQuery();
  const viewResume = async (candidateId) => {
    try {
      const res = await getResumeView(candidateId).unwrap();

      const url = res?.resume_url;

      if (url) {
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Resume fetch failed:", error);
    }
  };

  useEffect(() => {
    if (c.full_name) dispatch(setDynamicLabels({ candidateId: c.full_name }));
    return () => dispatch(setDynamicLabels({ candidateId: null }));
  }, [c.full_name, dispatch]);

  if (isLoading) return <PageSkeleton />;
  if (isError)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontSize: 16, fontWeight: 700, color: "#EF4444", mb: 1 }}
          >
            Failed to load candidate
          </Typography>
          <Typography sx={{ ...T.meta, color: C.tertiary }}>
            Please try again later.
          </Typography>
        </Box>
      </Box>
    );

  return (
    <Box
      sx={{ backgroundColor: "#fff", minHeight: "100vh", p: "10px 10px 40px" }}
    >
      {/* ── Hero card ── */}
      <Box
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          backgroundColor: C.white,
          mb: "16px",
        }}
      >
        <Box sx={{ height: 42 }} />
        <Box sx={{ px: "24px", pb: "20px", mt: "-30px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar row — arrow + avatar + identity */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* ← Back arrow aligned to avatar center */}
              <IconButton
                size="small"
                onClick={() => navigate(-1)}
                sx={{
                  mt: "0px", // pushes down to clear the banner overlap
                  flexShrink: 0,
                  border: `1px solid ${C.border}`,
                  borderRadius: "8px",
                  backgroundColor: C.white,
                  color: C.secondary,
                  "&:hover": {
                    backgroundColor: C.accentSoft,
                    borderColor: C.accent,
                    color: C.accent,
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 16 }} />
              </IconButton>

              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: 22,
                  fontWeight: 700,
                  backgroundColor: bg,
                  border: "3px solid #fff",
                  flexShrink: 0,
                }}
              >
                {getInitials(name)}
              </Avatar>

              <Box sx={{ pb: "4px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <Typography sx={T.valueLg}>{fmt(name)}</Typography>
                  {console.log("name...", name)}
                  <Box sx={{display:'flex',alignItems:"centre"}}>
                    <DescriptionOutlinedIcon
                    onClick={() => {
                      viewResume(candidateId);
                    }}
                    sx={{
                      fontSize: 14,
                      color: "#FF5F1F",
                      ml: 1,
                      cursor: "pointer",
                    }}
                  />
                  <Typography sx={{ ...T.meta, ml: 1, fontSize: 12, color: C.muted }}>
                    {clinId}
                  </Typography>
                  </Box>
                </Box>
                {(currentRole || currentComp) && (
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: C.secondary,
                      mt: "2px",
                    }}
                  >
                    {currentRole}
                    {currentComp ? ` · ${currentComp}` : ""}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    gap: "6px",
                    mt: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {domain && (
                    <Box
                      sx={{
                        ...T.badge,
                        px: "8px",
                        py: "2px",
                        borderRadius: "5px",
                        backgroundColor: C.indigoSoft,
                        color: C.indigo,
                        border: "1px solid #E0E7FF",
                      }}
                    >
                      {slug(domain)}
                    </Box>
                  )}
                  {fn && (
                    <Box
                      sx={{
                        ...T.badge,
                        px: "8px",
                        py: "2px",
                        borderRadius: "5px",
                        backgroundColor: C.greenSoft,
                        color: C.green,
                        border: `1px solid ${C.greenBorder}`,
                      }}
                    >
                      {slug(fn)}
                    </Box>
                  )}
                  {subFn && (
                    <Box
                      sx={{
                        ...T.badge,
                        px: "8px",
                        py: "2px",
                        borderRadius: "5px",
                        backgroundColor: C.amberSoft,
                        color: C.amber,
                        border: `1px solid ${C.amberBorder}`,
                      }}
                    >
                      {slug(subFn)}
                    </Box>
                  )}
                  {relocate === true && (
                    <Box
                      sx={{
                        ...T.badge,
                        px: "8px",
                        py: "2px",
                        borderRadius: "5px",
                        backgroundColor: C.greenSoft,
                        color: C.green,
                        border: `1px solid ${C.greenBorder}`,
                      }}
                    >
                      Open to relocate
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Contact + exp — unchanged */}
            <Box sx={{ display: "flex", gap: 1, pb: "4px", flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {email && (
                  <Box
                    component="a"
                    href={`mailto:${email}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: 12,
                      fontWeight: 600,
                      px: "14px",
                      py: "7px",
                      borderRadius: "8px",
                      border: `1px solid ${C.border}`,
                      backgroundColor: C.white,
                      color: C.secondary,
                      textDecoration: "none",
                      "&:hover": {
                        borderColor: C.accent,
                        color: C.accent,
                        backgroundColor: C.accentSoft,
                      },
                    }}
                  >
                    <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                    <Typography
                      component="span"
                      sx={{ fontSize: 12, fontWeight: 600 }}
                    >
                      {email}
                    </Typography>
                  </Box>
                )}
                {phone && (
                  <Box
                    component="a"
                    href={`tel:${phone}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: 12,
                      fontWeight: 600,
                      px: "14px",
                      py: "7px",
                      borderRadius: "8px",
                      border: `1px solid ${C.border}`,
                      backgroundColor: C.white,
                      color: C.secondary,
                      textDecoration: "none",
                      "&:hover": {
                        borderColor: C.accent,
                        color: C.accent,
                        backgroundColor: C.accentSoft,
                      },
                    }}
                  >
                    <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                    <Typography
                      component="span"
                      sx={{ fontSize: 12, fontWeight: 600 }}
                    >
                      {phone}
                    </Typography>
                  </Box>
                )}
              </Box>
              {totalExp && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: 12,
                    fontWeight: 600,
                    px: "14px",
                    py: "7px",
                    borderRadius: "8px",
                    border: `1px solid ${C.border}`,
                    backgroundColor: C.white,
                    color: C.secondary,
                  }}
                >
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                  <Typography
                    component="span"
                    sx={{ fontSize: 12, fontWeight: 600 }}
                  >
                    {totalExp}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Tabs card ── */}
      <Box
        sx={{
          borderRadius: "16px",
          border: `1px solid ${C.border}`,
          backgroundColor: C.white,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: "16px",
            borderBottom: `1px solid ${C.border}`,
            minHeight: 46,
            "& .MuiTab-root": {
              textTransform: "none",
              ...T.tabLabel,
              minHeight: 46,
              px: "14px",
              color: C.tertiary,
            },
            "& .Mui-selected": { color: C.accent },
            "& .MuiTabs-indicator": {
              backgroundColor: C.accent,
              height: 2,
              borderRadius: "1px 1px 0 0",
            },
          }}
        >
          {TABS.map((t, i) => (
            <Tab
              key={i}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>{t.label}</span>
                  {t.count > 0 && (
                    <Box
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        px: "5px",
                        py: "1px",
                        borderRadius: "4px",
                        backgroundColor: tab === i ? C.accentSoft : "#F3F4F6",
                        color: tab === i ? C.accent : C.tertiary,
                      }}
                    >
                      {t.count}
                    </Box>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>

        <Box sx={{ p: "24px" }}>
          <TabPanel value={tab} index={0}>
            {employment.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {employment.map((job, i) => (
                  <ExperienceCard
                    key={job.id || i}
                    job={job}
                    isLast={i === employment.length - 1}
                  />
                ))}
              </Box>
            ) : (
              <Empty label="No employment data available." />
            )}
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {education.length > 0 ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {education.map((edu, i) => (
                  <EducationCard key={edu.id || i} edu={edu} />
                ))}
              </Box>
            ) : (
              <Empty label="No education data available." />
            )}
          </TabPanel>

          <TabPanel value={tab} index={2}>
            {allSkills.length > 0 ? (
              <Box>
                <SectionHeading count={allSkills.length}>
                  All skills
                </SectionHeading>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {allSkills.map((sk, i) => (
                    <Box
                      key={i}
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        px: "10px",
                        py: "5px",
                        borderRadius: "7px",
                        border: `1px solid ${C.border}`,
                        color: C.indigo,
                        backgroundColor: C.indigoSoft,
                        transition: "all 0.12s",
                        "&:hover": {
                          borderColor: C.indigo,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {sk}
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Empty label="No skills data available." />
            )}
          </TabPanel>

          <TabPanel value={tab} index={3}>
            {certifications.length > 0 ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                {certifications.map((cert, i) => (
                  <CertCard key={cert.id || i} cert={cert} />
                ))}
              </Box>
            ) : (
              <Empty label="No certifications available." />
            )}
          </TabPanel>

          <TabPanel value={tab} index={4}>
            <SkillInfoTab
              skillInfoData={skillInfoData}
              skillLoading={skillLoading}
              candidateId={candidateId}
            />
          </TabPanel>
          <TabPanel value={tab} index={5}>
            <MatchedJobsTab candidateId={candidateId} tab={tab} />
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}

```

---

## File: pages/Dashboard/CandidatePipelineFunnel.jsx

```javascript
import React from "react";
import { Box, Typography } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import { COLORS, STATUS_COLORS } from "../../../styles/theme";
import CandidateFunnelChart from "./charts/CandidateFunnelChart";
import CandidateStageColumnChart from "./charts/CandidateStageColumnChart";

// Helper to safely get nested values
const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

// Get count safely from flat or nested structure. When the API returns a
// stage as an object (e.g. { total, current, ... }) instead of a plain
// number, prefer the field matching the selected Cumulative/Current toggle
// before falling back to .total/.value.
const getStageCount = (data, key, countsType) => {
    if (!data) return 0;
    const val = getNestedValue(data, key);

    if (typeof val === "number") return val;
    if (typeof val === "object" && val !== null) {
        if (countsType === "current" && val.current !== undefined) return val.current;
        return val.total ?? val.value ?? 0;
    }
    return 0;
};

// ─── Main funnel sequence ──────────────────────────────────────────────────
const MAIN_FLOW_STAGES = [
    { key: "matched", label: "Matched", Icon: GroupsOutlinedIcon, bg: STATUS_COLORS.matched.bg, color: STATUS_COLORS.matched.color },
    { key: "shortlisted", label: "Shortlisted", Icon: FactCheckOutlinedIcon, bg: STATUS_COLORS.shortlisted.bg, color: STATUS_COLORS.shortlisted.color },
    { key: "interviewing", label: "Interviewing", Icon: EventAvailableOutlinedIcon, bg: STATUS_COLORS.interviewing.bg, color: STATUS_COLORS.interviewing.color },
    { key: "selected", label: "Selected", Icon: HowToRegOutlinedIcon, bg: STATUS_COLORS.selected.bg, color: STATUS_COLORS.selected.color },
    {
        key: "offers.offer_released",
        stageKey: "offer_released",
        label: "Offer Released",
        Icon: DescriptionOutlinedIcon,
        bg: STATUS_COLORS.offer_released.bg,
        color: STATUS_COLORS.offer_released.color,
    },
    { key: "onboarded", label: "Onboarded", Icon: VerifiedOutlinedIcon, bg: STATUS_COLORS.onboarded.bg, color: STATUS_COLORS.onboarded.color },
];

const REJECTED_STAGE = {
    key: "rejected", label: "Rejected", Icon: PersonRemoveOutlinedIcon,
    bg: STATUS_COLORS.rejected.bg, color: STATUS_COLORS.rejected.color, textDark: STATUS_COLORS.rejected.color,
};

const SectionLabel = ({ children }) => (
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.75 }}>
        {children}
    </Typography>
);

// ── Header Suffix ───────────────────────────────────────────────────────
const HEADER_SUFFIX = {
    cumulative: "Pipeline Analytics",   // Keep this as is
    current: "Current Pipeline",
};

export default function CandidatePipelineFunnel({
    data, totalCount, loading, onStageClick, countsType,
}) {
    const rejectedCount = getStageCount(data, "rejected");

    const funnelData = MAIN_FLOW_STAGES.map((stage) => ({
        key: stage.stageKey || stage.key,
        name: stage.label,
        value: getStageCount(data, stage.key, countsType),
        fill: stage.color,
    }));

    return (
        <Box sx={{ bgcolor: "#fff", borderRadius: "12px", p: 1.5, border: `1px solid ${COLORS.border}`, boxShadow: "0 2px 12px rgba(23,79,223,0.07)", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, gap: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>
                    Candidate Pipeline
                    <Box component="span" sx={{ color: COLORS.textSecondary, fontWeight: 500 }}>
                        {" "}: {HEADER_SUFFIX[countsType] || HEADER_SUFFIX.cumulative}
                    </Box>
                </Typography>
                {totalCount > 0 && (
                    <Box sx={{ bgcolor: "#EEF3FF", borderRadius: "20px", px: 1.5, py: 0.4 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: COLORS.royalBlue }}>
                            {totalCount} total candidates
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Main Flow — "Cumulative" counts strictly narrow stage-over-stage, so a
                funnel's tapering shape fits; "Current" counts are an independent
                snapshot per stage (not monotonically decreasing), so it switches to
                a column chart instead of implying a shrinkage that isn't there. */}
            <SectionLabel>Main Flow</SectionLabel>
            {countsType === "current" ? (
                <CandidateStageColumnChart
                    data={funnelData}
                    loading={loading}
                    onSegmentClick={(stageKey) => onStageClick?.(`candidate_stage_breakdown.${stageKey}`)}
                />
            ) : (
                <CandidateFunnelChart
                    data={funnelData}
                    loading={loading}
                    onSegmentClick={(stageKey) => onStageClick?.(`candidate_stage_breakdown.${stageKey}`)}
                />
            )}

            {/* Rejected — shown as its own stat box rather than a drop-off footnote */}
            {!loading && (
                <Box sx={{ pt: 1, mt: 1, borderTop: `1px solid ${COLORS.border}` }}>
                    {/* <SectionLabel>Dropped Off</SectionLabel> */}
                    <Box
                        onClick={() => rejectedCount > 0 && onStageClick?.("candidate_stage_breakdown.rejected")}
                        sx={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            bgcolor: REJECTED_STAGE.bg, border: `1px solid ${REJECTED_STAGE.color}33`,
                            borderRadius: "10px", px: 1.5, py: 1,
                            cursor: rejectedCount > 0 ? "pointer" : "default",
                            transition: "box-shadow 0.15s",
                            "&:hover": rejectedCount > 0 ? { boxShadow: `0 2px 10px ${REJECTED_STAGE.color}22` } : {},
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 26, height: 26, borderRadius: "50%", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <PersonRemoveOutlinedIcon sx={{ fontSize: 14, color: REJECTED_STAGE.color }} />
                            </Box>
                            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: REJECTED_STAGE.textDark }}>
                                Rejected Candidates
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: REJECTED_STAGE.color }}>
                            {rejectedCount}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

```

---

## File: pages/Dashboard/charts/CandidateFunnelChart.jsx

```javascript
import React from "react";
import { Box, Typography } from "@mui/material";
import { FunnelChart, Funnel, Cell, LabelList, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../../../../styles/theme";

const FunnelTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <Box sx={{ bgcolor: COLORS.navyBlue, color: "#fff", px: 1.2, py: 0.8, borderRadius: "8px", fontSize: 12, whiteSpace: "nowrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: fill, flexShrink: 0 }} />
        <Box component="span">{name}: <b>{value}</b></Box>
      </Box>
    </Box>
  );
};

// ── Candidate pipeline as a real funnel — click a segment to drill in ─────
const CandidateFunnelChart = ({ data = [], onSegmentClick, loading }) => {
  if (loading) {
    return <Box sx={{ flex: 1, minHeight: 200, borderRadius: "10px", bgcolor: COLORS.bgPage }} />;
  }

  const hasData = data.some((d) => d.value > 0);
  if (!hasData) {
    return (
      <Box sx={{ flex: 1, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>No pipeline data yet</Typography>
      </Box>
    );
  }

  // Real pipeline counts aren't strictly decreasing (e.g. "Offers" or
  // "Onboarded" can be >= "Selected", since not every offer/onboard traces
  // back through a "selected" marking) — recharts' Funnel assumes a
  // monotonically shrinking series and renders anything that isn't as a
  // flat, untapered rectangle. `sizeValue` drives the trapezoid width (never
  // widening past the narrowest stage so far) while the true count still
  // shows via the "value"-keyed labels/tooltip below.
  let runningMin = Infinity;
  const shapeData = data.map((d) => {
    runningMin = Math.min(runningMin, d.value);
    return { ...d, sizeValue: runningMin };
  });

  return (
    <Box sx={{ flex: 1, minHeight: 0, height: "100%", overflow: "hidden", pb: 0.5 }}>
      <ResponsiveContainer width="100%" height="100%" margin={1}>
        <FunnelChart margin={{ top: 2, right: 30, bottom: 18, left: 20 }}>
          <Tooltip content={<FunnelTooltip />} />
          <Funnel dataKey="sizeValue" data={shapeData} isAnimationActive animationDuration={700} lastShapeType="rectangle">
            <LabelList position="right" dataKey="name" stroke="none" fill={COLORS.textPrimary} fontSize={11} fontWeight={600} offset={12} />
            <LabelList position="left" dataKey="value" stroke="none" fill={COLORS.textSecondary} fontSize={10.5} offset={12} />
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={entry.fill}
                cursor={entry.value > 0 ? "pointer" : "default"}
                onClick={() => entry.value > 0 && onSegmentClick?.(entry.key)}
              />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CandidateFunnelChart;

```

---

## File: pages/Dashboard/charts/CandidateStageColumnChart.jsx

```javascript
import React from "react";
import { Box, Typography } from "@mui/material";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from "recharts";
import { COLORS } from "../../../../styles/theme";

const ColumnTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <Box sx={{ bgcolor: COLORS.navyBlue, color: "#fff", px: 1.2, py: 0.8, borderRadius: "8px", fontSize: 12, whiteSpace: "nowrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: fill, flexShrink: 0 }} />
        <Box component="span">{name}: <b>{value}</b></Box>
      </Box>
    </Box>
  );
};

// ── Current-pipeline snapshot as independent columns — "Current" counts are
// candidates sitting in each stage right now, not a cumulative flow, so they
// aren't monotonically decreasing (e.g. "Onboarded" can be >= "Selected").
// A funnel's implied shrinkage would misrepresent that; plain columns show
// each stage's count on its own terms instead.
const CandidateStageColumnChart = ({ data = [], onSegmentClick, loading }) => {
  if (loading) {
    return <Box sx={{ flex: 1, minHeight: 200, borderRadius: "10px", bgcolor: COLORS.bgPage }} />;
  }

  const hasData = data.some((d) => d.value > 0);
  if (!hasData) {
    return (
      <Box sx={{ flex: 1, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>No pipeline data yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, height: "100%", overflow: "hidden", pb: 0.5 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 12, bottom: 4, left: 0 }} barCategoryGap="24%">
          <CartesianGrid vertical={false} stroke={COLORS.border} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10.5, fill: COLORS.textSecondary }}
            axisLine={{ stroke: COLORS.border }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 10.5, fill: COLORS.textSecondary }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<ColumnTooltip />} cursor={{ fill: `${COLORS.royalBlue}0A` }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive animationDuration={700}>
            <LabelList dataKey="value" position="top" fill={COLORS.textPrimary} fontSize={11} fontWeight={600} />
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={entry.fill}
                cursor={entry.value > 0 ? "pointer" : "default"}
                onClick={() => entry.value > 0 && onSegmentClick?.(entry.key)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CandidateStageColumnChart;

```

---

## File: pages/OrgCandidates/CandidateDetail.jsx

```javascript
// src/pages/OrgCandidates/CandidateDetail.jsx

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Grid,
  Chip,
  Button,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Stack,
  Divider,
  Link,
  DialogActions,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Rating,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import { useDispatch } from "react-redux";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import NotInterestedOutlinedIcon from "@mui/icons-material/NotInterestedOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import {
  setDynamicLabels,
  clearDynamicLabels,
} from "../../redux/slices/breadcrumbSlice";
import {
  useGetCandidateDetailQuery,
  useGetCandidateStageTimelineQuery,
  useLazyGetResumeViewQuery,
  useGetInterviewDetailsQuery,
  useLazyGetInterviewDetailsQuery,
  useScheduleInterviewInCandidatesMutation,
  useUpdateCandidateStatusMutation,
  useLazyGetEmployeesByRoleQuery,
  useRescheduleInterviewMutation,
  useUpdateInterviewRoundStatusMutation,
  useUpdateInterviewResultMutation,
  useLazyGetInterviewFullDetailsQuery,
  useLazyGetInterviewFeedbackQuery,
} from "../../redux/services/requisition/requisition";
import {
  PersonOutlineOutlined,
  WorkOutlineOutlined,
  EmailOutlined,
  PhoneOutlined,
  AccessTimeOutlined,
  CheckCircleOutlineOutlined,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const STAGE_CONFIG = [
  { key: "matched", label: "Matched" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interviewing", label: "Interviewing" },
  { key: "selected", label: "Selected" },
  { key: "offer", label: "Offer" },
  { key: "hired", label: "Hired" },
];

// Maps a granular lifecycle value (the `type` on a simple timeline entry,
// or `candidate.current_stage`) to one of the STAGE_CONFIG group keys.
const STAGE_GROUP = {
  matched: "matched",
  shortlisted: "shortlisted",
  interview_scheduled: "interviewing",
  interview_completed: "interviewing",
  interview_cancelled: "interviewing",
  interview_passed: "interviewing",
  interview_failed: "interviewing",
  selected: "selected",
  offer_released: "offer",
  offer_revoked: "offer",
  offer_accepted: "offer",
  offer_declined: "offer",
  hired: "hired",
  // rejected: "Rejected",
};

const SUB_LABEL = {
  interview_scheduled: "scheduled",
  interview_completed: "completed",
  interview_cancelled: "Cancelled",
  interview_passed: "passed",
  interview_failed: "failed",
  offer_released: "released",
  offer_revoked: "revoked",
  offer_accepted: "accepted",
  offer_declined: "declined",
  rejected: "Rejected",
};
const BADGE_COLOR = {
  interview_scheduled: "scheduled",
  interview_completed: "completed",
  interview_passed: "completed",
  interview_failed: "failed",
  interview_cancelled: "failed",
};
const STATE_COLORS = {
  completed: { bg: "#22C55E", border: "#22C55E", icon: "#fff" },
  current: { bg: "#FF5F1F", border: "#FF5F1F", icon: "#fff" },
  failed: { bg: "#EF4444", border: "#EF4444", icon: "#fff" },
  pending: { bg: "#F9FAFB", border: "#D1D5DB", icon: "#D1D5DB" },
};

const C = {
  accent: "#FF5F1F",
  accentSoft: "#FFF0E8",
  teal: "#00B4D8",
  tealSoft: "#E0F7FA",
  border: "#E8E8EC",
  textPrimary: "#111118",
  textSecondary: "#5C5C70",
};

const T = {
  stageTitle: 15,
  metaLabel: 11,
  metaValue: 12,
  subTitle: 12,
  subDate: 11,
};

const TAB_SX = {
  // borderBottom: "1px solid #E5E7EB",
  mb: "0px",
  minHeight: 38,
  "& .MuiTabs-flexContainer": { gap: "4px" },
  "& .MuiTab-root": {
    textTransform: "none",
    fontSize: 13,
    fontWeight: 500,
    color: "#6B7280",
    minWidth: "auto",
    minHeight: 28,
    px: "6px",
    py: "0px",
    mr: "14px",
  },
  "& .MuiTab-iconWrapper": { marginRight: "6px" },
  "& .Mui-selected": { color: `${C.accent} !important`, fontWeight: 600 },
  "& .MuiTabs-indicator": { backgroundColor: C.accent, height: 2, bottom: 0 },
};

const INTERVIEW_STATUS_OPTIONS = [
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircleOutlineOutlined,
    color: "#16A34A",
    requiresPast: true,
  },
  {
    value: "no_show",
    label: "No Show",
    icon: NotInterestedOutlinedIcon,
    color: "#F59E0B",
    requiresPast: true,
  },
  {
    value: "not_conducted",
    label: "Not Conducted",
    icon: RemoveCircleOutlinedIcon,
    color: "#6B7280",
    requiresPast: true,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CancelOutlinedIcon,
    color: "#DC2626",
    requiresPast: false,
  },
];
const OPEN_INTERVIEW_STAGES = ["interview_scheduled", "scheduled"];

// ── Pass / Fail options for a round that has already been marked "completed" ──
const INTERVIEW_RESULT_OPTIONS = [
  {
    value: "pass",
    label: "Pass",
    icon: CheckCircleOutlineOutlined,
    color: "#16A34A",
  },
  {
    value: "fail",
    label: "Fail",
    icon: CancelOutlinedIcon,
    color: "#DC2626",
  },
];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function fmtDateIST(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function getEntryGroup(entry) {
  const lookupKey = entry.stage?.toLowerCase().startsWith("interview_")
    ? "interview_scheduled"
    : entry.type?.toLowerCase();
  return STAGE_GROUP[lookupKey] ?? null;
}
function groupState(groupKey, grouped, currentStage, hasRejected) {
  const groupEntries = grouped[groupKey] ?? [];
  if (!groupEntries.length) return "pending";

  const hasFailed = groupEntries.some((e) => e.type === "offer_revoked");
  if (hasFailed) return "failed";

  const groupKeys = STAGE_CONFIG.map((s) => s.key);
  const curGroup = STAGE_GROUP[currentStage?.toLowerCase()] ?? "";
  const curIdx = groupKeys.indexOf(curGroup);
  const thisIdx = groupKeys.indexOf(groupKey);

  const groupsWithEntries = groupKeys.filter((gk) => grouped[gk]?.length);
  const lastGroupWithEntries = groupsWithEntries[groupsWithEntries.length - 1];
  const lastIdx = groupKeys.indexOf(lastGroupWithEntries);

  if (hasRejected && thisIdx === lastIdx) return "failed";

  if (curIdx !== -1) {
    if (thisIdx < curIdx) return "completed";
    if (thisIdx === curIdx) return "current";
    return "pending";
  }

  if (thisIdx < lastIdx) return "completed";
  if (thisIdx === lastIdx) return "current";
  return "pending";
}

function normalizeInterviewStatus(rawStatus) {
  if (!rawStatus) return "scheduled";
  const key = rawStatus.trim().toLowerCase().replace(/\s+/g, "_");
  return key === "rescheduled" ? "scheduled" : key;
}

// Normalizes whatever the backend sends for a round's outcome ("pass",
// "Pass", "PASSED", etc.) down to "pass" | "fail" | null.
function normalizeInterviewResult(rawResult) {
  if (!rawResult) return null;
  const key = rawResult.trim().toLowerCase();
  if (key.startsWith("pass")) return "pass";
  if (key.startsWith("fail")) return "fail";
  return null;
}

/* ═══════════════════════════════════════════════
   SECTION HEADER — reusable divider with label
═══════════════════════════════════════════════ */
function SectionHeader({ icon, label }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        mb: "16px",
        pb: "10px",
        borderBottom: `1.5px solid ${C.border}`,
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>
        {label}
      </Typography>
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   PLATFORM ICON — real brand logos for interview modal
═══════════════════════════════════════════════ */
function PlatformIcon({ platform, size = 20 }) {
  const p = (platform || "").toLowerCase();

  if (p.includes("zoom")) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="#2D8CFF" />
        <path
          d="M8 12.5C8 11.67 8.67 11 9.5 11H17.5C18.33 11 19 11.67 19 12.5V19.5C19 20.33 18.33 21 17.5 21H9.5C8.67 21 8 20.33 8 19.5V12.5Z"
          fill="white"
        />
        <path d="M20 14.2L24 11.8V20.2L20 17.8V14.2Z" fill="white" />
      </svg>
    );
  }

  if (p.includes("meet") || p.includes("google")) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="white" />
        <path d="M8 11h5.5L17 15.5V11H8z" fill="#2684FC" />
        <path d="M8 21h5.5L17 16.5V21H8z" fill="#00AC47" />
        <path d="M17 15.5L13.5 11H17v4.5z" fill="#FFBA00" />
        <path d="M17 16.5L13.5 21H17v-4.5z" fill="#00832D" />
        <path d="M17 14.5l6-4v11l-6-4v-3z" fill="#00AC47" />
      </svg>
    );
  }

  if (p.includes("teams") || p.includes("microsoft")) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="#5059C9" />
        <circle cx="21.5" cy="10.5" r="2.5" fill="#7B83EB" />
        <rect x="17" y="13" width="8" height="8.5" rx="2" fill="#7B83EB" />
        <circle cx="12.5" cy="10" r="3.2" fill="#5059C9" />
        <rect x="8" y="13.2" width="9" height="9.3" rx="2.2" fill="white" />
        <path
          d="M10.2 15.8h4.6M12.5 15.8v5.2"
          stroke="#5059C9"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Generic fallback (in-person / phone / other)
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "6px",
        bgcolor: "#E6F1FB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <VideocamOutlinedIcon sx={{ fontSize: size * 0.62, color: "#185FA5" }} />
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   INTERVIEW DETAILS MODAL — redesigned
═══════════════════════════════════════════════ */
function formatInterviewDateTime(date, startTime, endTime, duration) {
  if (!date) return { dateLabel: "—", timeLabel: "—" };

  const startHHmm = startTime ? startTime.slice(0, 5) : null;
  const endHHmm = endTime ? endTime.slice(0, 5) : null;

  // date + start_time/end_time are stored in UTC (see basePayload —
  // start.utc().format(...)), so parse as UTC and convert to local before
  // displaying — otherwise the raw UTC clock time renders as if it were
  // already local (e.g. an 11:40 IST interview showed as "06:10").
  const startLocal = startHHmm
    ? dayjs.utc(`${date} ${startHHmm}`, "YYYY-MM-DD HH:mm").local()
    : null;
  const endLocal = endHHmm
    ? dayjs.utc(`${date} ${endHHmm}`, "YYYY-MM-DD HH:mm").local()
    : null;

  const dateLabel =
    startLocal && startLocal.isValid()
      ? startLocal.format("dddd, MMMM D, YYYY")
      : dayjs(date).isValid()
        ? dayjs(date).format("dddd, MMMM D, YYYY")
        : "—";

  const start = startLocal && startLocal.isValid() ? startLocal.format("hh:mm A") : "—";
  const end = endLocal && endLocal.isValid() ? endLocal.format("hh:mm A") : "—";
  const timeLabel = `${start} → ${end}${duration ? ` (${duration} mins)` : ""}`;
  return { dateLabel, timeLabel };
}

const SKILL_GROUP_STYLE = {
  mandatory: { label: "MANDATORY SKILLS", color: "#E53935", bg: "#FEECEC" },
  primary: { label: "PRIMARY SKILLS", color: "#1976D2", bg: "#E8F1FD" },
  secondary: { label: "SECONDARY SKILLS", color: "#00A76F", bg: "#E6F7F1" },
  edc_tools: { label: "EDC TOOLS", color: "#7C3AED", bg: "#F1EBFE" },
  custom: { label: "CUSTOM SKILLS", color: "#7C3AED", bg: "#F1EBFE" },
};

function DetailRow({ icon, iconBg, title, children }) {
  return (
    <Box sx={{ display: "flex", gap: 1.5, px: 2.5, py: 2, borderBottom: `1px solid ${C.border}` }}>
      <Box
        sx={{
          width: 32, height: 32, borderRadius: "8px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          bgcolor: iconBg,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#111827", mb: 0.3 }}>
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}

function InterviewDetailsModal({ open, onClose, selectedInterview, isFetching, onEdit }) {
  const d = selectedInterview;
  const isCompleted = (d?.status ?? "").toLowerCase() === "completed";

  const { dateLabel, timeLabel } = d
    ? formatInterviewDateTime(d.date, d.start_time, d.end_time, d.duration)
    : { dateLabel: "—", timeLabel: "—" };

  const skillGroups = Object.entries(d?.template?.skills ?? {}).filter(
    ([, labels]) => Array.isArray(labels) && labels.length > 0,
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { width: { xs: "100%", sm: 580, md: 600, lg: 800 } } }}
    >
      {/* HEADER */}
      <Box sx={{ bgcolor: "#fff", px: 3, py: 0, textAlign: "start", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#00" }}>
          Interview Details
        </Typography>
        <Box>
          <DialogActions sx={{ px: 0, py: 2, borderTop: `1px solid ${C.border}`, gap: 0 }}>
            {!isCompleted && (
              <Button
                variant="contained"
                size="small"
                startIcon={<EditOutlinedIcon sx={{ fontSize: 12 }} />}
                onClick={() => onEdit?.(d.interview_id)}
                sx={{
                  flex: 1, textTransform: "none", borderRadius: "10px",
                  fontSize: 12,
                  fontWeight: 600, bgcolor: "#FF5722", boxShadow: "none",
                  "&:hover": { bgcolor: "#FF5722", boxShadow: "none" },
                }}
              >
                Edit Interview
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={onClose}
              size="small"
              sx={{
                flex: isCompleted ? 1 : "0 0 auto", textTransform: "none",
                borderRadius: "10px", fontWeight: 500, color: "#111827",
                borderColor: "#E5E7EB", px: 3,
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0, maxHeight: "65vh", overflowY: "auto" }}>
        {isFetching || !d ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DetailRow
              icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: "#00B4D8" }} />}
              iconBg="#E0F7FA"
              title="Interview Name"
            >
              <Typography sx={{ fontSize: 14, color: "#4B5563" }}>
                {d.interview_step_name}
                {d.interview_step_type ? ` — ${d.interview_step_type.toLowerCase()}` : ""}
              </Typography>
            </DetailRow>

            <DetailRow
              icon={<PersonOutlineOutlined sx={{ fontSize: 18, color: "#2563EB" }} />}
              iconBg="#E8F1FD"
              title="Candidate"
            >
              <Typography sx={{ fontSize: 14, color: "#111827" }}>
                {d.matched_candidate?.fullname}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>
                {d.matched_candidate?.email}
              </Typography>
            </DetailRow>

            {d.primary_interviewer_org_emp?.interviewer_full_name && (
              <DetailRow
                icon={<PersonOutlineOutlined sx={{ fontSize: 18, color: "#16A34A" }} />}
                iconBg="#EAF8EE"
                title="Primary Interviewer"
              >
                <Typography sx={{ fontSize: 14, color: "#111827" }}>
                  {d.primary_interviewer_org_emp.interviewer_full_name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>
                  {d.primary_interviewer_org_emp.email}
                </Typography>
              </DetailRow>
            )}

            {(d.panel_members_org_emp_ids ?? []).length > 0 && (
              <DetailRow
                icon={<PersonOutlineOutlined sx={{ fontSize: 18, color: "#6B7280" }} />}
                iconBg="#F3F4F6"
                title="Panel Members"
              >
                {d.panel_members_org_emp_ids.map((p) => (
                  <Typography key={p.primary_interviewer_org_emp} sx={{ fontSize: 14, color: "#111827" }}>
                    {p.interviewer_full_name}{" "}
                    <Box component="span" sx={{ fontSize: 13, color: "#9CA3AF" }}>
                      ({p.email})
                    </Box>
                  </Typography>
                ))}
              </DetailRow>
            )}

            <DetailRow
              icon={<AccessTimeOutlined sx={{ fontSize: 18, color: "#2563EB" }} />}
              iconBg="#E8F1FD"
              title="Date & Time"
            >
              <Typography sx={{ fontSize: 14, color: "#4B5563" }}>{dateLabel}</Typography>
              <Typography sx={{ fontSize: 14, color: "#4B5563" }}>{timeLabel}</Typography>
            </DetailRow>

            <DetailRow
              icon={<VideocamOutlinedIcon sx={{ fontSize: 18, color: "#DC2626" }} />}
              iconBg="#FEECEC"
              title="Meeting Link"
            >
              {d.meeting_url ? (
                <Button
                  component="a"
                  // href={d.meeting_url}
                  target="_blank"
                  size="small"
                  variant="outlined"
                  startIcon={<VideocamOutlinedIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    mt: 0.5, textTransform: "none", borderRadius: "8px",
                    fontSize: 13, fontWeight: 600,
                  }}
                >
                  Join Meeting
                </Button>
              ) : (
                <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>No link provided</Typography>
              )}
            </DetailRow>

            {skillGroups.length > 0 && (
              <DetailRow
                icon={<CheckCircleOutlineOutlined sx={{ fontSize: 18, color: "#16A34A" }} />}
                iconBg="#EAF8EE"
                title="Skills to Evaluate"
              >
                {skillGroups.map(([bucket, labels]) => {
                  const style = SKILL_GROUP_STYLE[bucket] ?? SKILL_GROUP_STYLE.custom;
                  return (
                    <Box key={bucket} sx={{ mt: 1 }}>
                      <Typography
                        sx={{ fontSize: 11, fontWeight: 700, color: style.color, mb: 0.5 }}
                      >
                        • {style.label}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                        {labels.map((label) => (
                          <Chip
                            key={label}
                            label={label}
                            size="small"
                            sx={{
                              height: 26, fontSize: 12, fontWeight: 500,
                              bgcolor: style.bg, color: style.color,
                              border: `1px solid ${style.color}33`,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </DetailRow>
            )}
          </>
        )}
      </DialogContent>


    </Dialog>
  );
}
/* ═══════════════════════════════════════════════
   INTERVIEW FEEDBACK MODAL — view-only, per-interviewer
   Feedback API returns dynamically-keyed interviewer ids
   (e.g. "interviewer_id- 1") and nested feedback arrays.
   Interviewer names + skill buckets aren't in that payload,
   so we cross-reference them from the full interview details
   object (primary_interviewer_org_emp / panel_members_org_emp_ids
   / template.skills) that's fetched alongside it.
═══════════════════════════════════════════════ */

const AVATAR_COLORS = ["#2563EB", "#7C3AED", "#16A34A", "#F97316", "#DB2777", "#0891B2"];

function extractInterviewerId(item) {
  const key = Object.keys(item).find((k) => k.startsWith("interviewer_id"));
  return key ? item[key] : null;
}

// Tries every id field shape we've seen on interviewer/panel objects.
function matchesInterviewerId(candidate, id) {
  if (!candidate || !id) return false;
  return (
    candidate.id === id ||
    candidate.org_employee_id === id ||
    candidate.employee_id === id ||
    candidate.primary_interviewer_org_emp === id
  );
}

function resolveInterviewerName(id, interview, fallbackIndex) {
  if (!interview) return `Interviewer ${fallbackIndex + 1}`;

  if (
    matchesInterviewerId(interview.primary_interviewer_org_emp, id) ||
    interview.org_employee_id === id
  ) {
    return interview.primary_interviewer_org_emp?.interviewer_full_name
      ?? `Interviewer ${fallbackIndex + 1}`;
  }

  const panelMatch = (interview.panel_members_org_emp_ids ?? []).find((p) =>
    matchesInterviewerId(p, id),
  );
  if (panelMatch) return panelMatch.interviewer_full_name ?? `Interviewer ${fallbackIndex + 1}`;

  return `Interviewer ${fallbackIndex + 1}`;
}

// Builds { "technical specification documents": "mandatory", ... } from
// interview.template.skills so feedback rows can show the right badge.
function buildSkillBucketMap(templateSkills) {
  const map = {};
  Object.entries(templateSkills ?? {}).forEach(([bucket, labels]) => {
    (labels ?? []).forEach((label) => {
      map[label.trim().toLowerCase()] = bucket;
    });
  });
  return map;
}

function FeedbackRatingBadge({ rating }) {
  const color = rating >= 4 ? "#16A34A" : rating >= 3 ? "#F97316" : "#DC2626";
  const bg = rating >= 4 ? "#EAF8EE" : rating >= 3 ? "#FFF3E8" : "#FEECEC";
  return (
    <Box
      sx={{
        px: 1.25, py: "3px", borderRadius: "999px",
        bgcolor: bg, color, fontSize: 12, fontWeight: 700, flexShrink: 0,
      }}
    >
      {rating}/5
    </Box>
  );
}

function InterviewFeedbackModal({ open, onClose, interview, feedbackItems, isFetching }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (open) setSelectedIdx(0);
  }, [open]);

  const skillBucketMap = useMemo(
    () => buildSkillBucketMap(interview?.template?.skills),
    [interview],
  );

  const panelists = useMemo(() => {
    return (feedbackItems ?? []).map((item, i) => {
      const interviewerId = extractInterviewerId(item);
      const name = resolveInterviewerName(interviewerId, interview, i);
      const ratings = (item.feedback ?? []).flat().filter(Boolean);
      return {
        interviewerId,
        name,
        ratings,
        comments: item.feedback_comments ?? "",
        done: ratings.length > 0,
      };
    });
  }, [feedbackItems, interview]);

  const current = panelists[selectedIdx];
  const loading = isFetching || !feedbackItems;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{ "& .MuiDialog-paper": { width: { xs: "100%", sm: 580, md: 600, lg: 800 } } }}
    >
      {/* Header */}
      <Box sx={{ px: 3, pt: 2.5, pb: 2, position: "relative" }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#6366F1", letterSpacing: "0.08em" }}>
          EVALUATION PANEL
        </Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#111827", mt: "2px" }}>
          Interview Feedback
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            position: "absolute", top: 18, right: 18,
            width: 34, height: 34, borderRadius: "50%", backgroundColor: "#EEF2FF",
          }}
        >
          <CloseIcon sx={{ fontSize: 16, color: "#4B5563" }} />
        </IconButton>
      </Box>

      {/* Interviewer tabs */}
      {!loading && panelists.length > 0 && (
        <Box sx={{ px: 3, display: "flex", gap: 3, borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
          {panelists.map((p, i) => {
            const isSelected = i === selectedIdx;
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <Box
                key={p.interviewerId ?? i}
                onClick={() => setSelectedIdx(i)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1, pb: 1.5,
                  cursor: "pointer", flexShrink: 0,
                  borderBottom: isSelected ? `2.5px solid #2563EB` : "2.5px solid transparent",
                }}
              >
                <Avatar sx={{ width: 26, height: 26, fontSize: 12, fontWeight: 700, bgcolor: isSelected ? color : "#E5E7EB", color: isSelected ? "#fff" : "#6B7280" }}>
                  {p.name?.[0]?.toUpperCase() ?? "?"}
                </Avatar>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: isSelected ? "#2563EB" : "#9CA3AF" }}>
                  {p.name}
                </Typography>
                {p.done && (
                  <Chip
                    label="✓ Done"
                    size="small"
                    sx={{ height: 20, fontSize: 11, fontWeight: 700, bgcolor: "#EAF8EE", color: "#16A34A" }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )}

      <DialogContent sx={{ p: 0, maxHeight: "65vh", overflowY: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : panelists.length === 0 ? (
          <Typography sx={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", py: 6 }}>
            No feedback submitted yet.
          </Typography>
        ) : (
          <Box sx={{ px: 3, py: 2.5 }}>
            {/* Selected interviewer row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
              <Avatar sx={{ width: 44, height: 44, fontSize: 16, fontWeight: 700, bgcolor: AVATAR_COLORS[selectedIdx % AVATAR_COLORS.length] }}>
                {current?.name?.[0]?.toUpperCase() ?? "?"}
              </Avatar>
              <Typography sx={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
                {current?.name}
              </Typography>
            </Box>

            {/* Skill ratings */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2.5 }}>
              {(current?.ratings ?? []).map((r, i) => {
                const bucket = skillBucketMap[r.skill?.trim().toLowerCase()];
                const bucketStyle = bucket ? SKILL_GROUP_STYLE[bucket] : null;
                return (
                  <Box
                    key={`${r.skill}-${i}`}
                    sx={{ border: `1px solid ${C.border}`, borderRadius: "12px", p: 1.75 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 0.75 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                          {r.skill}
                        </Typography>
                        {bucketStyle && (
                          <Chip
                            label={bucketStyle.label}
                            size="small"
                            sx={{
                              height: 20, fontSize: 10, fontWeight: 700,
                              bgcolor: bucketStyle.bg, color: bucketStyle.color,
                            }}
                          />
                        )}
                      </Box>
                      <FeedbackRatingBadge rating={r.rating} />
                    </Box>
                    <Rating value={r.rating} precision={0.5} readOnly size="small" />
                    {r.feedback && (
                      <Typography sx={{ fontSize: 12.5, color: "#6B7280", mt: 0.75 }}>
                        {r.feedback}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Overall comment */}
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.06em", mb: 1 }}>
                OVERALL COMMENT
              </Typography>
              <Box
                sx={{
                  border: `1px solid ${C.border}`, borderRadius: "12px",
                  borderLeft: "3px solid #2563EB", p: 1.75, backgroundColor: "#F8FAFF",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13.5,
                    color: current?.comments ? "#374151" : "#9CA3AF",
                    fontStyle: current?.comments ? "normal" : "italic",
                  }}
                >
                  {current?.comments || "No overall comment provided."}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${C.border}` }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: "10px", color: "#111827", borderColor: "#E5E7EB", px: 3 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const INTERVIEW_STAGE_STATUSES = [
  "shortlisted",
  "interview_scheduled",
  "interview_completed",
  "interviewing",
];

function CandidateActionButtons({
  status,
  onShortlist,
  onReject,
  onInterview,
  onSelect,
  onReleaseOffer,
  onRevokeOffer,
  onOfferAccepted,
  onOfferRejected,
}) {
  const normalized = (status ?? "").toLowerCase().trim();

  // ── Shortlisted / interviewing stage: Interview, Select (blue), Reject ──
  // Shortlisted -> only Interview + Reject
  if (normalized === "shortlisted") {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          size="small"
          startIcon={<PersonAddAltOutlinedIcon />}
          onClick={onInterview}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#16A34A",
          }}
        >
          Interview
        </Button>

        <Button
          variant="contained"
          size="small"
          startIcon={<BlockOutlinedIcon />}
          onClick={onReject}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#EF4444",
          }}
        >
          Reject
        </Button>
      </Stack>
    );
  }

  // After interview is scheduled/completed -> Interview + Select + Reject
  if (
    [
      "interview_scheduled",
      "interview_completed",
      "interviewing",
    ].includes(normalized)
  ) {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          size="small"
          startIcon={<PersonAddAltOutlinedIcon />}
          onClick={onInterview}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#16A34A",
          }}
        >
          Interview
        </Button>

        <Button
          variant="contained"
          size="small"
          startIcon={<CheckCircleOutlineOutlined />}
          onClick={onSelect}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#2563EB",
          }}
        >
          Select
        </Button>

        <Button
          variant="contained"
          size="small"
          startIcon={<BlockOutlinedIcon />}
          onClick={onReject}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#EF4444",
          }}
        >
          Reject
        </Button>
      </Stack>
    );
  }

  // ── Matched: Shortlist / Reject ──
  if (normalized === "matched") {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          size="small"
          startIcon={<CheckCircleOutlineOutlined sx={{ fontSize: 16 }} />}
          onClick={onShortlist}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "8px",
            backgroundColor: "#B8860B",
            boxShadow: "none",
            px: 2,
            "&:hover": { backgroundColor: "#9A6F09", boxShadow: "none" },
          }}
        >
          Shortlist
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<BlockOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onReject}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "8px",
            backgroundColor: "#EF4444",
            boxShadow: "none",
            px: 2,
            "&:hover": { backgroundColor: "#DC2626", boxShadow: "none" },
          }}
        >
          Reject
        </Button>
      </Stack>
    );
  }

  // ── Selected: Release Offer ──
  if (normalized === "selected") {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          size="small"
          startIcon={<LocalOfferOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onReleaseOffer}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            boxShadow: "none",
            px: 2,
            "&:hover": { backgroundColor: "#1D4ED8", boxShadow: "none" },
          }}
        >
          Release Offer
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<BlockOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onReject}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "8px",
            backgroundColor: "#EF4444",
            boxShadow: "none",
            px: 2,
            "&:hover": { backgroundColor: "#DC2626", boxShadow: "none" },
          }}
        >
          Reject
        </Button>
      </Stack>
    );
  }

  // ── Offer Released: Revoke Offer (orange) / Offer Accepted (green) / Offer Rejected (red) ──
  if (normalized === "offer_released") {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          size="small"
          startIcon={<UndoOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onRevokeOffer}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "8px",
            backgroundColor: "#F97316",
            boxShadow: "none",
            px: 2,
            "&:hover": { backgroundColor: "#EA580C", boxShadow: "none" },
          }}
        >
          Revoke Offer
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<ThumbUpAltOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onOfferAccepted}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "8px",
            backgroundColor: "#16A34A",
            boxShadow: "none",
            px: 2,
            "&:hover": { backgroundColor: "#15803D", boxShadow: "none" },
          }}
        >
          Offer Accepted
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<ThumbDownAltOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onOfferRejected}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
            borderRadius: "8px",
            backgroundColor: "#EF4444",
            boxShadow: "none",
            px: 2,
            "&:hover": { backgroundColor: "#DC2626", boxShadow: "none" },
          }}
        >
          Offer Rejected
        </Button>
      </Stack>
    );
  }

  return null;
}

const STATUS_DISPLAY = {
  shortlisted: { label: "Shortlisted", color: "#16A34A" },
  rejected: { label: "Rejected", color: "#DC2626" },
  selected: { label: "Selected", color: "#2563EB" },
  offer_released: { label: "Offer Released", color: "#2563EB" },
  offer_revoked: { label: "Offer Revoked", color: "#F97316" },
  offer_accepted: { label: "Offer Accepted", color: "#16A34A" },
  offer_rejected: { label: "Offer Rejected", color: "#DC2626" },
  // Interview round outcomes (Update Status dropdown on a scheduled round)
  completed: { label: "Completed", color: "#16A34A" },
  no_show: { label: "No Show", color: "#F59E0B" },
  not_conducted: { label: "Not Conducted", color: "#6B7280" },
  cancelled: { label: "Cancelled", color: "#DC2626" },
};

// Confirm-button colors, keyed by the same `action` value passed to
// StatusConfirmModal / updateCandidateStatus's `new_status`.
const CONFIRM_BTN_COLORS = {
  shortlisted: { bg: "#2563EB", hover: "#1D4ED8" },
  rejected: { bg: "#DC2626", hover: "#B91C1C" },
  selected: { bg: "#2563EB", hover: "#1D4ED8" },
  offer_released: { bg: "#2563EB", hover: "#1D4ED8" },
  offer_revoked: { bg: "#F97316", hover: "#EA580C" },
  offer_accepted: { bg: "#16A34A", hover: "#15803D" },
  offer_rejected: { bg: "#DC2626", hover: "#B91C1C" },
  completed: { bg: "#16A34A", hover: "#15803D" },
  no_show: { bg: "#F59E0B", hover: "#D97706" },
  not_conducted: { bg: "#6B7280", hover: "#4B5563" },
  cancelled: { bg: "#DC2626", hover: "#B91C1C" },
};

function StatusConfirmModal({ open, onClose, action, onConfirm, loading }) {
  const [comment, setComment] = useState("");
  const display = STATUS_DISPLAY[action] ?? { label: action, color: "#111827" };
  const isReject = action === "rejected";
  const btnColors =
    CONFIRM_BTN_COLORS[action] ?? { bg: "#2563EB", hover: "#1D4ED8" };

  useEffect(() => {
    if (open) setComment("");
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "14px", p: 0 } }}
    >
      <DialogContent sx={{ px: 3, py: 3 }}>
        <Typography sx={{ fontSize: 15, color: "#374151", mb: 2 }}>
          This action will update the candidate status to:{" "}
          <Box component="span" sx={{ fontWeight: 700, color: display.color }}>
            {display.label}
          </Box>
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Add a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: 14,
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: 14,
            color: "#111827",
            backgroundColor: "#F3F4F6",
            px: 3,
            "&:hover": { backgroundColor: "#E5E7EB" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(comment)}
          variant="contained"
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "none",
            px: 3,
            backgroundColor: btnColors.bg,
            "&:hover": {
              backgroundColor: btnColors.hover,
              boxShadow: "none",
            },
          }}
        >
          {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getInterviewEndTime(interviewTimeISO, durationMinutes) {
  if (!interviewTimeISO) return null;

  const start = dayjs.utc(interviewTimeISO);

  if (!start.isValid()) return null;

  return start.add(Number(durationMinutes || 30), "minute");
}
function hasInterviewTimePassed(interviewEndTime) {
  if (!interviewEndTime) return false;

  return dayjs.utc().isAfter(interviewEndTime);
}
function InterviewStatusMenu({ interviewEndTime, currentStatus, onSelect, disabled }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const timePassed = hasInterviewTimePassed(interviewEndTime);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handlePick = (value) => {
    handleClose();
    onSelect(value);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={disabled}
        variant="outlined"
        size="small"
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "none",
          fontSize: "12px",
          fontWeight: 500,
          borderRadius: "5px",
          borderColor: "#16A34A",
          color: "#16A34A",
          px: 2,
          py: 0,
          height: "30px",
          "&:hover": { borderColor: "#15803D", backgroundColor: "#F0FDF4" },
        }}
      >
        Update Status
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: "12px",
            minWidth: 200,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        {INTERVIEW_STATUS_OPTIONS.map((opt) => {
          const isDisabled =
            opt.value === currentStatus || (opt.requiresPast && !timePassed);
          const Icon = opt.icon;
          return (
            <MenuItem
              key={opt.value}
              disabled={isDisabled}
              onClick={() => handlePick(opt.value)}
              sx={{ py: 1, px: 1.8 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Icon sx={{ fontSize: 18, color: isDisabled ? "#D1D5DB" : opt.color }} />
              </ListItemIcon>
              <ListItemText
                primary={opt.label}
                primaryTypographyProps={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: isDisabled ? "#B0B0BC" : "#111827",
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

/* ═══════════════════════════════════════════════
   INTERVIEW RESULT MENU — Pass / Fail dropdown
   Shown once a round's status has been set to "completed".
   Fires onSelect("pass" | "fail"), which the parent wires to
   useUpdateInterviewResultMutation (PUT /acc/interviews/{id}/status_v1).
═══════════════════════════════════════════════ */
function InterviewResultMenu({ currentResult, onSelect, disabled }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handlePick = (value) => {
    handleClose();
    onSelect(value);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={disabled}
        variant="outlined"
        size="small"
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "none",
          fontSize: "12px",
          fontWeight: 500,
          borderRadius: "5px",
          borderColor: "#F97316",
          color: "#F97316",
          px: 2,
          py: 0,
          height: "30px",
          "&:hover": { borderColor: "#EA580C", backgroundColor: "#FFF7ED" },
        }}
      >
        Update Result
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: "12px",
            minWidth: 160,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        {INTERVIEW_RESULT_OPTIONS.map((opt) => {
          const isDisabled = opt.value === currentResult;
          const Icon = opt.icon;
          return (
            <MenuItem
              key={opt.value}
              disabled={isDisabled}
              onClick={() => handlePick(opt.value)}
              sx={{ py: 1, px: 1.8 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Icon sx={{ fontSize: 18, color: isDisabled ? "#D1D5DB" : opt.color }} />
              </ListItemIcon>
              <ListItemText
                primary={opt.label}
                primaryTypographyProps={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: isDisabled ? "#B0B0BC" : "#111827",
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const AVAILABILITY_BASE_URL =
  "https://dev-backend.invotrx.com/acc/employees/availability/slots/by-date";

function buildCalendarWeeks(monthStart) {
  // dayjs .day(): 0 = Sunday ... 6 = Saturday. Convert to Monday-first index.
  const firstWeekdayIdx = (monthStart.day() + 6) % 7;
  const daysInMonth = monthStart.daysInMonth();

  const cells = [];
  for (let i = 0; i < firstWeekdayIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(monthStart.date(d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function parseDurationMinutes(durationLabel) {
  const match = String(durationLabel ?? "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 30;
}

// Extracts an "HH:mm" fragment from a variety of time-string shapes the
// backend might send back for a scheduled interview, e.g.
// "14:00:00.000Z", "14:00:00", "14:00". Returns null if nothing matches.
function extractHHmm(timeStr) {
  if (!timeStr) return null;
  const match = String(timeStr).match(/^(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : null;
}

// Rebuilds the flat `skills` array (used by the Skills-to-Evaluate
// Autocomplete) from the bucketed `template.skills` shape the API stores
// on an existing interview (used to prefill the Reschedule modal).
function skillsFromTemplate(templateSkills) {
  if (!templateSkills) return [];
  const out = [];
  Object.entries(templateSkills).forEach(([bucket, labels]) => {
    (labels || []).forEach((label) => {
      out.push({ label, type: bucket === "custom" ? "custom" : bucket });
    });
  });
  return out;
}

function SelectSlotModal({
  open,
  onClose,
  employeeIds = [],
  durationLabel,
  initialDateTime,
  onConfirm,
}) {
  const today = dayjs().startOf("day");
  const [viewMonth, setViewMonth] = useState(today.startOf("month"));
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const slotDurationMinutes = parseDurationMinutes(durationLabel);

  // Reset to a sensible starting point whenever the modal opens
  useEffect(() => {
    if (!open) return;
    const base =
      initialDateTime && dayjs(initialDateTime).isValid()
        ? dayjs(initialDateTime).startOf("day")
        : today;
    setSelectedDate(base);
    setViewMonth(base.startOf("month"));
    setSelectedSlot(null);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSlots = useCallback(
    async (dateObj) => {
      if (!employeeIds.length) {
        setSlots([]);
        setErrorMsg("Select an interviewer first to see availability.");
        return;
      }
      setLoading(true);
      setErrorMsg("");
      try {
        const params = new URLSearchParams({
          employee_ids: employeeIds.join(","),
          slot_duration_minutes: String(slotDurationMinutes),
          selected_date: dateObj.format("YYYY-MM-DD"),
        });
        const res = await fetch(`${AVAILABILITY_BASE_URL}?${params.toString()}`, {
          headers: { accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        const data = await res.json();
        setSlots(data?.available_slots ?? []);
      } catch (err) {
        console.error("Failed to fetch availability slots:", err);
        setErrorMsg("Could not load available slots. Please try again.");
        setSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [employeeIds, slotDurationMinutes],
  );

  useEffect(() => {
    if (open) fetchSlots(selectedDate);
  }, [open, selectedDate, fetchSlots]);

  const handlePickDate = (d) => {
    if (!d || d.isBefore(today, "day")) return;
    setSelectedDate(d);
    setSelectedSlot(null);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    const startTime = selectedSlot.split("-")[0].trim();
    const combined = dayjs(
      `${selectedDate.format("YYYY-MM-DD")} ${startTime}`,
      "YYYY-MM-DD HH:mm",
    );
    if (!combined.isValid()) return;
    onConfirm(combined);
  };

  const weeks = buildCalendarWeeks(viewMonth);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 760,
          maxWidth: "95vw",
          borderRadius: "18px",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 19, fontWeight: 700, color: "#111827" }}>
            Select Date & Time
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#9CA3AF", mt: 0.3 }}>
            Pick an available slot for the interview.
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: "#F3F4F6" }}
        >
          <CloseIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, minHeight: 300, maxHeight: "70vh" }}>
        {/* LEFT: calendar */}
        <Box
          sx={{
            flex: "0 0 auto",
            width: { xs: "100%", sm: 340 },
            px: 3,
            py: 2.5,
            borderRight: { sm: `1px solid ${C.border}` },
            borderBottom: { xs: `1px solid ${C.border}`, sm: "none" },
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827", mb: 1.5 }}>
            Select Date
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <IconButton
              size="small"
              onClick={() => setViewMonth((m) => m.subtract(1, "month"))}
              sx={{ width: 30, height: 30, border: `1px solid ${C.border}`, borderRadius: "8px" }}
            >
              <ArrowBackIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
              {viewMonth.format("MMMM YYYY")}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setViewMonth((m) => m.add(1, "month"))}
              sx={{ width: 30, height: 30, border: `1px solid ${C.border}`, borderRadius: "8px" }}
            >
              <ArrowBackIcon sx={{ fontSize: 14, transform: "rotate(180deg)" }} />
            </IconButton>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", mb: 1 }}>
            {WEEKDAY_LABELS.map((w) => (
              <Typography key={w} sx={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", textAlign: "center" }}>
                {w}
              </Typography>
            ))}
          </Box>

          {weeks.map((week, wi) => (
            <Box key={wi} sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", mb: "6px" }}>
              {week.map((d, di) => {
                if (!d) return <Box key={di} />;
                const isPast = d.isBefore(today, "day");
                const isSelected = selectedDate && d.isSame(selectedDate, "day");
                const isToday = d.isSame(today, "day");
                return (
                  <Box
                    key={di}
                    onClick={() => handlePickDate(d)}
                    sx={{
                      height: 34,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 500,
                      cursor: isPast ? "default" : "pointer",
                      color: isPast ? "#D1D5DB" : isSelected ? "#fff" : "#111827",
                      backgroundColor: isSelected ? "#1976D2" : "transparent",
                      border: isToday && !isSelected ? "1.5px solid #1976D2" : "1.5px solid transparent",
                      "&:hover": !isPast && !isSelected ? { backgroundColor: "#F3F4F6" } : {},
                      transition: "background-color 0.15s, color 0.15s",
                    }}
                  >
                    {d.date()}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* RIGHT: available slots */}
        <Box sx={{ flex: 1, px: 3, py: 2.5, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827", mb: 1 }}>
            Available Slots — {selectedDate ? selectedDate.format("DD MMM YYYY") : "—"}
          </Typography>

          <Chip
            label="Asia/Kolkata"
            size="small"
            sx={{
              alignSelf: "flex-start",
              mb: 1.5,
              bgcolor: "#E8F1FD",
              color: "#1976D2",
              fontSize: 12,
              fontWeight: 600,
              height: 24,
            }}
          />

          <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5, display: "flex", flexDirection: "column", gap: "10px" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                <CircularProgress size={26} sx={{ color: "#1976D2" }} />
              </Box>
            ) : errorMsg ? (
              <Typography sx={{ fontSize: 13, color: "#DC2626", py: 2 }}>{errorMsg}</Typography>
            ) : slots.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: "#9CA3AF", py: 2 }}>
                No slots available for this date.
              </Typography>
            ) : (
              slots.map((s) => {
                const isSelected = selectedSlot === s;
                return (
                  <Box
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      py: 1.3,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      userSelect: "none",
                      color: isSelected ? "#fff" : "#111827",
                      backgroundColor: isSelected ? "#1976D2" : "#fff",
                      border: `1.5px solid ${isSelected ? "#1976D2" : C.border}`,
                      "&:hover": !isSelected ? { borderColor: "#1976D2", backgroundColor: "#F5F9FF" } : {},
                      transition: "background-color 0.15s, border-color 0.15s",
                    }}
                  >
                    {s}
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "flex-end",
          gap: 1.5,
          bgcolor: "#FAFAFA",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: "none", borderRadius: "8px", color: "#111827", borderColor: "#E5E7EB" }}
          >
            ← Back
          </Button>
          <Button
            variant="contained"
            disabled={!selectedSlot}
            onClick={handleConfirm}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              backgroundColor: "#1976D2",
              "&:hover": { backgroundColor: "#1259A8", boxShadow: "none" },
            }}
          >
            Continue →
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════
   SCHEDULE / RESCHEDULE INTERVIEW MODAL
═══════════════════════════════════════════════ */
const INTERVIEW_TYPES = ["Technical", "HR", "Managerial", "Telephonic", "Final Round"];
const DURATIONS = ["10 mins", "15 mins", "30 mins", "45 mins", "60 mins", "90 mins"];
const PLATFORMS = [
  { key: "google_meet", label: "Google Meet", icon: "📅" },
  { key: "zoom", label: "Zoom", icon: "🎥" },
  { key: "teams", label: "Teams", icon: "🟣" },
  { key: "other", label: "Other", icon: "🔗" },
];

const EMPTY_SCHEDULE_FORM = {
  round: "",
  type: "",
  interviewer: null,
  panelMembers: [],
  duration: "10 mins",
  dateTime: "",
  platform: "google_meet",
  meetingUrl: "",
  skills: [],
};

function ScheduleInterviewModal({
  open,
  onClose,
  candidate,
  skillOptions = [],
  allSkillOptions = [],
  onSchedule,
  loading,
  orgId,
  matched_candidate_id,
  // ── Reschedule mode ──
  // When `isReschedule` is true this same modal is reused to move an
  // existing interview round to a new slot / interviewer / platform.
  // `initialData` seeds the form instead of starting blank, and
  // `interviewId` is threaded straight through to onSchedule's payload.
  //
  // `initialData` can arrive in two phases:
  //   1. { interviewId, loading: true }              — fetch in flight
  //   2. { interviewId, loading: false, ...fields }   — fully hydrated,
  //      using the SAME shape returned by GET /acc/interviews/{id}
  //      (the exact values that were saved when the interview was
  //      originally scheduled), so the form is faithfully pre-filled
  //      with what's currently on record for this round.
  isReschedule = false,
  interviewId = null,
  initialData = null,
}) {
  const [form, setForm] = useState(EMPTY_SCHEDULE_FORM);
  const [customSkills, setCustomSkills] = useState([]);
  const [interviewerOptions, setInterviewerOptions] = useState([]);
  const [panelOptions, setPanelOptions] = useState([]);
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [getEmployeesByRole, { data: interviewersData, isLoading }] =
    useLazyGetEmployeesByRoleQuery();

  // True while we're still waiting on the initial GET /acc/interviews/{id}
  // fetch that hydrates `initialData` for a reschedule. Distinct from
  // `prefillLoading` (which only covers the panel-options refresh) and
  // from `loading` (which covers the final submit).
  const isFetchingInitialData = isReschedule && !!initialData?.loading;

  useEffect(() => {
    if (!open || !orgId) return;

    getEmployeesByRole({
      organisationId: orgId,
    })
      .unwrap()
      .then((res) => {
        const users = res.data.map((u) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          designation: u.designation,
        }));

        setInterviewerOptions(users);   // Keep interviewer list fixed
        setPanelOptions(users);         // Initial panel list
      });
  }, [open, orgId]);

  useEffect(() => {
    if (!open) return;

    if (isReschedule) {
      if (!initialData || initialData.loading) return; // wait for fetch to finish
      // Also wait for the employee list to load — we need it to resolve
      // names for interviewer/panel members when initialData only has IDs
      // (e.g. the local-schedule-payload fallback path).
      if (!interviewerOptions.length) return;

      const primaryInterviewerId =
        initialData.primary_interviewer?.id ?? initialData.org_employee_id ?? null;

      const primaryInterviewerName =
        initialData.primary_interviewer?.name ??
        interviewerOptions.find((u) => u.id === primaryInterviewerId)?.name ??
        "";

      // Normalize panel IDs across every shape we might receive:
      //  - GET /interviews/{id} response: panel_members: [{id, name}, ...]
      //  - local schedule-payload fallback: list_org_employee_id: ["id1", "id2"]
      const panelIds = initialData.panel_members
        ? initialData.panel_members.map((p) => p.id ?? p.org_employee_id)
        : initialData.list_org_employee
          ? initialData.list_org_employee.map((p) => p.id ?? p.org_employee_id)
          : initialData.list_org_employee_id ?? [];

      const panelMembers = panelIds
        .filter((id) => id && id !== primaryInterviewerId)
        .map((id) => ({
          id,
          name: interviewerOptions.find((u) => u.id === id)?.name ?? "",
        }));

      const hhmm = extractHHmm(initialData.start_time);
      const combinedDateTimeUTC =
        initialData.date && hhmm
          ? dayjs.utc(`${initialData.date} ${hhmm}`, "YYYY-MM-DD HH:mm")
          : null;
      const combinedDateTime =
        combinedDateTimeUTC && combinedDateTimeUTC.isValid()
          ? combinedDateTimeUTC.local()
          : null;

      setForm({
        round: initialData.interview_step_name ?? initialData.round ?? "",
        type: initialData.interview_step_type ?? initialData.type ?? "",
        interviewer: primaryInterviewerId
          ? { id: primaryInterviewerId, name: primaryInterviewerName }
          : null,
        panelMembers,
        duration: initialData.duration ? `${initialData.duration} mins` : "",
        dateTime:
          combinedDateTime && combinedDateTime.isValid()
            ? combinedDateTime.format("YYYY-MM-DDTHH:mm")
            : "",
        platform: initialData.platform ?? "google_meet",
        meetingUrl: initialData.meeting_url ?? "",
        skills: skillsFromTemplate(initialData.template?.skills),
      });

      // Prime the panel-members pool by excluding the seeded primary
      // interviewer, mirroring what happens when a person picks an
      // interviewer manually in the "new schedule" flow.
      if (primaryInterviewerId && orgId) {
        setPrefillLoading(true);
        getEmployeesByRole({
          organisationId: orgId,
          employeeExcludeIds: primaryInterviewerId,
        })
          .unwrap()
          .then((res) => {
            setPanelOptions(
              res.data.map((u) => ({
                id: u.id,
                name: u.name,
                role: u.role,
                designation: u.designation,
              })),
            );
          })
          .finally(() => setPrefillLoading(false));
      }
    } else {
      setForm(EMPTY_SCHEDULE_FORM);
    }
  }, [open, isReschedule, initialData, orgId, interviewerOptions]);

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const isValid = form.round.trim() && form.type && form.interviewer && form.dateTime;

  const interviewerId = form.interviewer?.id ?? form.interviewer ?? null;

  const handleSubmit = () => {
    if (!isValid) return;

    const durationMinutes = parseDurationMinutes(form.duration);
    const start = dayjs(form.dateTime);
    const end = start.add(durationMinutes, "minute");

    const skillsByType = form.skills.reduce(
      (acc, s) => {
        const bucket =
          s.type === "mandatory"
            ? "mandatory"
            : s.type === "primary"
              ? "primary"
              : s.type === "secondary"
                ? "secondary"
                : "custom"; // freeSolo/typed skills fall here
        acc[bucket].push(s.label);
        return acc;
      },
      { primary: [], secondary: [], mandatory: [], edc_tools: [], custom: [] }
    );
    const basePayload = {
      org_employee_id: form.interviewer?.id,
      list_org_employee_id: form.panelMembers.map((p) => p.id),
      interview_step_name: form.round,
      interview_step_type: form.type,
      is_final: false,

      date: start.utc().format("YYYY-MM-DD"),
      start_time: start.utc().format("HH:mm:ss"),
      end_time: end.utc().format("HH:mm:ss"),

      duration: durationMinutes,
      template: {
        rating_scale: 5,
        skills: skillsByType,
      },
      platform: form.platform,
      meeting_url: form.meetingUrl,
    };

    if (isReschedule) {
      onSchedule({ interviewId, matched_candidate_id, ...basePayload });
    } else {
      onSchedule({ matched_candidate_id, ...basePayload });
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? undefined : onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
      >
        {/* Header */}
        <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: `1px solid ${C.border}` }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
                {isReschedule ? "Reschedule Interview" : "Schedule Interview"}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#9CA3AF", mt: 0.25 }}>
                {isReschedule
                  ? "Update the slot, interviewer, or platform for this round."
                  : "Reserve an interview slot by choosing your preferred schedule."}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={onClose}
              disabled={loading}
              sx={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: "#F3F4F6" }}
            >
              <CloseIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Box>
        </Box>

        <DialogContent sx={{ px: 3, py: 2.5, maxHeight: "70vh" }}>
          {isFetchingInitialData || (isReschedule && prefillLoading) ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={26} sx={{ color: C.accent }} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {/* Interview Round */}
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>
                  Interview Round <Box component="span" sx={{ color: "#EF4444" }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. Technical Round 1"
                  value={form.round}
                  onChange={(e) => setField("round")(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* Interview Type */}
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>
                  Interview Type <Box component="span" sx={{ color: "#EF4444" }}>*</Box>
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    displayEmpty
                    value={form.type}
                    onChange={(e) => setField("type")(e.target.value)}
                    sx={{ borderRadius: "8px" }}
                    renderValue={(v) => v || <span style={{ color: "#9CA3AF" }}>Select type</span>}
                  >
                    {INTERVIEW_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Interviewer */}
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>
                  Interviewer <Box component="span" sx={{ color: "#EF4444" }}>*</Box>
                </Typography>
                <Autocomplete
                  size="small"
                  options={interviewerOptions}
                  value={form.interviewer}
                  onChange={async (_, val) => {
                    setField("interviewer")(val);

                    if (!val) return;

                    const res = await getEmployeesByRole({
                      organisationId: orgId,
                      employeeExcludeIds: val.id,
                    }).unwrap();

                    setPanelOptions(
                      res.data.map((u) => ({
                        id: u.id,
                        name: u.name,
                        role: u.role,
                        designation: u.designation,
                      }))
                    );
                  }}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  renderOption={(props, option) => {
                    const initials = option.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <li
                        {...props}
                        style={{
                          ...props.style,
                          paddingTop: 8,
                          paddingBottom: 8,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: 13,
                              fontWeight: 600,
                              bgcolor: "#FF5722",
                            }}
                          >
                            {initials}
                          </Avatar>

                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                              {option.name}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.4 }}>
                              {option.role}
                            </Typography>
                          </Box>
                        </Box>
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select interviewer"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Panel Members */}
              <Grid item size={{ xs: 12, sm: 6 }} >
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>
                  Panel Members <Box component="span" sx={{ color: "#9CA3AF" }}>(optional)</Box>
                </Typography>
                <Autocomplete
                  multiple
                  size="small"
                  options={panelOptions}
                  getOptionLabel={(o) => o.name ?? o.label ?? ""}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  value={form.panelMembers}
                  onChange={(_, val) => setField("panelMembers")(val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Add panel members"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  )}
                />
              </Grid>

              {/* Duration */}
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>
                  Duration
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    displayEmpty
                    value={form.duration}
                    onChange={(e) => {
                      setField("duration")(e.target.value);
                      // Duration changed → any previously chosen slot may no longer
                      // be valid, so clear it and let the person re-pick.
                      setField("dateTime")("");
                    }}
                    sx={{ borderRadius: "8px" }}
                    renderValue={(v) => v || <span style={{ color: "#9CA3AF" }}>Select duration</span>}
                  >
                    {DURATIONS.map((d) => (
                      <MenuItem key={d} value={d}>{d}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Select Day & Time — opens calendar + live availability modal */}
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>
                  Select Day & Time <Box component="span" sx={{ color: "#EF4444" }}>*</Box>
                </Typography>
                <Box
                  onClick={() => setSlotModalOpen(true)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    border: `1px solid ${C.border}`,
                    borderRadius: "8px",
                    px: 1.5,
                    py: "8.5px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    "&:hover": { borderColor: C.accent },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      color: form.dateTime ? "#111827" : "#9CA3AF",
                      fontWeight: form.dateTime ? 600 : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {form.dateTime && dayjs(form.dateTime).isValid()
                      ? dayjs(form.dateTime).format("ddd, DD MMM YYYY · HH:mm")
                      : "Select a slot"}
                  </Typography>
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: "#9CA3AF", flexShrink: 0 }} />
                </Box>
              </Grid>

              {/* Platform */}
              <Grid item size={{ xs: 12 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 1 }}>
                  Platform
                </Typography>
                <Grid container spacing={1}>
                  {PLATFORMS.map((p) => (
                    <Grid item size={{ xs: 6, sm: 3 }} key={p.key}>
                      <Box
                        onClick={() => setField("platform")(p.key)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          justifyContent: "center",
                          border: `1.5px solid ${form.platform === p.key ? C.accent : C.border}`,
                          backgroundColor: form.platform === p.key ? C.accentSoft : "#fff",
                          borderRadius: "8px",
                          py: 1,
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 600,
                          color: form.platform === p.key ? C.accent : "#374151",
                          userSelect: "none",
                        }}
                      >
                        <span>{p.icon}</span> {p.label}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Meeting URL */}
              <Grid item size={{ xs: 12, }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>
                  Meeting URL
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://meet.google.com/abc-def-ghi"
                  value={form.meetingUrl}
                  onChange={(e) => setField("meetingUrl")(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>

              {/* Skills to Evaluate */}
              <Grid item size={{ xs: 12 }}>
                <Box sx={{ border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden" }}>
                  <Box
                    sx={{
                      px: 2,
                      py: 1.2,
                      backgroundColor: "#F9FAFB",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                      ⭐ Skills to Evaluate
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5 }}>
                    <Autocomplete
                      multiple
                      freeSolo
                      disableCloseOnSelect
                      size="small"
                      options={[
                        { label: "Select All", type: "select_all" },
                        ...allSkillOptions,
                      ]}
                      value={form.skills}
                      isOptionEqualToValue={(option, value) =>
                        option.label === value.label && option.type === value.type
                      }
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.label
                      }
                      groupBy={(option) => {
                        switch (option.type) {
                          case "custom":
                            return "CUSTOM";
                          case "mandatory":
                            return "MANDATORY";
                          case "primary":
                            return "PRIMARY";
                          case "secondary":
                            return "SECONDARY";
                          default:
                            return "";
                        }
                      }}
                      onChange={(event, value, reason, details) => {
                        const isAllSelected =
                          form.skills.length === allSkillOptions.length;

                        if (details?.option?.type === "select_all") {
                          if (isAllSelected) {
                            setField("skills")([]);
                          } else {
                            setField("skills")(allSkillOptions);
                          }
                          return;
                        }

                        setField("skills")(
                          value.filter((v) => v.type !== "select_all")
                        );
                      }}
                      renderGroup={(params) => {
                        if (!params.group) {
                          return <li key={params.key}>{params.children}</li>;
                        }

                        return (
                          <li key={params.key}>
                            <Box
                              sx={{
                                px: 2,
                                py: 1,
                                fontWeight: 700,
                                fontSize: 13,
                                color:
                                  params.group === "MANDATORY"
                                    ? "#E53935"
                                    : params.group === "PRIMARY"
                                      ? "#1976D2"
                                      : params.group === "SECONDARY"
                                        ? "#00A76F"
                                        : "#7C3AED",
                                textTransform: "uppercase",
                              }}
                            >
                              {params.group}
                            </Box>

                            <ul style={{ margin: 0, padding: 0 }}>
                              {params.children}
                            </ul>
                          </li>
                        );
                      }}
                      renderOption={(props, option, { selected }) => {
                        const isAllSelected =
                          form.skills.length === allSkillOptions.length;

                        if (option.type === "select_all") {
                          return (
                            <li {...props} style={{ minHeight: "auto", padding: "4px 12px" }}>
                              <Checkbox
                                size="small"
                                sx={{ p: 0.5 }}
                                checked={isAllSelected}
                                indeterminate={
                                  form.skills.length > 0 &&
                                  form.skills.length < allSkillOptions.length
                                }
                              />

                              <Typography fontWeight={700} fontSize={13}>
                                Select All
                              </Typography>
                            </li>
                          );
                        }

                        return (
                          <li
                            {...props}
                            style={{
                              ...props.style,
                              minHeight: "auto",
                              padding: "4px 12px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Checkbox checked={selected} size="small" sx={{ p: 0.5 }} />

                              <Typography sx={{ fontSize: 12 }}>{option.label}</Typography>
                            </Box>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Type skill + Enter to add"
                          onKeyDown={(e) => {
                            if (e.key !== "Enter") return;

                            const value = e.target.value.trim();

                            if (!value) return;

                            e.preventDefault();

                            const exists = allSkillOptions.some(
                              (s) =>
                                s.label.toLowerCase() === value.toLowerCase()
                            );

                            if (exists) return;

                            const newSkill = {
                              label: value,
                              type: "custom",
                            };

                            setCustomSkills((prev) => [...prev, newSkill]);

                            setForm((prev) => ({
                              ...prev,
                              skills: [...prev.skills, newSkill],
                            }));
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${C.border}`, gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
            sx={{ textTransform: "none", borderRadius: "8px", color: "#111827", borderColor: "#E5E7EB" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isValid || loading || isFetchingInitialData}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              background: "#FF5F1F",
              "&:hover": {
                boxShadow: "none",
                background: "linear-gradient(90deg, #0C9090 0%, #0596B0 100%)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={18} sx={{ color: "#fff" }} />
            ) : isReschedule ? (
              "Reschedule Interview →"
            ) : (
              "Schedule Interview →"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calendar + live availability picker */}
      <SelectSlotModal
        open={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        employeeIds={interviewerId ? [interviewerId] : []}
        durationLabel={form.duration}
        initialDateTime={form.dateTime}
        onConfirm={(combinedDayjs) => {
          setField("dateTime")(combinedDayjs.format("YYYY-MM-DDTHH:mm"));
          setSlotModalOpen(false);
        }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════
   TIMELINE SMALL COMPONENTS
═══════════════════════════════════════════════ */
function CheckIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StageCircle({ state, size = 32 }) {
  const sc = STATE_COLORS[state] ?? STATE_COLORS.pending;
  const glowColor =
    state === "completed"
      ? "rgba(34,197,94,0.18)"
      : state === "current"
        ? "rgba(255,95,31,0.18)"
        : state === "failed"
          ? "rgba(239,68,68,0.18)"
          : "transparent";

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: sc.bg,
        border: `2px solid ${sc.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: state !== "pending" ? `0 0 0 5px ${glowColor}` : "none",
        mt: "2px",
        flexShrink: 0,
        transition: "background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {state === "failed" ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 2L10 10M10 2L2 10"
            stroke={sc.icon}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <CheckIcon color={sc.icon} />
      )}
    </Box>
  );
}

function SubStageCircle({ state, size = 20 }) {
  const sc = STATE_COLORS[state] ?? STATE_COLORS.pending;
  const glowColor =
    state === "completed"
      ? "rgba(34,197,94,0.16)"
      : state === "current"
        ? "rgba(255,95,31,0.16)"
        : state === "failed"
          ? "rgba(239,68,68,0.16)"
          : "transparent";

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: sc.bg,
        border: `2px solid ${sc.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: state !== "pending" ? `0 0 0 3px ${glowColor}` : "none",
        mt: "2px",
        flexShrink: 0,
        transition: "background-color 0.3s, border-color 0.3s",
      }}
    >
      {state === "failed" ? (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5"
            stroke={sc.icon}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M1.5 5L4 7.5L8.5 2.5"
            stroke={sc.icon}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Box>
  );
}

function StatusBadge({ label, color = "orange" }) {
  const styles = {
    completed: {
      bg: "#EAF8EE",
      color: "#22863A",
    },
    scheduled: {
      bg: "#FFF3E8",
      color: "#F97316",
    },
    failed: {
      bg: "#FEECEC",
      color: "#DC2626",
    },
  };

  const s = styles[color] ?? styles.scheduled;

  return (
    <Box
      sx={{
        ml: 1.5,
        px: 1.5,
        py: "5px",
        borderRadius: "999px",
        bgcolor: s.bg,
        color: s.color,
        fontSize: 12,
        fontWeight: 600,

        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
        alignSelf: "flex-start",   // <-- important
      }}
    >
      {label}
    </Box>
  );
}

function ConnectorLine({ state, minHeight }) {
  const lineColor =
    state === "completed"
      ? "#22C55E"
      : state === "current"
        ? "#FF5F1F"
        : state === "failed"
          ? "#EF4444"
          : "#E5E7EB";

  return (
    <Box
      sx={{
        width: 2,
        flex: 1,
        minHeight,
        background:
          state !== "pending"
            ? `linear-gradient(to bottom, ${lineColor}80, ${lineColor}20)`
            : "#E5E7EB",
        my: "4px",
        borderRadius: 2,
        transition: "background 0.3s",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════
   RADAR CHART
═══════════════════════════════════════════════ */
const SkillBarCompare = ({ scoreIntel, size = 350 }) => {
  const barWidth = 64;
  const chartH = 220;
  const gridVals = [0, 25, 50, 75, 100];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignSelf: "flex-end" }}>
        {[{ dot: "#818CF8", label: "Candidate" }, { dot: "#22C55E", label: "Desired" }].map(({ dot, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dot }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: C.gray900 }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", width: "100%", maxWidth: size + 150 }}>
        {/* Y-axis labels + gridlines */}
        <div style={{ position: "relative", height: chartH, width: 36, flexShrink: 0 }}>
          {gridVals.map((v) => (
            <span
              key={v}
              style={{
                position: "absolute",
                right: 8,
                bottom: (v / 100) * chartH - 6,
                fontSize: 12,
                color: C.gray400,
              }}
            >
              {v}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div style={{ position: "relative", flex: 1, height: chartH, borderLeft: `1px solid ${C.gray200}`, borderBottom: `1px solid ${C.gray200}` }}>
          {/* Gridlines */}
          {gridVals.map((v) => (
            <div
              key={v}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: (v / 100) * chartH,
                borderTop: v === 0 ? "none" : "1px dashed #E5E7EB",
              }}
            />
          ))}

          {/* Bars */}
          <div style={{ display: "flex", justifyContent: "center", gap: 56, height: "100%", position: "relative" }}>
            {scoreIntel.map((d, i) => {
              const candH = (Math.min(d.candidate, 100) / 100) * chartH;
              const desH = (Math.min(d.desired, 100) / 100) * chartH;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                  <div style={{ position: "relative", width: barWidth / 2, height: candH, background: "#818CF8", borderRadius: "4px 4px 0 0" }} />
                  <div style={{ position: "relative", width: barWidth / 2, height: desH, background: "#22C55E", borderRadius: "4px 4px 0 0" }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skill labels under chart, aligned to bar groups */}
      <div style={{ display: "flex", justifyContent: "center", gap: 56, width: "100%", maxWidth: size + 150, marginLeft: 36, marginTop: 8 }}>
        {scoreIntel.map((d, i) => (
          <div key={i} style={{ width: barWidth, textAlign: "center", fontSize: 13, fontWeight: 600, color: "#475569" }}>
            {d.skill}
          </div>
        ))}
      </div>
    </div>
  );
};
function RadarChart({ scoreIntel, size = 400 }) {
  if (!scoreIntel?.length) return null;
  if (scoreIntel.length < 3) {
    return <SkillBarCompare scoreIntel={scoreIntel} size={size} />;
  }
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });
  const svgRef = useRef(null);
  const wrapRef = useRef(null);

  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.28;
  const levels = 5;
  const n = scoreIntel.length;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const polar = (val, i) => {
    const r = (val / 100) * R;
    return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) };
  };
  const gridPoly = (level) =>
    Array.from({ length: n }, (_, i) => {
      const r = (level / levels) * R;
      const a = angle(i);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
  const toPath = (pts) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  const candidatePts = scoreIntel.map((d, i) => polar(d.candidate, i));
  const desiredPts = scoreIntel.map((d, i) => polar(d.desired, i));

  function distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax,
      dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - ax, py - ay);
    const t = Math.max(
      0,
      Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2),
    );
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  function isInsidePolygon(px, py, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i].x,
        yi = pts[i].y;
      const xj = pts[j].x,
        yj = pts[j].y;
      const intersect =
        yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function closestSkill(mx, my) {
    let bestIdx = -1,
      bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      const end = polar(100, i);
      const dist = distToSegment(mx, my, cx, cy, end.x, end.y);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    if (bestDist <= 22) return bestIdx;

    if (
      isInsidePolygon(mx, my, candidatePts) ||
      isInsidePolygon(mx, my, desiredPts)
    ) {
      let nearIdx = -1,
        nearDist = Infinity;
      candidatePts.forEach((p, i) => {
        const d = Math.hypot(mx - p.x, my - p.y);
        if (d < nearDist) {
          nearDist = d;
          nearIdx = i;
        }
      });
      return nearIdx;
    }
    return -1;
  }

  const handleMouseMove = useCallback(
    (e) => {
      const svgEl = svgRef.current;
      const wrapEl = wrapRef.current;
      if (!svgEl || !wrapEl) return;

      const svgRect = svgEl.getBoundingClientRect();
      const wrapRect = wrapEl.getBoundingClientRect();
      const scaleX = size / svgRect.width;
      const scaleY = size / svgRect.height;
      const mx = (e.clientX - svgRect.left) * scaleX;
      const my = (e.clientY - svgRect.top) * scaleY;

      const idx = closestSkill(mx, my);
      if (idx !== -1) {
        const ttW = 170,
          ttH = 82;
        let left = e.clientX - wrapRect.left + 14;
        let top = e.clientY - wrapRect.top - 20;
        if (left + ttW > wrapRect.width)
          left = e.clientX - wrapRect.left - ttW - 10;
        if (top + ttH > wrapRect.height)
          top = e.clientY - wrapRect.top - ttH - 10;
        if (top < 0) top = 4;

        setTooltip({ visible: true, x: left, y: top, data: scoreIntel[idx] });
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    },
    [scoreIntel, size],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Legend */}
      <Box
        sx={{ display: "flex", gap: "16px", mb: "10px", alignSelf: "flex-end" }}
      >
        {[
          { dot: "#818CF8", label: "Candidate" },
          { dot: "#22C55E", label: "Desired" },
        ].map(({ dot, label }) => (
          <Box
            key={label}
            sx={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: dot,
              }}
            />
            <Typography
              sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Chart + Tooltip wrapper */}
      <Box
        ref={wrapRef}
        sx={{ position: "relative", width: size, height: size }}
      >
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: "visible", display: "block" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Grid polygons */}
          {Array.from({ length: levels }, (_, i) => (
            <polygon
              key={i}
              points={gridPoly(i + 1)}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {scoreIntel.map((_, i) => {
            const end = polar(100, i);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            );
          })}

          {/* Desired polygon */}
          <path
            d={toPath(desiredPts)}
            fill="rgba(34,197,94,0.10)"
            stroke="#22C55E"
            strokeWidth="1.5"
          />

          {/* Candidate polygon */}
          <path
            d={toPath(candidatePts)}
            fill="rgba(129,140,248,0.20)"
            stroke="#818CF8"
            strokeWidth="2"
          />

          {/* Skill labels */}
          {scoreIntel.map((d, i) => {
            const labelR = R + 52;
            const lx = cx + labelR * Math.cos(angle(i));
            const ly = cy + labelR * Math.sin(angle(i));
            const anchor =
              Math.abs(lx - cx) < 5 ? "middle" : lx < cx ? "end" : "start";
            const label =
              d.skill.length > 24 ? d.skill.slice(0, 22) + "…" : d.skill;
            return (
              <text
                key={i}
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize="13"
                fontWeight="600"
                fill="#475569"
              >
                {label}
              </text>
            );
          })}

          {/* Level labels */}
          {Array.from({ length: levels }, (_, i) => {
            const r = ((i + 1) / levels) * R;
            return (
              <text
                key={i}
                x={cx + 4}
                y={cy - r + 4}
                fontSize="8"
                fill="#9CA3AF"
              >
                {(i + 1) * 20}
              </text>
            );
          })}

          {/* Candidate data points */}
          {candidatePts.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#818CF8"
              style={{ pointerEvents: "none" }}
            />
          ))}
        </svg>

        {/* Floating tooltip */}
        {tooltip.visible && tooltip.data && (
          <Box
            sx={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y,
              pointerEvents: "none",
              background: "#1E293B",
              borderRadius: "8px",
              padding: "10px 12px",
              minWidth: 160,
              zIndex: 10,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: "#F1F5F9",
                mb: "6px",
              }}
            >
              {tooltip.data.skill}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                mt: "4px",
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#818CF8",
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: 11, color: "#94A3B8" }}>
                Candidate
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#818CF8",
                  ml: "auto",
                }}
              >
                {Math.round(tooltip.data.candidate)}%
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                mt: "4px",
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22C55E",
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: 11, color: "#94A3B8" }}>
                Desired
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#22C55E",
                  ml: "auto",
                }}
              >
                {Math.round(tooltip.data.desired)}%
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   PROFILE: EXPERIENCE LIST
═══════════════════════════════════════════════ */
function ExperienceList({ candidate }) {
  const employment = candidate?.employment ?? [];
  // Track which cards have "show all skills" expanded
  const [expandedSkills, setExpandedSkills] = useState({});

  if (!employment.length)
    return (
      <Typography fontSize={15} color="#9CA3AF">
        No experience listed.
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {employment.map((emp, i) => {
        const isLast = i === employment.length - 1;
        const isSkillsExpanded = !!expandedSkills[i];
        const allSkills = emp.skills_used ?? [];
        const LIMIT = 8;
        const visibleSkills = isSkillsExpanded
          ? allSkills
          : allSkills.slice(0, LIMIT);
        const hiddenCount = allSkills.length - LIMIT;

        return (
          <Box key={emp.id ?? i} sx={{ display: "flex", gap: "8px", mt: -2 }}>
            {/* Left connector column */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: "50%",
                  backgroundColor: emp.is_current ? C.accent : "#F3F4F6",
                  border: `1px solid ${emp.is_current ? C.accent : C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BusinessOutlinedIcon
                  sx={{
                    fontSize: 15,
                    color: emp.is_current ? "#FFFFFF" : "#9CA3AF",
                  }}
                />
              </Box>
              {!isLast && (
                <Box
                  sx={{
                    width: 1.5,
                    flex: 1,
                    minHeight: 24,
                    backgroundColor: C.border,
                    my: "6px",
                  }}
                />
              )}
            </Box>

            {/* Card */}
            <Box
              sx={{
                width: "100%",
                border: emp.is_current ? "1px solid #FFD6C7" : "1px solid #E8E8EC",
                borderRadius: "14px",
                backgroundColor: emp.is_current ? "#FFFAF7" : "#fff",
                p: "16px",
                mb: 3,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                  mb: 0,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#0F172A",
                        lineHeight: 1.3,
                      }}
                    >
                      {emp.job_title}
                    </Typography>
                    {emp.is_current && (
                      <Chip
                        label="CURRENT"
                        size="small"
                        sx={{
                          height: 18,
                          backgroundColor: "#FFF0E8",
                          color: "#FF5F1F",
                          fontSize: 9,
                          fontWeight: 700,
                          borderRadius: "6px",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#FF5F1F",
                    }}
                  >
                    {emp.company_name}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 600, color: "#475569" }}
                    >
                      {emp.joining_date ?? "—"} —{" "}
                      {emp.is_current ? "Present" : (emp.end_date ?? "—")}
                    </Typography>
                  </Box>
                  {emp.duration && (
                    <Typography
                      sx={{ mt: 0.25, fontSize: 12, color: "#94A3B8" }}
                    >
                      {emp.duration}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Location */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  mt: 0,
                  mb: 1,
                }}
              >
                {emp.location && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 14, color: "#8B8BA7" }}
                    />
                    <Typography sx={{ fontSize: 12, color: "#475569" }}>
                      {emp.location}
                    </Typography>
                  </Box>
                )}
                {emp.country && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PublicOutlinedIcon
                      sx={{ fontSize: 14, color: "#8B8BA7" }}
                    />
                    <Typography sx={{ fontSize: 12, color: "#475569" }}>
                      {emp.country}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Skills Used */}
              {allSkills.length > 0 && (
                <>
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#7C7C98",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    Skills Used
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {visibleSkills.map((sk) => (
                      <Chip
                        key={sk}
                        label={sk}
                        size="small"
                        sx={{
                          height: 24,
                          backgroundColor: "#EEF2FF",
                          color: "#4338CA",
                          border: "1px solid #DDE4FF",
                          borderRadius: "8px",
                          fontSize: 11,
                          fontWeight: 500,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    ))}

                    {/* +N more / Show less toggle */}
                    {!isSkillsExpanded && hiddenCount > 0 && (
                      <Chip
                        label={`+${hiddenCount} more`}
                        size="small"
                        onClick={() =>
                          setExpandedSkills((prev) => ({ ...prev, [i]: true }))
                        }
                        sx={{
                          height: 24,
                          backgroundColor: "#FFF7ED",
                          color: "#F97316",
                          border: "1px solid #FDBA74",
                          borderRadius: "8px",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          "& .MuiChip-label": { px: 1 },
                          "&:hover": { backgroundColor: "#FFEDD5" },
                        }}
                      />
                    )}

                    {isSkillsExpanded && allSkills.length > LIMIT && (
                      <Chip
                        label="Show less"
                        size="small"
                        onClick={() =>
                          setExpandedSkills((prev) => ({ ...prev, [i]: false }))
                        }
                        sx={{
                          height: 24,
                          backgroundColor: "#F3F4F6",
                          color: "#6B7280",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          "& .MuiChip-label": { px: 1 },
                          "&:hover": { backgroundColor: "#E5E7EB" },
                        }}
                      />
                    )}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   PROFILE: EDUCATION LIST
═══════════════════════════════════════════════ */
function EducationList({ candidate }) {
  const education = [...(candidate?.education ?? [])].sort(
    (a, b) => (b.end_year ?? 0) - (a.end_year ?? 0),
  );

  if (!education.length)
    return (
      <Typography fontSize={15} color="#9CA3AF">
        No education listed.
      </Typography>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {education.map((edu, i) => {
        const isLast = i === education.length - 1;
        return (
          <Box key={edu.id ?? i} sx={{ display: "flex", gap: "16px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  backgroundColor: C.tealSoft,
                  border: `1px solid #B2EBF2`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <SchoolOutlinedIcon sx={{ fontSize: 18, color: "#059669" }} />
              </Box>
              {!isLast && (
                <Box
                  sx={{
                    width: 1.5,
                    flex: 1,
                    minHeight: 24,
                    backgroundColor: C.border,
                    my: "6px",
                  }}
                />
              )}
            </Box>
            <Box sx={{ pb: isLast ? 0 : "24px", flex: 1, pt: "6px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "4px",
                  mb: "2px",
                }}
              >
                <Typography
                  sx={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}
                >
                  {edu.course}
                </Typography>
                {edu.end_year && (
                  <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>
                    {edu.end_year}
                  </Typography>
                )}
              </Box>
              <Typography
                sx={{ fontSize: 13, color: "#059669", fontWeight: 600 }}
              >
                {edu.university}
              </Typography>
              {edu.specialization && (
                <Typography sx={{ fontSize: 13, color: "#9CA3AF", mt: "2px" }}>
                  {edu.specialization}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   PROFILE: SKILLS PANEL
═══════════════════════════════════════════════ */
function SkillsPanel({ candidate }) {
  const keySkills = candidate?.skill_info?.[0]?.key_skills ?? "";
  const skills = keySkills
    ? keySkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    : [];

  const matchedPrimary = (candidate?.matched_primary_skills ?? []).map((s) =>
    s.toLowerCase(),
  );
  const matchedSecondary = (candidate?.matched_secondary_skills ?? []).map(
    (s) => s.toLowerCase(),
  );
  const matchedMandatory = (candidate?.matched_mandatory_skills ?? []).map(
    (s) => s.toLowerCase(),
  );

  const getChipStyle = (skill) => {
    const sl = skill.toLowerCase();
    if (matchedMandatory.some((m) => sl.includes(m) || m.includes(sl)))
      return { bg: "#FFF0E8", color: C.accent, border: "#FFCFB3" };
    if (matchedPrimary.some((m) => sl.includes(m) || m.includes(sl)))
      return { bg: "#E0F2FE", color: "#0369A1", border: "#BAE6FD" };
    if (matchedSecondary.some((m) => sl.includes(m) || m.includes(sl)))
      return { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" };
    return { bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB" };
  };

  if (!skills.length)
    return (
      <Typography fontSize={15} color="#9CA3AF">
        No skills listed.
      </Typography>
    );

  return (
    <Box>
      <Box sx={{ display: "flex", gap: "14px", mb: "16px", flexWrap: "wrap" }}>
        {[
          {
            label: "Mandatory Match",
            bg: "#FFF0E8",
            color: C.accent,
            border: "#fa6007",
          },
          {
            label: "Primary Match",
            bg: "#E0F2FE",
            color: "#1803ff",
            border: "#BAE6FD",
          },
          {
            label: "Secondary Match",
            bg: "#F3F4F6",
            color: "#556c91",
            border: "#E5E7EB",
          },
        ].map((l) => (
          <Box
            key={l.label}
            sx={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "3px",
                backgroundColor: l.bg,
                border: `1px solid ${l.border}`,
              }}
            />
            <Typography sx={{ fontSize: 13 }}>{l.label}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
        {skills.map((skill) => {
          const style = getChipStyle(skill);
          return (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{
                fontSize: 12,
                height: 26,
                backgroundColor: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`,
                borderRadius: "6px",
                fontWeight: 500,
                "& .MuiChip-label": { px: "9px" },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   PROFILE: SKILL INTEL PANEL (radar + scores dialog)
═══════════════════════════════════════════════ */
const getScoreColors = (score) => {
  if (score >= 80) {
    return {
      ring: "#10B981",
      text: "#059669",
      bg: "#ECFDF5",
    };
  }

  if (score >= 50) {
    return {
      ring: "#F59E0B",
      text: "#D97706",
      bg: "#FFFBEB",
    };
  }

  return {
    ring: "#DC2626",
    text: "#DC2626",
    bg: "#FEF2F2",
  };
};
function SkillNotesAccordion({ skillNotes = {}, scoreIntel = [] }) {
  const notesArray = Object.entries(skillNotes);

  if (!notesArray.length) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
          mb: 2,
          color: "#111827",
        }}
      >
        Skill Notes
      </Typography>

      {notesArray.map(([skill, note]) => {
        const scoreData = scoreIntel.find(
          (s) => s.skill?.toLowerCase() === skill?.toLowerCase(),
        );

        const score = scoreData?.candidate || 0;

        const colors = getScoreColors(score);
        const noteText = typeof note === "object" ? note.value : note;

        return (
          <Accordion
            key={skill}
            disableGutters
            sx={{
              mb: 1.5,
              border: "1px solid #E5E7EB",
              borderRadius: "14px !important",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* Left Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    {/* Background ring */}
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={42}
                      thickness={5}
                      sx={{
                        color: "#E5E7EB",
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                    />

                    {/* Actual progress */}
                    <CircularProgress
                      variant="determinate"
                      value={score}
                      size={42}
                      thickness={5}
                      sx={{
                        color: colors.ring,
                        "& .MuiCircularProgress-circle": {
                          strokeLinecap: "round",
                        },
                      }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 8,
                          fontWeight: 700,
                          color: colors.text,
                        }}
                      >
                        {Math.round(score)}%
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {skill}
                  </Typography>
                </Box>

                {/* Right Section */}
                <Box sx={{ width: 240 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        width: 20,
                        fontSize: 10,
                        fontWeight: 600,
                        mr: 1,
                      }}
                    >
                      Score
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={score}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 999,
                        backgroundColor: "#E5E7EB",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          backgroundColor: "#10B981",
                        },
                      }}
                    />

                    <Chip
                      label={`${score}%`}
                      size="small"
                      sx={{
                        bgcolor: "#ECFDF5",
                        color: "#059669",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                background: "#FAFAFA",
                borderTop: "1px solid #F3F4F6",
              }}
            >
              {/* AI Notes */}
              <Box
                sx={{
                  p: 0,
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: "#374151",
                  }}
                >
                  {noteText}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
function SkillIntelPanel({ candidate }) {
  const skillInfo = candidate?.skill_info?.[0] ?? {};
  const scoreIntel = candidate?.score_intel ?? [];
  const skillNotes = candidate?.skill_notes ?? {};
  const summary = skillInfo.summary ?? "";
  const [skillScoresOpen, setSkillScoresOpen] = React.useState(false);

  const hasContent =
    scoreIntel.length > 0 || summary || Object.keys(skillNotes).length > 0;
  if (!hasContent) return null;

  return (
    <Box>
      {scoreIntel.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: "20px",
            width: "100%",
          }}
        >
          <RadarChart scoreIntel={scoreIntel} size={350} />
        </Box>
      )}

      {scoreIntel.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: "12px" }}>
          <Box
            onClick={() => setSkillScoresOpen(true)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              border: `1px solid ${C.border}`,
              borderRadius: "8px",
              px: "12px",
              py: "6px",
              cursor: "pointer",
              "&:hover": { backgroundColor: C.accentSoft },
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 14, color: C.accent }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.accent }}>
              View all skill scores
            </Typography>
          </Box>
        </Box>
      )}

      {summary && (
        <Box sx={{ mb: "16px" }}>
          <Typography
            sx={{ fontSize: 14, fontWeight: 600, color: "#000", mb: 1 }}
          >
            Skill Summary
          </Typography>
          <Typography sx={{ fontSize: 15 }} lineHeight={1.75}>
            {summary}
          </Typography>
        </Box>
      )}

      <SkillNotesAccordion
        skillNotes={candidate?.skill_notes ?? {}}
        scoreIntel={candidate?.score_intel ?? []}
      />

      {/* Skill Scores Dialog */}
      <Dialog
        open={skillScoresOpen}
        onClose={() => setSkillScoresOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: "500px",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 16px 50px rgba(0,0,0,0.14)",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: "16px",
            py: "12px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "#FFF7ED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 15, color: "#F97316" }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.textPrimary,
                  lineHeight: 1.1,
                }}
              >
                All Skill Scores
              </Typography>
              <Typography sx={{ fontSize: 10, color: "#9CA3AF", mt: "2px" }}>
                {scoreIntel.length} skills evaluated
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setSkillScoresOpen(false)}
            sx={{
              width: 26,
              height: 26,
              borderRadius: "7px",
              backgroundColor: "#F3F4F6",
              "&:hover": { backgroundColor: "#E5E7EB" },
            }}
          >
            <CloseIcon sx={{ fontSize: 12, color: "#6B7280" }} />
          </IconButton>
        </DialogTitle>

        <Box
          sx={{
            px: "16px",
            py: "9px",
            display: "flex",
            gap: "7px",
            borderBottom: `1px solid ${C.border}`,
            backgroundColor: "#FAFAFA",
          }}
        >
          {[
            {
              label: "Strong",
              color: "#22C55E",
              bg: "#DCFCE7",
              count: scoreIntel.filter(
                (s) => s.desired > 0 && s.candidate / s.desired >= 0.9,
              ).length,
            },
            {
              label: "Good",
              color: "#F97316",
              bg: "#FED7AA",
              count: scoreIntel.filter(
                (s) =>
                  s.desired > 0 &&
                  s.candidate / s.desired >= 0.7 &&
                  s.candidate / s.desired < 0.9,
              ).length,
            },
            {
              label: "Gap",
              color: "#EF4444",
              bg: "#FECACA",
              count: scoreIntel.filter(
                (s) => s.desired > 0 && s.candidate / s.desired < 0.7,
              ).length,
            },
          ].map(({ label, color, bg, count }) => (
            <Box
              key={label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                px: "9px",
                py: "4px",
                borderRadius: "999px",
                backgroundColor: bg,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{ fontSize: 10, fontWeight: 700, color, lineHeight: 1 }}
              >
                {count}
              </Typography>
              <Typography
                sx={{ fontSize: 10, fontWeight: 600, color, lineHeight: 1 }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 0px 58px",
            px: "16px",
            py: "6px",
            backgroundColor: "#F9FAFB",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {["Skill", "Score"].map((h) => (
            <Typography
              key={h}
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {h}
            </Typography>
          ))}
        </Box>

        <DialogContent sx={{ p: 0, maxHeight: 300, overflowY: "auto" }}>
          {scoreIntel.map((s, i) => {
            const pct =
              s.desired > 0 ? Math.round((s.candidate / s.desired) * 100) : 0;
            const isStrong = pct >= 90;
            const isGood = pct >= 70 && pct < 90;
            const barColor = isStrong
              ? "#22C55E"
              : isGood
                ? "#F97316"
                : "#EF4444";
            const badgeBg = isStrong
              ? "#DCFCE7"
              : isGood
                ? "#FED7AA"
                : "#FECACA";
            return (
              <Box
                key={s.skill}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 150px",
                  px: "16px",
                  py: "7px",
                  alignItems: "center",
                  borderBottom: "1px solid #F3F4F6",
                  backgroundColor: i % 2 === 0 ? "#fff" : "#FCFCFD",
                  "&:hover": { backgroundColor: "#F9FAFB" },
                  transition: "background 0.15s",
                }}
              >
                {/* Skill */}
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.textPrimary,
                    lineHeight: 1.3,
                    pr: "10px",
                  }}
                >
                  {s.skill}
                </Typography>

                {/* Candidate Score */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      backgroundColor: "#E5E7EB",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${Math.min(s.candidate, 100)}%`,
                        backgroundColor: barColor,
                        borderRadius: "999px",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: barColor,
                      ml: "auto",
                      minWidth: "55px",
                      textAlign: "right",
                      px: "10px",
                      py: "1px",
                      borderRadius: "999px",
                      backgroundColor: badgeBg,
                    }}
                  >
                    {s.candidate}%
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </DialogContent>

        <Box
          sx={{
            px: "16px",
            py: "10px",
            borderTop: `1px solid ${C.border}`,
            backgroundColor: "#FAFAFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
            Scores are out of 100
          </Typography>
          <Box sx={{ display: "flex", gap: "12px" }}>
            {[
              { label: "≥ 90%", color: "#22C55E" },
              { label: "≥ 70%", color: "#F97316" },
              { label: "< 70%", color: "#EF4444" },
            ].map(({ label, color }) => (
              <Box
                key={label}
                sx={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
                <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   PROFILE TAB — Skill Intel only
═══════════════════════════════════════════════ */

function SkillIntelTab({ candidate }) {
  const hasSkillIntel =
    (candidate?.score_intel ?? []).length > 0 ||
    candidate?.skill_info?.[0]?.summary ||
    Object.keys(candidate?.skill_notes ?? {}).length > 0;

  if (!hasSkillIntel) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <TrendingUpIcon sx={{ fontSize: 40, color: "#D1D5DB", mb: 1.5 }} />
        <Typography fontSize={15} color={C.textSecondary}>
          No skill intelligence data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        backgroundColor: "#fff",
        px: "28px",
        py: "24px",
      }}
    >
      <SkillIntelPanel candidate={candidate} />
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   EXPERIENCE TAB
═══════════════════════════════════════════════ */
function ExperienceTab({ candidate }) {
  return (
    <Box
      sx={{
        borderRadius: "14px",
        backgroundColor: "#fff",
        px: "5px",
        py: "24px",
      }}
    >
      <ExperienceList candidate={candidate} />
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   EDUCATION TAB
═══════════════════════════════════════════════ */
function EducationTab({ candidate }) {
  return (
    <Box
      sx={{
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        backgroundColor: "#fff",
        px: "28px",
        py: "24px",
      }}
    >
      <EducationList candidate={candidate} />
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   SKILLS TAB
═══════════════════════════════════════════════ */
function SkillsTab({ candidate }) {
  const certifications = candidate?.certifications ?? [];
  return (
    <Box
      sx={{
        border: `1px solid ${C.border}`,
        borderRadius: "14px",
        backgroundColor: "#fff",
        px: "28px",
        py: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      <Box>
        <SectionHeader
          icon={
            <PsychologyOutlinedIcon sx={{ fontSize: 18, color: "#818CF8" }} />
          }
          label="Skills"
        />
        <SkillsPanel candidate={candidate} />
      </Box>

      {certifications.length > 0 && (
        <Box>
          <SectionHeader
            icon={
              <InsertDriveFileOutlinedIcon
                sx={{ fontSize: 18, color: "#16A34A" }}
              />
            }
            label="Certifications"
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {certifications.map((cert, i) => {
              const isLast = i === certifications.length - 1;
              return (
                <Box key={cert.id ?? i} sx={{ display: "flex", gap: "16px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: "#F0FDF4",
                        border: `1px solid #BBF7D0`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <InsertDriveFileOutlinedIcon
                        sx={{ fontSize: 18, color: "#16A34A" }}
                      />
                    </Box>
                    {!isLast && (
                      <Box
                        sx={{
                          width: 1.5,
                          flex: 1,
                          minHeight: 24,
                          backgroundColor: C.border,
                          my: "6px",
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ pb: isLast ? 0 : "24px", flex: 1, pt: "6px" }}>
                    <Typography
                      fontSize={14}
                      fontWeight={700}
                      color={C.textPrimary}
                      mb="2px"
                    >
                      {cert.name ?? cert.title ?? "Certification"}
                    </Typography>
                    {cert.issuer && (
                      <Typography fontSize={13} color={C.textSecondary}>
                        {cert.issuer}
                      </Typography>
                    )}
                    {cert.issued_date && (
                      <Typography fontSize={13} color="#9CA3AF" mt="2px">
                        {cert.issued_date}
                        {cert.expiry_date ? ` — ${cert.expiry_date}` : ""}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}

function TimelineTab({
  candidate,
  onInterviewClick,
  onUpdateInterviewStatus,
  onRescheduleInterview,
  onUpdateInterviewResult,
  onViewFeedback,
  interviewStatusOverrides = {},
  interviewResultOverrides = {},
  interviewTimeOverrides = {},
}) {
  const currentStage = candidate.current_stage ?? "";
  const location = useLocation();
  const { candidateId } = useParams();
  const matched_candidate_id =
    location.state?.matched_candidate_id ?? candidateId;

  const { data, isLoading } = useGetCandidateStageTimelineQuery(
    matched_candidate_id,
    {
      skip: !matched_candidate_id,
    },
  );

  const entries = data?.timeline ?? [];

  const grouped = {};
  entries.forEach((entry) => {
    const g = getEntryGroup(entry);
    if (!g) return;
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(entry);
  });
  const rejectedEntry = entries.find((e) => e.type === "rejected");
  if (rejectedEntry) {
    const groupKeys = STAGE_CONFIG.map((s) => s.key);
    const groupsWithEntries = groupKeys.filter((gk) => grouped[gk]?.length);
    const lastGroupWithEntries = groupsWithEntries[groupsWithEntries.length - 1];
    if (lastGroupWithEntries) {
      grouped[lastGroupWithEntries] = [
        ...(grouped[lastGroupWithEntries] ?? []),
        rejectedEntry,
      ];
    }
  }

  const hasRejected = entries.some((e) => e.type === "rejected");

  // Badges for lifecycle (non-interview) entries, keyed by `entry.type`.
  const LIFECYCLE_BADGE_COLOR = {
    ...BADGE_COLOR,
    offer_released: "scheduled",
    offer_accepted: "completed",
    offer_declined: "failed",
    offer_revoked: "failed",
    rejected: "failed",
  };

  // Badges/labels for a single interview round's *effective* status
  // (derived from its latest event, or a locally-applied Update Status
  // override), keyed the same way as INTERVIEW_STATUS_OPTIONS values.
  const ROUND_STATUS_LABEL = {
    scheduled: "Scheduled",
    completed: "Completed",
    no_show: "No Show",
    not_conducted: "Not Conducted",
    cancelled: "Cancelled",
  };
  const ROUND_BADGE_COLOR = {
    scheduled: "scheduled",
    completed: "completed",
    no_show: "failed",
    not_conducted: "failed",
    cancelled: "failed",
  };

  const visibleStages = STAGE_CONFIG.filter((stage) => !!grouped[stage.key]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );
  }

  if (!visibleStages.length) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <TrendingUpIcon sx={{ fontSize: 40, color: "#D1D5DB", mb: 1.5 }} />
        <Typography fontSize={T.valueSize} color={C.textSecondary}>
          No timeline entries found.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      <Grid sx={{ width: "100%", pr: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 5,
            width: "100%",
          }}
        >
          {visibleStages.map((stage, i) => {
            const stageEntries = grouped[stage.key] ?? [];
            const isLast = i === visibleStages.length - 1;
            const state = groupState(stage.key, grouped, currentStage, hasRejected);

            // Interview rounds only ever live in the "interviewing" group.
            const interviewRounds = stageEntries
              .filter((e) => e.stage?.toLowerCase().startsWith("interview_"))
              .sort((a, b) => (a.step_number ?? 0) - (b.step_number ?? 0));
            const hasSubEntries = interviewRounds.length > 0;

            // Simple lifecycle entries for this group (matched / shortlisted /
            // selected / offer / hired) — everything that isn't a round.
            const lifecycleEntries = stageEntries.filter(
              (e) => !e.stage?.toLowerCase().startsWith("interview_") && e.type !== "rejected",
            );

            // Rejected is rendered separately, after interview rounds, since it
            // represents the terminal action taken *after* the rounds happened.
            const rejectedEntries = stageEntries.filter((e) => e.type === "rejected");

            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
                key={stage.key}
              >
                <Box
                  sx={{ display: "flex", gap: "16px", width: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <StageCircle state={state} size={32} />
                    {!isLast && (
                      <ConnectorLine
                        state={state}
                        minHeight={hasSubEntries ? 80 : 48}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      pb: isLast ? 0 : "12px",
                      width: "100%",
                      pt: "4px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: "4px",
                        width: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 700,
                          letterSpacing: "0.2px",
                        }}
                        color={C.textPrimary}
                      >
                        {stage.label}
                      </Typography>
                    </Box>

                    {/* Simple lifecycle entries (matched / shortlisted / selected / offer / hired) */}
                    {lifecycleEntries.map((entry, ei) => (
                      <Box key={entry.timestamp ?? ei} sx={{ mt: 1 }}>
                        {SUB_LABEL[entry.type] && (
                          <StatusBadge
                            label={SUB_LABEL[entry.type]}
                            color={LIFECYCLE_BADGE_COLOR[entry.type]}
                          />
                        )}

                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "#9CA3AF",
                              minWidth: 24,
                            }}
                          >
                            IST :
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              ml: 1,
                              color: "#4B5563",
                            }}
                          >
                            {fmtDateIST(entry.timestamp)}
                          </Typography>
                        </Box>

                        {entry.by?.name && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#9CA3AF",
                                minWidth: 24,
                              }}
                            >
                              By :
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                ml: 1,
                                color: "#4B5563",
                              }}
                            >
                              {entry.by.name}
                            </Typography>
                          </Box>
                        )}

                        {entry.comments && (
                          <Typography
                            sx={{ fontSize: 12, color: "#6B7280", mt: 0.3 }}
                          >
                            "{entry.comments}"
                          </Typography>
                        )}
                      </Box>
                    ))}

                    {hasSubEntries && (
                      <Box
                        sx={{
                          mt: "8px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          width: "100%",
                        }}
                      >
                        {interviewRounds.map((round, si) => {
                          const roundEvents = round.events ?? [];

                          const latestEvent = [...roundEvents].sort(
                            (a, b) =>
                              new Date(b.timestamp) - new Date(a.timestamp),
                          )[0];
                          const scheduledEvent =
                            roundEvents.find(
                              (e) => e.event === "interview_scheduled",
                            ) ?? roundEvents[0];

                          const effectiveStatus =
                            interviewStatusOverrides[round.interview_id] ??
                            normalizeInterviewStatus(latestEvent?.status);

                          const isOpenRound = OPEN_INTERVIEW_STAGES.includes(
                            effectiveStatus,
                          );
                          const isCompletedRound = effectiveStatus === "completed";
                          const effectiveResult =
                            interviewResultOverrides[round.interview_id] ??
                            normalizeInterviewResult(
                              latestEvent?.result ?? round.result,
                            );
                          const hasFinalResult =
                            effectiveResult === "pass" || effectiveResult === "fail";

                          const roundBadgeLabel =
                            isCompletedRound && effectiveResult
                              ? `Completed (${effectiveResult.toUpperCase()})`
                              : ROUND_STATUS_LABEL[effectiveStatus] ?? effectiveStatus;

                          const roundBadgeColor =
                            isCompletedRound && effectiveResult
                              ? effectiveResult === "pass"
                                ? "completed"
                                : "failed"
                              : ROUND_BADGE_COLOR[effectiveStatus] ?? "scheduled";

                          const timeOverride = interviewTimeOverrides[round.interview_id];
                          const effectiveInterviewTime = timeOverride?.interview_time ?? round.interview_time;
                          const effectiveDurationMinutes = timeOverride?.duration_minutes ?? round.duration_minutes;

                          const interviewEndTimeForRound = getInterviewEndTime(
                            effectiveInterviewTime,
                            effectiveDurationMinutes,
                          );

                          return (
                            <Box
                              key={round.interview_id ?? si}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "10px",
                                width: "100%",
                                mt: -1.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mt: "2px",
                                }}
                              >
                                <Box sx={{ mt: 1 }}>
                                  <Box sx={{ display: 'flex' }}>
                                    <Typography
                                      sx={{
                                        fontSize: 15,
                                        fontWeight: 700,
                                        color: "#111827",
                                      }}
                                    >
                                      {round.step_name ?? `Round-${round.step_number}`}
                                    </Typography>
                                    <StatusBadge
                                      label={roundBadgeLabel}
                                      color={roundBadgeColor}
                                    />
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: "#6B7280",
                                      mt: 0.5,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    IST:
                                    <Typography sx={{ ml: 1, fontSize: 12, color: "#4B5563", fontWeight: 600 }}>
                                      {fmtDateIST(round.timestamp)}
                                    </Typography>
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: "#6B7280",
                                      mt: 0.3,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    Interview Time: IST:
                                    <Typography sx={{ ml: 1, fontSize: 12, color: "#4B5563", fontWeight: 600 }}>
                                      {fmtDateIST(effectiveInterviewTime)}
                                    </Typography>
                                  </Typography>

                                  {round.interviewer?.name && (
                                    <Typography
                                      sx={{
                                        fontSize: 12,
                                        color: "#6B7280",
                                        mt: 0.3,
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      Interviewer:
                                      <Typography sx={{ ml: 1, fontSize: 12, color: "#4B5563", fontWeight: 600 }}>
                                        {round.interviewer.name}
                                      </Typography>
                                    </Typography>
                                  )}

                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: "#6B7280",
                                      mt: 0.3,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    By:
                                    <Typography sx={{ ml: 1, fontSize: 12, color: "#4B5563", fontWeight: 600 }}>
                                      {scheduledEvent?.by?.name ?? "—"}
                                    </Typography>
                                  </Typography>

                                  {latestEvent?.comments && (
                                    <Typography
                                      sx={{ fontSize: 12, color: "#6B7280", mt: 0.3 }}
                                    >
                                      "{latestEvent.comments}"
                                    </Typography>
                                  )}
                                </Box>
                              </Box>

                              {round.interview_id && (
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    startIcon={
                                      <VisibilityIcon
                                        sx={{ fontSize: "13px !important" }}
                                      />
                                    }
                                    variant="outlined"
                                    onClick={() =>
                                      onInterviewClick(round.interview_id)
                                    }
                                    sx={{
                                      borderColor: "#1976d2",
                                      color: "#1976d2",
                                      textTransform: "none",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      borderRadius: "5px",
                                      px: 2,
                                      py: 0,
                                      height: "30px",
                                      "& .MuiSvgIcon-root": {
                                        fontSize: "13px",
                                      },
                                    }}
                                  >
                                    View Details
                                  </Button>

                                  {isCompletedRound && (
                                    <>
                                      <Button
                                        startIcon={
                                          <VisibilityIcon sx={{ fontSize: "13px !important" }} />
                                        }
                                        variant="outlined"
                                        onClick={() => onViewFeedback(round.interview_id)}
                                        sx={{
                                          borderColor: "#16A34A",
                                          color: "#16A34A",
                                          textTransform: "none",
                                          fontSize: "12px",
                                          fontWeight: 500,
                                          borderRadius: "5px",
                                          px: 2,
                                          py: 0,
                                          height: "30px",
                                        }}
                                      >
                                        View Feedback
                                      </Button>

                                      {!hasFinalResult && !hasRejected && (
                                        <InterviewResultMenu
                                          currentResult={effectiveResult}
                                          onSelect={(result) =>
                                            onUpdateInterviewResult(
                                              round.interview_id,
                                              result,
                                            )
                                          }
                                        />
                                      )}
                                    </>
                                  )}

                                  {isOpenRound && (
                                    <>
                                      <Button
                                        startIcon={
                                          <EventRepeatOutlinedIcon
                                            sx={{ fontSize: "13px !important" }}
                                          />
                                        }
                                        variant="outlined"
                                        onClick={() =>
                                          onRescheduleInterview(round.interview_id)
                                        }
                                        sx={{
                                          borderColor: "#F97316",
                                          color: "#F97316",
                                          textTransform: "none",
                                          fontSize: "12px",
                                          fontWeight: 500,
                                          borderRadius: "5px",
                                          px: 2,
                                          py: 0,
                                          height: "30px",
                                          "& .MuiSvgIcon-root": {
                                            fontSize: "13px",
                                          },
                                        }}
                                      >
                                        Reschedule
                                      </Button>

                                      <InterviewStatusMenu
                                        interviewEndTime={interviewEndTimeForRound}
                                        currentStatus={effectiveStatus}
                                        onSelect={(action) =>
                                          onUpdateInterviewStatus(
                                            round.interview_id,
                                            action,
                                          )
                                        }
                                      />
                                    </>
                                  )}
                                </Stack>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    {/* Rejected renders last — it's the terminal action, after any rounds */}
                    {rejectedEntries.map((entry, ei) => (
                      <Box key={entry.timestamp ?? `rejected-${ei}`} sx={{ mt: 1 }}>
                        {SUB_LABEL[entry.type] && (
                          <StatusBadge
                            label={SUB_LABEL[entry.type]}
                            color={LIFECYCLE_BADGE_COLOR[entry.type]}
                          />
                        )}

                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <Typography sx={{ fontSize: 11, color: "#9CA3AF", minWidth: 24 }}>
                            IST :
                          </Typography>
                          <Typography sx={{ fontSize: 12, fontWeight: 600, ml: 1, color: "#4B5563" }}>
                            {fmtDateIST(entry.timestamp)}
                          </Typography>
                        </Box>

                        {entry.by?.name && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ fontSize: 11, color: "#9CA3AF", minWidth: 24 }}>
                              By :
                            </Typography>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, ml: 1, color: "#4B5563" }}>
                              {entry.by.name}
                            </Typography>
                          </Box>
                        )}

                        {entry.comments && (
                          <Typography sx={{ fontSize: 12, color: "#6B7280", mt: 0.3 }}>
                            "{entry.comments}"
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Grid>
    </Grid>
  );
}

/* ═══════════════════════════════════════════════
   INTERVIEWS TAB
═══════════════════════════════════════════════ */
function InterviewsTab({ candidate }) {
  const interviews = candidate.interviews ?? [];

  if (!interviews.length) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <CalendarMonthOutlinedIcon
          sx={{ fontSize: 40, color: "#D1D5DB", mb: 1.5 }}
        />
        <Typography fontSize={T.valueSize} color={C.textSecondary}>
          No interviews scheduled yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {interviews.map((iv, i) => (
        <Box
          key={i}
          sx={{
            p: "16px",
            border: `1px solid ${C.border}`,
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "8px",
            }}
          >
            <Typography fontSize={15} fontWeight={700} color={C.textPrimary}>
              {iv.round_name}
            </Typography>
            <Chip
              label={iv.status}
              size="small"
              sx={{
                fontSize: 11,
                height: 22,
                textTransform: "capitalize",
                fontWeight: 600,
                backgroundColor:
                  iv.status === "scheduled" ? "#E7F8EE" : "#F3F4F6",
                color: iv.status === "scheduled" ? "#0F6E56" : "#6B7280",
                "& .MuiChip-label": { px: "8px" },
              }}
            />
          </Box>
          <Typography fontSize={14} color={C.textSecondary}>
            {new Date(iv.scheduled_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {new Date(iv.scheduled_at).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          {iv.interviewer && (
            <Typography fontSize={14} color={C.textSecondary} mt="2px">
              <Box
                component="span"
                sx={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}
              >
                Interviewer:{" "}
              </Box>
              {iv.interviewer}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   DOCUMENTS TAB
═══════════════════════════════════════════════ */
function DocumentsTab({ candidate }) {
  if (!candidate.resume_url) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <InsertDriveFileOutlinedIcon
          sx={{ fontSize: 40, color: "#D1D5DB", mb: 1.5 }}
        />
        <Typography fontSize={T.valueSize} color={C.textSecondary}>
          No documents uploaded.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: "16px",
        border: `1px solid ${C.border}`,
        borderRadius: "10px",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: 500,
      }}
    >
      <Box>
        <Typography fontSize={15} fontWeight={600} color={C.textPrimary}>
          Resume
        </Typography>
        <Typography
          fontSize={13}
          color="#9CA3AF"
          sx={{ wordBreak: "break-all" }}
        >
          {candidate.resume_url.split("/").pop()}
        </Typography>
      </Box>
      <Button
        size="small"
        variant="outlined"
        href={candidate.resume_url}
        target="_blank"
        sx={{
          borderColor: C.accent,
          color: C.accent,
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "8px",
          fontSize: 13,
          flexShrink: 0,
          ml: 2,
          "&:hover": { backgroundColor: C.accentSoft, borderColor: C.accent },
        }}
      >
        View
      </Button>
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */

export default function CandidateDetail() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);

  const matched_candidate_id =
    location.state?.matched_candidate_id ?? candidateId;
  const { data, isLoading, isError, error } =
    useGetCandidateDetailQuery(matched_candidate_id);
  const candidate = data?.data?.candidate ?? null;
  const orgId = location.state?.orgId;
  const enriched = candidate
    ? {
      ...candidate,
      matched_primary_skills: data?.data?.matched_primary_skills ?? [],
      matched_secondary_skills: data?.data?.matched_secondary_skills ?? [],
      matched_mandatory_skills: data?.data?.matched_mandatory_skills ?? [],
      skill_notes: data?.data?.skill_notes ?? {},
      score_intel: data?.data?.score_intel ?? [],
      status: data?.data?.status,
    }
    : null;

  const [customSkills, setCustomSkills] = useState([]);
  const skillOptions = [
    ...(enriched?.matched_mandatory_skills ?? []).map((s) => ({
      label: s,
      type: "mandatory",
    })),
    ...(enriched?.matched_primary_skills ?? []).map((s) => ({
      label: s,
      type: "primary",
    })),
    ...(enriched?.matched_secondary_skills ?? []).map((s) => ({
      label: s,
      type: "secondary",
    })),
  ];
  const allSkillOptions = useMemo(() => {
    const map = new Map();

    [...customSkills, ...skillOptions].forEach((skill) => {
      map.set(skill.label.toLowerCase(), skill);
    });

    return [...map.values()];
  }, [customSkills, skillOptions]);

  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [lastInterviewPayload, setLastInterviewPayload] = useState(null);
  const [interviewTimeOverrides, setInterviewTimeOverrides] = useState({});

  const [getInterviewFullDetails, { isFetching }] =
    useLazyGetInterviewFullDetailsQuery();

  const handleInterviewDetails = async (interviewId) => {
    try {
      const response = await getInterviewFullDetails(interviewId).unwrap();
      setSelectedInterview(response.data);
      setInterviewModalOpen(true);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to load interview details",
        severity: "error",
      });
    }
  };

  const handleEditFromDetails = (interviewId) => {
    setInterviewModalOpen(false);
    handleRescheduleClick(interviewId);
  };

  /* ── Shortlist / Reject / Select / Offer flow ──
     All of these reuse the same StatusConfirmModal + updateCandidateStatus
     mutation. `statusModal.action` is always the exact `new_status` value
     sent to the API. */
  const [statusModal, setStatusModal] = useState({ open: false, action: null });
  const [updateCandidateStatus, { isLoading: statusUpdating }] =
    useUpdateCandidateStatusMutation();
  const [updateInterviewRoundStatus, { isLoading: updatingInterview }] =
    useUpdateInterviewRoundStatusMutation();
  const [updateInterviewResult, { isLoading: updatingInterviewResult }] =
    useUpdateInterviewResultMutation();
  const INTERVIEW_ACTIONS = [
    "completed",
    "no_show",
    "not_conducted",
    "cancelled",
  ];

  const handleConfirmStatus = async (comments) => {
    try {
      const statusAction = statusModal.action;

      if (INTERVIEW_ACTIONS.includes(statusAction)) {
        await updateInterviewRoundStatus({
          interviewId: interviewStatusModal.interviewId,
          status: statusAction,
          // result: statusAction,
          reason: comments,
          candidateId: matched_candidate_id,
        }).unwrap();
      } else {
        await updateCandidateStatus({
          candidateId: matched_candidate_id,
          newStatus: statusAction,
          reason: comments,
        }).unwrap();
      }

      // Close modal
      setStatusModal({
        open: false,
        action: null,
      });

      // Clear interview modal state if applicable
      setInterviewStatusModal({
        open: false,
        action: null,
        interviewId: null,
      });

      setSnackbar({
        open: true,
        message: "Status updated successfully",
        severity: "success",
      });

    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err?.data?.message || "Failed to update status",
        severity: "error",
      });
    }
  };

  /* ── Interview round outcome flow (Update Status dropdown, Timeline tab) ──
     Reuses the same StatusConfirmModal used above — `interviewStatusModal.action`
     is one of: "completed" | "no_show" | "not_conducted" | "cancelled". */
  const [interviewStatusModal, setInterviewStatusModal] = useState({
    open: false,
    action: null,
    interviewId: null,
  });
  // Optimistic local overrides so the Timeline UI reflects the new outcome
  // immediately, keyed by interview_id. Cleared automatically once the
  // backend timeline query refetches with the real stage (RTK Query tag
  // invalidation on the mutation should trigger that refetch).
  const [interviewStatusOverrides, setInterviewStatusOverrides] = useState({});

  // Once a round is "completed", a Pass/Fail result can be recorded
  // against it via useUpdateInterviewResultMutation. Same optimistic-
  // override pattern as interviewStatusOverrides above, keyed by
  // interview_id, storing "pass" | "fail".
  const [interviewResultOverrides, setInterviewResultOverrides] = useState({});

  const handleOpenInterviewStatusModal = (interviewId, action) => {
    setStatusModal({
      open: true,
      action,
    });

    setInterviewStatusModal({
      open: true,
      action,
      interviewId,
    });
  };

  const handleConfirmInterviewStatus = async (comment) => {
    const { interviewId, action } = interviewStatusModal;
    if (!interviewId || !action) return;
    try {
      await updateCandidateStatus({
        candidateId: matched_candidate_id,
        newStatus: action, // "completed" | "no_show" | "not_conducted" | "cancelled"
        reason: comment || undefined,
      }).unwrap();

      setInterviewStatusOverrides((prev) => ({ ...prev, [interviewId]: action }));
      setInterviewStatusModal({ open: false, action: null, interviewId: null });
      setSnackbar({
        open: true,
        message: `Interview marked as ${STATUS_DISPLAY[action]?.label ?? action}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Interview status update failed:", err);
      setSnackbar({
        open: true,
        message: err?.data?.message || "Failed to update interview status",
        severity: "error",
      });
    }
  };

  /* ── Interview result flow (Pass / Fail — Timeline tab, "completed" rounds) ──
     Wired to PUT /acc/interviews/{interviewId}/status_v1?result=pass|fail
     via useUpdateInterviewResultMutation. On success we optimistically
     store the result locally so the round's badge flips to
     "Completed (PASS)" / "Completed (FAIL)" immediately; the mutation's
     invalidatesTags (CandidateTimeline / CandidateDetail) will refetch
     the real data in the background. */
  const handleUpdateInterviewResult = async (interviewId, result) => {
    try {
      await updateInterviewResult({ interviewId, result, candidateId: matched_candidate_id }).unwrap();

      setInterviewResultOverrides((prev) => ({ ...prev, [interviewId]: result }));

      setSnackbar({
        open: true,
        message: `Interview marked as ${result === "pass" ? "Passed" : "Failed"}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Interview result update failed:", err);
      setSnackbar({
        open: true,
        message: err?.data?.message || "Failed to update interview result",
        severity: "error",
      });
    }
  };

  /* ── View Feedback flow ── */
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackInterview, setFeedbackInterview] = useState(null); // full interview details (names/skill buckets)
  const [feedbackItems, setFeedbackItems] = useState(null); // raw feedback API `data` array
  const [getInterviewFeedback, { isFetching: isFetchingFeedback }] =
    useLazyGetInterviewFeedbackQuery();

  const handleViewFeedback = async (interviewId) => {
    setFeedbackModalOpen(true);
    setFeedbackInterview(null);
    setFeedbackItems(null);
    try {
      const [detailsRes, feedbackRes] = await Promise.all([
        getInterviewFullDetails(interviewId).unwrap(),
        getInterviewFeedback(interviewId).unwrap(),
      ]);
      setFeedbackInterview(detailsRes.data);
      setFeedbackItems(feedbackRes.data ?? []);
    } catch (err) {
      console.error("Failed to load interview feedback:", err);
      setFeedbackModalOpen(false);
      setSnackbar({
        open: true,
        message: "Failed to load interview feedback",
        severity: "error",
      });
    }
  };
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null); // { interviewId, loading, ...savedInterviewFields }
  const [rescheduleInterview, { isLoading: reschedulingInterview }] =
    useRescheduleInterviewMutation();
  const handleRescheduleClick = (interviewId) => {
    const savedPayload = scheduledInterviewData[interviewId];

    if (savedPayload) {
      setRescheduleModalOpen(true);
      setRescheduleTarget({ interviewId, loading: false, ...savedPayload });
      return;
    }

    setRescheduleModalOpen(true);
    setRescheduleTarget({ interviewId, loading: true });

    getInterviewFullDetails(interviewId)
      .unwrap()
      .then((response) => {
        setRescheduleTarget({ interviewId, loading: false, ...response.data });
      })
      .catch((err) => {
        console.error("Failed to fetch interview details for reschedule:", err);
        setRescheduleTarget({ interviewId, loading: false });
        setSnackbar({
          open: true,
          message: "Couldn't load saved interview details — please re-enter them.",
          severity: "info",
        });
      });
  };
  const handleConfirmReschedule = async ({ interviewId, ...payload }) => {
    try {
      await rescheduleInterview({
        interviewId,
        candidateId: matched_candidate_id,
        body: payload,
      }).unwrap();

      setScheduledInterviewData((prev) => ({
        ...prev,
        [interviewId]: payload,
      }));

      // payload.date / payload.start_time are already UTC (see basePayload
      // in ScheduleInterviewModal — start.utc().format(...)), so this
      // composes a correct UTC ISO instant for the new slot.
      setInterviewTimeOverrides((prev) => ({
        ...prev,
        [interviewId]: {
          interview_time: `${payload.date}T${payload.start_time}Z`,
          duration_minutes: payload.duration,
        },
      }));

      setRescheduleModalOpen(false);
      setRescheduleTarget(null);
      setInterviewStatusOverrides((prev) => {
        const next = { ...prev };
        delete next[interviewId];
        return next;
      });
      setInterviewResultOverrides((prev) => {
        const next = { ...prev };
        delete next[interviewId];
        return next;
      });
      setSnackbar({ open: true, message: "Interview rescheduled successfully", severity: "success" });
    } catch (err) {
      console.error("Reschedule failed:", err);
      setSnackbar({ open: true, message: err?.data?.message || "Failed to reschedule interview", severity: "error" });
    }
  };

  /* ── Derived counts / conditional tabs (computed early so they can be
     used both for the snackbar/tab-switch logic and the render below) ── */
  const certCount = enriched?.certifications?.length ?? 0;
  const hasSkillIntel =
    (enriched?.score_intel ?? []).length > 0 ||
    enriched?.skill_info?.[0]?.summary ||
    Object.keys(enriched?.skill_notes ?? {}).length > 0;

  const tabIndices = useMemo(() => {
    let idx = 0;
    const EXP = idx++;
    const EDU = idx++;
    const SKILLS = idx++;
    const CERT = certCount > 0 ? idx++ : -1;
    const INTEL = hasSkillIntel ? idx++ : -1;
    const TIMELINE = idx++;
    const INTERVIEWS = idx++;
    const DOCUMENTS = idx++;
    return { EXP, EDU, SKILLS, CERT, INTEL, TIMELINE, INTERVIEWS, DOCUMENTS };
  }, [certCount, hasSkillIntel]);

  /* ── Toast (Schedule Interview / Reschedule / Status update success/error) ── */
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  /* ── Schedule Interview flow ── */
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleInterview, { isLoading: schedulingInterview }] =
    useScheduleInterviewInCandidatesMutation();
  const [scheduledInterviewData, setScheduledInterviewData] = useState({});
  const handleScheduleInterview = async (payload) => {
    try {
      const response = await scheduleInterview(payload).unwrap();
      const newInterviewId = response?.data?.interview_id ?? response?.interview_id;
      if (newInterviewId) {
        setScheduledInterviewData((prev) => ({
          ...prev,
          [newInterviewId]: payload,
        }));
      }

      setScheduleModalOpen(false);
      setSnackbar({
        open: true,
        message: "Interview scheduled successfully",
        severity: "success",
      });
      setActiveTab(tabIndices.TIMELINE);
    } catch (err) {
      console.error("Schedule interview failed:", err);
      setSnackbar({
        open: true,
        message: err?.data?.message || "Failed to schedule interview",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    const labels = {};
    if (location.state?.orgName) labels.orgId = location.state.orgName;
    if (location.state?.jobTitle) labels.jobId = location.state.jobTitle;
    if (enriched?.full_name) labels.candidateId = enriched.full_name;
    if (Object.keys(labels).length) dispatch(setDynamicLabels(labels));
    return () => dispatch(clearDynamicLabels());
  }, [enriched?.full_name, location.state?.orgName, location.state?.jobTitle]);

  const [getResumeView] = useLazyGetResumeViewQuery();
  const viewResume = async (candidateId) => {
    try {
      const res = await getResumeView(candidateId).unwrap();

      const url = res?.resume_url;

      if (url) {
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Resume fetch failed:", error);
    }
  };

  useEffect(() => {
    if (candidate?.full_name) {
      dispatch(setDynamicLabels({ candidateId: candidate.full_name }));
    }
  }, [candidate]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );
  }

  if (isError || !enriched) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Failed to load candidate: {error?.data?.message || "Unknown error"}
      </Alert>
    );
  }

  // ── Derived counts for tab labels ──
  const expCount = enriched.employment?.length ?? 0;
  const eduCount = enriched.education?.length ?? 0;
  const skillCount = (enriched.skill_info?.[0]?.key_skills ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean).length;

  // ── Total experience string ──
  const totalExp =
    enriched.total_experience ?? enriched.employment?.[0]?.duration ?? null;

  return (
    <Box sx={{ p: 1, backgroundColor: "#fff" }}>
      {/* ── Page header card ── */}
      <Box
        sx={{
          border: `0.5px solid ${C.border}`,
          borderRadius: "14px",
          backgroundColor: "#fff",
          mb: "16px",
          overflow: "hidden",
        }}
      >
        {/* Top row: back + avatar + name/title + right meta */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            p: "16px 20px 12px",
            width: "100%",
          }}
        >
          {/* Back button */}
          <Box
            onClick={() => {
              if (location.state?.orgId && location.state?.jobId == null) {
                navigate(`/account-manager/org/${location.state.orgId}`, {
                  state: { activeTab: location.state?.previousTab ?? 2 },
                });
                return;
              }
              if (location.state?.orgId && location.state?.jobId) {
                navigate(
                  `/account-manager/org/${location.state.orgId}/requisitions/${location.state.jobId}`,
                  {
                    state: {
                      activeReqTab: 1,
                      previousTab: location.state?.previousTab ?? 1,
                    },
                  },
                );
                return;
              }
              navigate(-1);
            }}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `0.5px solid ${C.border}`,
              backgroundColor: "#F9FAFB",
              cursor: "pointer",
              flexShrink: 0,
              mt: "4px",
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16, color: C.textSecondary }} />
          </Box>

          {/* Avatar */}
          <Avatar
            sx={{
              width: 54,
              height: 54,
              backgroundColor: C.accent,
              fontSize: 18,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {enriched.full_name
              ?.split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </Avatar>

          {/* Name + title block */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.textPrimary,
                  lineHeight: 1.2,
                }}
              >
                {enriched.full_name}
              </Typography>
              <DescriptionOutlinedIcon
                onClick={() => {
                  viewResume(enriched.id);
                }}
                sx={{
                  fontSize: 14,
                  color: "#FF5F1F",
                  ml: 0,
                  cursor: "pointer",
                }}
              />
              {enriched.status && (
                <Box
                  sx={{
                    px: "8px",
                    py: "2px",
                    borderRadius: "999px",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor:
                      enriched.status === "active"
                        ? "#DCFCE7"
                        : enriched.status === "inactive"
                          ? "#F3F4F6"
                          : "#FEF3C7",
                    color:
                      enriched.status === "active"
                        ? "#16A34A"
                        : enriched.status === "inactive"
                          ? "#6B7280"
                          : "#D97706",
                  }}
                >
                  {enriched.status}
                </Box>
              )}
              <Tooltip title="View Full Profile">

                <Person2OutlinedIcon sx={{ fontSize: 16, color: "#FF5722", cursor: "pointer" }} onClick={() => {
                  navigate(`/account-manager/candidates/${candidate?.id}`)
                }} />
              </Tooltip>
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: "3px",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                {enriched.employment?.[0]?.job_title}
              </Typography>
              <Typography sx={{ fontSize: 13, color: C.textSecondary }}>
                {" . "}
              </Typography>
              <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                {enriched.employment[0].company_name}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>

              <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <EmailOutlined sx={{ fontSize: 13, color: "#9CA3AF" }} />
                <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                  {enriched.email}
                </Typography>
              </Box>
              {enriched.clin_id && (
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 11,
                    color: "#000",
                    fontWeight: 500,
                    ml: 1
                  }}
                >
                  CLIN{enriched.clin_id}

                </Typography>
              )}
            </Box>
          </Box>

          {/* Right meta block — email, experience, phone */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              flexShrink: 0,
              alignItems: "flex-end",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {totalExp && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    border: `1px solid ${C.border}`,
                    borderRadius: "8px",
                    px: "10px",
                    py: "5px",
                    backgroundColor: "#FAFAFA",
                  }}
                >
                  <AccessTimeOutlined sx={{ fontSize: 13, color: "#9CA3AF" }} />
                  <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                    {totalExp}
                  </Typography>
                </Box>
              )}
              {enriched.phone && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    border: `1px solid ${C.border}`,
                    borderRadius: "8px",
                    px: "10px",
                    py: "5px",
                    backgroundColor: "#FAFAFA",
                  }}
                >
                  <PhoneOutlined sx={{ fontSize: 13, color: "#9CA3AF" }} />
                  <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
                    {enriched.phone}
                  </Typography>
                </Box>
              )}
            </Box>
            {enriched.skill_info?.[0]?.skillintel_score != null && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  color: C.accent,
                  backgroundColor: C.accentSoft,
                  border: "0.5px solid #FFCFB3",
                  borderRadius: "999px",
                  px: "10px",
                  py: "4px",
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 15, color: C.accent }} />
                <Typography
                  sx={{ fontSize: 12, fontWeight: 700, color: C.accent }}
                >
                  Skill Intel {enriched.skill_info[0].skillintel_score}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Tab bar (inside header card, matching image) ── */}
      </Box>

      {/* ── Tab content ── */}
      {(() => {
        const { EXP, EDU, SKILLS, CERT, INTEL, TIMELINE, INTERVIEWS, DOCUMENTS } = tabIndices;

        return (
          <Box
            sx={{
              border: `0.5px solid ${C.border}`,
              borderRadius: "14px",
              backgroundColor: "#fff",
              p: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Tabs row + action buttons (Shortlist/Reject, Interview/Select/Reject,
                Release Offer, or Revoke/Offer Accepted/Offer Rejected) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: "20px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{
                  ...TAB_SX,
                  mb: 0,
                  px: 0,
                  "& .MuiTabs-indicator": {
                    backgroundColor: C.accent,
                    height: 2,
                    bottom: 0,
                  },
                }}
              >
                <Tab
                  icon={<WorkOutlineOutlined sx={{ fontSize: 14 }} />}
                  iconPosition="start"
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      Experience{" "}
                      {expCount > 0 && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor:
                              activeTab === 0 ? C.accent : "#E5E7EB",
                            color: activeTab === 0 ? "#fff" : "#6B7280",
                            borderRadius: "999px",
                            px: "6px",
                            py: "1px",
                            lineHeight: 1.6,
                          }}
                        >
                          {expCount}
                        </Box>
                      )}
                    </Box>
                  }
                />
                <Tab
                  icon={<SchoolOutlinedIcon sx={{ fontSize: 14 }} />}
                  iconPosition="start"
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      Education{" "}
                      {eduCount > 0 && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor:
                              activeTab === 1 ? C.accent : "#E5E7EB",
                            color: activeTab === 1 ? "#fff" : "#6B7280",
                            borderRadius: "999px",
                            px: "6px",
                            py: "1px",
                            lineHeight: 1.6,
                          }}
                        >
                          {eduCount}
                        </Box>
                      )}
                    </Box>
                  }
                />
                <Tab
                  icon={<PsychologyOutlinedIcon sx={{ fontSize: 14 }} />}
                  iconPosition="start"
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                    >
                      Skills{" "}
                      {skillCount > 0 && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor:
                              activeTab === 2 ? C.accent : "#E5E7EB",
                            color: activeTab === 2 ? "#fff" : "#6B7280",
                            borderRadius: "999px",
                            px: "6px",
                            py: "1px",
                            lineHeight: 1.6,
                          }}
                        >
                          {skillCount}
                        </Box>
                      )}
                    </Box>
                  }
                />
                {certCount > 0 && (
                  <Tab
                    icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: 14 }} />}
                    iconPosition="start"
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: "5px" }}
                      >
                        Certifications{" "}
                        <Box
                          component="span"
                          sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor:
                              activeTab === 3 ? C.accent : "#E5E7EB",
                            color: activeTab === 3 ? "#fff" : "#6B7280",
                            borderRadius: "999px",
                            px: "6px",
                            py: "1px",
                            lineHeight: 1.6,
                          }}
                        >
                          {certCount}
                        </Box>
                      </Box>
                    }
                  />
                )}
                {hasSkillIntel && (
                  <Tab
                    icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                    iconPosition="start"
                    label="Skill Intel"
                  />
                )}
                <Tab
                  icon={<TrendingUpIcon sx={{ fontSize: 14 }} />}
                  iconPosition="start"
                  label="Timeline"
                />
                {/* <Tab icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Interviews" />
              <Tab icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Documents" /> */}
              </Tabs>

              {/* Shortlist/Reject, Interview/Select/Reject, Release Offer, or
                  Revoke/Accepted/Rejected offer buttons — driven by candidate status */}
              <CandidateActionButtons
                status={enriched.status}
                onShortlist={() =>
                  setStatusModal({ open: true, action: "shortlisted" })
                }
                onReject={() =>
                  setStatusModal({ open: true, action: "rejected" })
                }
                onInterview={() => setScheduleModalOpen(true)}
                onSelect={() =>
                  setStatusModal({ open: true, action: "selected" })
                }
                onReleaseOffer={() =>
                  setStatusModal({ open: true, action: "offer_released" })
                }
                onRevokeOffer={() =>
                  setStatusModal({ open: true, action: "offer_revoked" })
                }
                onOfferAccepted={() =>
                  setStatusModal({ open: true, action: "offer_accepted" })
                }
                onOfferRejected={() =>
                  setStatusModal({ open: true, action: "offer_rejected" })
                }
              />
            </Box>

            <Box sx={{ mt: -1 }}>
              {activeTab === EXP && <ExperienceTab candidate={enriched} />}
              {activeTab === EDU && <EducationTab candidate={enriched} />}
              {activeTab === SKILLS && (
                <SkillsTab candidate={enriched} showCerts={false} />
              )}
              {CERT !== -1 && activeTab === CERT && (
                <SkillsTab candidate={enriched} />
              )}
              {INTEL !== -1 && activeTab === INTEL && (
                <SkillIntelTab candidate={enriched} />
              )}
              {activeTab === TIMELINE && (
                <TimelineTab
                  candidate={enriched}
                  onInterviewClick={handleInterviewDetails}
                  onUpdateInterviewStatus={handleOpenInterviewStatusModal}
                  onRescheduleInterview={handleRescheduleClick}
                  onUpdateInterviewResult={handleUpdateInterviewResult}
                  onViewFeedback={handleViewFeedback}
                  interviewStatusOverrides={interviewStatusOverrides}
                  interviewResultOverrides={interviewResultOverrides}
                  interviewTimeOverrides={interviewTimeOverrides}
                />
              )}
              {/* {activeTab === INTERVIEWS && <InterviewsTab candidate={enriched} />}
            {activeTab === DOCUMENTS && <DocumentsTab candidate={enriched} />} */}
            </Box>
          </Box>
        );
      })()}

      {/* ── Interview details Dialog (redesigned) ── */}
      <InterviewDetailsModal
        open={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        selectedInterview={selectedInterview}
        isFetching={isFetching}
        onEdit={handleEditFromDetails}
      />
      <InterviewFeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        interview={feedbackInterview}
        feedbackItems={feedbackItems}
        isFetching={isFetchingFeedback}
      />
      {/* ── Shortlist / Reject / Select / Offer confirmation modal (shared) ── */}
      <StatusConfirmModal
        open={statusModal.open}
        action={statusModal.action}
        onClose={() =>
          !statusUpdating && setStatusModal({ open: false, action: null })
        }
        onConfirm={handleConfirmStatus}
        loading={statusUpdating}
      />

      {/* ── Schedule Interview modal (fresh schedule — always starts blank) ── */}
      <ScheduleInterviewModal
        open={scheduleModalOpen}
        candidate={enriched}
        allSkillOptions={allSkillOptions}
        onClose={() => !schedulingInterview && setScheduleModalOpen(false)}
        onSchedule={handleScheduleInterview}
        loading={schedulingInterview}
        orgId={orgId}
        matched_candidate_id={matched_candidate_id}
        isReschedule={false}
      />

      {/* ── Reschedule Interview modal (same UI, prefilled with the
          interview's saved values, submits through rescheduleInterview
          keyed by interviewId) ── */}
      <ScheduleInterviewModal
        open={rescheduleModalOpen}
        candidate={enriched}
        allSkillOptions={allSkillOptions}
        onClose={() => {
          if (reschedulingInterview) return;
          setRescheduleModalOpen(false);
          setRescheduleTarget(null);
        }}
        onSchedule={handleConfirmReschedule}
        loading={reschedulingInterview}
        orgId={orgId}
        matched_candidate_id={matched_candidate_id}
        isReschedule={true}
        interviewId={rescheduleTarget?.interviewId}
        initialData={rescheduleTarget}
      />

      {/* ── Snackbar (Schedule / Reschedule / Status update / Interview outcome) ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((t) => ({ ...t, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
```

---

## File: pages/OrgCandidates/JobMatchedCandidates.jsx

```javascript
// src/pages/OrgCandidates/JobMatchedCandidates.jsx
import React, { useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Typography, CircularProgress, Avatar, Divider } from "@mui/material";
import EmailOutlinedIcon       from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon       from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon  from "@mui/icons-material/AccessTimeOutlined";
import WorkOutlineRoundedIcon  from "@mui/icons-material/WorkOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PeopleAltOutlinedIcon   from "@mui/icons-material/PeopleAltOutlined";

import { useGetJobMatchedCandidatesQuery } from "../../redux/services/requisition/requisition";
import { clearDynamicLabels, setDynamicLabels } from "../../redux/slices/breadcrumbSlice";
import { useDispatch } from "react-redux";
// import { BreadcrumbContext } from "../../layout/Drawer";

// ─── Design tokens ────────────────────────────────────────────
const C = {
  accent:      "#FF5F1F", accentSoft: "#FFF0E8",
  green:       "#0F6E56", greenSoft:  "#E7F8EE",
  indigo:      "#4338CA", indigoSoft: "#EEF2FF",
  amber:       "#92400E", amberSoft:  "#FEF3C7",
  border:      "#E8E8EC",
  textPrimary: "#111118", textSecondary: "#5C5C70", textTertiary: "#9696A6",
};

function initials(name = "") {
  return name.trim().split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function scoreStyle(s) {
  if (s >= 90) return { bg: C.greenSoft,  color: C.green,  label: "Excellent" };
  if (s >= 70) return { bg: C.accentSoft, color: C.accent, label: "Good"      };
  return             { bg: C.amberSoft,  color: C.amber,  label: "Fair"      };
}

function stageChip(stage = "") {
  const key = stage.toLowerCase().replace(/_/g, " ");
  const MAP = {
    matched:             { bg: C.indigoSoft, color: C.indigo  },
    shortlisted:         { bg: C.amberSoft,  color: C.amber   },
    interviewing:        { bg: C.accentSoft, color: C.accent  },
    "interview scheduled":{ bg: C.accentSoft,color: C.accent  },
    "interview completed":{ bg: C.greenSoft, color: C.green   },
    selected:            { bg: C.greenSoft,  color: C.green   },
    hired:               { bg: C.greenSoft,  color: C.green   },
    rejected:            { bg: "#FEE2E2",    color: "#B91C1C" },
    "offer revoked":     { bg: "#FEE2E2",    color: "#B91C1C" },
  };
  return MAP[key] ?? { bg: "#F3F4F6", color: "#6B7280" };
}

// ─────────────────────────────────────────────────────────────
// Stat box
// ─────────────────────────────────────────────────────────────
function StatBox({ value, label, bg, color }) {
  return (
    <Box sx={{
      backgroundColor: bg, border: `1px solid ${color}22`,
      borderRadius: "10px", px: "16px", py: "12px",
    }}>
      <Typography sx={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ fontSize: 11, color: C.textSecondary, mt: "3px" }}>{label}</Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// Candidate Card
// ─────────────────────────────────────────────────────────────
function CandidateCard({ candidate, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  const score = candidate.match_score ?? 0;
  const sc    = scoreStyle(score);
  const stage = stageChip(candidate.current_stage);
  const avail = candidate.availability === 0 ? "Immediate" : `${candidate.availability} days`;

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      sx={{
        backgroundColor: "#fff",
        border:        `1.5px solid ${hovered ? C.accent : C.border}`,
        borderRadius:  "14px",
        p:             "18px",
        cursor:        "pointer",
        height:        "100%",
        display:       "flex",
        flexDirection: "column",
        gap:           "14px",
        transition:    "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
        boxShadow:     hovered
          ? "0 0 0 4px rgba(255,95,31,0.08), 0 4px 16px rgba(0,0,0,0.08)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Avatar + Name + Stage */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Avatar sx={{
          width: 44, height: 44, borderRadius: "11px",
          backgroundColor: hovered ? C.accent : C.accentSoft,
          color: hovered ? "#fff" : C.accent,
          fontSize: 15, fontWeight: 700, flexShrink: 0,
          transition: "background-color 0.15s, color 0.15s",
        }}>
          {initials(candidate.full_name)}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{
            fontSize: 14, fontWeight: 700, color: C.textPrimary,
            lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {candidate.full_name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: C.textTertiary, mt: "2px", fontFamily: "monospace" }}>
            {candidate.clin_id}
          </Typography>
        </Box>

        {/* Stage pill */}
        <Box component="span" sx={{
          fontSize: 9, fontWeight: 700, px: "7px", py: "3px",
          borderRadius: "20px", backgroundColor: stage.bg, color: stage.color,
          textTransform: "uppercase", letterSpacing: "0.05em",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {(candidate.current_stage ?? "").replace(/_/g, " ")}
        </Box>
      </Box>

      {/* Match score */}
      <Box sx={{
        backgroundColor: sc.bg, borderRadius: "10px",
        px: "14px", py: "10px", border: `1px solid ${sc.color}22`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box>
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: sc.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Match Score
          </Typography>
          <Typography sx={{ fontSize: 11, color: C.textSecondary, mt: "1px" }}>{sc.label}</Typography>
        </Box>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color: sc.color, lineHeight: 1 }}>
          {score}<Box component="span" sx={{ fontSize: 14, fontWeight: 600 }}>%</Box>
        </Typography>
      </Box>

      <Divider sx={{ borderColor: C.border }} />

      {/* Info rows */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {[
          { Icon: WorkOutlineRoundedIcon, value: candidate.total_experience },
          { Icon: EmailOutlinedIcon,      value: candidate.email,        truncate: true },
          { Icon: PhoneOutlinedIcon,      value: candidate.phone_number  },
          { Icon: AccessTimeOutlinedIcon, value: `Available: ${avail}`   },
        ].map(({ Icon, value, truncate }, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon sx={{ fontSize: 13, color: C.textTertiary, flexShrink: 0 }} />
            <Typography sx={{
              fontSize: 12, color: C.textSecondary,
              ...(truncate ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } : {}),
            }}>
              {value ?? "—"}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* CTA */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mt: "auto", pt: "2px" }}>
        <Typography sx={{
          fontSize: 10.5, fontWeight: 700,
          color: hovered ? C.accent : C.textTertiary,
          textTransform: "uppercase", letterSpacing: "0.06em",
          transition: "color 0.15s",
        }}>
          View Profile &amp; Timeline
        </Typography>
        <ArrowForwardRoundedIcon sx={{
          fontSize: 12, color: hovered ? C.accent : C.textTertiary,
          transition: "color 0.15s, transform 0.15s",
          transform: hovered ? "translateX(4px)" : "none",
        }} />
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <Box sx={{ textAlign: "center", py: 12, backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px" }}>
      <PeopleAltOutlinedIcon sx={{ fontSize: 44, color: C.textTertiary, mb: 1.5 }} />
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>No matched candidates</Typography>
      <Typography sx={{ fontSize: 13, color: C.textSecondary, mt: 0.5 }}>No candidates have been matched to this requisition yet.</Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function JobMatchedCandidates() {
  const { jobId, orgId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
//   const { setDynamicLabels } = useContext(BreadcrumbContext);

  const { data, isLoading, isError } = useGetJobMatchedCandidatesQuery(jobId);
  const candidates = data?.data ?? [];

  const orgName  = location.state?.orgName  ?? data?.organisation_name ?? null;
  const jobTitle = location.state?.jobTitle ?? data?.job_title         ?? null;

const dispatch = useDispatch();

useEffect(() => {
  const labels = {};

  if (orgName)  labels.orgId = orgName;
  if (jobTitle) labels.jobId = jobTitle;

  if (Object.keys(labels).length) {
    dispatch(setDynamicLabels(labels));
  }

  return () => {
    dispatch(clearDynamicLabels());
  };
}, [orgName, jobTitle, dispatch]);

  // Summary stats
  const perfect   = candidates.filter(c => c.match_score === 100).length;
  const immediate = candidates.filter(c => c.availability === 0).length;
  const avgScore  = candidates.length
    ? Math.round(candidates.reduce((s, c) => s + (c.match_score ?? 0), 0) / candidates.length)
    : 0;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3, backgroundColor: "#FEE2E2", borderRadius: "10px", border: "1px solid #FECACA" }}>
        <Typography sx={{ fontSize: 13, color: "#B91C1C" }}>Failed to load candidates. Please try again.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: 1.2 }}>
            Matched Candidates
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
            <Typography sx={{ fontSize: 13, color: C.textSecondary }}>
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} matched
            </Typography>
            {jobTitle && (
              <Box component="span" sx={{
                fontSize: 10.5, fontWeight: 600, px: "8px", py: "2px",
                borderRadius: "20px", backgroundColor: C.accentSoft,
                color: C.accent, fontFamily: "monospace",
              }}>
                {jobTitle}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      {candidates.length > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid item size={{xs:6,sm:3}}>
            <StatBox value={candidates.length} label="Total Matched"      bg="#F0F4FF"    color={C.indigo} />
          </Grid>
          <Grid item size={{xs:6,sm:3}}>
            <StatBox value={perfect}           label="Perfect Match"      bg={C.greenSoft} color={C.green}  />
          </Grid>
          <Grid item size={{xs:6,sm:3}}>
            <StatBox value={immediate}         label="Immediate Joiners"  bg={C.accentSoft} color={C.accent} />
          </Grid>
          <Grid item size={{xs:6,sm:3}}>
            <StatBox value={`${avgScore}%`}    label="Avg Match Score"    bg={C.amberSoft} color={C.amber}  />
          </Grid>
        </Grid>
      )}

      {/* Cards */}
      {candidates.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={2}>
          {candidates.map((c) => (
            <Grid item size={{xs:12,sm:6,md:4}} key={c.matched_candidate_id} sx={{ display: "flex" }}>
              <CandidateCard
                candidate={c}
                onClick={() =>
                  // ✅ Uses matched_candidate_id to match your App.js route:
                  // org/:orgId/requisitions/:jobId/candidates/:candidateId
                  navigate(
                    `/account-manager/org/${orgId}/requisitions/${jobId}/candidates/${c.matched_candidate_id}`,
                    { state: { orgName, jobTitle } }
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
```

---

## File: pages/OrgCandidates/index.jsx

```javascript
// src/pages/Organizations/OrgCandidates.jsx

import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // 👈 add useLocation
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux"; // 👈 add
import { setDynamicLabels } from "../../redux/slices/breadcrumbSlice"; // 👈 add

import { useGetJobMatchedCandidatesQuery } from "../../redux/services/requisition/requisition";

export default function OrgCandidates() {
  const { orgId, jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 add
  const dispatch = useDispatch(); // 👈 add

  const { data, isLoading, isError, error } =
    useGetJobMatchedCandidatesQuery(jobId);

  const candidates = data?.data ?? [];

  // ✅ Read from router state first (passed from OrgRequisitions navigate call)
  const jobTitle = location.state?.jobTitle ?? candidates[0]?.job_title ?? null;
  const orgName =
    location.state?.orgName ?? candidates[0]?.organisation_name ?? null;

  useEffect(() => {
    const labels = {};
    if (orgName) labels.orgId = orgName;
    if (jobTitle) labels.jobId = jobTitle;
    if (Object.keys(labels).length) dispatch(setDynamicLabels(labels)); // 👈 no cleanup — preserve for candidate page
  }, [orgName, jobTitle]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#FF5F1F" }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Failed to load candidates: {error?.data?.message || "Unknown error"}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 1, backgroundColor: "#fff" }}>
      {/* ── Header ── */}
      <Typography variant="h5" fontWeight={600} mb={0.5}>
        Matched Candidates
      </Typography>
      {jobTitle && (
        <Typography fontSize={13} color="#9CA3AF" mb={3}>
          {jobTitle} · {candidates.length} candidate
          {candidates.length !== 1 ? "s" : ""} matched
        </Typography>
      )}

      {/* ── Fallback or Grid ── */}
      {candidates.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography fontSize={14} color="#9CA3AF">
            No matched candidates found for this job.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5} mt={2}>
          {candidates.map((candidate) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 3 }}
              key={candidate.matched_candidate_id}
            >
              <CandidateCard
                candidate={candidate}
                onView={() =>
                  navigate(
                    `/account-manager/candidate/${candidate.candidate_id}`, // ✅ use candidate_id not matched_candidate_id
                    {
                      state: {
                        jobTitle,
                        orgName,
                        previousTab: 2,
                      },
                    },
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

/* ─── Candidate Card ─────────────────────────────────────────── */
function CandidateCard({ candidate, onView }) {
  const [hovered, setHovered] = React.useState(false);

  const matchColor =
    candidate.match_score >= 80
      ? { bg: "#E7F8EE", color: "#0F6E56" }
      : candidate.match_score >= 60
        ? { bg: "#FFF8E1", color: "#B45309" }
        : { bg: "#FEE2E2", color: "#B91C1C" };

  const availabilityLabel =
    candidate.availability === 0
      ? "Immediate"
      : `${candidate.availability} days`;

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        height: "100%",
        borderRadius: "12px",
        border: `1px solid ${hovered ? "#FF5F1F" : "#E5E7EB"}`,
        boxShadow: hovered ? "0 0 0 3px rgba(255,95,31,0.07)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          p: "16px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Row 1: Avatar + Name + Match Score ── */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: "12px" }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              fontWeight: 700,
              fontSize: 16,
              bgcolor: "#FF5F1F",
              flexShrink: 0,
            }}
          >
            {candidate.full_name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {candidate.full_name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>
              {candidate.clin_id}
            </Typography>
          </Box>
          <Chip
            label={`${candidate.match_score}%`}
            size="small"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              height: 24,
              backgroundColor: matchColor.bg,
              color: matchColor.color,
              flexShrink: 0,
              "& .MuiChip-label": { px: "8px" },
            }}
          />
        </Box>

        <Divider sx={{ mb: "12px" }} />

        {/* ── Row 2: Stage + Availability ── */}
        <Grid container spacing={1} sx={{ mb: "12px" }}>
          <Grid size={{ xs: 6 }}>
            <Box
              sx={{ backgroundColor: "#F9FAFB", borderRadius: "8px", p: "8px" }}
            >
              <Typography sx={{ fontSize: 10, color: "#6B7280", mb: "2px" }}>
                Stage
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#111827",
                  textTransform: "capitalize",
                }}
              >
                {candidate.current_stage}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box
              sx={{ backgroundColor: "#F9FAFB", borderRadius: "8px", p: "8px" }}
            >
              <Typography sx={{ fontSize: 10, color: "#6B7280", mb: "2px" }}>
                Availability
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: candidate.availability === 0 ? "#0F6E56" : "#111827",
                }}
              >
                {availabilityLabel}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* ── Row 3–5: Experience, Email, Phone ── */}
        {[
          { label: "Experience", value: candidate.total_experience },
          { label: "Email", value: candidate.email },
          { label: "Phone", value: candidate.phone_number },
        ].map(({ label, value }) => (
          <Box
            key={label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "6px",
            }}
          >
            <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
              {label}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: label === "Experience" ? 600 : 500,
                color: "#111827",
                maxWidth: "60%",
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}

        {/* ── Footer: View Button ── */}
        <Box sx={{ mt: "auto", pt: "6px" }}>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={onView}
            sx={{
              borderColor: "#FF5F1F",
              color: "#FF5F1F",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              fontSize: 12,
              "&:hover": { backgroundColor: "#FFF0E8", borderColor: "#FF5F1F" },
            }}
          >
            View Profile &amp; Timeline
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

```

---

## File: pages/OrgRequisitions/ReqCandidatesTab.jsx

```javascript
// src/pages/RequisitionDetail/ReqCandidatesTab.jsx

import React from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useGetMatchedCandidatesQuery } from "../../redux/services/requisition/requisition";
import { useNavigate } from "react-router-dom";

export default function ReqCandidatesTab({ jobId, orgId }) {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } =
    useGetMatchedCandidatesQuery(jobId);

  const candidates = data?.data || [];

  if (isLoading) {
    return (
      <Box textAlign="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.data?.message || "Failed to load candidates"}
      </Alert>
    );
  }

  if (candidates.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography>No matched candidates found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {candidates.map((c) => (
        <Box
          key={c.candidate_id}
          sx={{
            p: 2,
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(`/account-manager/candidate/${c.candidate_id}`, {
              state: {
                orgName: "",
                jobTitle: "",
              },
            })
          }
        >
          <Typography fontWeight={600}>{c.full_name}</Typography>
          <Typography fontSize={12} color="#6B7280">
            {c.email}
          </Typography>
          <Typography fontSize={12}>
            Experience: {c.total_experience}
          </Typography>
          <Typography fontSize={12}>
            Match Score: {c.match_score}%
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
```

---

## File: pages/OrgRequisitions/createJob/matchedCandidates/CandidateCard.jsx

```javascript
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { PersonOutlineOutlined } from "@mui/icons-material";

const truncate = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
  flex: 1,
};

const CandidateCard = ({ candidate, handleClick, index = 0, orgId }) => {
  const navigate = useNavigate();

  const gradients = [
    "linear-gradient(135deg,#F8FBFF,#EEF5FF)",
    "linear-gradient(135deg,#F0FDFA,#ECFDF5)",
    "linear-gradient(135deg,#FDF4FF,#FAF5FF)",
    "linear-gradient(135deg,#FFF7ED,#FFFBEB)",
    "linear-gradient(135deg,#F5F3FF,#EEF2FF)",
  ];

  const background = gradients[index % gradients.length];

  const formatAvailability = (val) => {
    if (!val && val !== 0) return "-";
    if (val === 0) return "Immediately available";
    return `Available in ${val} days`;
  };

  const formatExperience = (val) => (!val ? "-" : val);

  const statusColors = {
    matched: "#64748B",
    shortlisted: "#22C55E",
    rejected: "#EF4444",
    interviewing: "#F59E0B",
    selected: "#10B981",
    onboarded: "#3B82F6",
    pending: "#8B5CF6",
    revoked: "#DC2626",
    waitlisted: "#F97316",
  };

  const status = candidate?.status?.toLowerCase() || "matched";
  const showOpenRequisition = status !== "matched";

  const InfoRow = ({ icon, value, tooltipTitle }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", overflow: "hidden" }}>
      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", color: "#9CA3AF" }}>
        {icon}
      </Box>
      <Tooltip title={tooltipTitle ?? value ?? ""} placement="top" arrow disableHoverListener={!value}>
        <Typography sx={{ ...truncate, fontSize: 13, color: "#374151" }}>
          {value || "-"}
        </Typography>
      </Tooltip>
    </Box>
  );

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        background,
        overflow: "visible",
        position: "relative",
        boxShadow: "none",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        },
      }}
    >
      {/* Status Badge — small pill, top-left, like reference */}
      {candidate?.status && (
        <Chip
          label={candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          size="small"
          sx={{
            position: "absolute",
            top: -10,
            left: 14,
            background: statusColors[status] || "#64748B",
            color: "#fff",
            fontWeight: 600,
            fontSize: 11,
            borderRadius: "999px",
            height: 22,
            "& .MuiChip-label": { px: 1.2 },
            zIndex: 2,
          }}
        />
      )}

      {/* New Badge */}
      {candidate?.is_new && (
        <Chip
          label="NEW"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#16A34A",
            color: "#fff",
            fontWeight: 600,
            fontSize: 11,
            height: 20,
            zIndex: 2,
          }}
        />
      )}

      <CardContent sx={{ pt: 3.5, px: 2.25, pb: 2.25 }}>
        {/* Profile */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1 }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: "#F3F4F6", mb: 1 }}>
            <PersonOutlineOutlined sx={{ fontSize: 26, color: "#6B7280" }} />
          </Avatar>

          <Tooltip title={`CLIN${candidate?.clin_id}`} placement="top" arrow>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
                color: "#1E3A8A",
                maxWidth: "100%",
                ...truncate,
                flex: "unset",
                textAlign: "center",
              }}
            >
              CLIN{candidate?.clin_id}
            </Typography>
          </Tooltip>
        </Box>

        {/* SkillIntel Bar — slim, navy fill like reference (not big orange) */}
        <Box mb={1.5}>
          <Box sx={{ position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={candidate?.match_score || 0}
              sx={{
                height: 16,
                borderRadius: 999,
                backgroundColor: "#E5E7EB",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #F59E0B 0%, #FF5722 100%)",
                  borderRadius: 999,
                },
              }}
            />
            <Typography
              sx={{
                position: "absolute",
                width: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                textAlign: "center",
                color: "#fff",
                fontWeight: 600,
                fontSize: 10,
                pointerEvents: "none",
              }}
            >
              SkillIntel {candidate?.match_score || 0}%
            </Typography>
          </Box>
        </Box>

        {/* Candidate Details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 ,mt:1}}>
          <InfoRow
            icon={<CalendarTodayIcon sx={{ fontSize: 15 }} />}
            value={candidate?.designation || "-"}
          />
          <InfoRow
            icon={<WorkIcon sx={{ fontSize: 15 }} />}
            value={formatExperience(candidate?.total_experience)}
          />
          <InfoRow
            icon={<AccessTimeIcon sx={{ fontSize: 15 }} />}
            value={formatAvailability(candidate?.availability)}
          />
          <InfoRow
            icon={<LocationOnIcon sx={{ fontSize: 15 }} />}
            value={candidate?.location || "Not specified"}
          />
        </Box>

        {/* Skills */}
        {candidate?.skills?.length > 0 && (
          <Box mt={1.5} sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {candidate.skills.slice(0, 3).map((skill) => (
              <Tooltip key={skill} title={skill} placement="top" arrow>
                <Chip
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{
                    maxWidth: 90,
                    height: 22,
                    fontSize: 11,
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      px: 0.8,
                    },
                  }}
                />
              </Tooltip>
            ))}
            {candidate.skills.length > 3 && (
              <Tooltip
                title={candidate.skills.slice(3).join(", ")}
                placement="top"
                arrow
              >
                <Chip
                  label={`+${candidate.skills.length - 3} more`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: 11,
                    background: "#F3F4F6",
                    color: "#6B7280",
                    fontWeight: 600,
                    cursor: "default",
                  }}
                />
              </Tooltip>
            )}
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ mt: 1.5 }}>
          {showOpenRequisition && (
            <Button
              fullWidth
              variant="text"
              size="small"
              startIcon={<PersonAddAltIcon sx={{ fontSize: 16 }} />}
              onClick={() =>
                navigate(`/account-manager/org/${orgId}`, {
                  state: {
                    editMode: true,
                    requisitionId: candidate?.job_details_id,
                  },
                })
              }
              sx={{
                color: "#FF5722",
                fontWeight: 600,
                fontSize: 12,
                textTransform: "none",
                mb: 1,
                "&:hover": { background: "rgba(255,87,34,0.06)" },
              }}
            >
              Open Requisition
            </Button>
          )}

          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={handleClick}
            sx={{
              textTransform: "none",
              borderRadius: 1.5,
              background: "#FF5722",
              fontWeight: 600,
              fontSize: 13,
              py: 0.9,
              boxShadow: "none",
              "&:hover": { background: "#E64A19", boxShadow: "none" },
            }}
          >
            View Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
```

---

## File: pages/OrgRequisitions/createJob/matchedCandidates/index.jsx

```javascript
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import GridViewIcon from "@mui/icons-material/GridView";
import MapIcon from "@mui/icons-material/Map";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import EditIcon from "@mui/icons-material/Edit";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import CandidateCard from "./CandidateCard";
import { toast } from "react-toastify";
import { useLazyGetMatchedCandidateDetailsQuery } from "../../../../redux/services/createRequesition/createRequesition";

// ─── Constants ────────────────────────────────────────────────────────────────
const CARD_WIDTH = 280;
const CARD_GAP = 24;
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

// ─── Map auto-recenter on prop change ────────────────────────────────────────
const MapAutoCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

// ─── Simple geocode via Nominatim (cached) ────────────────────────────────────
const geocodeCache = {};
const geocodeCity = async (city) => {
  if (!city || city === "Not specified") return null;
  const key = city.trim().toLowerCase();
  if (geocodeCache[key]) return geocodeCache[key];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data?.length) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geocodeCache[key] = coords;
      return coords;
    }
  } catch {
    // silently fail
  }
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────
const MatchedCandidates = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("tile");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Map state
  const [assignedCandidates, setAssignedCandidates] = useState([]); // [{city, coords, candidates[]}]
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);    // default: India
  const [mapLoading, setMapLoading] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState(null);

  const sliderRef = useRef(null);

  const {
    candidates = [],
    orgEmpId,
    job_details_id,
    requisitionData,
    orgId,
  } = location.state || {};

  const validCandidates = candidates.filter((c) => c?.id);

  const [fetchCandidateDetails] = useLazyGetMatchedCandidateDetailsQuery();
  const [loadingId, setLoadingId] = useState(null);

  // ─── Geocode candidates whenever map mode is activated ────────────────────
  useEffect(() => {
    if (viewMode !== "map") return;

    const buildGroups = async () => {
      setMapLoading(true);

      // Group candidates by city
      const cityMap = {};
      for (const c of validCandidates) {
        const city = c.location || "Unknown";
        if (!cityMap[city]) cityMap[city] = [];
        cityMap[city].push(c);
      }

      // Geocode each unique city
      const groups = [];
      for (const [city, cands] of Object.entries(cityMap)) {
        const coords = await geocodeCity(city);
        if (coords) {
          groups.push({ city, coords, candidates: cands });
        }
      }

      setAssignedCandidates(groups);

      // Center map on first group
      if (groups.length > 0) setMapCenter(groups[0].coords);

      setMapLoading(false);
    };

    buildGroups();
  }, [viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Tile view handlers ────────────────────────────────────────────────────
  const handleViewProfile = async (candidate) => {
    setLoadingId(candidate.id);
    try {
      const result = await fetchCandidateDetails(candidate.id).unwrap();
      navigate("/account-manager/view-profile", {
        state: {
          profileResponse: result,
          job_details_id,
          status: candidate.status,
          list: validCandidates,
          orgId,
          orgEmpId,
          requisitionData,
          candidate,
        },
      });
    } catch {
      toast.error("Failed to load candidate profile.");
    } finally {
      setLoadingId(null);
    }
  };

  const hideEditButton = validCandidates.some(
    (c) =>
      c.status?.toLowerCase() === "shortlisted" ||
      c.status?.toLowerCase() === "rejected"
  );

  const syncArrows = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
    setTimeout(syncArrows, 350);
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
    setTimeout(syncArrows, 350);
  };

  const showArrows = validCandidates.length > 3;
  const centerCards = !showArrows;

  // ─── Marker icon factory ──────────────────────────────────────────────────
  const makeMarkerIcon = (city, count) =>
    L.divIcon({
      className: "",
      html: `
        <div style="
          display: flex;
          align-items: center;
          gap: 4px;
          color: #0288d1;
          font-size: 13px;
          font-weight: 700;
          background: rgba(255,255,255,0.95);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1.5px solid #0288d1;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#0288d1" height="16" viewBox="0 0 24 24" width="16">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          ${city} (${count})
        </div>
      `,
      iconAnchor: [0, 0],
    });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box p={3}>
      {/* ── Top Action Bar ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
        }}
      >
        {/* Tile / Map Toggle */}
        <Box
          sx={{
            display: "flex",
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Button
            startIcon={<GridViewIcon />}
            onClick={() => setViewMode("tile")}
            sx={{
              textTransform: "none",
              borderRadius: 0,
              px: 2,
              fontWeight: 600,
              background: viewMode === "tile" ? "#FF5722" : "#fff",
              color: viewMode === "tile" ? "#fff" : "#374151",
              "&:hover": { background: viewMode === "tile" ? "#FF5722" : "#F3F4F6" },
            }}
          >
            Tile
          </Button>
          <Button
            startIcon={<MapIcon />}
            onClick={() => setViewMode("map")}
            sx={{
              textTransform: "none",
              borderRadius: 0,
              px: 2,
              fontWeight: 600,
              borderLeft: "1px solid #E5E7EB",
              background: viewMode === "map" ? "#FF5722" : "#fff",
              color: viewMode === "map" ? "#fff" : "#374151",
              "&:hover": { background: viewMode === "map" ? "#FF5722" : "#F3F4F6" },
            }}
          >
            Map
          </Button>
        </Box>

        {/* Request Additional Candidates */}
        {/* <Button
          variant="outlined"
          startIcon={<PersonAddAltIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            borderColor: "#FF5722",
            color: "#FF5722",
            fontWeight: 600,
            "&:hover": { borderColor: "#FF5722", background: "#FFF3F0" },
          }}
        >
          Request Additional Candidates
        </Button> */}

        {/* Edit Job */}
        {!hideEditButton && (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() =>
              navigate("/account-manager/create-requisition", {
                state: {
                  editMode: true,
                  requisitionData,
                  orgId,
                  jobDetailsId: job_details_id,
                  fromMatchedCandidates: true,
                },
              })
            }
            sx={{
            textTransform: "none",
            borderRadius: 2,
            borderColor: "#FF5722",
            color: "#FF5722",
            fontWeight: 600,
            "&:hover": { borderColor: "#FF5722", background: "#FFF3F0" },
          }}
          >
            Edit Job
          </Button>
        )}
      </Box>

      {/* ── Empty State ── */}
      {validCandidates.length === 0 ? (
        <Typography>No matched candidates found.</Typography>
      ) : viewMode === "map" ? (
        /* ══════════════════════════════════════════════════════════════════
           MAP VIEW
        ══════════════════════════════════════════════════════════════════ */
        <Box
          sx={{
            width: "100%",
            height: "calc(100vh - 200px)",
            minHeight: 480,
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #E5E7EB",
          }}
        >
          {mapLoading ? (
            /* Loading spinner while geocoding */
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                background: "#F9FAFB",
                zIndex: 10,
              }}
            >
              <CircularProgress sx={{ color: "#FF5722" }} />
              <Typography sx={{ color: "#6B7280", fontSize: 14 }}>
                Locating candidates on map…
              </Typography>
            </Box>
          ) : assignedCandidates.length === 0 ? (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              No candidates with valid locations found.
            </Typography>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
              doubleClickZoom={false}
              boxZoom={false}
            >
              <MapAutoCenter center={mapCenter} />
              <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png" />

              {assignedCandidates.map((group, groupIndex) => (
                <Marker
                  key={groupIndex}
                  position={group.coords}
                  icon={makeMarkerIcon(group.city, group.candidates.length)}
                  eventHandlers={{
                    mouseover: () => setOpenTooltipId(groupIndex),
                    click: () =>
                      setOpenTooltipId((prev) =>
                        prev === groupIndex ? null : groupIndex
                      ),
                  }}
                >
                  {openTooltipId === groupIndex && (
                    <Tooltip
                      direction="left"
                      offset={[0, 20]}
                      opacity={1}
                      permanent
                      interactive
                      className="custom-candidate-tooltip"
                    >
                      {/* Cards row inside tooltip */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          overflowX: "auto",
                          maxWidth: group.candidates.length === 1 ? 300 : 620,
                          p: 1,
                          "&::-webkit-scrollbar": { height: 4 },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#D1D5DB",
                            borderRadius: 2,
                          },
                        }}
                        onMouseLeave={() => setOpenTooltipId(null)}
                      >
                        {group.candidates.map((candidate, idx) => (
                          <Box
                            key={candidate.id}
                            sx={{
                              flex: `0 0 ${CARD_WIDTH}px`,
                              width: CARD_WIDTH,
                              pt: "20px", // room for status badge
                            }}
                          >
                            <CandidateCard
                              candidate={candidate}
                              index={idx}
                              handleClick={() => handleViewProfile(candidate)}
                              orgId={orgId}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Tooltip>
                  )}
                </Marker>
              ))}
            </MapContainer>
          )}
        </Box>
      ) : (
        /* ══════════════════════════════════════════════════════════════════
           TILE VIEW  (horizontal slider)
        ══════════════════════════════════════════════════════════════════ */
        <Box sx={{ position: "relative" }}>

          {/* Left Arrow */}
          {showArrows && (
            <IconButton
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              sx={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                width: 40,
                height: 40,
                background: canScrollLeft ? "#FF5722" : "#E5E7EB",
                color: canScrollLeft ? "#fff" : "#9CA3AF",
                boxShadow: canScrollLeft ? "0 2px 8px rgba(255,87,34,0.35)" : "none",
                "&:hover": { background: canScrollLeft ? "#E64A19" : "#E5E7EB" },
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}

          {/* Scrollable outer (pt keeps badge visible, overflow-x scrolls) */}
          <Box
            ref={sliderRef}
            onScroll={syncArrows}
            sx={{
              pt: "20px",
              pb: "8px",
              overflowX: showArrows ? "auto" : "visible",
              overflowY: "visible",
              px: showArrows ? "8px" : 0,
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: `${CARD_GAP}px`,
                scrollSnapType: showArrows ? "x mandatory" : "none",
                width: showArrows ? "max-content" : "100%",
                justifyContent: centerCards ? "center" : "flex-start",
              }}
            >
              {validCandidates.map((candidate, index) => (
                <Box
                  key={candidate.id}
                  sx={{
                    flex: `0 0 ${CARD_WIDTH}px`,
                    width: CARD_WIDTH,
                    minWidth: CARD_WIDTH,
                    maxWidth: CARD_WIDTH,
                    scrollSnapAlign: "start",
                    "& *": { minWidth: 0 },
                  }}
                >
                  <CandidateCard
                    candidate={candidate}
                    index={index}
                    handleClick={() => handleViewProfile(candidate)}
                    orgId={orgId}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Arrow */}
          {showArrows && (
            <IconButton
              onClick={scrollRight}
              disabled={!canScrollRight}
              sx={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                width: 40,
                height: 40,
                background: canScrollRight ? "#FF5722" : "#E5E7EB",
                color: canScrollRight ? "#fff" : "#9CA3AF",
                boxShadow: canScrollRight ? "0 2px 8px rgba(255,87,34,0.35)" : "none",
                "&:hover": { background: canScrollRight ? "#E64A19" : "#E5E7EB" },
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}

          {/* Dot Indicators */}
          {showArrows && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, mt: 1.5 }}>
              {validCandidates.map((c) => (
                <Box
                  key={c.id}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#D1D5DB",
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ── Leaflet tooltip global styles ── */}
      <style>{`
        .custom-candidate-tooltip {
          padding: 0 !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          max-width: none !important;
        }
        .custom-candidate-tooltip::before {
          display: none !important;
        }
        .leaflet-tooltip.custom-candidate-tooltip {
          pointer-events: auto !important;
        }
      `}</style>
    </Box>
  );
};

export default MatchedCandidates;
```

---

## File: pages/Organizations/CandidatePipeline.jsx

```javascript
import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PRIMARY, C, STATUS_COLORS } from "../../theme/index";

// ─── Main funnel sequence ──────────────────────────────────────────────────
// This is the literal, ordered path a candidate walks through. "Rejected" is
// deliberately NOT in this list — a candidate can be rejected at almost any
// point, so it's shown as a separate drop-off line rather than a fixed step.
// "Offer released" sits at the end of the main flow because it's still a
// single sequential gate every offer-track candidate passes through;
// accepted/rejected/revoked are the three *possible outcomes* of that gate,
// not further steps in sequence — they're rendered as a separate trio below.
const MAIN_FLOW_STAGES = [
  { key: "matched",         label: "Matched",         Icon: GroupsOutlinedIcon,         bg: "#E3F2FD", color: "#1565C0", textDark: "#0D3C61" },
  { key: "shortlisted",     label: "Shortlisted",     Icon: FactCheckOutlinedIcon,       bg: "#EEEDFE", color: "#534AB7", textDark: "#2E2A66" },
  { key: "interviewing",    label: "Interviewing",    Icon: EventAvailableOutlinedIcon,  bg: "#FFF3E0", color: "#C77700", textDark: "#6B4100" },
  { key: "selected",        label: "Selected",        Icon: HowToRegOutlinedIcon,        bg: "#FCE4EC", color: "#AD1457", textDark: "#6B0D34" },
  { key: "offer_released",  label: "Offer released",  Icon: DescriptionOutlinedIcon,     bg: "#E3F2FD", color: "#1976D2", textDark: "#0D3C61" },
  { key: "onboarded",       label: "Onboarded",       Icon: VerifiedOutlinedIcon,        bg: "#E1F5EE", color: "#0F6E56", textDark: "#053D30" },
];

// ─── Offer outcome trio — mutually exclusive results of "offer released" ──
const OFFER_OUTCOME_STAGES = [
  { key: "offer_accepted", label: "Accepted", Icon: ThumbUpOutlinedIcon,       color: "#2E7D32" },
  { key: "offer_rejected", label: "Rejected",  Icon: ThumbDownAltOutlinedIcon, color: "#C62828" },
  { key: "offer_revoked",  label: "Revoked",   Icon: BlockOutlinedIcon,        color: "#455A64" },
];

const formatPct = (current, previous) => {
  if (!previous) return null;
  return Math.round((current / previous) * 100);
};

// ── Single main-flow stage card ─────────────────────────────────────────
const StageCard = ({ stage, count, isEmpty, onClick }) => {
  const { Icon, label, bg, color, textDark } = stage;
  const clickable = !isEmpty && count > 0;

  return (
    <Box
      onClick={clickable ? onClick : undefined}
      sx={{
        minWidth: 110,
        flex: "1 1 110px",
        bgcolor: isEmpty ? PRIMARY.bg : bg,
        border: `1px solid ${isEmpty ? PRIMARY.border : "transparent"}`,
        borderRadius: "10px",
        p: "10px 8px",
        textAlign: "center",
        cursor: clickable ? "pointer" : "default",
        opacity: isEmpty ? 0.6 : 1,
        transition: "transform 0.15s, box-shadow 0.15s",
        "&:hover": clickable
          ? { transform: "translateY(-2px)", boxShadow: `0 4px 14px ${color}30` }
          : {},
      }}
    >
      <Icon sx={{ fontSize: 18, color: isEmpty ? PRIMARY.textMuted : color }} />
      <Typography
        sx={{
          fontSize: 19,
          fontWeight: 700,
          lineHeight: 1.15,
          mt: 0.5,
          color: isEmpty ? PRIMARY.textSecondary : textDark,
        }}
      >
        {count}
      </Typography>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          mt: 0.25,
          color: isEmpty ? PRIMARY.textMuted : color,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

// ── Connector arrow + conversion % between two stages ──────────────────
const StageConnector = ({ pct }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 38,
      flexShrink: 0,
    }}
  >
    <ArrowForwardIcon sx={{ fontSize: 14, color: PRIMARY.textMuted }} />
    {pct !== null && (
      <Typography sx={{ fontSize: 10, color: PRIMARY.textMuted, fontWeight: 500 }}>
        {pct}%
      </Typography>
    )}
  </Box>
);

// ── Small offer-outcome tile ──────────────────────────────────────────────
const OutcomeTile = ({ stage, count, onClick }) => {
  const { Icon, label, color } = stage;
  const isEmpty = count === 0;
  const clickable = !isEmpty;

  return (
    <Box
      onClick={clickable ? onClick : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 1.25,
        bgcolor: isEmpty ? PRIMARY.bg : `${color}10`,
        border: `1px solid ${isEmpty ? PRIMARY.border : "transparent"}`,
        borderRadius: "8px",
        cursor: clickable ? "pointer" : "default",
        opacity: isEmpty ? 0.6 : 1,
        transition: "background-color 0.15s",
        "&:hover": clickable ? { bgcolor: `${color}1A` } : {},
      }}
    >
      <Icon sx={{ fontSize: 16, color: isEmpty ? PRIMARY.textMuted : color }} />
      <Box>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: isEmpty ? PRIMARY.textSecondary : color, lineHeight: 1.1 }}>
          {count}
        </Typography>
        <Typography sx={{ fontSize: 11, color: isEmpty ? PRIMARY.textMuted : PRIMARY.textSecondary }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

// ── Section label (small caps eyebrow above each row) ───────────────────
const SectionLabel = ({ children }) => (
  <Typography
    sx={{
      fontSize: 11,
      fontWeight: 600,
      color: PRIMARY.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

export default function CandidatePipelineFunnel({ data = {}, totalCount = 0, loading = false, onStageClick }) {
  const rejectedCount = data?.rejected || 0;

  // Only show the offer-outcomes row if there's any offer activity at all —
  // no point showing three empty tiles for orgs that haven't reached that
  // stage yet, it'd just be dead weight under the main flow.
  const hasOfferActivity =
    (data?.offer_released || 0) > 0 ||
    (data?.offer_accepted || 0) > 0 ||
    (data?.offer_rejected || 0) > 0 ||
    (data?.offer_revoked || 0) > 0;

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "12px",
        p: 2,
        border: `1px solid ${PRIMARY.border}`,
        boxShadow: "0 2px 12px rgba(23,79,223,0.07)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: PRIMARY.textPrimary }}>
          Candidate Pipeline
        </Typography>
        {totalCount > 0 && (
          <Box sx={{ bgcolor: "#EEF3FF", borderRadius: "20px", px: 1.5, py: 0.4 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: PRIMARY.textPrimary }}>
              {totalCount} total candidates
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Main flow ── */}
      <SectionLabel>Main flow</SectionLabel>
      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 0,
          overflowX: "auto",
          pb: 0.5,
          mb: 2,
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { background: PRIMARY.border, borderRadius: 4 },
        }}
      >
        {MAIN_FLOW_STAGES.map((stage, idx) => {
          const count = data?.[stage.key] || 0;
          const prevCount = idx > 0 ? data?.[MAIN_FLOW_STAGES[idx - 1].key] || 0 : null;
          const pct = idx > 0 ? formatPct(count, prevCount) : null;
          const isEmpty = count === 0;

          return (
            <React.Fragment key={stage.key}>
              {idx > 0 && <StageConnector pct={pct} />}
              {loading ? (
                <Box sx={{ minWidth: 110, flex: "1 1 110px", bgcolor: PRIMARY.bg, borderRadius: "10px", height: 84 }} />
              ) : (
                <StageCard
                  stage={stage}
                  count={count}
                  isEmpty={isEmpty}
                  onClick={() => onStageClick?.(stage.key)}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* ── Offer outcomes (only rendered if there's any offer activity) ── */}
      {!loading && hasOfferActivity && (
        <>
          <SectionLabel>Offer outcomes</SectionLabel>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1.25,
              mb: 2,
            }}
          >
            {OFFER_OUTCOME_STAGES.map((stage) => (
              <OutcomeTile
                key={stage.key}
                stage={stage}
                count={data?.[stage.key] || 0}
                onClick={() => onStageClick?.(stage.key)}
              />
            ))}
          </Box>
        </>
      )}

      {/* ── Drop-off line — rejected candidates, shown separately ── */}
      {!loading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pt: 1.5,
            borderTop: `1px solid ${PRIMARY.border}`,
          }}
        >
          <PersonRemoveOutlinedIcon sx={{ fontSize: 16, color: "#C62828" }} />
          <Typography sx={{ fontSize: 12, color: PRIMARY.textSecondary }}>
            {rejectedCount} candidate{rejectedCount !== 1 ? "s" : ""} rejected along the way
          </Typography>
          {rejectedCount > 0 && (
            <Tooltip title="View rejected candidates">
              <Typography
                onClick={() => onStageClick?.("rejected")}
                sx={{
                  ml: "auto",
                  fontSize: 12,
                  color: PRIMARY.textPrimary    ,
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                View →
              </Typography>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
}
```

---

## File: pages/Requests/CandidateAssignmentDialog.jsx

```javascript
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { CheckCircle, GroupsOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  useCloseRequestAndAddCandidatesMutation,
  useGetRequestCandidateScoresQuery,
} from "../../redux/services/drawerService/drawerService";

const CandidateAssignmentDialog = ({ open, onClose, requestId, jobTitle }) => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetRequestCandidateScoresQuery(requestId, {
    skip: !open || !requestId,
    refetchOnMountOrArgChange: true,
  });
  const [assignCandidates, { isLoading: isAssigning, error: assignError }] =
    useCloseRequestAndAddCandidatesMutation();
  const candidates = Array.isArray(data?.candidates) ? data.candidates : [];
  const loading = isLoading || isFetching;

  const handleAssign = async () => {
    if (!requestId || candidates.length === 0 || isAssigning) return;
    try {
      await assignCandidates({
        requestUuid: requestId,
        candidateIds: candidates.map((candidate) => candidate.candidate_id),
      }).unwrap();
      toast.success("Candidates assigned successfully.");
      onClose();
    } catch {
      // Keep the dialog open so the user can retry.
    }
  };

  return (
    <Dialog open={open} onClose={isAssigning ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: "#FFF1EB", color: "#FF5722", display: "grid", placeItems: "center" }}>
            <GroupsOutlined fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontSize={17} fontWeight={700} color="#172033">Assign candidates</Typography>
            <Typography fontSize={12} color="#667085" noWrap>{jobTitle || "Hiring request"}</Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#FCFCFD", minHeight: 170 }}>
        {loading && <Box sx={{ minHeight: 150, display: "grid", placeItems: "center" }}><CircularProgress sx={{ color: "#FF5722" }} /></Box>}
        {!loading && isError && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={refetch}>Retry</Button>}>
            Unable to load matched candidates.
          </Alert>
        )}
        {!loading && !isError && candidates.length === 0 && (
          <Box sx={{ minHeight: 150, display: "grid", placeItems: "center", textAlign: "center" }}>
            <Box>
              <GroupsOutlined sx={{ color: "#98A2B3", fontSize: 34, mb: 1 }} />
              <Typography fontWeight={650} color="#344054">No matched candidates</Typography>
              <Typography fontSize={13} color="#667085" sx={{ mt: 0.4 }}>There are no candidates available to assign to this request.</Typography>
            </Box>
          </Box>
        )}
        {!loading && candidates.length > 0 && (
          <Stack spacing={1}>
            <Typography fontSize={13} color="#667085" sx={{ mb: 0.25 }}>
              Review the matched candidates before assigning them. This action also closes the request.
            </Typography>
            {candidates.map((candidate, index) => (
              <Box key={candidate.candidate_id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, p: 1.5, borderRadius: 2, border: "1px solid #EAECF0", bgcolor: "#fff" }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontSize={14} fontWeight={650} color="#344054" noWrap>{candidate.candidate_name || `Candidate ${index + 1}`}</Typography>
                  <Typography fontSize={12} color="#667085" noWrap>{candidate.experience || candidate.email || "Matched candidate"}</Typography>
                </Box>
                <Chip size="small" icon={<CheckCircle sx={{ fontSize: "15px !important" }} />} label={`${Math.round(Number(candidate.skillintel_score) || 0)}% match`} sx={{ color: "#087E8B", bgcolor: "#E7F6F7", fontWeight: 700, flexShrink: 0 }} />
              </Box>
            ))}
          </Stack>
        )}
        {assignError && <Alert severity="error" sx={{ mt: 1.5 }}>{assignError?.data?.message || assignError?.data?.detail || "Unable to assign candidates. Please try again."}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.75 }}>
        <Button onClick={onClose} disabled={isAssigning} sx={{ textTransform: "none", color: "#667085" }}>Cancel</Button>
        <Button variant="contained" onClick={handleAssign} disabled={loading || isError || candidates.length === 0 || isAssigning} startIcon={isAssigning ? <CircularProgress size={15} color="inherit" /> : <CheckCircle />} sx={{ textTransform: "none", bgcolor: "#FF5722", fontWeight: 700, boxShadow: "none", "&:hover": { bgcolor: "#E64A19", boxShadow: "none" } }}>
          {isAssigning ? "Assigning..." : `Assign ${candidates.length} candidate${candidates.length === 1 ? "" : "s"}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CandidateAssignmentDialog;

```

---

## File: redux/services/candidates/candidate.js

```javascript
import { api } from "../api/api";

export const candidateService = api.injectEndpoints({
  endpoints: (builder) => ({
    deleteCandidate: builder.mutation({
      query: ({ candidate_id, confirmation_text }) => ({
        url: `/acc/candidate/delete-complete?candidate_id=${candidate_id}&confirmation_text=${confirmation_text}`,
        method: "DELETE",
      }),
    }),
    getCandidateMatchedJobs: builder.query({
      query: (candidate_id) => ({
        url: `/acc/candidate/jobs/${candidate_id}`,
        method: "GET",
      }),
    }),
  }),
});

// ── Export hooks ──
export const { useDeleteCandidateMutation, useGetCandidateMatchedJobsQuery } = candidateService;

```

---

## File: redux/slices/candidateSlice.js

```javascript
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, logout } = candidateSlice.actions;
export default candidateSlice.reducer;
```

---

