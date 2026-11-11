import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { BusinessOutlined, Check, Close, EventOutlined, GroupsOutlined, RefreshRounded } from "@mui/icons-material";
import DemoRequests from "../DemoRequests";
import CandidateAssignmentDialog from "./CandidateAssignmentDialog";
import { useGetUpgradeRequestsQuery, useReviewUpgradeRequestMutation } from "../../redux/services/subscriptions/subscriptions";
import { useGetMyAssignedRequestsQuery } from "../../redux/services/drawerService/drawerService";

const ACCENT = "#FF5722";
const STATUS_OPTIONS = ["pending", "approved", "rejected"];
const REQUEST_TABS = [
  { value: "demo", label: "Demo Request", icon: <BusinessOutlined fontSize="small" /> },
  { value: "subscription", label: "Subscription Request", icon: <GroupsOutlined fontSize="small" /> },
  { value: "hiring", label: "Hiring Requests", icon: <GroupsOutlined fontSize="small" /> },
];

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);
};

const formatStatus = (status = "pending") => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
const formatRequestType = (requestType) => {
  if (!requestType) return "—";
  return String(requestType)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

function SubscriptionRequests() {
  const [status, setStatus] = useState("pending");
  const [requestToReject, setRequestToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { data, isLoading, isFetching, isError, error, refetch } = useGetUpgradeRequestsQuery(status);
  const [reviewRequest, { isLoading: isReviewing, error: reviewError }] = useReviewUpgradeRequestMutation();
  const requests = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  const statusColors = {
    pending: { color: "#B54708", background: "#FFF4E5", border: "#FEDF89" },
    approved: { color: "#027A48", background: "#ECFDF3", border: "#ABEFC6" },
    rejected: { color: "#B42318", background: "#FEF3F2", border: "#FECDCA" },
  };

  const handleReview = async (requestId, decision, reason) => {
    try {
      await reviewRequest({ requestId, decision, rejectionReason: reason }).unwrap();
      setRequestToReject(null);
      setRejectionReason("");
    } catch {
      // Keep the request visible so the user can retry.
    }
  };

  return (
    <Box sx={{ maxWidth: 1220, mx: "auto" }}>
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" gap={2.25} sx={{ mb: 2.75 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box sx={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 2.5, color: ACCENT, bgcolor: "#FFF1EB", border: "1px solid #FFE0D4" }}>
              <GroupsOutlined />
            </Box>
            <Box>
              <Typography fontSize={{ xs: 19, sm: 21 }} fontWeight={750} color="#101828" letterSpacing="-0.35px">
                Subscription requests
              </Typography>
              <Typography fontSize={12.5} color="#667085" sx={{ mt: 0.2 }}>
                Review plan changes submitted by organisations.
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            label={`${requests.length} ${requests.length === 1 ? "request" : "requests"}`}
            size="small"
            sx={{ height: 30, px: 0.35, bgcolor: "#F2F4F7", color: "#475467", fontWeight: 700, borderRadius: 2 }}
          />
          <IconButton
            aria-label="Refresh subscription requests"
            onClick={refetch}
            disabled={isLoading || isFetching}
            sx={{ width: 34, height: 34, border: "1px solid #EAECF0", color: "#667085", bgcolor: "#fff", "&:hover": { bgcolor: "#F9FAFB", color: ACCENT } }}
          >
            <RefreshRounded fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ display: "inline-flex", p: 0.45, mb: 2.25, bgcolor: "#F2F4F7", border: "1px solid #EAECF0", borderRadius: 2.5 }}>
        <Tabs
          value={status}
          onChange={(_, value) => setStatus(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Filter subscription requests by status"
          sx={{ minHeight: 38, "& .MuiTabs-indicator": { display: "none" }, "& .MuiTab-root": { minHeight: 36, minWidth: 90, textTransform: "none", fontSize: 12.5, fontWeight: 650, px: 1.7, borderRadius: 1.75, color: "#667085", transition: "all .18s ease" }, "& .Mui-selected": { bgcolor: "#fff", color: `${ACCENT} !important`, boxShadow: "0 1px 3px rgba(16,24,40,.12)" } }}
        >
          {STATUS_OPTIONS.map((option) => <Tab key={option} value={option} label={formatStatus(option)} />)}
        </Tabs>
      </Box>

      {isError && <Alert severity="error" action={<Button color="inherit" size="small" onClick={refetch}>Retry</Button>} sx={{ mb: 2 }}>{error?.data?.message ?? "Unable to load subscription requests."}</Alert>}
      {reviewError && <Alert severity="error" sx={{ mb: 2 }}>{reviewError?.data?.message ?? "Unable to update this request. Please try again."}</Alert>}
      {isLoading || isFetching ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 220 }}><CircularProgress sx={{ color: ACCENT }} /></Box>
      ) : !isError && requests.length === 0 ? (
        <Card variant="outlined" sx={{ borderColor: "#EAECF0", borderRadius: 3, bgcolor: "#FCFCFD" }}>
          <CardContent sx={{ py: { xs: 5, sm: 7 }, textAlign: "center" }}>
            <Box sx={{ width: 52, height: 52, display: "grid", placeItems: "center", mx: "auto", mb: 1.5, borderRadius: 2.5, bgcolor: "#FFF1EB", color: ACCENT }}>
              <GroupsOutlined />
            </Box>
            <Typography fontWeight={700} color="#344054">No {status} requests</Typography>
            <Typography fontSize={13} color="#667085" sx={{ mt: 0.5 }}>Subscription requests with this status will appear here.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1.5}>
          {requests.map((request) => (
            <Card
              key={request.request_id ?? request.id}
              variant="outlined"
              sx={{ position: "relative", overflow: "hidden", borderColor: "#EAECF0", borderRadius: 3, boxShadow: "0 2px 8px rgba(16,24,40,.035)", transition: "box-shadow .2s ease, border-color .2s ease, transform .2s ease", "&::before": { content: '""', position: "absolute", inset: "0 auto 0 0", width: 3, bgcolor: request.status === "pending" ? ACCENT : "#D0D5DD" }, "&:hover": { borderColor: "#F5B49E", boxShadow: "0 10px 24px rgba(16,24,40,.075)", transform: "translateY(-2px)" } }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) auto" }, alignItems: "center", gap: { xs: 2, sm: 3 } }}>
                  <Stack direction="row" alignItems="flex-start" spacing={1.75} sx={{ minWidth: 0 }}>
                    <Box sx={{ width: 48, height: 48, display: "grid", placeItems: "center", flexShrink: 0, borderRadius: 2.5, bgcolor: "#FFF4EF", color: ACCENT, border: "1px solid #FFE4D9" }}>
                      <BusinessOutlined />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontSize={15.5} fontWeight={750} color="#172033" sx={{ overflowWrap: "anywhere", letterSpacing: "-.15px" }}>
                        {request.organisation_name || `Organisation ${request.organisation_id || ""}`}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.65} sx={{ mt: 0.65 }}>
                        <EventOutlined sx={{ fontSize: 15, color: "#98A2B3" }} />
                        <Typography fontSize={12} color="#667085" fontWeight={500}>
                          {formatDate(request.requested_at)}
                        </Typography>
                      </Stack>
                      <Chip
                        size="small"
                        label={`Request type · ${formatRequestType(request.request_type)}`}
                        sx={{ mt: 1, height: 25, maxWidth: "100%", bgcolor: "#F8FAFC", color: "#475467", border: "1px solid #EAECF0", fontSize: 11.5, fontWeight: 600, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
                      />
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: "row", sm: "column", md: "row" }} alignItems={{ xs: "center", sm: "flex-end", md: "center" }} spacing={1.1} justifyContent={{ xs: "space-between", sm: "flex-start", md: "flex-end" }}>
                    <Chip
                      size="small"
                      label={formatStatus(request.status)}
                      sx={{ minWidth: 88, height: 28, fontWeight: 700, border: `1px solid ${statusColors[request.status]?.border || "#EAECF0"}`, color: statusColors[request.status]?.color || "#475467", bgcolor: statusColors[request.status]?.background || "#F2F4F7", borderRadius: 2 }}
                    />
                    <Stack direction="row" spacing={1}>
                    {request.status === "pending" && (
                      <>
                        <Button size="small" variant="outlined" color="error" startIcon={<Close />} disabled={isReviewing} onClick={() => { setRequestToReject(request); setRejectionReason(""); }} sx={{ minHeight: 38, borderRadius: 2, px: 1.6, fontWeight: 650, textTransform: "none", borderColor: "#FDA29B", bgcolor: "#fff", "&:hover": { bgcolor: "#FEF3F2", borderColor: "#F97066" } }}>
                          Reject
                        </Button>
                        <Button size="small" variant="contained" startIcon={isReviewing ? <CircularProgress size={15} color="inherit" /> : <Check />} disabled={isReviewing} onClick={() => handleReview(request.request_id ?? request.id, "approve")} sx={{ minHeight: 38, bgcolor: ACCENT, borderRadius: 2, px: 1.75, fontWeight: 700, textTransform: "none", boxShadow: "0 3px 8px rgba(255,87,34,.18)", "&:hover": { bgcolor: "#E64A19", boxShadow: "0 5px 12px rgba(255,87,34,.24)" } }}>
                          {isReviewing ? "Approving..." : "Approve"}
                        </Button>
                      </>
                    )}
                    </Stack>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={Boolean(requestToReject)} onClose={isReviewing ? undefined : () => setRequestToReject(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject subscription request</DialogTitle>
        <DialogContent>
          <Typography fontSize={13} color="#667085" sx={{ mb: 2 }}>
            Add a reason for rejecting this request. The reason will be visible in the rejected requests list.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label="Rejection reason"
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRequestToReject(null)} disabled={isReviewing}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={isReviewing || !rejectionReason.trim()}
            onClick={() => handleReview(requestToReject?.request_id ?? requestToReject?.id, "reject", rejectionReason.trim())}
          >
            {isReviewing ? "Rejecting..." : "Confirm rejection"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function HiringRequests() {
  const { data, isLoading, isError, error, refetch } = useGetMyAssignedRequestsQuery();
  const [requestToAssign, setRequestToAssign] = useState(null);
  const requests = Array.isArray(data?.requests) ? data.requests : [];

  if (isLoading) return <Box sx={{ display: "grid", placeItems: "center", minHeight: 180 }}><CircularProgress sx={{ color: ACCENT }} /></Box>;
  if (isError) return <Alert severity="error" action={<Button color="inherit" size="small" onClick={refetch}>Retry</Button>}>{error?.data?.message ?? "Unable to load hiring requests."}</Alert>;

  return (
    <Box sx={{ maxWidth: 1180, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, mb: 2.5 }}>
        <Box>
          <Typography fontSize={{ xs: 19, sm: 21 }} fontWeight={750} color="#101828" letterSpacing="-0.35px">Hiring requests</Typography>
          <Typography fontSize={13} color="#667085" sx={{ mt: 0.45 }}>Review assigned roles and find matched candidates to share with each hiring team.</Typography>
        </Box>
        <Chip
          label={`${requests.length} assigned`}
          size="small"
          sx={{ bgcolor: "#FFF1EB", color: ACCENT, fontWeight: 700, borderRadius: 2, flexShrink: 0 }}
        />
      </Box>
      {requests.length === 0 ? (
        <Card variant="outlined" sx={{ borderColor: "#EAECF0", borderRadius: 3, bgcolor: "#FCFCFD" }}>
          <CardContent sx={{ py: { xs: 5, sm: 7 }, px: 2, textAlign: "center" }}>
            <Box sx={{ width: 52, height: 52, display: "grid", placeItems: "center", mx: "auto", mb: 1.5, borderRadius: 2.5, bgcolor: "#FFF1EB", color: ACCENT }}>
              <GroupsOutlined />
            </Box>
            <Typography fontWeight={700} color="#344054">You’re all caught up</Typography>
            <Typography fontSize={13} color="#667085" sx={{ mt: 0.5 }}>Hiring requests assigned to you will appear here.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1.5}>
          {requests.map((request) => (
            <Card
              key={request.request_id ?? request.id}
              variant="outlined"
              sx={{
                borderColor: "#EAECF0",
                borderLeft: `3px solid ${ACCENT}`,
                borderRadius: 2.5,
                boxShadow: "0 1px 3px rgba(16,24,40,.035)",
                transition: "border-color .18s ease, box-shadow .18s ease, transform .18s ease",
                "&:hover": { borderColor: "#F5B49E", boxShadow: "0 8px 20px rgba(16,24,40,.07)", transform: "translateY(-1px)" },
              }}
            >
              <CardContent sx={{ p: { xs: 1.75, sm: 2.25 }, "&:last-child": { pb: { xs: 1.75, sm: 2.25 } } }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" }, alignItems: "center", gap: { xs: 1.75, md: 3 } }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0 }}>
                      <Box sx={{ width: 42, height: 42, display: "grid", placeItems: "center", flexShrink: 0, borderRadius: 2, color: ACCENT, bgcolor: "#FFF1EB" }}>
                        <BusinessOutlined fontSize="small" />
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography fontSize={15} fontWeight={700} color="#172033" sx={{ overflowWrap: "anywhere" }}>
                            {request.job_title ?? request.title ?? "Hiring request"}
                          </Typography>
                          <Chip
                            size="small"
                            label={formatStatus(request.status ?? "open")}
                            sx={{ height: 23, fontSize: 11, fontWeight: 700, bgcolor: String(request.status || "open").toLowerCase() === "closed" ? "#F2F4F7" : "#FFF4E5", color: String(request.status || "open").toLowerCase() === "closed" ? "#667085" : "#B54708" }}
                          />
                        </Stack>
                        {request.request_number && (
                          <Typography fontSize={12} color="#667085" sx={{ mt: 0.35, overflowWrap: "anywhere" }}>
                            {request.request_number}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{ mt: 2, pl: { xs: 0, sm: 0.25 } }}>
                      <Chip
                        size="small"
                        icon={<GroupsOutlined sx={{ fontSize: "15px !important" }} />}
                        label={`${request.exact_no_of_positions ?? 0} position${request.exact_no_of_positions === 1 ? "" : "s"}`}
                        sx={{ bgcolor: "#F8FAFC", color: "#475467", fontSize: 11, fontWeight: 600, "& .MuiChip-icon": { color: "#667085" } }}
                      />
                      <Chip
                        size="small"
                        icon={<EventOutlined sx={{ fontSize: "15px !important" }} />}
                        label={formatDate(request.created_at)}
                        sx={{ bgcolor: "#F8FAFC", color: "#475467", fontSize: 11, fontWeight: 600, "& .MuiChip-icon": { color: "#667085" } }}
                      />
                      {request.requested_by && (
                        <Chip
                          size="small"
                          label={`Requested by ${request.requested_by}`}
                          sx={{ maxWidth: "100%", bgcolor: "#F8FAFC", color: "#475467", fontSize: 11, fontWeight: 600, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
                        />
                      )}
                    </Stack>
                  </Box>

                  {String(request.status || "open").toLowerCase() !== "closed" && (
                    <Button
                      fullWidth
                      size="medium"
                      variant="contained"
                      startIcon={<GroupsOutlined />}
                      onClick={() => setRequestToAssign(request)}
                      sx={{ width: { xs: "100%", md: "auto" }, minWidth: { md: 190 }, height: 42, bgcolor: ACCENT, borderRadius: 2, px: 2, fontWeight: 700, textTransform: "none", boxShadow: "none", whiteSpace: "nowrap", "&:hover": { bgcolor: "#E64A19", boxShadow: "0 4px 10px rgba(255,87,34,.2)" } }}
                    >
                      Assign candidates
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      <CandidateAssignmentDialog
        open={Boolean(requestToAssign)}
        onClose={() => setRequestToAssign(null)}
        requestId={requestToAssign?.request_id ?? requestToAssign?.id}
        jobTitle={requestToAssign?.job_title ?? requestToAssign?.title ?? "Hiring request"}
      />
    </Box>
  );
}

export default function RequestsPage() {
  const navigate = useNavigate();
  const { requestType = "demo" } = useParams();
  const selectedTab = REQUEST_TABS.some((tab) => tab.value === requestType) ? requestType : "demo";

  useEffect(() => {
    if (requestType !== selectedTab) navigate("/account-manager/requests/demo", { replace: true });
  }, [navigate, requestType, selectedTab]);

  const handleTabChange = (_, value) => {
    navigate(`/account-manager/requests/${value}`);
  };

  return (
    <Box sx={{ minHeight: "100%", background: "radial-gradient(ellipse at 12% 0%, #FFF4EF 0%, transparent 32%), #F8FAFC", p: { xs: 1.5, sm: 2.5, lg: 1 } }}>
      <Box sx={{ width: "100%", maxWidth: 1480, mx: "auto" }}>
      {/* <Box sx={{ mb: 2.5, px: { xs: 0.25, sm: 0.5 } }}>
        <Typography fontSize={{ xs: 23, sm: 26 }} fontWeight={780} color="#101828" letterSpacing="-0.65px">Requests</Typography>
        <Typography fontSize={13.5} color="#667085" sx={{ mt: 0.55 }}>Manage incoming demo, subscription, and hiring requests.</Typography>
      </Box> */}
      <Card variant="outlined" sx={{ borderColor: "#E6EAF0", borderRadius: 3.5, bgcolor: "rgba(255,255,255,.96)", overflow: "hidden", boxShadow: "0 12px 32px rgba(16,24,40,.055)" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ px: { xs: 1, sm: 2.5 }, borderBottom: "1px solid #EAECF0", bgcolor: "#fff", "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0", bgcolor: ACCENT }, "& .MuiTab-root": { minHeight: 62, textTransform: "none", fontWeight: 650, color: "#667085", fontSize: 13.5, px: { xs: 1.5, sm: 2.5 }, transition: "color .18s ease, background-color .18s ease", "& .MuiTab-iconWrapper": { mr: 1, mb: "0 !important" } }, "& .Mui-selected": { color: `${ACCENT} !important` }, "& .MuiTab-root:hover": { color: ACCENT, bgcolor: "#FFFAF8" } }}
        >
          {REQUEST_TABS.map((tab) => <Tab key={tab.value} value={tab.value} icon={tab.icon} iconPosition="start" label={tab.label} />)}
        </Tabs>
        <Box sx={{ p: { xs: 1.75, sm: 3, lg: 3.5 } }}>
          {selectedTab === "demo" && <DemoRequests />}
          {selectedTab === "subscription" && <SubscriptionRequests />}
          {selectedTab === "hiring" && <HiringRequests />}
        </Box>
      </Card>
      </Box>
    </Box>
  );
}
