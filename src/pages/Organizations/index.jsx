// src/pages/Organizations/index.jsx

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import { useGetMyOrganisationsQuery } from "../../redux/services/requisition/requisition";
import SearchFilter from "../../components/searchFilter/index.jsx";
import ViewToggle from "../../components/table/ViewToggle";
import ReusableMRT from "../../components/table/index";

// ─── Design tokens ────────────────────────────────────────────
const C = {
  accent: "#FF5F1F",
  accentHover: "#E54E10",
  accentSoft: "#FFF0E8",
  green: "#0F6E56",
  greenSoft: "#E7F8EE",
  indigo: "#4338CA",
  indigoSoft: "#EEF2FF",
  amber: "#92400E",
  amberSoft: "#FEF3C7",
  red: "#B91C1C",
  redSoft: "#FEE2E2",
  border: "#E8E8EC",
  textPrimary: "#111118",
  textSecondary: "#5C5C70",
  textTertiary: "#9696A6",
};

// ─────────────────────────────────────────────────────────────
// Subscription helpers (payg is shown as "Premium")
// ─────────────────────────────────────────────────────────────
const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

const getPlanMeta = (sub) => {
  if (!sub) {
    return {
      key: "none",
      label: "No plan",
      color: C.textTertiary,
      bg: "#F3F4F6",
      Icon: BlockIcon,
      detail: "No subscription found",
    };
  }
  const type = String(sub.subscription_type || "").toLowerCase();
  const cancelled = !!sub.cancelled_at || sub.status === "cancelled";
  const inactive = sub.is_access_active === false;

  if (type === "trial") {
    const daysLeft = sub.trial_ends_at
      ? Math.ceil((new Date(sub.trial_ends_at) - new Date()) / 86400000)
      : null;
    const expired = sub.trial_expired || (daysLeft !== null && daysLeft <= 0);
    return expired
      ? {
          key: "trial-expired",
          label: "Trial expired",
          color: C.red,
          bg: C.redSoft,
          Icon: HourglassTopIcon,
          detail: `Ended ${fmtDate(sub.trial_ends_at) ?? ""}`.trim(),
        }
      : {
          key: "trial",
          label: "Trial",
          color: "#6D4AFF",
          bg: "#F1EDFF",
          Icon: HourglassTopIcon,
          detail:
            daysLeft !== null
              ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left · ends ${fmtDate(sub.trial_ends_at)}`
              : "Trial active",
        };
  }

  if (cancelled || inactive) {
    return {
      key: "inactive",
      label: cancelled ? "Premium · Cancelled" : "Premium · Inactive",
      color: C.red,
      bg: C.redSoft,
      Icon: BlockIcon,
      detail: cancelled
        ? `Cancelled ${fmtDate(sub.cancelled_at) ?? ""}`.trim()
        : "Access disabled",
    };
  }

  return {
    key: "premium",
    label: "Premium",
    color: "#087E8B",
    bg: "#E7F6F7",
    Icon: WorkspacePremiumIcon,
    detail: `Since ${fmtDate(sub.payg_started_at || sub.started_at) ?? "—"}`,
  };
};

function PlanBadge({ subscription, size = "md" }) {
  const { label, color, bg, Icon } = getPlanMeta(subscription);
  const small = size === "sm";
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        px: small ? "8px" : "10px",
        py: small ? "3px" : "4px",
        borderRadius: "999px",
        backgroundColor: bg,
        color,
        fontSize: small ? 11 : 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
        border: `1px solid ${color}22`,
      }}
    >
      <Icon sx={{ fontSize: small ? 13 : 15 }} />
      {label}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function AmOrganizations() {
  const { data, isLoading, isError, error } = useGetMyOrganisationsQuery();
  const orgs = data?.data ?? [];
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  const filteredOrgs = orgs.filter(
    (org) =>
      org.organisation_name?.toLowerCase().includes(search.toLowerCase()) ||
      org.industry?.toLowerCase().includes(search.toLowerCase()) ||
      org.country?.toLowerCase().includes(search.toLowerCase()) ||
      org.clin_org_id?.toLowerCase().includes(search.toLowerCase()),
  );

  const goToOrg = (org) =>
    navigate(`/account-manager/org/${org.id}`, {
      state: { orgName: org.organisation_name, org },
    });

  const orgColumns = useMemo(
    () => [
      {
        accessorKey: "organisation_name",
        header: "Organization",
        size: 250,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                backgroundColor: C.accentSoft,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LayersIcon sx={{ color: C.accent, fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
                noWrap
              >
                {row.original.organisation_name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: C.textTertiary }}>
                {row.original.clin_org_id}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        id: "plan",
        accessorFn: (row) => getPlanMeta(row.subscription).label,
        header: "Plan",
        size: 190,
        Cell: ({ row }) => {
          const sub = row.original.subscription;
          return (
            <Box>
              <PlanBadge subscription={sub} size="sm" />
              <Typography
                sx={{ fontSize: 11, color: C.textTertiary, mt: "3px" }}
              >
                {getPlanMeta(sub).detail}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "industry",
        header: "Industry",
        size: 150,
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
        accessorKey: "country",
        header: "Location",
        size: 130,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "website_url",
        header: "Website",
        size: 180,
        Cell: ({ cell }) => {
          const v = cell.getValue();
          return v ? (
            <Typography
              component="a"
              href={v}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: 12,
                color: "#3B82F6",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {v}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: 12, color: C.textTertiary }}>
              —
            </Typography>
          );
        },
      },
      {
        accessorKey: "time_zone",
        header: "Timezone",
        size: 140,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12, color: C.textSecondary }}>
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "total_hires",
        header: "Total Hires",
        size: 110,
        Cell: ({ cell }) => (
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}
          >
            {cell.getValue() ?? 0}
          </Typography>
        ),
      },
      {
        accessorKey: "success_rate",
        header: "Success Rate",
        size: 120,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              px: "8px",
              py: "3px",
              borderRadius: "8px",
              backgroundColor: C.greenSoft,
              color: C.green,
            }}
          >
            {cell.getValue() ?? 0}%
          </Box>
        ),
      },
      {
        accessorKey: "total_jobs",
        header: "Active Jobs",
        size: 110,
        Cell: ({ cell }) => (
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}
          >
            {cell.getValue() ?? 0}
          </Typography>
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ p: 1, height: "100%" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}
            >
              Organizations
            </Typography>
            <Typography sx={{ fontSize: 13, color: C.textTertiary, mt: "4px" }}>
              Manage your assigned organizations and drill into requisitions
            </Typography>
          </Box>

          {/* Toolbar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SearchFilter
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizations..."
            />
            <ViewToggle view={view} onChange={setView} />
          </Box>
        </Box>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: C.accent }} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
          Failed to load organisations: {error?.data?.message ?? error?.status}
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          {filteredOrgs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography sx={{ fontSize: 14, color: C.textTertiary }}>
                No organizations match "{search}"
              </Typography>
            </Box>
          ) : view === "grid" ? (
            <Grid container spacing={3}>
              {filteredOrgs.map((org) => (
                <Grid
                  key={org.id}
                  size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}
                >
                  <CompanyCard org={org} onOpen={() => goToOrg(org)} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <ReusableMRT
              data={filteredOrgs}
              columnData={orgColumns}
              enableRowActions={false}
              enableRowSelection={false}
              enableGlobalFilter={false}
              height="calc(100vh - 160px)"
              onRowClick={goToOrg}
            />
          )}
        </>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// Company Card
// ─────────────────────────────────────────────────────────────
function CompanyCard({ org, onOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      sx={{
        borderRadius: "16px",
        border: `1px solid ${hovered ? C.accent : C.border}`,
        boxShadow: hovered
          ? "0 0 0 3px rgba(255,95,31,0.07)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "border-color 0.15s, box-shadow 0.15s",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: "20px 20px 0 20px" }}>
        {/* Org header: icon + name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            mb: "18px",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              backgroundColor: C.accentSoft,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LayersIcon sx={{ color: C.accent, fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                color: C.textPrimary,
                lineHeight: 1.25,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {org.organisation_name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: C.textTertiary, mt: "1px" }}>
              {org.clin_org_id}
            </Typography>
          </Box>
        </Box>

        {/* Subscription plan */}
        {(() => {
          const plan = getPlanMeta(org.subscription);
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                p: "10px 12px",
                mb: "16px",
                borderRadius: "10px",
                backgroundColor: plan.bg,
                border: `1px solid ${plan.color}22`,
              }}
            >
              <PlanBadge subscription={org.subscription} />
              <Typography
                sx={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: plan.color,
                  textAlign: "right",
                }}
              >
                {plan.detail}
              </Typography>
            </Box>
          );
        })()}

        <Divider sx={{ borderColor: C.border, mb: "16px" }} />

        {/* Core Company Profile */}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: C.textPrimary,
            mb: "10px",
          }}
        >
          Core Company Profile
        </Typography>

        <InfoRow label="Company name" value={org.organisation_name} />
        <InfoRow label="Location" value={org.country ?? "—"} />
        <InfoRow label="Website" value={org.website_url ?? "—"} isLink />
        <InfoRow label="Industry" value={org.industry ?? "—"} />
        <InfoRow label="Timezone" value={org.time_zone ?? "—"} />

        <Divider sx={{ borderColor: C.border, my: "16px" }} />

        {/* Essential Hiring Metrics */}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: C.textPrimary,
            mb: "10px",
          }}
        >
          Essential Hiring Metrics
        </Typography>

        <InfoRow label="Total hires made" value={org.total_hires ?? 0} />
        <InfoRow
          label="Hiring success rate"
          value={`${org.success_rate ?? 0}%`}
        />
        <InfoRow
          label="Total Requisitions"
          value={org.total_jobs ?? 0}
        />
      </Box>

      {/* CTA */}
      {/* CTA */}
      <Box sx={{ p: "16px 20px 20px 20px", mt: "auto" }}>
        <Button
          fullWidth
          disableElevation
          onClick={onOpen}
          sx={{
            backgroundColor: C.accent,
            color: "#fff",
            borderRadius: "10px",
            py: "11px",
            fontWeight: 600,
            fontSize: 13,
            textTransform: "none",
            "&:hover": { backgroundColor: C.accentHover },
          }}
        >
          See Full Details
        </Button>
      </Box>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// InfoRow
// ─────────────────────────────────────────────────────────────
function InfoRow({ label, value, isLink }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: "8px",
      }}
    >
      <Typography
        sx={{ fontSize: 13, color: C.textSecondary, flexShrink: 0, mr: 1 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: isLink ? "#3B82F6" : C.textPrimary,
          textAlign: "right",
          maxWidth: "60%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
