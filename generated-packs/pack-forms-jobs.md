# Jobs and Job Description Forms

Generated Date: 2026-11-03T09:30:42.948Z

Total Source Files: 13

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

## File: pages/OrgRequisitions/JobDetailTabs.jsx

```javascript
import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function JobDetailTabs() {
  const navigate = useNavigate();
  const { orgId, jobId } = useParams();
  const location = useLocation();

  const tabValue = (() => {
    if (location.pathname.includes("candidates")) return 1;
    if (location.pathname.includes("interviews")) return 2;
    return 0;
  })();

  return (
    <Box mb={2}>
      <Tabs value={tabValue}>
        <Tab
          label="Job Overview"
          onClick={() =>
            navigate(`/account-manager/org/${orgId}/requisitions/${jobId}`)
          }
        />
        <Tab
          label="Matched Candidates"
          onClick={() =>
            navigate(`/account-manager/org/${orgId}/requisitions/${jobId}/candidates`)
          }
        />
        <Tab
          label="Interviews"
          onClick={() =>
            navigate(`/account-manager/org/${orgId}/requisitions/${jobId}/interviews`)
          }
        />
      </Tabs>
    </Box>
  );
}
```

---

## File: pages/OrgRequisitions/OrgJobDetailLayout.jsx

```javascript
// src/pages/Organizations/OrgJobDetailLayout.jsx

import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate, useParams, useLocation, Outlet } from "react-router-dom";

const TAB_SX = {
  borderBottom: "1px solid #E5E7EB",
  mb: "24px",
  "& .MuiTab-root": {
    textTransform: "none",
    fontSize: 13,
    fontWeight: 500,
    color: "#6B7280",
    mr: "24px",
  },
  "& .Mui-selected": {
    color: "#FF5F1F !important",
    fontWeight: 600,
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#FF5F1F",
  },
};

export default function OrgJobDetailLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orgId, jobId } = useParams();

  const tabValue = React.useMemo(() => {
    if (location.pathname.includes("candidates")) return 1;
    if (location.pathname.includes("interviews")) return 2;
    return 0;
  }, [location.pathname]);

  return (
    <Box sx={{ p: 1 }}>
      <Tabs value={tabValue} sx={TAB_SX}>
        <Tab
          label="Job Overvi"
          onClick={() =>
            navigate(`/account-manager/org/${orgId}/requisitions/${jobId}`)
          }
        />
        <Tab
          label="Matched Candidates"
          onClick={() =>
            navigate(`/account-manager/org/${orgId}/requisitions/${jobId}/candidates`)
          }
        />
        <Tab
          label="Interviews"
          onClick={() =>
            navigate(`/account-manager/org/${orgId}/requisitions/${jobId}/interviews`)
          }
        />
      </Tabs>

      <Outlet />
    </Box>
  );
}
```

---

## File: pages/OrgRequisitions/createJob/RecruitementSteps/index.jsx

```javascript
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import ComputerIcon from "@mui/icons-material/Computer";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";

const RecruitmentSteps = ({ onSubmitSuccess }) => {
  const [steps, setSteps] = useState([
    {
      id: "step-1",
      title: "Technical Assessment",
      subtitle: "Assignment - Step 1",
      isExpanded: false ,
      skills: [],
    },
    {
      id: "step-2",
      title: "Chatbot",
      subtitle: "Chatbot - Step 2",
      isExpanded: false,
      skills: [],
    },
    {
      id: "step-3",
      title: "Technical Interview",
      subtitle: "Technical Interview - Step 3",
      isExpanded: false,
      skills: [],
    },
    {
      id: "step-4",
      title: "Telephonic",
      subtitle: "Telephonic Interview - Step 4",
      isExpanded: false,
      skills: [],
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newStep, setNewStep] = useState({ title: "", subtitle: "" });

  const handleAddSkill = (index) => {
    const newSteps = [...steps];
    newSteps[index].skills = [
      ...(newSteps[index].skills || []),
      { skill: "", rating: "", feedback: "" },
    ];
    setSteps(newSteps);
  };

  const handleSkillChange = (stepIndex, skillIndex, field, value) => {
    const newSteps = [...steps];
    newSteps[stepIndex].skills[skillIndex][field] = value;
    setSteps(newSteps);
  };

  const handleDeleteSkill = (stepIndex, skillIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].skills.splice(skillIndex, 1);
    setSteps(newSteps);
  };

  const handleToggleExpand = (index) => {
    const newSteps = [...steps];
    newSteps[index].isExpanded = !newSteps[index].isExpanded;
    setSteps(newSteps);
  };

  const handleDeleteStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleSaveEvaluation = (index) => {
    console.log("Saving evaluation for step:", index, steps[index].skills);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewStep({ title: "", subtitle: "" });
  };

  const handleAddStep = () => {
    if (newStep.title.trim()) {
      setSteps([
        ...steps,
        {
          id: `step-${steps.length + 1}`,
          title: newStep.title,
          subtitle: newStep.subtitle || `Step ${steps.length + 1}`,
          isExpanded: false,
          skills: [],
        },
      ]);
      handleCloseDialog();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitSuccess();
  };

  const handleStepChange = (field, value) => {
    setNewStep({ ...newStep, [field]: value });
  };

const getStepIcon = (title, isSubtitle = false) => {
  if (isSubtitle) return null;
  const iconStyles = {
    width: 32, // Consistent size for the icon
    height: 32, // Consistent size for the icon
    display: 'flex', // Ensure centering
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
    borderRadius: '50%', // Circular background
    p: 0.75, // Reduced padding to fit icon better
    mr: 1, // Margin to separate from text
    verticalAlign: 'middle', // Align with text
    boxSizing: 'border-box', // Ensure padding doesn't affect size
  };
  switch (title.toLowerCase()) {
    case 'technical assessment':
      return (
        <ComputerIcon
          sx={{ ...iconStyles, color: '#9333EA', backgroundColor: '#F3E8FF' }}
        />
      );
    case 'chatbot':
      return (
        <SmartToyIcon
          sx={{ ...iconStyles, color: '#2563EB', backgroundColor: '#DBEAFE' }}
        />
      );
    case 'technical interview':
      return (
        <PersonIcon
          sx={{ ...iconStyles, color: '#16A34A', backgroundColor: '#DCFCE7' }}
        />
      );
    case 'telephonic':
      return (
        <PhoneIcon
          sx={{ ...iconStyles, color: '#A855F7', backgroundColor: '#F1E3FF' }}
        />
      );
    default:
      return (
        <PersonIcon
          sx={{ ...iconStyles, color: '#666', backgroundColor: '#E0E0E0' }}
        />
      );
  }
};

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newSteps = [...steps];
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);
    setSteps(newSteps);
  };

  return (
    <Grid container 
      sx={{ 
          // maxWidth: { xs: "100%", sm: 700, md: 1000, lg: 1500, xl: 1500 },
          // width: { xs: "100%", sm: 550, md: 700, lg: 850, xl: 1140 },
          // margin: "auto",
          // border: 1,
          borderColor: "#E5E7EB",
          // mt: { xs: 8, sm: 10, lg: 2, xl: 2 },
          }}
      component="form"
      onSubmit={handleSubmit}
      id="recruitment"
    >
    <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
        <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Configure Recruitment Steps
        </Typography>
        <Typography variant="body1" color="#3e3b3bff" mb={2}>
          Set up the interview process by adding and configuring each step
          candidates will go through.
        </Typography>
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button
            variant="contained"
            sx={{ color: "#00BBD4", backgroundColor: "#E1FBFF" }}
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Recruitment Step
          </Button>
        </Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="steps">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {steps.map((step, stepIndex) => (
                  <Draggable
                    key={step.id}
                    draggableId={step.id}
                    index={stepIndex}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ mb: 2 }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                          }}
                        >
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <IconButton
                                {...provided.dragHandleProps}
                                sx={{ cursor: "grab", mt: 1 }}
                              >
                                <DragIndicatorIcon />
                              </IconButton>
                            </Grid>
                            <Grid item size={{ xs: 6 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 1,
                                }}
                              >
                                <Box sx={{ mr: 1, mt: 1 }}>
                                  {getStepIcon(step.title)}
                                </Box>
                                <Box>
                                  <Typography variant="subtitle1">
                                    {step.title}
                                  </Typography>
                                  <Typography variant="caption">
                                    {step.subtitle}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid
                              item
                              sx={{
                                ml: "auto",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                sx={{
                                  color: "#A855F7",
                                  minWidth: "auto",
                                  padding: "4px",
                                }}
                                variant="text"
                                startIcon={<AssignmentIcon />}
                                endIcon={
                                  <ExpandMoreIcon
                                    sx={{
                                      transform: step.isExpanded
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                      transition: "transform 0.2s",
                                    }}
                                  />
                                }
                                onClick={() => handleToggleExpand(stepIndex)}
                              >
                                Add Evaluation Form
                              </Button>
                              <IconButton
                                onClick={() => handleDeleteStep(stepIndex)}
                                color="error"
                                sx={{ ml: 1 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                          {step.isExpanded && (
                            <Box sx={{ mt: 2 }}>
                              {step.skills.map((skill, skillIndex) => (
                                <Paper sx={{ p: 2, mb: 2 }} key={skillIndex}>
                                  <Grid
                                    container
                                    spacing={2}
                                    alignItems="center"
                                  >
                                    <Grid item size={{ xs:3 }} >
                                      <Select
                                        value={skill.skill}
                                        onChange={(e) =>
                                          handleSkillChange(
                                            stepIndex,
                                            skillIndex,
                                            "skill",
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                        displayEmpty
                                      >
                                        <MenuItem value="">
                                          <Typography>Select skill</Typography>
                                        </MenuItem>
                                        <MenuItem value="SDTM">SDTM</MenuItem>
                                        <MenuItem value="ADaM">ADaM</MenuItem>
                                      </Select>
                                    </Grid>
                                    <Grid item size={{ xs: 3 }} >
                                      <Select
                                        value={skill.rating}
                                        onChange={(e) =>
                                          handleSkillChange(
                                            stepIndex,
                                            skillIndex,
                                            "rating",
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                        displayEmpty
                                      >
                                        <MenuItem value="">
                                          <Typography>Select rating</Typography>
                                        </MenuItem>
                                        <MenuItem value="1-10">1-10</MenuItem>
                                        <MenuItem value="1-5">1-5</MenuItem>
                                      </Select>
                                    </Grid>
                                    <Grid item size={{ xs: 5 }} >
                                      <TextField
                                        value={skill.feedback}
                                        onChange={(e) =>
                                          handleSkillChange(
                                            stepIndex,
                                            skillIndex,
                                            "feedback",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter feedback"
                                        fullWidth
                                      />
                                    </Grid>
                                    <Grid item>
                                      <IconButton
                                        onClick={() =>
                                          handleDeleteSkill(
                                            stepIndex,
                                            skillIndex
                                          )
                                        }
                                        color="error"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </Paper>
                              ))}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mt: 2,
                                }}
                              >
                                <Button
                                  variant="text"
                                  color="success"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleAddSkill(stepIndex)}
                                >
                                  + Add Skill
                                </Button>
                                {/* <Button
                                  sx={{ color: "#2563EB", backgroundColor: "#DBEAFE" }}
                                  variant="contained"
                                  onClick={() => handleSaveEvaluation(stepIndex)}
                                >
                                  Save Evaluation Form
                                </Button> */}
                              </Box>
                            </Box>
                          )}
                        </Paper>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Recruitment Step</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{ xs: 12 }}>
              <TextField
                label="Step Title"
                value={newStep.title}
                onChange={(e) => handleStepChange("title", e.target.value)}
                fullWidth
                placeholder="e.g., Technical Assessment"
              />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <TextField
                label="Step Subtitle"
                value={newStep.subtitle}
                onChange={(e) => handleStepChange("subtitle", e.target.value)}
                fullWidth
                placeholder="e.g., Assignment - Step 1"
              />
            </Grid>
            <Grid item size={{ xs: 12 }}>
              <Typography variant="caption" color="textSecondary">
                Icon Preview: {getStepIcon(newStep.title || "New Step")}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddStep}
            variant="contained"
            sx={{ color: "#00BBD4", backgroundColor: "#E1FBFF" }}
            disabled={!newStep.title.trim()}
          >
            Add Step
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RecruitmentSteps;

```

---

## File: pages/OrgRequisitions/createJob/SummaryPage.jsx

```javascript
import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";
import { PRIMARY } from "../../../theme";
import { useGetMatchingCandidatesMutation } from "../../../redux/services/createRequesition/createRequesition";

const SummaryPage = ({
  summary,
  jobDetailsId,
  setActiveStep,
  orgEmpId,
  formData,
  orgId,
  isEditMode,
  setIsEditAfterSummary,
}) => {
  const navigate = useNavigate();
  { console.log("fromSummaryPage jobDetailsId",jobDetailsId) }

  const [getMatchingCandidates, { isLoading }] =
    useGetMatchingCandidatesMutation();
  const handleAgree = async () => {
    try {
      const response = await getMatchingCandidates({
        jobId: jobDetailsId,
        orgEmpId,
      }).unwrap();

      console.log("MATCHED RESPONSE", response);

      navigate("/account-manager/matched-candidates", {
        state: {
          job_details_id: jobDetailsId,
          candidates: response?.data || [],
          requisitionData: formData,
          orgId,
          orgEmpId,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 2,
      }}
    >


      {/* Summary Card */}
      <Box
        sx={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          p: 4,
          mb: 3,
          boxShadow: "0px 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            p: 3,
            minHeight: 250,
          }}
        >
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
              color: "#374151",
              fontSize: 15,
            }}
          >
            {summary || "No summary generated."}
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          onClick={() => {
            setIsEditAfterSummary(true);
            setActiveStep(1);
            setReturnTo("summary");
          }}
          sx={{
            minWidth: 180,
            height: 46,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Edit Job Details
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleAgree}
          sx={{
            minWidth: 220,
            height: 46,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: PRIMARY.primary,
          }}
        >
          {isEditMode ? "Update & Continue" : "Agree & Continue"}
        </Button>
      </Box>
    </Box>
  );
};

export default SummaryPage;
```

---

## File: pages/OrgRequisitions/createJob/ViewProfileDetails.jsx

```javascript
import React, { useMemo, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateCandidateStatusMutation, useGetMatchingCandidatesMutation, useLazyGetThreeMatchedCandidateDetailsQuery } from "../../../redux/services/createRequesition/createRequesition";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  orange: "#E8612A",
  orangeLight: "#FFF4F0",
  blue: "#0A66E8",
  blueLight: "#EAF1FD",
  green: "#16C968",
  greenLight: "#E6FAF1",
  red: "#F44336",
  teal: "#0ABFAD",
  tealLight: "#E6FAF8",
  purple: "#7C3AED",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray700: "#374151",
  gray900: "#111827",
  white: "#FFFFFF",
};

// ─── Tiny SVG icons ───────────────────────────────────────────────────────────
const Ic = {
  Back: () => <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor"><path d="M8 1L1 8l7 7" /></svg>,
  Location: () => <svg width="14" height="14" viewBox="0 0 24 24" fill={C.orange}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill={C.gray500}><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>,
  Brief: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 3.19 16.81 2 15.36 2h-6.72C7.19 2 6 3.19 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4.82-1.36c0 .36-.28.64-.64.64H9.46a.636.636 0 0 1-.64-.64C8.82 4.28 9.1 4 9.46 4h5.08c.36 0 .64.28.64.64zM20 19H4V8h16v11z" /></svg>,
  Grad: () => <svg width="16" height="16" viewBox="0 0 24 24" fill={C.teal}><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>,
  Skills: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" /></svg>,
  Trend: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg>,
  Timeline: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" /></svg>,
  Pin: () => <svg width="13" height="13" viewBox="0 0 24 24" fill={C.gray400}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>,
  Globe: () => <svg width="13" height="13" viewBox="0 0 24 24" fill={C.gray400}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>,
  Email: () => <svg width="13" height="13" viewBox="0 0 24 24" fill={C.gray400}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>,
  Phone: () => <svg width="13" height="13" viewBox="0 0 24 24" fill={C.gray400}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>,
  Chevron: ({ open }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={C.gray500} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>,
};

// ─── Small reusable atoms ─────────────────────────────────────────────────────
const Divider = () => <div style={{ height: 1, background: C.gray200, margin: "10px 0" }} />;

const Badge = ({ label, bg, color, border }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: bg, color, border: border ? `1px solid ${border}` : "none" }}>
    {label}
  </span>
);

const Chip = ({ label, bg, color, border }) => (
  <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 500, background: bg || C.gray100, color: color || C.gray700, border: `1px solid ${border || C.gray200}`, margin: "3px", whiteSpace: "nowrap" }}>
    {label}
  </span>
);

// ─── Fallback bar comparison for <3 skills (radar needs ≥3 points for a polygon) ──
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

// ─── Custom SVG Radar Chart (matching CandidateDetail style) ──────────────────
const RadarChart = ({ scoreIntel, size = 350 }) => {
  if (!scoreIntel?.length) return null;
// Radar needs ≥3 points to form a polygon — fall back to bar comparison otherwise
  if (scoreIntel.length < 3) {
    return <SkillBarCompare scoreIntel={scoreIntel} size={size} />;
  }
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
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
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - ax, py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  function isInsidePolygon(px, py, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const xi = pts[i].x, yi = pts[i].y;
      const xj = pts[j].x, yj = pts[j].y;
      const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function closestSkill(mx, my) {
    let bestIdx = -1, bestDist = Infinity;
    for (let i = 0; i < n; i++) {
      const end = polar(100, i);
      const dist = distToSegment(mx, my, cx, cy, end.x, end.y);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    }
    if (bestDist <= 22) return bestIdx;
    if (isInsidePolygon(mx, my, candidatePts) || isInsidePolygon(mx, my, desiredPts)) {
      let nearIdx = -1, nearDist = Infinity;
      candidatePts.forEach((p, i) => {
        const d = Math.hypot(mx - p.x, my - p.y);
        if (d < nearDist) { nearDist = d; nearIdx = i; }
      });
      return nearIdx;
    }
    return -1;
  }

  const handleMouseMove = useCallback((e) => {
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
      const ttW = 170, ttH = 82;
      let left = e.clientX - wrapRect.left + 14;
      let top = e.clientY - wrapRect.top - 20;
      if (left + ttW > wrapRect.width) left = e.clientX - wrapRect.left - ttW - 10;
      if (top + ttH > wrapRect.height) top = e.clientY - wrapRect.top - ttH - 10;
      if (top < 0) top = 4;
      setTooltip({ visible: true, x: left, y: top, data: scoreIntel[idx] });
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  }, [scoreIntel, size]);

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      {/* Legend — right-aligned, matching CandidateDetail */}
      <div style={{ display: "flex", gap: 16, marginBottom: 10, alignSelf: "flex-end" }}>
        {[{ dot: "#818CF8", label: "Candidate" }, { dot: "#22C55E", label: "Desired" }].map(({ dot, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dot }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: C.gray900 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Chart + Tooltip wrapper */}
      <div ref={wrapRef} style={{ position: "relative", width: size, height: size }}>
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
            <polygon key={i} points={gridPoly(i + 1)} fill="none" stroke="#E5E7EB" strokeWidth="1" />
          ))}

          {/* Axis lines */}
          {scoreIntel.map((_, i) => {
            const end = polar(100, i);
            return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#E5E7EB" strokeWidth="1" />;
          })}

          {/* Desired polygon */}
          <path d={toPath(desiredPts)} fill="rgba(34,197,94,0.10)" stroke="#22C55E" strokeWidth="1.5" />

          {/* Candidate polygon */}
          <path d={toPath(candidatePts)} fill="rgba(129,140,248,0.20)" stroke="#818CF8" strokeWidth="2" />

          {/* Skill labels — fontSize 13, fontWeight 600, matching CandidateDetail */}
          {scoreIntel.map((d, i) => {
            const labelR = R + 52;
            const lx = cx + labelR * Math.cos(angle(i));
            const ly = cy + labelR * Math.sin(angle(i));
            const anchor = Math.abs(lx - cx) < 5 ? "middle" : lx < cx ? "end" : "start";
            const label = d.skill.length > 24 ? d.skill.slice(0, 22) + "…" : d.skill;
            return (
              <text key={i} x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fontSize="13" fontWeight="600" fill="#475569">
                {label}
              </text>
            );
          })}

          {/* Level labels */}
          {Array.from({ length: levels }, (_, i) => {
            const r = ((i + 1) / levels) * R;
            return (
              <text key={i} x={cx + 4} y={cy - r + 4} fontSize="8" fill="#9CA3AF">
                {(i + 1) * 20}
              </text>
            );
          })}

          {/* Candidate data points */}
          {candidatePts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#818CF8" style={{ pointerEvents: "none" }} />
          ))}
        </svg>

        {/* Floating tooltip — dark card, matching CandidateDetail */}
        {tooltip.visible && tooltip.data && (
          <div style={{
            position: "absolute", left: tooltip.x, top: tooltip.y,
            pointerEvents: "none", background: "#1E293B", borderRadius: 8,
            padding: "10px 12px", minWidth: 160, zIndex: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>
              {tooltip.data.skill}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#818CF8", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#94A3B8" }}>Candidate</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#818CF8", marginLeft: "auto" }}>
                {Math.round(tooltip.data.candidate)}%
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#94A3B8" }}>Desired</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#22C55E", marginLeft: "auto" }}>
                {Math.round(tooltip.data.desired)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Circular SVG progress ring (mirrors MUI CircularProgress from CandidateDetail) ──
const CircularScore = ({ score }) => {
  const size = 42;
  const thickness = 5;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const ringColor = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#DC2626";
  const textColor = score >= 80 ? "#059669" : score >= 50 ? "#D97706" : "#DC2626";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Track ring */}
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#E5E7EB" strokeWidth={thickness}
        />
      </svg>
      {/* Progress ring */}
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={ringColor} strokeWidth={thickness}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      {/* Label */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 8, fontWeight: 700, color: textColor }}>{Math.round(score)}%</span>
      </div>
    </div>
  );
};

// ─── Skill note accordion row — matching CandidateDetail SkillNotesAccordion ──
const SkillNoteRow = ({ skill, note, score }) => {
  const [open, setOpen] = useState(false);
  const pct = score ?? 0;

  const barColor = pct >= 80 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#DC2626";
  const badgeBg = pct >= 80 ? "#ECFDF5" : pct >= 50 ? "#FFFBEB" : "#FEF2F2";
  const badgeColor = pct >= 80 ? "#059669" : pct >= 50 ? "#D97706" : "#DC2626";

  const noteText = typeof note === "object" && note !== null ? note.value : note;

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 14, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
      {/* Summary row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", cursor: "pointer", background: C.white, gap: 12 }}
      >
        {/* Left: circular ring + skill name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
          <CircularScore score={pct} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{skill}</span>
        </div>

        {/* Right: "Score" label + linear bar + badge + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.gray500, whiteSpace: "nowrap" }}>Score</span>
          {/* Linear progress bar */}
          <div style={{ width: 120, height: 4, background: "#E5E7EB", borderRadius: 999, overflow: "hidden", flexShrink: 0 }}>
            <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: barColor, borderRadius: 999, transition: "width 0.4s ease" }} />
          </div>
          {/* Score badge chip */}
          <span style={{ fontSize: 10, fontWeight: 700, color: badgeColor, background: badgeBg, borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>
            {pct}%
          </span>
          <Ic.Chevron open={open} />
        </div>
      </div>

      {/* Expanded note */}
      {open && (
        <div style={{ padding: "12px 18px 16px", background: "#FAFAFA", borderTop: "1px solid #F3F4F6" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.8 }}>{noteText}</p>
        </div>
      )}
    </div>
  );
};

// ─── TAB: Experience ──────────────────────────────────────────────────────────
const SKILLS_LIMIT = 8;

const JobCard = ({ job, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const skills = job.skills_used || [];
  const visible = expanded ? skills : skills.slice(0, SKILLS_LIMIT);
  const hiddenCount = skills.length - SKILLS_LIMIT;

  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 52 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: C.gray100, border: `1px solid ${C.gray200}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.gray400, flexShrink: 0 }}>
          <Ic.Brief />
        </div>
        {!isLast && <div style={{ flex: 1, width: 2, background: C.gray200, margin: "4px 0" }} />}
      </div>

      <div style={{ flex: 1, background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "16px 20px", marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.gray900 }}>{job.job_title}</span>
              {job.is_current && <Badge label="CURRENT" bg={C.orangeLight} color={C.orange} />}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.orange, marginBottom: 6 }}>{job.company_name}</div>
            <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.gray400 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Ic.Pin /> {job.location || "Not specified"}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Ic.Globe /> {job.country || "India"}</span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ background: C.gray100, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 4, whiteSpace: "nowrap" }}>
              {job.joining_date} — {job.end_date}
            </div>
            <div style={{ fontSize: 12, color: C.gray400 }}>{job.duration}</div>
          </div>
        </div>

        {skills.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.gray400, marginBottom: 8 }}>SKILLS USED</div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {visible.map(s => <Chip key={s} label={s} />)}
              {!expanded && hiddenCount > 0 && (
                <span onClick={() => setExpanded(true)} style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: C.orangeLight, color: C.orange, border: `1px solid ${C.orange}`, margin: "3px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  +{hiddenCount} more
                </span>
              )}
              {expanded && hiddenCount > 0 && (
                <span onClick={() => setExpanded(false)} style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: C.gray100, color: C.gray500, border: `1px solid ${C.gray200}`, margin: "3px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  Show less
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ExperienceTab = ({ employment }) => (
  <div style={{ marginTop: 20 }}>
    {employment.map((job, idx) => (
      <JobCard key={job.id} job={job} isLast={idx === employment.length - 1} />
    ))}
  </div>
);

// ─── TAB: Education ───────────────────────────────────────────────────────────
const EducationTab = ({ education }) => (
  <div style={{ marginTop: 20 }}>
    {education.map(edu => (
      <div key={edu.id} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ic.Grad />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.gray900, marginBottom: 3 }}>{edu.course}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>{edu.university}</div>
          </div>
        </div>
        {edu.end_year && <span style={{ fontSize: 15, color: C.gray400, fontWeight: 500, flexShrink: 0 }}>{edu.end_year}</span>}
      </div>
    ))}
  </div>
);

// ─── TAB: Skills ─────────────────────────────────────────────────────────────
const SkillsTab = ({ skillInfo, mandatorySkills, primarySkills, secondarySkills }) => {
  const allSkills = skillInfo?.[0]?.key_skills?.split(",").map(s => s.trim()) || [];
  const mandatorySet = new Set(mandatorySkills.map(s => s.toLowerCase()));
  const primarySet = new Set(primarySkills.map(s => s.toLowerCase()));
  const secondarySet = new Set(secondarySkills.map(s => s.toLowerCase()));

  const chipStyle = (skill) => {
    const k = skill.toLowerCase();
    if (mandatorySet.has(k)) return { bg: C.orangeLight, color: C.orange, border: C.orange };
    if (primarySet.has(k)) return { bg: C.blueLight, color: C.blue, border: C.blue };
    if (secondarySet.has(k)) return { bg: C.gray100, color: C.gray700, border: "#D1D5DB" };
    return { bg: C.gray100, color: C.gray700, border: C.gray200 };
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.orange }}>
            <Ic.Skills />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.gray900 }}>Skills</span>
        </div>
        <Divider />
        <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Mandatory Match", color: C.orange },
            { label: "Primary Match", color: C.blue },
            { label: "Secondary Match", color: C.gray400 },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.gray700 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${color}` }} />
              {label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {allSkills.map(skill => {
            const s = chipStyle(skill);
            return <Chip key={skill} label={skill} bg={s.bg} color={s.color} border={s.border} />;
          })}
        </div>
      </div>
    </div>
  );
};

// ─── TAB: Skill Intel ─────────────────────────────────────────────────────────
const SkillIntelTab = ({ scoreIntel, skillNotes }) => {
  const scoreMap = scoreIntel.reduce((acc, item) => {
    acc[item.skill] = item.candidate;
    return acc;
  }, {});

  return (
    <div style={{ marginTop: 20 }}>
      {/* Custom SVG Radar — centered, size 350 matching CandidateDetail */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <RadarChart scoreIntel={scoreIntel} size={350} />
      </div>

      {/* Skill Notes — one accordion per skill_notes entry */}
      {Object.keys(skillNotes).length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.gray900, marginBottom: 12 }}>Skill Notes</div>
          {Object.entries(skillNotes).map(([skill, note]) => (
            <SkillNoteRow key={skill} skill={skill} note={note} score={scoreMap[skill] ?? null} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── TAB: Timeline ────────────────────────────────────────────────────────────
const TimelineTab = ({ employment }) => (
  <div style={{ marginTop: 24, paddingLeft: 32, position: "relative" }}>
    <div style={{ position: "absolute", left: 15, top: 0, bottom: 0, width: 2, background: C.gray200 }} />
    {employment.map(job => (
      <div key={job.id} style={{ position: "relative", marginBottom: 28 }}>
        <div style={{ position: "absolute", left: -24, top: 6, width: 14, height: 14, borderRadius: "50%", background: job.is_current ? C.orange : C.gray400, border: `2px solid ${C.white}`, boxShadow: `0 0 0 2px ${job.is_current ? C.orange : C.gray400}` }} />
        <div style={{ fontSize: 12, color: C.gray400, marginBottom: 3 }}>{job.joining_date} — {job.end_date}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.gray900 }}>{job.job_title}</div>
        <div style={{ fontSize: 13, color: C.orange }}>{job.company_name}</div>
        <div style={{ fontSize: 12, color: C.gray400 }}>{job.duration}</div>
      </div>
    ))}
  </div>
);

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { key: "skillintel", label: "Skill Intel", icon: <Ic.Trend /> },
  { key: "experience", label: "Experience", icon: <Ic.Brief /> },
  { key: "education", label: "Education", icon: <Ic.Grad /> },
  { key: "skills", label: "Skills", icon: <Ic.Skills /> },
  // { key: "timeline", label: "Timeline", icon: <Ic.Timeline /> },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ViewProfileDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const profile = state?.profileResponse;
  const candidate = profile?.candidate;
  const matchedMandatory = profile?.matched_mandatory_skills || [];
  const matchedPrimary = profile?.matched_primary_skills || [];
  const matchedSecondary = profile?.matched_secondary_skills || [];
  const skillNotes = profile?.skill_notes || {};
  const scoreIntel = profile?.score_intel || [];
  const matchStatus = profile?.status || "matched";

  const [activeTab, setActiveTab] = useState("skillintel");
  const [reasonModal, setReasonModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reason, setReason] = useState("");

  const [updateCandidateStatus, { isLoading: updating }] = useUpdateCandidateStatusMutation();
  // const [getMatchingCandidates] = useGetMatchingCandidatesMutation();
  const [getThreeMatchedCandidates] =
    useLazyGetThreeMatchedCandidateDetailsQuery();

  const totalExperience = useMemo(() => {
    const cur = candidate?.employment?.find(e => e.is_current);
    if (!cur) return null;
    return `${cur.total_exp_years} Years ${cur.total_exp_months} Months`;
  }, [candidate]);

  if (!candidate) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "sans-serif", color: C.gray500 }}>
        No profile data found.
      </div>
    );
  }

  const initials = `${candidate.first_name?.charAt(0) || ""}${candidate.last_name?.charAt(0) || ""}`;
  const currentJob = candidate.employment?.find(e => e.is_current);
  const skillintelScore = candidate.skill_info?.[0]?.skillintel_score || 0;
  const skillCount = candidate.skill_info?.[0]?.key_skills?.split(",").length || 0;

  const tabCount = (key) => {
    if (key === "experience") return candidate.employment?.length || 0;
    if (key === "education") return candidate.education?.length || 0;
    if (key === "skills") return skillCount;
    return null;
  };

  const statusBadge = matchStatus === "matched"
    ? { label: "MATCHED", bg: "#FFF9E6", color: "#C78A00", border: "#F5D376" }
    : { label: matchStatus.toUpperCase(), bg: C.gray100, color: C.gray700, border: C.gray200 };

  const handleStatusUpdate = async () => {
    // if (!reason.trim()) { toast.error("Please enter reason"); return; }
    try {
      await updateCandidateStatus({ candidateId: profile?.candidate_id1, status: selectedStatus, reason }).unwrap();
      // const refreshedResponse = await getMatchingCandidates({ jobId: state.job_details_id, orgEmpId: state.orgEmpId }).unwrap();
      const refreshedResponse =
        await getThreeMatchedCandidates({
          jobId: state.job_details_id,
          orgEmpId: state.orgEmpId,
        }).unwrap();
      toast.success(`Candidate ${selectedStatus} successfully`);
      console.log("THREE MATCHED RESPONSE", refreshedResponse);
      navigate("/account-manager/matched-candidates", {
        state: {
          candidates: refreshedResponse,
          job_details_id: state.job_details_id,
          orgId: state.orgId,
          orgEmpId: state.orgEmpId,
          requisitionData: state.requisitionData,
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: 24, boxSizing: "border-box" }}>

      {/* ── HEADER CARD ─────────────────────────────────────── */}
      <div style={{ background: C.white, borderRadius: 14, padding: "18px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>

        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* <button onClick={() => navigate(-1)} style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${C.gray200}`, background: C.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.gray700, flexShrink: 0 }}>
            <Ic.Back />
          </button> */}
          <ArrowBackIcon sx={{ fontSize: 16, cursor: "pointer" }} onClick={() => navigate(-1)} />

          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.orange, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.gray900 }}>{candidate.full_name}</span>
              <Badge label={statusBadge.label} bg={statusBadge.bg} color={statusBadge.color} border={statusBadge.border} />
            </div>

            {currentJob && (
              <div style={{ fontSize: 13, color: C.gray500, marginBottom: 4 }}>
                {currentJob.job_title} &nbsp;·&nbsp; {currentJob.company_name}
              </div>
            )}

            <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.gray400, flexWrap: "wrap" }}>
              {candidate.email && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Ic.Email /> {candidate.email}
                </span>
              )}
              {candidate.phone_no && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Ic.Phone /> {candidate.phone_no}
                </span>
              )}
              <span style={{ fontWeight: 600, color: C.gray700 }}>CLIN{candidate.clin_id}</span>
            </div>

            {(candidate.personal_details?.city || candidate.personal_details?.country) && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 12 }}>
                <Ic.Location />
                <span style={{ color: C.orange }}>
                  {[candidate.personal_details.city, candidate.personal_details.country].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          {totalExperience && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: "5px 14px", fontSize: 13, color: C.gray500 }}>
              <Ic.Clock /> {totalExperience}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.orangeLight, border: `1px solid #F5C4AE`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 700, color: C.orange }}>
            <Ic.Trend /> Skill Intel {Math.round(skillintelScore * 10) / 10}
          </div>
        </div>
      </div>

      {/* ── BODY CARD ────────────────────────────────────────── */}
      <div style={{ background: C.white, borderRadius: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>

        {/* Tab bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.gray200}`, padding: "0 24px", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 0 }}>
            {TABS.map(tab => {
              const count = tabCount(tab.key);
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "16px 16px", fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? C.orange : C.gray500, background: "none", border: "none", borderBottom: isActive ? `2.5px solid ${C.orange}` : "2.5px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>
                  <span style={{ color: isActive ? C.orange : C.gray400 }}>{tab.icon}</span>
                  {tab.label}
                  {count != null && (
                    <span style={{ background: isActive ? C.orange : C.gray200, color: isActive ? C.white : C.gray500, borderRadius: "50%", width: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Shortlist / Reject */}
          <div style={{ display: "flex", gap: 10, padding: "8px 0" }}>
            <button
              disabled={matchStatus?.toLowerCase() === "shortlisted"}
              onClick={() => {
                setSelectedStatus("shortlisted");
                setReason("");
                setReasonModal(true);
              }}
              style={{
                background:
                  matchStatus?.toLowerCase() === "shortlisted"
                    ? "#D1D5DB"
                    : C.green,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 28px",
                cursor:
                  matchStatus?.toLowerCase() === "shortlisted"
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  matchStatus?.toLowerCase() === "shortlisted"
                    ? 0.7
                    : 1,
              }}
            >
              Shortlist
            </button>

            <button
              disabled={matchStatus?.toLowerCase() === "rejected"}
              onClick={() => {
                setSelectedStatus("rejected");
                setReason("");
                setReasonModal(true);
              }}
              style={{
                background:
                  matchStatus?.toLowerCase() === "rejected"
                    ? "#D1D5DB"
                    : "#F44336",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 28px",
                cursor:
                  matchStatus?.toLowerCase() === "rejected"
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  matchStatus?.toLowerCase() === "rejected"
                    ? 0.7
                    : 1,
              }}
            >
              Reject
            </button>
          </div>
        </div>

        {/* Tab body */}
        <div style={{ padding: "8px 24px 32px" }}>
          {activeTab === "experience" && <ExperienceTab employment={candidate.employment || []} />}
          {activeTab === "education" && <EducationTab education={candidate.education || []} />}
          {activeTab === "skills" && (
            <SkillsTab
              skillInfo={candidate.skill_info}
              mandatorySkills={matchedMandatory}
              primarySkills={matchedPrimary}
              secondarySkills={matchedSecondary}
            />
          )}
          {activeTab === "skillintel" && (
            <SkillIntelTab scoreIntel={scoreIntel} skillNotes={skillNotes} />
          )}
          {/* {activeTab === "timeline" && <TimelineTab employment={candidate.employment || []} />} */}
        </div>
      </div>

      {/* Reason Modal */}
      <Dialog open={reasonModal} onClose={() => setReasonModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStatus === "shortlisted" ? "Shortlist Candidate" : "Reject Candidate"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth multiline rows={4} label="Reason" value={reason}
            onChange={(e) => setReason(e.target.value)} sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReasonModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate} disabled={updating}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewProfileDetails;
```

---

## File: pages/OrgRequisitions/createJob/index.jsx

```javascript
import React, { memo, useState, useRef, useEffect } from "react";
import { Autocomplete, Box, FormControl, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { PRIMARY } from "../../../theme";
import {
  useGetSubFunctionsQuery,
  useGetCountriesQuery,
  useGetCitiesByCountryQuery,
  useGetNormalSkillsQuery,
  useGetPrimarySkillsQuery,
  useGetMandatorySkillsQuery,
  useGetSecondarySkillsQuery,
  useGetEdcToolsQuery,
  useGetTherapeuticAreasQuery,
  useGetTemplatesQuery,
  useGetCPSkillsQuery,
  useGetCPRemainingSkillsQuery,
  useGetApproversQuery,
  useCreateRequisitionMutation,
  useEditJobMutation,
  useDeleteTemplateMutation
} from "../../../redux/services/createRequesition/createRequesition";
import GroupedSkillAutocomplete from "../../../components/autocomplete";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import SummaryPage from "./SummaryPage";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────
const STATIC = {
  domainSkillsIT: [
    { key: "javascript", label: "JavaScript" }, { key: "typescript", label: "TypeScript" },
    { key: "react", label: "React.js" }, { key: "node", label: "Node.js" },
    { key: "python", label: "Python" }, { key: "java", label: "Java" },
    { key: "dotnet", label: ".NET / C#" }, { key: "sql", label: "SQL" },
    { key: "aws", label: "AWS" }, { key: "azure", label: "Azure" },
    { key: "docker", label: "Docker" }, { key: "kubernetes", label: "Kubernetes" },
    { key: "devops", label: "DevOps" }, { key: "machine_learning", label: "Machine Learning" },
    { key: "data_science", label: "Data Science" }, { key: "cybersecurity", label: "Cybersecurity" },
    { key: "agile_scrum", label: "Agile / Scrum" }, { key: "other", label: "Other" },
  ],
  domainSkillsNonIT: [
    { key: "accounting", label: "Accounting" }, { key: "finance", label: "Finance" },
    { key: "hr_management", label: "HR Management" }, { key: "recruitment", label: "Recruitment" },
    { key: "legal", label: "Legal" }, { key: "compliance", label: "Compliance" },
    { key: "supply_chain", label: "Supply Chain" }, { key: "operations", label: "Operations" },
    { key: "customer_service", label: "Customer Service" }, { key: "ms_office", label: "MS Office" },
    { key: "data_analysis", label: "Data Analysis" }, { key: "other", label: "Other" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const DOMAINS = [
  { value: "clinical", label: "Clinical" },
  { value: "it", label: "IT" },
  { value: "non_it", label: "Non-IT" },
];
const FUNCTIONS = [
  { label: "Bio Statistics", key: "biostatistics" },
  { label: "Clinical Data Management", key: "clinical data management" },
];
const AVAILABILITY = [
  { value: "0", label: "Immediately Available" },
  { value: "30", label: "Less than 30 days" },
  { value: "60", label: "Less than 60 days" },
  { value: "90", label: "Less than 90 days" },
];
const PRIORITIES = ["High", "Medium", "Low"];
const JOB_TYPES = ["Full Time", "Part Time", "Freelancer"];
const WORK_MODES = ["Remote", "Hybrid", "Onsite"];
const POSITIONS = ["One", "Two", "More than Two"];

const getTodayPlus30 = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
};

const SUB_SHORT = {
  "Clinical Data Manager": "CDM", "Statistical Programmer": "SP",
  "Clinical Programmer/CRF Developer": "CRF", "Bio Statistician": "BIO",
};
const generateTitle = (sub) => {
  const code = SUB_SHORT[sub] || sub.slice(0, 3).toUpperCase();
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getFullYear()).slice(-2)}`;
  const time = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  return `${code}-${date}${time}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  primary: PRIMARY.primary,
  primaryLight: "#EBF0FB",
  primaryHover: "#2F5EC4",
  border: "#E5E7EB",
  bg: "#F3F4F6",
  surface: "#fff",
  surfaceMuted: "#F9FAFB",
  text: "#111827",
  textMuted: "#6B7280",
  textHint: "#9CA3AF",
  success: "#16A34A",
  successLight: "#F0FDF4",
  successBorder: "#BBF7D0",
  danger: "#EF4444",
  tag: "#EBF0FB",
  tagText: "#1A4FB5",
  tagBorder: "#C7D8F8",
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED MINI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const FieldRow = ({ children, style }) => (
  <div style={{
    border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "10px 14px", background: C.surfaceMuted, marginBottom: 10, ...style,
  }}>
    {children}
  </div>
);

const FieldLabel = ({ children, error }) => (
  <div style={{
    fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize,
    fontWeight: 500, color: error ? C.danger : C.textMuted, marginBottom: 5,
  }}>
    {children}
  </div>
);

const ErrorText = ({ msg }) => msg ? (
  <div style={{ fontSize: 12, color: C.danger, marginTop: 3 }}>{msg}</div>
) : null;

const SectionCard = ({ children, style }) => (
  <div style={{
    background: C.surface, borderRadius: 12,
    border: `1px solid ${C.border}`, padding: "20px 22px", ...style,
  }}>
    {children}
  </div>
);

const SectionHeader = ({ title }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{
      fontFamily: PRIMARY.fontFamily, fontSize: 16,
      fontWeight: 600, color: C.text, marginBottom: 4,
    }}>
      {title}
    </div>
  </div>
);

const ChipTag = ({ label, onRemove }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 9px", background: C.tag, color: C.tagText,
    border: `1px solid ${C.tagBorder}`, borderRadius: 20,
    fontSize: PRIMARY.chip.fontSize, fontFamily: PRIMARY.fontFamily, fontWeight: 500,
  }}>
    {label}
    {onRemove && (
      <button onClick={onRemove} style={{
        background: "none", border: "none", cursor: "pointer",
        padding: 0, display: "flex", color: C.tagText, fontSize: 12, lineHeight: 1,
      }}>
        <i className="ti ti-x" style={{ fontSize: 11 }} />
      </button>
    )}
  </span>
);

const MultiSelect = ({ options = [], selected = [], onChange, placeholder, getKey, getLabel, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const resolvedKey = getKey || ((o) => o.key || o.value || o);
  const resolvedLabel = getLabel || ((o) => o.label || o.lable || o.name || o);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (key) => {
    onChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key]);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", border: `1px solid ${error ? C.danger : C.border}`, borderRadius: 8,
          padding: "7px 10px", fontSize: 13, background: C.surface,
          cursor: "pointer", display: "flex", flexWrap: "wrap", gap: 4,
          alignItems: "center", minHeight: 36,
        }}
      >
        {selected.length === 0 && (
          <span style={{ color: C.textHint, fontSize: 13 }}>{placeholder || "select"}</span>
        )}
        {selected.map(k => {
          const opt = options.find(o => resolvedKey(o) === k);
          return opt ? (
            <ChipTag key={k} label={resolvedLabel(opt)}
              onRemove={(e) => { e.stopPropagation(); toggle(k); }} />
          ) : null;
        })}
        <i className={`ti ti-chevron-${open ? "up" : "down"}`}
          style={{ marginLeft: "auto", fontSize: 13, color: C.textMuted }} />
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)", maxHeight: 220, overflowY: "auto",
        }}>
          {options.map(opt => {
            const k = resolvedKey(opt);
            const lbl = resolvedLabel(opt);
            const checked = selected.includes(k);
            return (
              <div key={k} onClick={() => toggle(k)} style={{
                padding: "8px 12px", fontSize: PRIMARY.label.fontSize,
                fontFamily: PRIMARY.fontFamily, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                background: checked ? C.primaryLight : "transparent",
              }}>
                <div style={{
                  width: 15, height: 15, borderRadius: 4,
                  border: `2px solid ${checked ? C.primary : C.border}`,
                  background: checked ? C.primary : C.surface,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {checked && <i className="ti ti-check" style={{ fontSize: 9, color: "#fff" }} />}
                </div>
                {lbl}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ToggleChip = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    flex: 1, padding: "9px 0", borderRadius: 6,
    border: `1px solid ${selected ? C.primary : C.border}`,
    background: selected ? C.primaryLight : C.surface,
    color: selected ? C.primary : C.textMuted,
    fontSize: 13, fontWeight: selected ? 600 : 400,
    cursor: "pointer", transition: "all 0.15s",
  }}>
    {label}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEPPER HEADER
// ─────────────────────────────────────────────────────────────────────────────
const StepperHeader = ({ activeStep }) => (
  <div style={{ borderRadius: 0, marginBottom: 14, overflow: "hidden", display: "flex", alignItems: "stretch" }}>
    <div style={{
      background: activeStep === 1 ? C.primary : C.surfaceMuted,
      color: activeStep === 1 ? "#fff" : C.textMuted, padding: "14px 24px",
      display: "flex", alignItems: "center", gap: 12, flex: 1,
      clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 18px 50%)",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 600, flexShrink: 0,
      }}>01</div>
      <div style={{ fontFamily: PRIMARY.fontFamily, fontSize: 14, fontWeight: 600 }}>Job Details</div>
    </div>
    <div style={{
      background: activeStep === 2 ? C.primary : C.surfaceMuted,
      color: activeStep === 2 ? "#fff" : C.textMuted,
      padding: "14px 24px 14px 38px", display: "flex", alignItems: "center", gap: 12, flex: 1,
      clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 18px 50%)",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 600, flexShrink: 0,
      }}>02</div>
      <div style={{ fontFamily: PRIMARY.fontFamily, fontSize: 14, fontWeight: 500, color: C.text }}>Summary</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TOAST BANNER
// ─────────────────────────────────────────────────────────────────────────────
const TemplatToastBanner = ({ onLoadNow, onDismiss }) => (
  <div style={{
    position: "fixed", right: 24, bottom: 24, width: 320, zIndex: 999,
    background: "linear-gradient(135deg,#E8532A 0%,#F06830 100%)",
    borderRadius: 12, padding: "14px 16px",
    display: "flex", alignItems: "center", gap: 14,
    boxShadow: "0 8px 30px rgba(0,0,0,.2)",
  }}>
    <button onClick={onDismiss} style={{
      width: 28, height: 28, borderRadius: "50%",
      background: "rgba(255,255,255,0.2)", border: "none",
      color: "#fff", cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0,
    }}>
      <CloseIcon fontSize="small" sx={{ color: "#fff", fontSize: 16 }} />
    </button>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Load Template</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
        Load a saved template to pre-fill the form
      </div>
    </div>
    <button onClick={onLoadNow} style={{
      padding: "7px 18px", borderRadius: 8, background: "#fff", border: "none",
      color: "#E8532A", fontSize: 13, fontWeight: 600, cursor: "pointer",
      flexShrink: 0, whiteSpace: "nowrap",
    }}>
      Load now
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
export const Sidebar = ({ sections, sectionStatus, activeSection, onSectionClick }) => (
  <div style={{
    width: 220, minWidth: 220, background: C.surface, borderRadius: 12,
    padding: "20px 14px", border: `1px solid ${C.border}`,
    height: "fit-content", position: "sticky", top: 10, alignSelf: "flex-start",
  }}>
    {sections.map((s, i) => {
      const done = sectionStatus[s.id];
      const active = activeSection === s.id;
      return (
        <div key={s.id}>
          {i > 0 && (
            <div style={{
              width: 2, height: 22, background: done ? C.primary : C.border,
              marginLeft: 20, transition: "background 0.3s",
            }} />
          )}
          <div onClick={() => onSectionClick(s.id)} style={{
            display: "flex", alignItems: "center", gap: 10,
            cursor: "pointer", padding: "6px 8px", borderRadius: 8,
            background: active ? C.primaryLight : "transparent",
            transition: "background 0.2s",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
              background: done ? C.primary : C.surfaceMuted,
              border: done ? "none" : `1.5px solid ${C.border}`,
              color: done ? "#fff" : C.textHint,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700,
              boxShadow: done ? "0 2px 6px rgba(59,111,212,0.25)" : "none",
            }}>
              {done ? <i className="ti ti-check" style={{ fontSize: 11 }} /> : i + 1}
            </div>
            <span style={{
              fontFamily: PRIMARY.fontFamily, fontSize: 13,
              fontWeight: done || active ? 600 : 500,
              color: active ? C.primary : C.textMuted,
            }}>
              {s.label}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE DIALOG
// ─────────────────────────────────────────────────────────────────────────────
const TemplateDialog = ({ templates, onClose, onApply, onDelete }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
    zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      background: C.surface, borderRadius: 14, width: 480,
      maxWidth: "90vw", maxHeight: "80vh", display: "flex", flexDirection: "column",
      border: `1px solid ${C.border}`,
    }}>
      <div style={{
        padding: "16px 22px", borderBottom: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 15, color: C.primary }}>
          <i className="ti ti-bookmark" style={{ fontSize: 18 }} />
          Saved templates
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted }}>
          <i className="ti ti-x" style={{ fontSize: 18 }} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px" }}>
        {templates.length === 0 ? (
          <p style={{ color: C.textHint, fontSize: 13, textAlign: "center", margin: "24px 0" }}>
            No templates saved yet.
          </p>
        ) : templates.map(t => {
          const jd = t.job_details;
          return (
            <div key={t.template_id} onClick={() => onApply(t)} style={{
              padding: "12px 14px", marginBottom: 8,
              border: `1px solid ${C.border}`, borderRadius: 10,
              cursor: "pointer", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.background = C.primaryLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: C.primary }}>{t.template_name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: C.textMuted }}>
                    {jd.domain}{jd.function ? ` › ${jd.function}` : ""}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: C.textHint }}>
                    {t.created_at ? new Date(t.created_at).toLocaleDateString("en-GB") : ""}
                  </span>
                  {/* <button onClick={e => { e.stopPropagation(); onDelete(t.template_id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: C.danger, padding: 4 }}>
                    <i className="ti ti-trash" style={{ fontSize: 14 }} />
                  </button> */}
                  <DeleteOutlineOutlinedIcon onClick={e => { e.stopPropagation(); onDelete(t.template_id);}}
                    sx={{fontSize:15,color:"#FF5722"}}
                    />
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 7, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 10, padding: "2px 8px", background: C.primaryLight,
                  color: C.primary, border: `1px solid ${C.tagBorder}`, borderRadius: 10,
                }}>{jd.domain}</span>
                {jd.mode && (
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 10,
                    background: jd.mode === "normal" ? "#FFF8E1" : "#E8F5E9",
                    color: jd.mode === "normal" ? "#F57F17" : "#2E7D32",
                    border: `1px solid ${jd.mode === "normal" ? "#FFE082" : "#A5D6A7"}`,
                  }}>
                    {jd.mode === "normal" ? "Standard" : "Advanced"}
                  </span>
                )}
                {jd.mode_of_work && (
                  <span style={{
                    fontSize: 10, padding: "2px 8px", background: C.surfaceMuted,
                    color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: 10,
                  }}>{jd.mode_of_work}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "12px 22px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{
          padding: "8px 20px", borderRadius: 8, border: `1px solid ${C.border}`,
          background: C.surface, fontSize: 13, cursor: "pointer", color: C.textMuted,
        }}>Close</button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CLINICAL SKILLS PANEL
// ─────────────────────────────────────────────────────────────────────────────
const ClinicalSkillsPanel = memo(({
  skillMode, onModeChange, subFunctionKey, selectedSubFunction,
  isClinicalDataManagement, isClinicalDataManagerSub, isClinicalProgrammerSub,
  selections, setters, errors,
}) => {
  const { data: normalSkillsData = [] } = useGetNormalSkillsQuery(subFunctionKey, {
    skip: !subFunctionKey || skillMode !== "normal",
  });
  const normalSkillsOptions = Array.isArray(normalSkillsData)
    ? normalSkillsData
    : normalSkillsData?.data || [];

  const { data: primarySkillsData = [] } = useGetPrimarySkillsQuery(subFunctionKey, {
    skip: !subFunctionKey || skillMode !== "advanced" || isClinicalDataManagement || isClinicalProgrammerSub,
  });

  const { data: mandatorySkillsData = [] } = useGetMandatorySkillsQuery(
    { subFunction: subFunctionKey, primarySelected: selections.primarySkills.join(",") },
    {
      skip: !subFunctionKey || skillMode !== "advanced" ||
        (!isClinicalDataManagerSub && selections.primarySkills.length === 0),
    }
  );

  const { data: secondarySkillsData = [] } = useGetSecondarySkillsQuery(
    {
      subFunction: subFunctionKey,
      primarySelected: selections.primarySkills.join(","),
      mandatorySelected: selections.mandatorySkills.join(","),
    },
    {
      skip: !subFunctionKey || skillMode !== "advanced" ||
        (!isClinicalDataManagerSub && selections.primarySkills.length === 0) ||
        selections.mandatorySkills.length === 0,
    }
  );

  const { data: cpMandatory = [] } = useGetCPSkillsQuery("advanced", {
    skip: !isClinicalProgrammerSub || skillMode !== "advanced",
  });

  const { data: cpSecondaryData = [] } = useGetCPRemainingSkillsQuery(
    { mode: "advanced", selectedSkills: selections.cpMandatory },
    { skip: !isClinicalProgrammerSub || skillMode !== "advanced" || selections.cpMandatory.length === 0 }
  );

  const { data: cpNormalSkills = [] } = useGetCPSkillsQuery("normal", {
    skip: !isClinicalProgrammerSub || skillMode !== "normal",
  });

  const { data: edcToolsData = [] } = useGetEdcToolsQuery();
  const { data: therapeuticAreasData = [] } = useGetTherapeuticAreasQuery();

  const primaryWithKey = primarySkillsData.map(s => ({ key: s.key, label: s.lable || s.label }));

  return (
    <SectionCard>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Skills</div>
        <div style={{ display: "flex", gap: 4, background: "#E8EAED", borderRadius: 8, padding: 3, flexShrink: 0 }}>
          {["normal", "advanced"].map(m => (
            <button key={m} onClick={() => onModeChange(m)} style={{
              padding: "6px 16px", borderRadius: 6, border: "none",
              background: skillMode === m ? C.primary : "transparent",
              color: skillMode === m ? "#fff" : C.textMuted,
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}>
              {m === "normal" ? "Standard" : "Advanced"}
            </button>
          ))}
        </div>
      </div>

      {skillMode === "normal" ? (
        <FieldRow>
          <FieldLabel error={errors.normalSkills}>Skills *</FieldLabel>
          <GroupedSkillAutocomplete
            options={isClinicalProgrammerSub ? cpNormalSkills : normalSkillsOptions}
            value={selections.normalSkills}
            onChange={setters.normalSkills}
            placeholder="Select Skills"
          />
          <ErrorText msg={errors.normalSkills} />
        </FieldRow>
      ) : (
        <>
          {!isClinicalDataManagement && !isClinicalProgrammerSub && (
            <FieldRow>
              <FieldLabel error={errors.primarySkills}>Primary skills *</FieldLabel>
              <GroupedSkillAutocomplete
                options={primaryWithKey}
                value={selections.primarySkills}
                onChange={setters.primarySkills}
                placeholder="Select Primary Skills"
              />
              <ErrorText msg={errors.primarySkills} />
            </FieldRow>
          )}
          <FieldRow>
            <FieldLabel error={errors.mandatorySkills}>Mandatory skills *</FieldLabel>
            <GroupedSkillAutocomplete
              showTooltip
              options={isClinicalProgrammerSub ? cpMandatory : mandatorySkillsData}
              value={isClinicalProgrammerSub ? selections.cpMandatory : selections.mandatorySkills}
              onChange={isClinicalProgrammerSub ? setters.cpMandatory : setters.mandatorySkills}
              placeholder="Select Mandatory Skills"
            />
            <ErrorText msg={errors.mandatorySkills} />
          </FieldRow>
          <FieldRow>
            <FieldLabel>Secondary skills</FieldLabel>
            <GroupedSkillAutocomplete
              options={
                isClinicalProgrammerSub
                  ? cpSecondaryData
                  : secondarySkillsData.filter(s => !selections.mandatorySkills.includes(s.key))
              }
              value={isClinicalProgrammerSub ? selections.cpSecondary : selections.secondarySkills}
              onChange={isClinicalProgrammerSub ? setters.cpSecondary : setters.secondarySkills}
              placeholder="Select Secondary Skills"
            />
          </FieldRow>
          {(isClinicalDataManagerSub || isClinicalProgrammerSub) && (
            <FieldRow>
              <FieldLabel error={errors.edcTools}>EDC tools *</FieldLabel>
              <GroupedSkillAutocomplete
                options={(edcToolsData || []).map(item => ({ ...item, label: item.lable || item.label }))}
                value={selections.edcTools}
                onChange={setters.edcTools}
                placeholder="Select EDC Tools"
              />
              <ErrorText msg={errors.edcTools} />
            </FieldRow>
          )}
          {isClinicalDataManagement && (
            <FieldRow>
              <FieldLabel>Preferred therapeutic experience</FieldLabel>
              <GroupedSkillAutocomplete
                options={therapeuticAreasData.map(item => ({ ...item, label: item.lable }))}
                value={selections.therapeutic}
                onChange={setters.therapeutic}
                placeholder="Select Therapeutic Areas"
              />
            </FieldRow>
          )}
        </>
      )}
    </SectionCard>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// NON-CLINICAL SKILLS PANEL
// ─────────────────────────────────────────────────────────────────────────────
const NonClinicalSkillsPanel = memo(({ domain, selections, setters, errors }) => {
  const options = domain === "it" ? STATIC.domainSkillsIT : STATIC.domainSkillsNonIT;
  return (
    <SectionCard>
      <SectionHeader title="Skills" />
      <FieldRow>
        <FieldLabel error={errors.domainSkills}>Skills *</FieldLabel>
        <MultiSelect
          options={options} selected={selections.domainSkills}
          onChange={setters.domainSkills} placeholder="select" error={errors.domainSkills}
        />
        <ErrorText msg={errors.domainSkills} />
      </FieldRow>
    </SectionCard>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FORM
// ─────────────────────────────────────────────────────────────────────────────
const CreateRequisitionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ── Capture edit state ONCE on mount into refs ──
  // This prevents location.state changes (from navigate()) from
  // wiping isEditMode mid-session and triggering auto-select effects.
  const editModeRef = useRef(location.state?.editMode || false);
  const editDataRef = useRef(location.state?.requisitionData || null);
  const editJobIdRef = useRef(location.state?.jobDetailsId || null);

  const isEditMode = editModeRef.current;
  const editJobId = editJobIdRef.current;
  const returnTo = editModeRef?.returnTo;
  const [activeStep, setActiveStep] = useState(1);
  const [summaryData, setSummaryData] = useState("");
  const [jobDetailsId, setJobDetailsId] = useState("");
  const [isEditAfterSummary, setIsEditAfterSummary] = useState(false);

  const orgId = location.state?.orgId;
  const [currentOrgId] = useState(location.state?.orgId);

  // ── Domain / Function / SubFunction ──
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [selectedSubFunction, setSelectedSubFunction] = useState("");
  const [subFunctionKey, setSubFunctionKey] = useState("");
  const [skillMode, setSkillMode] = useState("normal");

  // ── UI state ──
  const [activeSection, setActiveSection] = useState("roleSetup");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [deletedTemplateIds, setDeletedTemplateIds] = useState([]);
  const [showTemplatePrompt, setShowTemplatePrompt] = useState(false);
  const [minimizeTemplatePrompt, setMinimizeTemplatePrompt] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Job info ──
  const [designation, setDesignation] = useState("");
  const [experience, setExperience] = useState({ min: "", max: "" });
  const [availability, setAvailability] = useState("");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [positionsCount, setPositionsCount] = useState("One");
  const [priority, setPriority] = useState("High");
  const [jobType, setJobType] = useState("Full Time");
  const [workMode, setWorkMode] = useState("Onsite");
  const [salaryUnit, setSalaryUnit] = useState("INR / Per Annum");
  const [salary, setSalary] = useState("");
  const [closingDate, setClosingDate] = useState(getTodayPlus30());

  // ── Team ──
  const [approver, setApprover] = useState(null);
  const [taTeam, setTaTeam] = useState([]);
  const [creator, setCreator] = useState(null);
  const [jdFile, setJdFile] = useState(null);

  // ── Job description ──
  const [instructions, setInstructions] = useState("");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  // ── Skills ──
  const [normalSkills, setNormalSkills] = useState([]);
  const [primarySkills, setPrimarySkills] = useState([]);
  const [mandatorySkills, setMandatorySkills] = useState([]);
  const [secondarySkills, setSecondarySkills] = useState([]);
  const [cpMandatory, setCpMandatory] = useState([]);
  const [cpSecondary, setCpSecondary] = useState([]);
  const [edcTools, setEdcTools] = useState([]);
  const [therapeutic, setTherapeutic] = useState([]);
  const [domainSkills, setDomainSkills] = useState([]);

  const [errors, setErrors] = useState({});
  const [requisitionData, setRequisitionData] = useState(null);

  // ── RTK Queries ──
  const { data: countries = [] } = useGetCountriesQuery();
  const { data: cities = [] } = useGetCitiesByCountryQuery(country, { skip: !country });
  const { data: approversResponse } = useGetApproversQuery(
    { orgID: currentOrgId },
    { skip: !currentOrgId }
  );
  const approvers = approversResponse?.data || [];

  const { data: templatesResponse } = useGetTemplatesQuery(
    { orgID: currentOrgId },
    { skip: !currentOrgId }
  );
  const allTemplates = templatesResponse?.data || [];
  const [deleteTemplate] = useDeleteTemplateMutation();

  const { data: subFunctionsData = [] } = useGetSubFunctionsQuery(selectedFunction, {
    skip: !selectedFunction || selectedDomain !== "clinical",
  });

  // ── RTK Mutation ──
  const [createRequisition, { isLoading: isSubmitting }] = useCreateRequisitionMutation();
  const [editJob, { isLoading: isUpdating }] =
    useEditJobMutation();

  // ── Derived ──
  const localTemplates = allTemplates.filter(t => !deletedTemplateIds.includes(t.template_id));
  const isClinical = selectedDomain === "clinical";
  const isNonClinical = selectedDomain !== "" && selectedDomain !== "clinical";
  const isCDM = selectedFunction === "clinical data management";
  const isCDMSub = selectedSubFunction === "Clinical Data Manager";
  const isCPSub = selectedSubFunction === "Clinical Programmer/CRF Developer";

  const subFunctionOptions = subFunctionsData.map((s) => {
    let disabled = false;
    if (selectedFunction === "biostatistics" && s.key === "biostatistician") disabled = true;
    if (selectedFunction === "clinical data management" && s.key === "medical coder") disabled = true;
    return { value: s.lable, label: s.lable, disabled, subFunction: s.sub_function };
  });

  // ── Style helpers ──
  const flatSelectStyle = {
    width: "100%", border: "none", outline: "none", background: "#fff",
    fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize,
    color: C.text, cursor: "pointer", padding: "10px 5px",
  };
  const muiSelectSx = {
    fontFamily: PRIMARY.fontFamily,
    "& .MuiSelect-select": { fontSize: PRIMARY.label.fontSize, fontFamily: PRIMARY.fontFamily },
  };
  const muiMenuItemSx = {
    fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize,
    "&:hover": { backgroundColor: "#EEF2FF" },
  };

  // ── Handlers ──
  const handleDomainChange = (val) => {
    setSelectedDomain(val);
    setSelectedFunction(""); setSelectedSubFunction(""); setSubFunctionKey("");
    setNormalSkills([]); setPrimarySkills([]); setMandatorySkills([]);
    setSecondarySkills([]); setCpMandatory([]); setCpSecondary([]);
    setEdcTools([]); setTherapeutic([]); setDomainSkills([]);
    setErrors({});
  };

  const handleFunctionChange = (val) => {
    setSelectedFunction(val);
    setSelectedSubFunction(""); setSubFunctionKey("");
  };

  const handleSubFunctionChange = (val) => {
    setSelectedSubFunction(val);
    const match = subFunctionsData.find(s => s.lable === val);
    setSubFunctionKey(match?.sub_function || "");
    setDesignation(generateTitle(val));
  };

  const handleSkillModeChange = (mode) => {
    setSkillMode(mode);
    setNormalSkills([]); setPrimarySkills([]); setMandatorySkills([]);
    setSecondarySkills([]); setCpMandatory([]); setCpSecondary([]);
  };
  const handleCancel = () => {
    if (returnTo === "matchedCandidates") {
      navigate("/account-manager/matched-candidates", {
        state: {
          requisitionData,
          orgId,
        },
      });
      return;
    }

    if (isEditAfterSummary || returnTo === "summary") {
      setActiveStep(2);
      return;
    }

    navigate(-1);
  };
  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = () => {
    const errs = {};
    if (!selectedDomain) errs.domain = "Required";
    if (!positionsCount) errs.positionsCount = "Required";
    if (isClinical && !selectedFunction) errs.function = "Required";
    if (isClinical && !selectedSubFunction) errs.subFunction = "Required";
    if (!designation.trim()) errs.designation = "Job title is required";
    if (experience.min === "" || experience.min === null) errs.min = "Required";
    if (!experience.max) errs.max = "Required";
    if (experience.min !== "" && experience.max && Number(experience.max) < Number(experience.min)) {
      errs.max = "Max must be ≥ Min";
    }
    if (!availability) errs.availability = "Required";
    if (!country) errs.country = "Required";
    if (!jobType) errs.jobType = "Required";
    if (!workMode) errs.workMode = "Required";
    if (!priority) errs.priority = "Required";
    if (!closingDate) errs.closingDate = "Required";
    if (!approver) errs.approver = "Approver is required";
    if (!creator) errs.creator = "Creator is required";
    if (isClinical) {
      if (skillMode === "normal" && normalSkills.length === 0) errs.normalSkills = "Select at least one skill";
      if (skillMode === "advanced") {
        if (!isCDM && !isCPSub && primarySkills.length === 0) errs.primarySkills = "Required";
        const hasMandatory = isCPSub ? cpMandatory.length > 0 : mandatorySkills.length > 0;
        if (!hasMandatory) errs.mandatorySkills = "Required";
        if ((isCDMSub || isCPSub) && edcTools.length === 0) errs.edcTools = "Required";
      }
    } else if (isNonClinical && domainSkills.length === 0) {
      errs.domainSkills = "Select at least one skill";
    }
    if (saveAsTemplate && !templateName.trim()) errs.templateName = "Template name is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── SUBMIT ──
  const handleSubmit = async () => {
    setSubmitError("");
    if (!validate()) return;

    const requisitionFormData = {
      selectedDomain, selectedFunction, selectedSubFunction, subFunctionKey, skillMode,
      designation, experience, availability, country, city, positionsCount,
      priority, jobType, workMode, salaryUnit, salary, closingDate,
      creatorId: creator?.employee_id,
      approverId: approver?.employee_id,
      taTeam, instructions,
      normalSkills, primarySkills, mandatorySkills, secondarySkills,
      cpMandatory, cpSecondary, edcTools, therapeutic, domainSkills,
    };

    const fd = new FormData();
    fd.append("organisation_id", orgId || "");
    fd.append("org_emp_id", creator?.employee_id || "");
    fd.append("job_approver", approver?.employee_id || "");
    fd.append("domain", selectedDomain);
    fd.append("function", selectedFunction);
    fd.append("sub_function", subFunctionKey);
    fd.append("designation", designation);
    fd.append("no_of_positions", positionsCount);
    fd.append("min_years", experience.min);
    fd.append("max_years", experience.max);
    fd.append("availability", availability);
    fd.append("country", country);
    fd.append("city", city);
    fd.append("priority", priority);
    fd.append("job_type", jobType);
    fd.append("mode_of_work", workMode);
    fd.append("salary_range", salary);
    fd.append("salary_unit", salaryUnit);
    fd.append("closing_date", closingDate || "");
    fd.append("mode", skillMode);

    if (isClinical) {
      if (skillMode === "normal") {
        fd.append("normal_skills", normalSkills.join(","));
      } else {
        fd.append("primaryskills", primarySkills.join(","));
        fd.append("mandatoryskills", isCPSub ? cpMandatory.join(",") : mandatorySkills.join(","));
        fd.append("secondaryskills", isCPSub ? cpSecondary.join(",") : secondarySkills.join(","));
        fd.append("edc", edcTools.join(","));
        fd.append("therapeutic_areas", therapeutic.join(","));
      }
    } else {
      fd.append("additional_skill_1", domainSkills.join(","));
    }

    fd.append("recruiter", taTeam.join(","));
    fd.append("text", instructions);
    fd.append("save_as_template", saveAsTemplate ? "true" : "false");
    if (saveAsTemplate) {
      fd.append("template_name", templateName);
      fd.append("template_description", templateDescription);
    }
    if (jdFile) fd.append("file", jdFile);
    try {
      let result;
      if (editModeRef.current || isEditAfterSummary) {
        result = await editJob({
          jobId: editJobId || jobDetailsId,
          formData: fd,
        }).unwrap();

        setSummaryData(
          result?.data?.summary ||
          result?.summary ||
          summaryData
        );

        setJobDetailsId(
          editJobId || jobDetailsId
        );

        setRequisitionData(requisitionFormData);

        setIsEditAfterSummary(false);

        setActiveStep(2);

        return;
      }

      result = await createRequisition(fd).unwrap();

      setSummaryData(result?.data?.summary || result?.summary || "");
      setJobDetailsId(result?.data?.job_details_id || result?.job_details_id);
      setRequisitionData(requisitionFormData);
      setActiveStep(2);

    } catch (err) {
      console.error("Submit failed:", err);
      setSubmitError(
        err?.data?.message ||
        err?.error ||
        "Submission failed. Please try again."
      );
    }

    // try {
    //   const result = await createRequisition(fd).unwrap();
    //   setSummaryData(result?.data?.summary || result?.summary || "");
    //   setJobDetailsId(result?.data?.job_details_id || result?.job_details_id);
    //   setRequisitionData(requisitionFormData);
    //   setActiveStep(2);
    // } catch (err) {
    //   console.error("Submit failed:", err);
    //   setSubmitError(err?.data?.message || err?.error || "Submission failed. Please try again.");
    // }
  };

const handleApplyTemplate = (template) => {
    const jd = template.job_details;

    setSelectedDomain(jd.domain || "clinical");
    setSelectedFunction(jd.function || "");
    setSelectedSubFunction(jd.sub_function || "");
    setDesignation(jd.job_title || "");
    setExperience({ min: jd.min_years || "", max: jd.max_years || "" });
    setAvailability(String(jd.availability || ""));
    setCountry(jd.country || "India");
    setCity(jd.city || "");
    setPositionsCount(jd.no_of_positions || "One");
    setPriority(jd.priority || "High");
    setJobType(jd.job_type || "Full Time");
    setWorkMode(jd.mode_of_work || "Onsite");
    setSalary(jd.salary_range || "");
    setSalaryUnit(jd.salary_unit || "INR / Per Annum");
    setClosingDate(jd.closing_date ? jd.closing_date.split("T")[0] : "");
    setSkillMode(jd.mode || "normal");
    setNormalSkills(jd.normal_skills?.[0] ? jd.normal_skills[0].split(",") : []);
    setPrimarySkills(jd.primaryskills?.[0] ? jd.primaryskills[0].split(",") : []);
    setMandatorySkills(jd.mandatoryskills?.[0] ? jd.mandatoryskills[0].split(",") : []);
    setSecondarySkills(jd.secondaryskills?.[0] ? jd.secondaryskills[0].split(",") : []);
    setEdcTools(jd.edc?.[0] ? jd.edc[0].split(",") : []);
    setTherapeutic(jd.therapeutic_area?.[0] ? jd.therapeutic_area[0].split(",").filter(Boolean) : []);

    // ✅ creator is template.created_by (root level), NOT inside job_details
    const selectedCreator = approvers.find(a => a.employee_id === template.created_by);
    setCreator(selectedCreator || null);

    const selectedApprover = approvers.find(a => a.employee_id === jd.job_approver);
    setApprover(selectedApprover || null);

    setTaTeam(jd.recruiter || []);
    setTemplateDialogOpen(false);
     setShowTemplatePrompt(false);

  // move template card under sidebar
  setMinimizeTemplatePrompt(true);
  };  

  const handleDeleteTemplate = async (templateId) => {
    console.log("templateId =", templateId);
  console.log("type =", typeof templateId);
  try {
    await deleteTemplate({
      templateId,
      organisationId:orgId,
    }).unwrap();

    setDeletedTemplateIds((prev) => [...prev, templateId]);

    // optional success toast
    // toast.success("Template deleted successfully");
  } catch (error) {
    console.error("Delete template failed", error);

    // optional error toast
    // toast.error("Failed to delete template");
  }
};

  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────

  // Effect 1: Clean up location state immediately on mount (edit mode only).
  // Runs once. Strips editMode/requisitionData from URL state so a page
  // refresh doesn't re-trigger edit mode. The refs already hold the data.
  useEffect(() => {
    if (!editModeRef.current) return;
    navigate(location.pathname, {
      replace: true,
      state: { orgId },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect 2: Hydrate all scalar fields from editData on mount (edit mode only).
  useEffect(() => {
    if (!editModeRef.current || !editDataRef.current) return;
    const ed = editDataRef.current;

    setSelectedDomain(ed.selectedDomain);
    setSelectedFunction(ed.selectedFunction);
    setSelectedSubFunction(ed.selectedSubFunction);
    setSubFunctionKey(ed.subFunctionKey);
    setSkillMode(ed.skillMode);
    setDesignation(ed.designation);
    setExperience(ed.experience);
    setAvailability(ed.availability);
    setCountry(ed.country);
    setCity(ed.city);
    setPositionsCount(ed.positionsCount);
    setPriority(ed.priority);
    setJobType(ed.jobType);
    setWorkMode(ed.workMode);
    setSalaryUnit(ed.salaryUnit);
    setSalary(ed.salary);
    setClosingDate(ed.closingDate);
    setTaTeam(ed.taTeam || []);
    setInstructions(ed.instructions);
    setNormalSkills(ed.normalSkills || []);
    setPrimarySkills(ed.primarySkills || []);
    setMandatorySkills(ed.mandatorySkills || []);
    setSecondarySkills(ed.secondarySkills || []);
    setCpMandatory(ed.cpMandatory || []);
    setCpSecondary(ed.cpSecondary || []);
    setEdcTools(ed.edcTools || []);
    setTherapeutic(ed.therapeutic || []);
    setDomainSkills(ed.domainSkills || []);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect 3: Resolve creator/approver once the approvers list arrives.
  // Depends on approvers so it retries until the API responds.
  useEffect(() => {
    if (!editModeRef.current || !editDataRef.current) return;
    if (approvers.length === 0) return;
    const ed = editDataRef.current;

    const selectedCreator = approvers.find(a => a.employee_id === ed.creatorId);
    const selectedApprover = approvers.find(a => a.employee_id === ed.approverId);
    setCreator(selectedCreator || null);
    setApprover(selectedApprover || null);
  }, [approvers]);

  // Effect 4: Auto-select subfunction for NON-edit mode only.
  // editModeRef.current is always the original value — safe to check here.
  useEffect(() => {
    if (editModeRef.current) return;
    if (!selectedFunction || !subFunctionsData.length) return;

    if (selectedFunction === "biostatistics") {
      const opt = subFunctionsData.find(s => s.key === "statistical programmer");
      if (opt) {
        setSelectedSubFunction(opt.lable);
        setSubFunctionKey(opt.sub_function);
        setDesignation(generateTitle(opt.lable));
      }
    }

    if (selectedFunction === "clinical data management") {
      const opt = subFunctionsData.find(s => s.key === "clinical data manager");
      if (opt) {
        setSelectedSubFunction(opt.lable);
        setSubFunctionKey(opt.sub_function);
        setDesignation(generateTitle(opt.lable));
      }
    }
  }, [selectedFunction, subFunctionsData]);

  // Effect 5: Sync subFunctionKey when subFunctionsData loads — NON-edit mode only.
  useEffect(() => {
    if (editModeRef.current) return;
    if (!selectedFunction || !selectedSubFunction) return;

    const match = subFunctionsData.find(s => s.lable === selectedSubFunction);
    if (match) setSubFunctionKey(match.sub_function);
  }, [subFunctionsData, selectedSubFunction]);

  // Effect 6: Show template prompt when templates arrive.
  useEffect(() => {
    if (allTemplates.length > 0) setShowTemplatePrompt(true);
  }, [allTemplates]);

  // ── Section status ──
  const sectionStatus = {
    roleSetup: !!(selectedDomain && positionsCount && (!isClinical || (selectedFunction && selectedSubFunction))),
    jobInfo: !!(designation.trim() && experience.min !== "" && experience.max && availability && country),
    skills: isClinical
      ? (skillMode === "normal" ? normalSkills.length > 0 : (isCPSub ? cpMandatory.length > 0 : mandatorySkills.length > 0))
      : (isNonClinical ? domainSkills.length > 0 : false),
    additionalInfo: !!(jobType && workMode && priority && closingDate),
    team: !!(approver && creator),
    jobDescription: true,
  };

  const SECTIONS = [
    { id: "roleSetup", label: "Role Setup" },
    { id: "jobInfo", label: "Job Info & Experience" },
    { id: "skills", label: "Skills" },
    { id: "additionalInfo", label: "Additional Info" },
    { id: "team", label: "Team" },
    { id: "jobDescription", label: "Job Description" },
  ];

  const skillSetters = {
    normalSkills: setNormalSkills, primarySkills: setPrimarySkills,
    mandatorySkills: setMandatorySkills, secondarySkills: setSecondarySkills,
    cpMandatory: setCpMandatory, cpSecondary: setCpSecondary,
    edcTools: setEdcTools, therapeutic: setTherapeutic, domainSkills: setDomainSkills,
  };
  const skillSelections = {
    normalSkills, primarySkills, mandatorySkills, secondarySkills,
    cpMandatory, cpSecondary, edcTools, therapeutic, domainSkills,
  };

  // ── Step 2: Summary Page ──
  if (activeStep === 2) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: 14,
        background: "#fff",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Sidebar
          sections={SECTIONS}
          sectionStatus={sectionStatus}
          activeSection={activeSection}
          onSectionClick={scrollTo}
        />
{/* 
        {minimizeTemplatePrompt && (
          <div
            onClick={() => {
              setShowTemplatePrompt(true);
              setMinimizeTemplatePrompt(false);
            }}
            style={{
              background:
                "linear-gradient(135deg,#E8532A 0%,#F06830 100%)",
              borderRadius: 12,
              padding: 12,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 700 }}>Templates</div>
            <div style={{ fontSize: 12 }}>
              Click to load saved templates
            </div>
          </div>
        )} */}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <StepperHeader activeStep={activeStep} />

        <SummaryPage
          summary={summaryData}
          jobDetailsId={jobDetailsId}
          setActiveStep={setActiveStep}
          orgEmpId={creator?.employee_id}
          formData={requisitionData}
          orgId={orgId}
          isEditMode={isEditMode}
          setIsEditAfterSummary={setIsEditAfterSummary}
          SECTIONS={SECTIONS}
        />
      </div>
    </div>
  );
}

  return (
    <div style={{
      display: "flex", gap: 14, padding: 14,
      height: "calc(100vh - 70px)", background: "#fff", boxSizing: "border-box",
    }}>
      {/* ── SIDEBAR ── */}
      <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
        <Sidebar
          sections={SECTIONS} sectionStatus={sectionStatus}
          activeSection={activeSection} onSectionClick={scrollTo}
        />
        {minimizeTemplatePrompt && (
          <div onClick={() => { setShowTemplatePrompt(true); setMinimizeTemplatePrompt(false); }}
            style={{
              background: "linear-gradient(135deg,#E8532A 0%,#F06830 100%)",
              borderRadius: 12, padding: 12, color: "#fff", cursor: "pointer",
            }}>
            <div style={{ fontWeight: 700 }}>Templates</div>
            <div style={{ fontSize: 12 }}>Click to load saved templates</div>
          </div>
        )}
      </div>

      {/* ── MAIN SCROLL AREA ── */}
      <div style={{ flex: 1, overflowY: "auto", maxHeight: "100vh", paddingRight: 2 }}>
        <StepperHeader activeStep={activeStep} />

        {showTemplatePrompt && (
          <TemplatToastBanner
            onLoadNow={() => setTemplateDialogOpen(true)}
            onDismiss={() => { setShowTemplatePrompt(false); setMinimizeTemplatePrompt(true); }}
          />
        )}

        {/* ── ROLE SETUP ── */}
        <div id="roleSetup" style={{ marginBottom: 12 }}>
          <SectionCard>
            <SectionHeader title="Role setup" />

            <FieldRow style={errors.domain ? { borderColor: C.danger } : {}}>
              <FieldLabel error={errors.domain}>Select domain *</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={selectedDomain} onChange={e => handleDomainChange(e.target.value)}
                  displayEmpty sx={muiSelectSx}
                  renderValue={s => s
                    ? DOMAINS.find(d => d.value === s)?.label
                    : <span style={{ color: C.textHint }}>Select Domain</span>
                  }>
                  {DOMAINS.map(d => <MenuItem key={d.value} value={d.value} sx={muiMenuItemSx}>{d.label}</MenuItem>)}
                </Select>
              </FormControl>
              <ErrorText msg={errors.domain} />
            </FieldRow>

            {isClinical && (
              <FieldRow style={errors.function ? { borderColor: C.danger } : {}}>
                <FieldLabel error={errors.function}>Select Function *</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={selectedFunction} onChange={e => handleFunctionChange(e.target.value)}
                    displayEmpty sx={muiSelectSx}
                    renderValue={s => s
                      ? FUNCTIONS.find(f => f.key === s)?.label
                      : <span style={{ color: C.textHint }}>Select Function</span>
                    }>
                    {FUNCTIONS.map(f => <MenuItem key={f.key} value={f.key} sx={muiMenuItemSx}>{f.label}</MenuItem>)}
                  </Select>
                </FormControl>
                <ErrorText msg={errors.function} />
              </FieldRow>
            )}

            <FieldRow>
              <FieldLabel error={errors.positionsCount}>Select no of positions *</FieldLabel>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {POSITIONS.map(p => (
                  <ToggleChip key={p} label={p} selected={positionsCount === p}
                    onClick={() => { setPositionsCount(p); setErrors(e => ({ ...e, positionsCount: "" })); }} />
                ))}
              </div>
              <ErrorText msg={errors.positionsCount} />
            </FieldRow>

            {isClinical && (
              <FieldRow style={errors.subFunction ? { borderColor: C.danger } : {}}>
                <FieldLabel error={errors.subFunction}>Select Sub Function *</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={selectedSubFunction} onChange={e => handleSubFunctionChange(e.target.value)}
                    disabled={!selectedFunction} displayEmpty
                    sx={{ ...muiSelectSx, "&.Mui-disabled": { bgcolor: "#F3F4F6" } }}
                    renderValue={s => s
                      ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>
                        {subFunctionOptions.find(o => o.value === s)?.label}
                      </span>
                      : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>
                        Select Sub Function
                      </span>
                    }>
                    {subFunctionOptions.map(o => (
                      <MenuItem key={o.value} value={o.value} disabled={o.disabled} sx={muiMenuItemSx}>{o.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <ErrorText msg={errors.subFunction} />
              </FieldRow>
            )}
          </SectionCard>
        </div>

        {/* ── JOB INFO ── */}
        <div id="jobInfo" style={{ marginBottom: 12 }}>
          <SectionCard>
            <SectionHeader title="Job info & experience" />

            <FieldRow style={errors.designation ? { borderColor: C.danger } : {}}>
              <FieldLabel error={errors.designation}>Job title *</FieldLabel>
              <input value={designation}
                onChange={e => { setDesignation(e.target.value); setErrors(v => ({ ...v, designation: "" })); }}
                placeholder="e.g. Senior Statistical Programmer"
                style={{ ...flatSelectStyle, cursor: "text" }} />
              <ErrorText msg={errors.designation} />
            </FieldRow>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <FieldRow style={errors.min ? { borderColor: C.danger } : {}}>
                <FieldLabel error={errors.min}>Min experience (yrs) *</FieldLabel>
                <input type="number" min={0} value={experience.min}
                  onChange={e => { setExperience(v => ({ ...v, min: e.target.value })); setErrors(v => ({ ...v, min: "" })); }}
                  placeholder="0" style={{ ...flatSelectStyle, cursor: "text" }} />
                <ErrorText msg={errors.min} />
              </FieldRow>
              <FieldRow style={errors.max ? { borderColor: C.danger } : {}}>
                <FieldLabel error={errors.max}>Max experience (yrs) *</FieldLabel>
                <input type="number" min={0} value={experience.max}
                  onChange={e => { setExperience(v => ({ ...v, max: e.target.value })); setErrors(v => ({ ...v, max: "" })); }}
                  placeholder="10" style={{ ...flatSelectStyle, cursor: "text" }} />
                <ErrorText msg={errors.max} />
              </FieldRow>
            </div>

            <FieldRow style={errors.availability ? { borderColor: C.danger } : {}}>
              <FieldLabel error={errors.availability}>Availability *</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={availability}
                  onChange={e => { setAvailability(e.target.value); setErrors(v => ({ ...v, availability: "" })); }}
                  displayEmpty sx={muiSelectSx}
                  renderValue={s => s
                    ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>
                      {AVAILABILITY.find(a => a.value === s)?.label}
                    </span>
                    : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>
                      Select Availability
                    </span>
                  }>
                  {AVAILABILITY.map(a => <MenuItem key={a.value} value={a.value} sx={muiMenuItemSx}>{a.label}</MenuItem>)}
                </Select>
              </FormControl>
              <ErrorText msg={errors.availability} />
            </FieldRow>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <FieldRow style={errors.country ? { borderColor: C.danger } : {}}>
                <FieldLabel error={errors.country}>Country *</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={country}
                    onChange={e => { setCountry(e.target.value); setCity(""); setErrors(v => ({ ...v, country: "" })); }}
                    displayEmpty sx={muiSelectSx}
                    renderValue={s => s
                      ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>{s}</span>
                      : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>Select Country</span>
                    }>
                    {countries.map(c => <MenuItem key={c} value={c} sx={muiMenuItemSx}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
                <ErrorText msg={errors.country} />
              </FieldRow>
              <FieldRow>
                <FieldLabel>City</FieldLabel>
                <FormControl fullWidth size="small">
                  <Autocomplete
                    options={cities} value={city}
                    onChange={(_, value) => setCity(value || "")}
                    disabled={!country} fullWidth size="small"
                    sx={{
                      "& .MuiInputBase-input": { fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize },
                      "& .MuiOutlinedInput-root": { fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize },
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select City"
                        sx={{ "& .MuiOutlinedInput-root": { ...muiSelectSx } }} />
                    )}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: "4px", borderRadius: "8px",
                          "& .MuiAutocomplete-option": {
                            fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize,
                            minHeight: "unset", padding: "8px 14px",
                          },
                          "& .MuiAutocomplete-option.Mui-focused": { backgroundColor: "#F5F7FF" },
                          "& .MuiAutocomplete-option[aria-selected='true']": { backgroundColor: "#EEF2FF" },
                        },
                      },
                    }}
                  />
                </FormControl>
              </FieldRow>
            </div>
          </SectionCard>
        </div>

        {/* ── SKILLS ── */}
        <div id="skills" style={{ marginBottom: 12 }}>
          {isClinical && subFunctionKey && (
            <ClinicalSkillsPanel
              skillMode={skillMode} onModeChange={handleSkillModeChange}
              subFunctionKey={subFunctionKey} selectedSubFunction={selectedSubFunction}
              isClinicalDataManagement={isCDM} isClinicalDataManagerSub={isCDMSub}
              isClinicalProgrammerSub={isCPSub}
              selections={skillSelections} setters={skillSetters} errors={errors}
            />
          )}
          {isClinical && !subFunctionKey && (
            <SectionCard>
              <SectionHeader title="Skills" />
              <p style={{ color: C.textHint, fontSize: 13 }}>Select a sub function to load skills.</p>
            </SectionCard>
          )}
          {isNonClinical && (
            <NonClinicalSkillsPanel
              domain={selectedDomain} selections={skillSelections}
              setters={skillSetters} errors={errors}
            />
          )}
          {!selectedDomain && (
            <SectionCard>
              <SectionHeader title="Skills" />
              <p style={{ color: C.textHint, fontSize: 13 }}>Select a domain to load skills.</p>
            </SectionCard>
          )}
        </div>

        {/* ── ADDITIONAL INFO ── */}
        <div id="additionalInfo" style={{ marginBottom: 12 }}>
          <SectionCard>
            <SectionHeader title="Additional info" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <FieldRow>
                <FieldLabel>Job type *</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={jobType} onChange={e => setJobType(e.target.value)} displayEmpty sx={muiSelectSx}
                    renderValue={s => s
                      ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>{s}</span>
                      : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>Select Job Type</span>
                    }>
                    {JOB_TYPES.map(t => <MenuItem key={t} value={t} sx={muiMenuItemSx}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </FieldRow>

              <FieldRow>
                <FieldLabel>Work mode *</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={workMode} onChange={e => setWorkMode(e.target.value)} displayEmpty sx={muiSelectSx}
                    renderValue={s => s
                      ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>{s}</span>
                      : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>Select Work Mode</span>
                    }>
                    {WORK_MODES.map(m => <MenuItem key={m} value={m} sx={muiMenuItemSx}>{m}</MenuItem>)}
                  </Select>
                </FormControl>
              </FieldRow>

              <FieldRow>
                <FieldLabel>Priority *</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={priority} onChange={e => setPriority(e.target.value)} displayEmpty sx={muiSelectSx}
                    renderValue={s => s
                      ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>{s}</span>
                      : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>Select Priority</span>
                    }>
                    {PRIORITIES.map(p => <MenuItem key={p} value={p} sx={muiMenuItemSx}>{p}</MenuItem>)}
                  </Select>
                </FormControl>
              </FieldRow>

              <FieldRow style={errors.closingDate ? { borderColor: C.danger } : {}}>
                <FieldLabel error={errors.closingDate}>Closing date *</FieldLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={closingDate ? dayjs(closingDate) : null}
                    minDate={dayjs()}
                    onChange={(v) => {
                      setClosingDate(v ? v.format("YYYY-MM-DD") : "");
                      setErrors(e => ({ ...e, closingDate: "" }));
                    }}
                    slotProps={{
                      textField: {
                        size: "small", fullWidth: true,
                        sx: { "& .MuiInputBase-input": { fontSize: PRIMARY.label.fontSize, fontFamily: PRIMARY.fontFamily } },
                      },
                    }}
                  />
                </LocalizationProvider>
                <ErrorText msg={errors.closingDate} />
              </FieldRow>

              <FieldRow>
                <FieldLabel>Salary unit</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select value={salaryUnit} onChange={e => setSalaryUnit(e.target.value)}
                    disabled={country?.toLowerCase() === "india"} displayEmpty
                    sx={{ ...muiSelectSx, "&.Mui-disabled": { bgcolor: "#F8FAFC" } }}
                    renderValue={s => s
                      ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>{s}</span>
                      : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>Select Salary Unit</span>
                    }>
                    {country?.toLowerCase() === "india"
                      ? <MenuItem value="INR / Per Annum" sx={muiMenuItemSx}>INR / Per Annum</MenuItem>
                      : ["USD / Per Hour", "USD / Per Month", "USD / Per Annum"].map(u => (
                        <MenuItem key={u} value={u} sx={muiMenuItemSx}>{u}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </FieldRow>

              <FieldRow>
                <FieldLabel>Salary</FieldLabel>
                <input value={salary} onChange={e => setSalary(e.target.value)}
                  placeholder={country?.toLowerCase() === "india" ? "₹ e.g. 1200000" : "e.g. 120000"}
                  style={{ ...flatSelectStyle, cursor: "text" }} />
              </FieldRow>
            </div>
          </SectionCard>
        </div>

        {/* ── TEAM ── */}
        <div id="team" style={{ marginBottom: 12 }}>
          <SectionCard>
            <SectionHeader title="Team" />

            <FieldRow style={errors.creator ? { borderColor: C.danger } : {}}>
              <FieldLabel error={errors.creator}>Creator *</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={creator?.employee_id || ""}
                  onChange={e => setCreator(approvers.find(a => a.employee_id === e.target.value) || null)}
                  displayEmpty sx={muiSelectSx}
                  renderValue={s => s
                    ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>
                      {approvers.find(a => a.employee_id === s)?.full_name}
                    </span>
                    : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>
                      Select Creator
                    </span>
                  }>
                  {approvers.map(item => (
                    <MenuItem key={item.employee_id} value={item.employee_id} sx={muiMenuItemSx}>
                      {item.full_name} ({item.user_role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ErrorText msg={errors.creator} />
            </FieldRow>

            <FieldRow style={errors.approver ? { borderColor: C.danger } : {}}>
              <FieldLabel error={errors.approver}>Approver *</FieldLabel>
              <FormControl fullWidth size="small">
                <Select value={approver?.employee_id || ""}
                  onChange={e => setApprover(approvers.find(a => a.employee_id === e.target.value) || null)}
                  displayEmpty sx={muiSelectSx}
                  renderValue={s => s
                    ? <span style={{ color: C.text, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>
                      {approvers.find(a => a.employee_id === s)?.full_name}
                    </span>
                    : <span style={{ color: C.textHint, fontFamily: PRIMARY.fontFamily, fontSize: PRIMARY.label.fontSize }}>
                      Select Approver
                    </span>
                  }>
                  {approvers.map(item => (
                    <MenuItem key={item.employee_id} value={item.employee_id} sx={muiMenuItemSx}>
                      {item.full_name} ({item.user_role})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ErrorText msg={errors.approver} />
            </FieldRow>

            <FieldRow>
              <FieldLabel>TA team</FieldLabel>
              <GroupedSkillAutocomplete
                options={approvers
                  .filter(h => h.employee_id !== approver?.employee_id)
                  .map(item => ({
                    key: item.employee_id, label: item.full_name,
                    designation: item.designation, group: item.department || "Others",
                  }))}
                value={taTeam}
                onChange={setTaTeam}
                placeholder="Select TA Team"
              />
            </FieldRow>
          </SectionCard>
        </div>

        {/* ── JOB DESCRIPTION ── */}
        <div id="jobDescription" style={{ marginBottom: 12 }}>
          <SectionCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Job description</div>
              <span style={{
                fontSize: 11, padding: "3px 10px", background: C.successLight,
                color: C.success, border: `1px solid ${C.successBorder}`, borderRadius: 20, fontWeight: 600,
              }}>Optional</span>
            </div>

            <FieldRow style={{
              background: instructions ? C.primaryLight : C.surfaceMuted,
              borderColor: instructions ? C.primary : C.border,
            }}>
              <textarea rows={4} value={instructions} onChange={e => setInstructions(e.target.value)}
                placeholder="Describe the role, responsibilities, and requirements..."
                style={{
                  width: "100%", border: "none", outline: "none", background: "transparent",
                  fontSize: 13, resize: "vertical", fontFamily: "inherit",
                  color: C.text, boxSizing: "border-box",
                }} />
              <div style={{
                display: "flex", justifyContent: "flex-end",
                borderTop: `1px solid ${C.border}`, paddingTop: 6, marginTop: 4,
              }}>
                <span style={{ fontSize: 11, color: instructions.length > 2000 ? C.danger : C.textHint }}>
                  {instructions.length}/2000
                </span>
              </div>
            </FieldRow>

            <Box sx={{
              border: "2px dashed #D1D5DB", borderRadius: "24px", backgroundColor: "#FAFAFA",
              minHeight: 200, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": { borderColor: PRIMARY.primary, backgroundColor: "#F8FAFC" },
            }}>
              <input type="file" accept=".pdf,.doc,.docx,.txt,.xlsx"
                hidden id="jd-upload"
                onChange={e => setJdFile(e.target.files?.[0] || null)} />
              <label htmlFor="jd-upload" style={{
                width: "100%", height: "100%", minHeight: 200,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: "16px", backgroundColor: "#DDF3F5",
                  display: "flex", alignItems: "center", justifyContent: "center", mb: 2,
                }}>
                  <CloudUploadOutlinedIcon sx={{ fontSize: 32, color: PRIMARY.primary }} />
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0F172A", mb: 0.5, fontFamily: PRIMARY.fontFamily }}>
                  {jdFile ? jdFile.name : "Upload Job Description"}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#94A3B8", fontFamily: PRIMARY.fontFamily }}>
                  {jdFile ? `${(jdFile.size / 1024 / 1024).toFixed(2)} MB` : "PDF, DOC, DOCX, TXT, XLSX — max 10MB"}
                </Typography>
                {jdFile && (
                  <button onClick={e => { e.preventDefault(); setJdFile(null); }}
                    style={{
                      marginTop: 8, fontSize: 12, color: C.danger, background: "none",
                      border: "none", cursor: "pointer", textDecoration: "underline",
                    }}>
                    Remove file
                  </button>
                )}
              </label>
            </Box>

            <div style={{
              border: `1.5px ${saveAsTemplate ? "solid" : "dashed"} ${saveAsTemplate ? C.primary : C.border}`,
              borderRadius: 10, padding: 14, marginTop: 12,
              background: saveAsTemplate ? C.primaryLight : C.surfaceMuted,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: saveAsTemplate ? "#DBEAFE" : C.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className="ti ti-bookmark" style={{ fontSize: 16, color: saveAsTemplate ? C.primary : C.textHint }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: saveAsTemplate ? C.primary : C.text }}>
                      Save as template
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: C.textHint }}>Reuse this setup for future postings</p>
                  </div>
                </div>
                <div onClick={() => setSaveAsTemplate(v => !v)} style={{
                  width: 40, height: 22, borderRadius: 20,
                  background: saveAsTemplate ? C.primary : C.border,
                  cursor: "pointer", position: "relative", transition: "background 0.2s",
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, left: saveAsTemplate ? 20 : 4,
                    transition: "left 0.2s",
                  }} />
                </div>
              </div>

              {saveAsTemplate && (
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 0 }}>
                  <FieldRow style={errors.templateName ? { borderColor: C.danger } : {}}>
                    <FieldLabel error={errors.templateName}>Template name *</FieldLabel>
                    <input value={templateName}
                      onChange={e => { setTemplateName(e.target.value); setErrors(v => ({ ...v, templateName: "" })); }}
                      placeholder="e.g. Senior Statistical Programmer – Biostatistics"
                      style={{ ...flatSelectStyle, cursor: "text" }} />
                    <ErrorText msg={errors.templateName} />
                  </FieldRow>

                  <FieldRow style={{
                    background: templateDescription ? C.primaryLight : C.surfaceMuted,
                    borderColor: templateDescription ? C.primary : C.border,
                  }}>
                    <FieldLabel>Template description</FieldLabel>
                    <textarea rows={3} value={templateDescription}
                      onChange={e => setTemplateDescription(e.target.value)}
                      placeholder="Describe what this template is for..."
                      style={{
                        width: "100%", border: "none", outline: "none", background: "transparent",
                        fontSize: 13, resize: "vertical", fontFamily: "inherit",
                        color: C.text, boxSizing: "border-box",
                      }} />
                    <div style={{
                      display: "flex", justifyContent: "flex-end",
                      borderTop: `1px solid ${C.border}`, paddingTop: 6, marginTop: 4,
                    }}>
                      <span style={{ fontSize: 11, color: templateDescription.length > 500 ? C.danger : C.textHint }}>
                        {templateDescription.length}/500
                      </span>
                    </div>
                  </FieldRow>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* ── SUBMIT ERROR ── */}
        {submitError && (
          <div style={{
            marginBottom: 12, padding: "12px 16px", borderRadius: 8,
            background: "#FEF2F2", border: `1px solid #FCA5A5`,
            color: C.danger, fontSize: 13, fontFamily: PRIMARY.fontFamily,
          }}>
            <i className="ti ti-alert-circle" style={{ marginRight: 6 }} />
            {submitError}
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 28 }}>
          {(isEditMode || isEditAfterSummary) && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "10px 26px",
                background: "#fff",
                color: C.text,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isUpdating}
            style={{
              padding: "10px 26px",
              background:
                isSubmitting || isUpdating
                  ? C.primaryHover
                  : C.primary,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor:
                isSubmitting || isUpdating
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity:
                isSubmitting || isUpdating
                  ? 0.8
                  : 1,
            }}
          >
            {isSubmitting || isUpdating ? (
              <>
                <i
                  className="ti ti-loader-2"
                  style={{
                    fontSize: 14,
                    animation: "spin 1s linear infinite",
                  }}
                />
                {isEditMode || isEditAfterSummary
                  ? "Updating..."
                  : "Submitting..."}
              </>
            ) : (
              <>
                {isEditMode || isEditAfterSummary
                  ? "Update Job"
                  : isNonClinical
                    ? "Submit Job"
                    : "Create Job"}
                <i
                  className="ti ti-arrow-right"
                  style={{ fontSize: 14 }}
                />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── TEMPLATE DIALOG ── */}
      {templateDialogOpen && (
        <TemplateDialog
          templates={localTemplates}
          onClose={() => setTemplateDialogOpen(false)}
          onApply={handleApplyTemplate}
          onDelete={handleDeleteTemplate}
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default function CreateRequisition() {
  return <CreateRequisitionForm />;
}
```

---

## File: pages/OrgRequisitions/createJob/jobType-Info/index.jsx

```javascript
import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Autocomplete,
} from "@mui/material";
import { AppContext } from "../../../../AppContext.js";
import api from "../../../../api.js";
import { toast } from "react-toastify";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Checkbox } from "@mui/material";
import { getItem } from "../../../../utils/helper.js";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const JobTypeInfo = ({
  handleNext,
  activeStep,
  handleStepClick,
  onSubmit,
  jobId,
  jobDetails,
  onSubmitSuccess,
}) => {
  const {
    formData = {},
    setFormData,
    setEmployerStepperData,
  } = useContext(AppContext);

  const jobTypes = ["Full Time", "Part Time", "Freelancer"];
  const ModeOfWork = ["Remote", "Hybrid", "Onsite"];
  const SalaryRangeOptions = ["Rate/hour", "CtC", "W7", "1099", "W2"];
  const salaryUnitOptions = ["1000", "10000", "1000000", "100000"];

  const [countries, setCountries] = useState([]);
  const [stateAndCityOptions, setStateAndCityOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStateAndCity, setSelectedStateAndCity] = useState("");

  const [localData, setLocalData] = useState({
    jobType: "",
    salaryRange: null,
    salaryUnit: null,
    country: "",
    modeOfWork: "",
    stateAndCity: "",
    selectedManager: null,
    selectedRectuiter: [],
    selectedRecruiterIds: [],
  });

  const [errors, setErrors] = useState({});
  const [hiringManagerList, setHiringManagerList] = useState([]);
  const [recruitersList, setRecruitersList] = useState([]);
  const Approver = JSON.parse(localStorage.getItem("user"));
  console.log("Approver",Approver);
  
  const apiResApprover = hiringManagerList.find(
    (val) => val?.name?.toLowerCase() === Approver?.name?.toLowerCase(),
  );
  console.log("hiringManagerList",hiringManagerList)
  const handleAutoCompleteChange = (key) => (_e, value) => {
    setLocalData((prev) => ({ ...prev, [key]: value || "" }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get("/dropdown/countries");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // useEffect(() => {
  //   const fetchHiringManagers = async () => {
  //     const roles = ["super_admin", "admin", "hm_user"];
  //     try {
  //       const requests = roles.map((role) =>
  //         api
  //           .get(`/user-employees/by-role_v1?user_role=${role}`)
  //           .catch(() => ({ data: { data: [] } })),
  //       );
  //       const responses = await Promise.all(requests);

  //       let allUsers = responses.flatMap((res) => res?.data?.data || []);
  //       console.log("roles", allUsers);

  //       const uniqueMap = new Map();
  //       allUsers.forEach((user) => {
  //         if (user.id && user.name)
  //           uniqueMap.set(user.id, {
  //             id: user.id,
  //             name: user.name,
  //             designation: user.designation,
  //           });
  //       });

  //       const uniqueUsers = Array.from(uniqueMap.values()).sort((a, b) =>
  //         a.name.localeCompare(b.name),
  //       );
  //       setHiringManagerList(uniqueUsers);
  //     } catch (error) {
  //       console.error("Error fetching hiring managers:", error);
  //     }
  //   };
  //   fetchHiringManagers();
  // }, []);

  // useEffect(() => {
  //   const fetchRecruiters = async () => {
  //     const roles = ["super_admin", "admin", "hm_user"];
  //     try {
  //       const requests = roles.map((role) =>
  //         api
  //           .get(`/user-employees/by-role_v1?user_role=${role}`)
  //           .catch(() => ({ data: { data: [] } })),
  //       );
  //       const responses = await Promise.all(requests);
  //       let allUsers = responses.flatMap((res) => res?.data?.data || []);
  //       console.log("responses", allUsers);

  //       const uniqueMap = new Map();
  //       allUsers.forEach((user) => {
  //         if (user.id && user.name)
  //           uniqueMap.set(user.id, {
  //             id: user.id,
  //             name: user.name,
  //             designation: user.designation,
  //           });
  //       });

  //       const uniqueUsers = Array.from(uniqueMap.values()).sort((a, b) =>
  //         a.name.localeCompare(b.name),
  //       );
  //       setRecruitersList(uniqueUsers);
  //     } catch (error) {
  //       console.error("Error fetching recruiters:", error);
  //     }
  //   };
  //   fetchRecruiters();
  // }, []);
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const roles = ["super_admin", "admin", "hm_user"];

      const requests = roles.map((role) =>
        api.get(`/user-employees/by-role_v1?user_role=${role}`)
      );

      const responses = await Promise.all(requests);
      const allUsers = responses.flatMap(res => res.data?.data || []);

      const uniqueUsers = Array.from(
        new Map(allUsers.map(u => [u.id, u])).values()
      );

      setHiringManagerList(uniqueUsers);
      setRecruitersList(uniqueUsers);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUsers();
}, []);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country || "");
    setSelectedStateAndCity("");
    setLocalData((prev) => ({
      ...prev,
      country: country || "",
      stateAndCity: "",
    }));

    if (country) {
      const fetchCities = async () => {
        try {
          const response = await api.get(
            `/dropdown/locations?country=${country}`,
          );
          setStateAndCityOptions(response.data || []);
        } catch (error) {
          console.error("Error fetching cities:", error);
          setStateAndCityOptions([]);
        }
      };
      fetchCities();
    } else {
      setStateAndCityOptions([]);
    }
  };

  useEffect(() => {
    if (!jobDetails) return;

    const country = jobDetails.country || "";
    const city = jobDetails.city || "";

    setSelectedCountry(country);
    setSelectedStateAndCity(city);

    setLocalData((prev) => ({
      ...prev,
      country,
      stateAndCity: city,
      jobType: normalizeJobType(jobDetails.job_type) || "",
      modeOfWork: jobDetails.mode_of_work || "",
      salaryRange:
        country.toLowerCase() === "india"
          ? null
          : jobDetails.salary_range || null,
      salaryUnit:
        country.toLowerCase() === "india"
          ? null
          : jobDetails.salary_unit || null,
    }));

    if (jobDetails.hiring_manager && hiringManagerList.length > 0) {
      const matched = hiringManagerList.find(
        (m) => m.id === jobDetails.hiring_manager.id,
      );
      if (matched) {
        setLocalData((prev) => ({ ...prev, selectedManager: matched }));
      }
    }

    if (country) {
      const fetchCities = async () => {
        try {
          const response = await api.get(
            `/dropdown/locations?country=${country}`,
          );
          setStateAndCityOptions(response.data || []);
        } catch (error) {
          console.error("Error fetching cities on load:", error);
        }
      };
      fetchCities();
    }
  }, [jobDetails, hiringManagerList]);

  const normalizeJobType = (value) => {
    if (!value) return "";
    const lower = value.trim().toLowerCase();
    if (lower.includes("full")) return "Full Time";
    if (lower.includes("part")) return "Part Time";
    if (lower.includes("free")) return "Freelancer";
    return value;
  };

  const validateForm = () => {
    const newErrors = {
      country: !localData.country,
      jobType: !localData.jobType,
      modeOfWork: !localData.modeOfWork,
      selectedManager: !localData.selectedManager,
      // selectedRectuiter: !localData.selectedRectuiter,
      // selectedRectuiter: localData.selectedRectuiter.length === 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const isIndia = localData.country?.toLowerCase() === "india";

    const params = new URLSearchParams();

    params.append("job_type", localData.jobType || "");
    params.append("country", localData.country || "");
    params.append("salary_range", isIndia ? "" : localData.salaryRange || "");
    params.append("salary_unit", isIndia ? "" : localData.salaryUnit || "");
    params.append("mode_of_work", localData.modeOfWork || "");
    params.append("additional_skill_1", " ");
    params.append("additional_skill_2", " ");
    params.append("job_approver", localData.selectedManager?.id || "");

    params.append("recruiter", localData.selectedRecruiterIds.join(","));
    try {
      const response = await api.post(
        `/add-new-job_additional_details/${jobId}`,
        params.toString(),
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (response?.data?.success) {
        setEmployerStepperData(response.data.data);
        onSubmitSuccess();
        toast.success("Job details saved successfully!");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to save job details.");
    }
  };
  useEffect(() => {
    if (apiResApprover && !localData.selectedManager) {
      setLocalData((prev) => ({
        ...prev,
        selectedManager: apiResApprover,
      }));
    }
  }, [apiResApprover]);
  return (
    <Grid container direction="column" spacing={3}>
      <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          id="jobTypeInfoForm"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            p: { xs: 2, sm: 3, md: 3, lg: 4, xl: 4 },
            borderRadius: 2,
            border: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: "1.2rem",
                lg: "1.3rem",
                xl: "1.4rem",
              },
              fontWeight: 500,
              mb: 2,
            }}
          >
            Job Type
          </Typography>
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 }}>
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Autocomplete
                size="small"
                freeSolo
                fullWidth
                options={countries}
                value={jobDetails.country || localData.country || null}
                onChange={(e, value) => {
                  handleSelectCountry(value);
                  setErrors((prev) => ({ ...prev, country: "" }));

                  setSelectedStateAndCity("");
                  setLocalData((prev) => ({ ...prev, stateAndCity: "" }));
                  setErrors((prev) => ({ ...prev, stateAndCity: "" }));
                }}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    error={!!errors.country}
                    helperText={errors.country ? "Country is required" : ""}
                    autoComplete="Country"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#00BBD4" },
                        "&:hover fieldset": { borderColor: "#00BBD4" },
                        "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                      },
                    }}
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiFormLabel-asterisk": {
                          color: "red",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Autocomplete
                freeSolo
                fullWidth
                size="small"
                options={stateAndCityOptions}
                disabled={!jobDetails.country && !selectedCountry}
                value={jobDetails.city || selectedStateAndCity || ""}
                onChange={(e, value) => {
                  setSelectedStateAndCity(value);
                  setLocalData((prev) => ({
                    ...prev,
                    stateAndCity: value || "",
                  }));
                  setErrors((prev) => ({ ...prev, stateAndCity: "" }));
                }}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    error={!!errors.stateAndCity}
                    helperText={errors.stateAndCity ? "City is required" : ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#00BBD4" },
                        "&:hover fieldset": { borderColor: "#00BBD4" },
                        "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                      },
                    }}
                    // required
                    InputLabelProps={{
                      sx: {
                        "& .MuiFormLabel-asterisk": {
                          color: "red",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Autocomplete
                freeSolo
                size="small"
                fullWidth
                options={jobTypes}
                value={
                  normalizeJobType(jobDetails?.job_type) ||
                  normalizeJobType(localData.jobType) ||
                  null
                }
                onChange={handleAutoCompleteChange("jobType")}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Type"
                    error={!!errors.jobType}
                    helperText={errors.jobType ? "Job Type is required" : ""}
                    autoComplete="JobType"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#00BBD4" },
                        "&:hover fieldset": { borderColor: "#00BBD4" },
                        "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                      },
                    }}
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiFormLabel-asterisk": {
                          color: "red",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Grid container spacing={2}>
                <Grid item size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    size="small"
                    // disabled={localData.country?.toLowerCase() === "india"}
                    options={SalaryRangeOptions}
                    value={
                      jobDetails.salary_range || localData.salaryRange || null
                    }
                    onChange={handleAutoCompleteChange("salaryRange")}
                    getOptionLabel={(option) => option || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Salary Unit"
                        error={!!errors.salaryRange}
                        helperText={
                          errors.salaryRange ? "Salary Range is required" : ""
                        }
                        autoComplete="salary range"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#00BBD4" },
                            "&:hover fieldset": { borderColor: "#00BBD4" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#00BBD4",
                            },
                          },
                        }}
                        // required
                        InputLabelProps={{
                          sx: {
                            "& .MuiFormLabel-asterisk": {
                              color: "red",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <Autocomplete
                    freeSolo
                    fullWidth
                    size="small"
                    // disabled={localData.country?.toLowerCase() === "india"}
                    options={salaryUnitOptions}
                    value={jobDetails.salary_unit || localData.salaryUnit || ""}
                    onChange={(e, value) => {
                      setLocalData((prev) => ({
                        ...prev,
                        salaryUnit: value || "",
                      }));
                      setErrors((prev) => ({ ...prev, salaryUnit: "" }));
                    }}
                    onInputChange={(e, value) => {
                      setLocalData((prev) => ({
                        ...prev,
                        salaryUnit: value || "",
                      }));
                      setErrors((prev) => ({ ...prev, salaryUnit: "" }));
                    }}
                    getOptionLabel={(option) => option || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Salary"
                        error={!!errors.salaryUnit}
                        helperText={
                          errors.salaryUnit ? "Salary Unit is required" : ""
                        }
                        autoComplete="salary unit"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value) {
                            e.preventDefault();
                            setLocalData((prev) => ({
                              ...prev,
                              salaryUnit: e.target.value.trim(),
                            }));
                            setErrors((prev) => ({ ...prev, salaryUnit: "" }));
                          }
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#00BBD4" },
                            "&:hover fieldset": { borderColor: "#00BBD4" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#00BBD4",
                            },
                          },
                        }}
                        // required
                        InputLabelProps={{
                          sx: {
                            "& .MuiFormLabel-asterisk": {
                              color: "red",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Autocomplete
                freeSolo
                fullWidth
                size="small"
                options={ModeOfWork}
                value={jobDetails?.mode_of_work || localData.modeOfWork || null}
                onChange={handleAutoCompleteChange("modeOfWork")}
                getOptionLabel={(option) => {
                  if (!option) return "";
                  return option
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Mode Of Work"
                    error={!!errors.modeOfWork}
                    helperText={errors.modeOfWork ? "Mode is required" : ""}
                    autoComplete="modeOfWork"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#00BBD4" },
                        "&:hover fieldset": { borderColor: "#00BBD4" },
                        "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                      },
                    }}
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiFormLabel-asterisk": {
                          color: "red",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            {/* <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Autocomplete
                multiple
                disabled
                size="small"
                freeSolo
                options={availableSkills}
                value={
                  jobDetails.additionalSkill_1 || localData?.itSkills || []
                }
                onChange={handleSkillsChange}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Additional skills 1"
                    placeholder="Type to add custom skills or select from list"
                    onKeyDown={handleCustomSkillAdd}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#00BBD4" },
                        "&:hover fieldset": { borderColor: "#00BBD4" },
                        "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                        "& .MuiInputBase-input": {
                          height: "20px",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Autocomplete
                multiple
                freeSolo
                size="small"
                disabled
                options={availableSkills}
                value={jobDetails.additionalSkill_2 || localData.itSkills || []}
                onChange={handleSkillsChange}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Additional skills 2"
                    placeholder="Type to add custom skills or select from list"
                    onKeyDown={handleCustomSkillAdd}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#00BBD4" },
                        "&:hover fieldset": { borderColor: "#00BBD4" },
                        "&.Mui-focused fieldset": { borderColor: "#00BBD4" },
                        "& .MuiInputBase-input": {
                          height: "20px",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid> */}
          </Grid>
        </Box>
      </Grid>
      <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            p: { xs: 2, sm: 3, md: 3, lg: 4, xl: 4 },
            borderRadius: 2,
            border: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
                md: "1.2rem",
                lg: "1.3rem",
                xl: "1.4rem",
              },
              fontWeight: 500,
              mb: 2,
            }}
          >
            Team
          </Typography>
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3 }}>
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Autocomplete
                size="small"
                options={hiringManagerList}
                // value={apiResApprover || localData.selectedManager || null}
                value={localData.selectedManager || null}
                onChange={(e, value) => {
                  setLocalData((prev) => ({ ...prev, selectedManager: value }));
                  setErrors((prev) => ({ ...prev, selectedManager: "" }));
                }}
                getOptionLabel={(option) => {
                  console.log("option", option);
                  return `${option?.name} (${option?.designation})` || "";
                }}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Approver"
                    required
                    error={!!errors.selectedManager}
                    helperText={errors.selectedManager && "Required"}
                    sx={{
                      "& .MuiFormLabel-asterisk": {
                        color: "red",
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Autocomplete
                multiple
                size="small"
                // options={recruitersList}
                options={recruitersList.filter((user) => {
                  // console.log("user", user);

                  return (
                    user.id !== localData.selectedManager?.id
                     &&
                    user.designation !== "Super admin"
                  );
                })}
                value={localData.selectedRectuiter || []}
                // onChange={(e, value) => {
                //   console.log("ReqruterValue",value);
                //    const recruiterIds = value.map((item) => item.id);
                //   setLocalData((prev) => ({
                //     ...prev,
                //     // selectedRectuiter: value,
                //     selectedRectuiter: recruiterIds,
                //   }));
                //   setErrors((prev) => ({ ...prev, selectedRectuiter: "" }));
                // }}
                onChange={(e, value = []) => {
                  console.log("RecruiterValue", value);

                  const recruiterIds = value
                    .filter(Boolean) // safety
                    .map((item) => item.id); // extract ids

                  setLocalData((prev) => ({
                    ...prev,
                    selectedRectuiter: value, // ✅ objects (UI)
                    selectedRecruiterIds: recruiterIds, // ✅ ids (API)
                  }));

                  setErrors((prev) => ({ ...prev, selectedRectuiter: "" }));
                }}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props} style={{ fontSize: 12 }}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                      size="small"
                      sx={{ padding: "0px 5px" }}
                    />
                    {console.log("localData", recruitersList)}
                    {`${option?.name} (${option?.designation})` || ""}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Collaborators"
                    // required
                    error={!!errors.selectedRectuiter}
                    helperText={errors.selectedRectuiter && "Required"}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default React.memo(JobTypeInfo);

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

## File: pages/OrgRequisitions/createJob/stepper.jsx

```javascript
import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";

const steps = [
  "Job Details",
  // "Job type & Info",
  // "Recruitement Steps",
  "Summary",
];

const StepperComponent = ({ activeStep, handleStepClick }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleStep = (step) => () => {
    handleStepClick(step);
  };

  const isStepCompleted = (index) => index < activeStep;

  return (
    <Stepper
      nonLinear
      activeStep={activeStep}
      orientation="horizontal"
      sx={{
        display: { xs: "none", sm: "flex", lg: "flex", xl: "flex" },
        mt: 0.5,
        position: "sticky",
        zIndex: 1100,
        width: "100%",

        /* ↓↓↓ Decreased padding & height ↓↓↓ */
        padding: { xs: 0.5, sm: 0.75, md: 1, lg: 1, xl: 1 },
        minHeight: "48px",

        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.08)",

        "& .MuiStepConnector-root": {
          marginLeft: { xs: "4px", sm: "6px", lg: "8px", xl: "10px" },
          marginTop: { xs: "1px", sm: "2px", lg: "3px", xl: "3px" },
        },

        "& .MuiStepConnector-line": {
          borderTopWidth: 1.5,
          width: "calc(100% - 10px)",
          margin: "4px auto",
        },
      }}
    >
      {steps.map((label, index) => (
        // <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        <Step
          key={label}
          sx={{
            flex: 1,
            padding: { xs: "2px 0", sm: "3px 0", md: "4px 0" }, // reduced
          }}
        >
          <StepButton
            color="inherit"
            onClick={handleStep(index)}
            icon={
              isStepCompleted(index) ? (
                <CheckCircleIcon
                  sx={{
                    color: "#4CAF50",
                    fontSize: {
                      xs: "0.7rem",
                      sm: "0.85rem",
                      md: "1rem",
                      lg: "1rem",
                    }, // reduced
                  }}
                />
              ) : index === activeStep ? (
                <Box
                  sx={{
                    width: { xs: "5px", sm: "6px", md: "8px" },
                    height: { xs: "5px", sm: "6px", md: "8px" },
                    borderRadius: "50%",
                    backgroundColor: "#00BBD4",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: { xs: "16px", sm: "18px", md: "22px" },
                    height: { xs: "16px", sm: "18px", md: "22px" },
                    borderRadius: "50%",
                    backgroundColor:
                      index === activeStep ? "#00BBD4" : "#B0BEC5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.875rem",
                      md: "1rem",
                      lg: "1.125rem",
                    },
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </Box>
              )
            }
            sx={{
              "& .MuiStepLabel-label": {
                fontSize: {
                  xs: "0.625rem",
                  sm: "0.65rem",
                  md: "0.875rem",
                  lg: "1rem",
                },
                color:
                  index === activeStep
                    ? "#00BBD4"
                    : isStepCompleted(index)
                    ? "#4CAF50"
                    : "#B0BEC5",
                fontWeight: index === activeStep ? "bold" : "normal",
                marginLeft: "4px",
                marginRight: { xs: "8px", sm: "12px" },
                whiteSpace: "nowrap",
              },
            }}
          >
            {label}
          </StepButton>
        </Step>
        // </Grid>
      ))}
    </Stepper>
  );
};
export default StepperComponent;
```

---

## File: pages/OrgRequisitions/createJob/style.js

```javascript
import { makeStyles } from '@mui/styles';

const UseJobRequirementsStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 600,
    // marginBottom: theme.spacing(3),
    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    // color: theme.palette.text.primary,
    fontWeight: 700,
    mb: 4,
    // marginLeft:"20x"
  },
  subtitle: {
    textAlign: "left",
  },
  instructionsSection: {
    display: "flex",
    // gap: theme.spacing(2),
    alignItems: "center",
    // marginTop:"25px",
  },
 
  uploadSection: {
    display: "flex",
    justifyContent: "space-around",
    // marginTop:"-20px",
    // marginLeft:"120px"
    // marginTop: theme.spacing(2),
  },
  uploadText: {
    // marginBottom: theme.spacing(2),
  },
  uploadButton: {
    // borderRadius: "20px",
  },
  selectedFileText: {
    // marginTop: theme.spacing(1),
    fontStyle: "italic",
  },
  fileErrorText: {
    // marginTop: theme.spacing(2),
    color: "red",
},

 
}));

export default UseJobRequirementsStyles;

```

---

## File: pages/OrgRequisitions/createJob/styles.js

```javascript
import { makeStyles } from '@mui/styles';

const UseJobRequirementsStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 600,
    // marginBottom: theme.spacing(3),
    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    // color: theme.palette.text.primary,
    fontWeight: 700,
    mb: 4,
    // marginLeft:"20x"
  },
  subtitle: {
    textAlign: "left",
  },
  instructionsSection: {
    display: "flex",
    // gap: theme.spacing(2),
    alignItems: "center",
    // marginTop:"25px",
  },
 
  uploadSection: {
    display: "flex",
    justifyContent: "space-around",
    // marginTop:"-20px",
    // marginLeft:"120px"
    // marginTop: theme.spacing(2),
  },
  uploadText: {
    // marginBottom: theme.spacing(2),
  },
  uploadButton: {
    // borderRadius: "20px",
  },
  selectedFileText: {
    // marginTop: theme.spacing(1),
    fontStyle: "italic",
  },
  fileErrorText: {
    // marginTop: theme.spacing(2),
    color: "red",
},

 
}));

export default UseJobRequirementsStyles;

```

---

