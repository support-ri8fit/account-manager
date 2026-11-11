# Application Forms

Generated Date: 2026-11-03T09:30:42.927Z

Total Source Files: 18

---

## File: components/table/index.jsx

```javascript
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
  IconButton,
  Modal,
  Select,
  FormControl,
} from "@mui/material";
import {
  AccountCircle,
  CloseOutlined,
  //   DeleteOutline,
  Send,
} from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function ReusableMRT({
  data = [],
  enableRowSelection = false,
  enableRowActions = true,
  enableColumnFilters = true,
  enableGlobalFilter = true,
  onViewProfile,
  onSendEmail,
  enableRowClickModal = true,
  columnData = [],
  onRowClick,
  onDelete,
  height,
  compactMode = false,
  disableDefaultColumnPinning = false,
  ...rest          
}) {
  // ✅ REQUIRED STATE
  // const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // ✅ COLUMNS
  const columns = useMemo(
    () =>
      columnData.map((col) => ({
        ...col,

        // ✅ default header styles + custom override
        muiTableBodyCellProps: {
          sx: {
            backgroundColor: "white",
            p: "14px 24px", // bigger cell padding
            minWidth: "180px", // increase cell width
            fontSize: "14px",
          },
        },

        // ✅ default cell styles + custom override
        muiTableBodyCellProps: {
          sx: {
            fontSize: compactMode ? "12px" : "13px",
            color: "#374151",
            fontWeight: 500,
            ...(compactMode ? { px: 1.5, py: 1, minWidth: 0 } : {}),
            ...(col.cellSx || {}),
          },
        },
      })),
    [columnData, compactMode],
  );

  // ✅ TABLE INSTANCE
  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection,
    enableRowActions,
    enableColumnFilters: true,
    enableGlobalFilter,
    enableColumnActions: false,
    renderBottomToolbar: false,
    enableStickyHeader: true, // ✅ Header stays fixed

    muiTableContainerProps: {
      sx: {
        maxHeight: `calc(${height} - 48px)`,
        // maxHeight: height,
        overflowY: "auto",
        overflowX: "auto",
        // Optional: custom scrollbar
        "&::-webkit-scrollbar": { width: "6px", height: "8px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bcc3c3ff",
          borderRadius: "6px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          // backgroundColor: "#00A1A7",
          backgroundColor: "#bcc3c3ff",
        },
      },
    },
    // Column Action UI Controls
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 60,
        muiTableHeadCellProps: {
          sx: {
            fontSize: "13px",
            fontWeight: 600,
            justifyContent: "center",
            backgroundColor: "#F5F5F5",
          },
        },
        muiTableBodyCellProps: {
          sx: {
            justifyContent: "center",
            px: 1,
          },
        },
      },
    },
    initialState: {
      showGlobalFilter: enableGlobalFilter,
      // columnPinning: {
      //   left: enableRowSelection ? ["mrt-row-select"] : [],
      //   right: enableRowActions ? ["mrt-row-actions"] : [],
      // },
      columnPinning: disableDefaultColumnPinning ? { left: [], right: [] } : {
        left: columnData.slice(0, 3).map((col) => col.accessorKey || col.id),
        right: [
          ...(enableRowActions ? ["mrt-row-actions"] : []),
          ...(columnData.some((c) => c.id === "actions") ? ["actions"] : []),
        ],
      },
    },

    columnFilterDisplayMode: "popover",

    // White background styles
    muiTablePaperProps: {
      sx: { backgroundColor: "white", boxShadow: "none" },
    },
    muiTableHeadCellProps: {
      sx: { backgroundColor: "white" },
    },
    muiTableBodyProps: { sx: { backgroundColor: "white" } },
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: "white",
        p: compactMode ? "10px 12px" : "14px 24px",
        minWidth: compactMode ? 0 : "180px",
        fontSize: compactMode ? "12px" : "14px",
      },
    },

    // muiBottomToolbarProps: {
    //   sx: { backgroundColor: "white", padding: "0px 8px",},
    // },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "white",
        padding: "0px 8px",
        // minHeight: "40px",
      },
    },

    muiPaginationProps: {
      labelRowsPerPage: " ",
      sx: {
        ".MuiTablePagination-toolbar": {
          minHeight: "32px", // ✅ reduces footer height
          padding: "0px 6px", // ✅ main padding control
        },
        ".css-9lr64-MuiFormLabel-root-MuiInputLabel-root": {
          display: "none",
        },
        ".MuiTablePagination-selectLabel": {
          display: "none",
          margin: 0,
          fontSize: "12px",
        },
        ".MuiTablePagination-displayedRows": {
          margin: 0,
          fontSize: "12px",
        },
        ".MuiTablePagination-actions": {
          marginLeft: "8px",
        },
        ".MuiIconButton-root": {
          padding: "4px", // ✅ smaller pagination arrows
        },
      },
    },

    renderTopToolbar: false,

    renderRowActionMenuItems:
      enableRowActions &&
      (({ row, closeMenu }) => [
        <MenuItem
          key="view"
          onClick={() => {
            onDelete?.(row.original);
            closeMenu();
          }}
        >
          <DeleteOutlineOutlinedIcon />
        </MenuItem>,
        // <MenuItem
        //   key="email"
        //   onClick={() => {
        //     onSendEmail?.(row.original);
        //     closeMenu();
        //   }}
        // >
        //   <ListItemIcon>
        //     <Send />
        //   </ListItemIcon>
        //   Send Email
        // </MenuItem>,
      ]),

    // THIS IS THE MISSING PART THAT MAKES ROW CLICK WORK
    // muiTableBodyRowProps: ({ row }) => ({
    //   onClick: () => {
    //     setSelectedRow(row.original);
    //     setModalOpen(true);
    //   },
    //   sx: {
    //     backgroundColor: "#fff",
    //     cursor: "pointer",
    //     "&:hover": {
    //       backgroundColor: "#fff",
    //     },
    //   },
    // }),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        // 1️⃣ Custom row click (highest priority)
        if (onRowClick) {
          onRowClick(row.original);
          return;
        }

        // 2️⃣ Fallback to modal
        if (enableRowClickModal) {
          setSelectedRow(row.original);
          setModalOpen(true);
        }
      },
      sx: {
        backgroundColor: "#ffffff !important",
        cursor: onRowClick || enableRowClickModal ? "pointer" : "default",
        "&:hover": { backgroundColor: "#fff" },
      },
    }),
  });
  const { getState, setPageIndex, setPageSize, getRowCount } = table;

  const { pagination } = getState();
  return (
    <Box
      sx={{
        // height: "calc(100vh - 150px)", // adjust
        height: height, // adjust
        display: "flex",
        flexDirection: "column",
        // border:1
      }}
    >
      {/* ===== TABLE AREA ===== */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "auto",
        }}
      >
        <MaterialReactTable table={table} {...rest} />
      </Box>

      {/* ===== FOOTER ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #eee",
          backgroundColor: "white",
          px: 2,
          py: 1,
          flexShrink: 0,
        }}
      >
        <Typography fontSize="13px" fontWeight={500}>
          Total Record Count : {data.length}
        </Typography>

        {/* RIGHT: Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* Rows-per-page dropdown */}
          <FormControl size="small" sx={{ minWidth: 64 }}>
            <Select
              value={pagination.pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              sx={{
                fontSize: "12px",
                height: 28,
                ".MuiSelect-select": { py: "2px" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: { fontSize: "12px" },
                },
              }}
            >
              {[5, 10, 25, 50,100].map((size) => (
                <MenuItem key={size} value={size} sx={{ fontSize: "12px" }}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* First page */}
          {/* <IconButton
            size="small"
            onClick={() => setPageIndex(0)}
            disabled={pagination.pageIndex === 0}
          >
            ⏮
          </IconButton> */}

          {/* Previous page */}
          <IconButton
            size="small"
            onClick={() => setPageIndex(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 0}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          {/* Page info */}
          <Typography fontSize="12px" color="#555">
            {pagination.pageIndex * pagination.pageSize + 1}–
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              getRowCount(),
            )}
          </Typography>

          {/* Next page */}
          <IconButton
            size="small"
            onClick={() => setPageIndex(pagination.pageIndex + 1)}
            disabled={
              (pagination.pageIndex + 1) * pagination.pageSize >= getRowCount()
            }
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

```

---

## File: pages/1dashboard1/DashboardFilterBar.jsx

```javascript
import React from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { COLORS } from "../../theme/index.js";
import { useGetCountriesQuery, useGetSubFunctionsQuery } from "../../redux/services/dashboard/dashboardService.js";

const PERIOD_OPTIONS = [
  { value: 3, label: "Last 3 months" },
  { value: 6, label: "Last 6 months" },
  { value: "all", label: "All" },
  // { value: 12, label: "Last 12 months" },
];

const selectSx = {
  height: 28,
  fontSize: 11.5,
  borderRadius: "8px",
  bgcolor: "#F7F9FC",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.border },
  "& .MuiSelect-select": { py: "4px", pl: "10px" },
};

const menuPropsSx = { PaperProps: { sx: { "& .MuiMenuItem-root": { fontSize: 11.5 } } } };

// ── Period (monthly) selector — top-level dashboard filter bar ──────────────
const PeriodSelect = ({ value, onChange, disabled }) => (
  <FormControl size="small" sx={{ minWidth: 130 }} disabled={disabled}>
    <Select value={value} onChange={(e) => onChange(e.target.value)} sx={selectSx} MenuProps={menuPropsSx}>
      {PERIOD_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

// ── Country selector — top-level dashboard filter bar ───────────────────────
export const CountrySelect = ({ value, onChange, disabled }) => {
  const { data: countries = [], isLoading: countriesLoading } = useGetCountriesQuery();
  const options = [
    { value: "all", label: "All" },
    ...countries
      .map((country) => {
        const label = typeof country === "string" ? country : country?.name ?? country?.label ?? country?.country;
        return label ? { value: label, label } : null;
      })
      .filter(Boolean),
  ];

  return (
    <FormControl size="small" sx={{ minWidth: 140 }} disabled={disabled || countriesLoading}>
      <Select value={value ?? "all"} onChange={(e) => onChange(e.target.value)} sx={selectSx} MenuProps={menuPropsSx}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// ── Sub-function selector — top-level dashboard filter bar ──────────────────
export const SubFunctionSelect = ({ value, onChange, disabled }) => {
  const { data: subFnRes, isLoading: subFnLoading } = useGetSubFunctionsQuery();
  const options = subFnRes?.data ?? [];

  return (
    <FormControl size="small" sx={{ minWidth: 190 }} disabled={disabled || subFnLoading}>
      <Select value={value} onChange={(e) => onChange(e.target.value)} displayEmpty sx={selectSx} MenuProps={menuPropsSx}>
        <MenuItem value="">All Sub-functions</MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.key} value={opt.key}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PeriodSelect;

```

---

## File: pages/AccountManagement/AccountManagement.jsx

```javascript
import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  ListItemButton,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Grid,
  MenuItem,
  Snackbar,
  Select,
  FormControl,
  FormHelperText,
  Divider,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";

import {
  useAssignOrganisationMutation,
  useGetAllInternalUsersQuery,
  useGetMyOrganisationsQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "../../redux/services/requisition/requisition";
import { useCreateUserMutation } from "../../redux/services/userManagement/userManagement";

// ── ADD THIS IMPORT from your userManagement service ──
import { useUpdateUserByAdminMutation } from "../../redux/services/userManagement/userManagement";

import ReusableMRT from "../../components/table";

/* ─────────────────────── Design tokens ─────────────────────── */
const C = {
  accent: "#FF5F1F",
  accentSoft: "#FFF0E8",
  accentMid: "#FFD6BF",
  border: "#E8E8EC",
  bg: "#F7F7F9",
  white: "#FFFFFF",
  primary: "#111118",
  secondary: "#5C5C70",
  tertiary: "#9696A6",
  green: "#0F6E56",
  greenSoft: "#E7F8EE",
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
  valueSm: { fontSize: 13, fontWeight: 500, color: C.primary },
  meta: { fontSize: 11, fontWeight: 400, color: C.tertiary },
};

/* ─────────────────────── Helpers ─────────────────────── */
function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function roleLabel(role = "") {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const DIAL_CODES = [
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1",  label: "🇺🇸 +1"  },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971",label: "🇦🇪 +971"},
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+81", label: "🇯🇵 +81" },
  { code: "+86", label: "🇨🇳 +86" },
];
function splitPhone(fullPhone = "") {
  if (!fullPhone) return { dialCode: "+91", local: "" };
  const match = DIAL_CODES.find((d) => fullPhone.startsWith(d.code));
  if (match) return { dialCode: match.code, local: fullPhone.slice(match.code.length) };
  return { dialCode: "+91", local: fullPhone.replace(/^\+/, "") };
}

const GENDER_OPTIONS     = ["Male", "Female", "Other", "Prefer not to say"];
const EMP_TYPE_OPTIONS   = ["Full-time", "Part-time", "Contract", "Intern"];
const EMP_STATUS_OPTIONS = ["Active", "Inactive", "On Leave", "Terminated"];
const TZ_OPTIONS = [
  "UTC","Asia/Kolkata","America/New_York","America/Los_Angeles",
  "Europe/London","Europe/Paris","Asia/Tokyo","Australia/Sydney",
];
const USER_ROLE_OPTIONS = [
  { value: "accountmanager", label: "AccountManager" },
  { value: "super_admin",    label: "Super Admin"    },
];

/* ─────────────────────── Field styles ─────────────────────── */
const editFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px", fontSize: 13, background: "#FFF7F2",
    transition: "all 0.2s ease",
    "& fieldset": { borderColor: "#FFD6BF", borderWidth: "1.5px" },
    "&:hover": { background: "#FFF1E8" },
    "&:hover fieldset": { borderColor: "#FF8A4C" },
    "&.Mui-focused": { background: "#fff", boxShadow: "0 0 0 3px rgba(255,95,31,0.10)" },
    "&.Mui-focused fieldset": { borderColor: C.accent, borderWidth: "2px" },
  },
  "& .MuiInputBase-input": { py: 1.2, fontWeight: 500, color: C.primary },
};
const errorFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px", fontSize: 13, background: "#FFF5F5",
    "& fieldset": { borderColor: "#FCA5A5", borderWidth: "1.5px" },
    "&.Mui-focused fieldset": { borderColor: "#EF4444", borderWidth: "2px" },
  },
  "& .MuiInputBase-input": { py: 1.2, fontWeight: 500, color: C.primary },
};

/* ─────────────────────── Shared sub-components ─────────────────────── */
function ReadField({ label, value }) {
  return (
    <Box>
      <Typography sx={{ ...T.label, mb: "3px" }}>{label}</Typography>
      <Typography sx={value ? T.value : { ...T.value, color: C.tertiary }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

function EditField({ label, fieldKey, select, options = [], form, setForm, error }) {
  const sx = error ? errorFieldSx : editFieldSx;
  return (
    <Box>
      <Typography sx={{ ...T.label, mb: "5px" }}>{label}</Typography>
      {select ? (
        <TextField
          select size="small" fullWidth
          value={form[fieldKey] ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, [fieldKey]: e.target.value }))}
          sx={sx} error={!!error} helperText={error}
        >
          <MenuItem value=""><em style={{ color: C.tertiary, fontStyle: "normal" }}>—</em></MenuItem>
          {options.map((o) => (
            <MenuItem key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
              {typeof o === "string" ? o : o.label}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          size="small" fullWidth
          value={form[fieldKey] ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, [fieldKey]: e.target.value }))}
          sx={sx} error={!!error} helperText={error}
        />
      )}
    </Box>
  );
}

function PhoneEditField({ dialCode, setDialCode, localPhone, setLocalPhone, error }) {
  return (
    <Box>
      <Typography sx={{ ...T.label, mb: "5px" }}>Phone</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 108 }}>
          <Select
            value={dialCode} onChange={(e) => setDialCode(e.target.value)}
            sx={{
              borderRadius: "10px", fontSize: 13,
              "& .MuiOutlinedInput-notchedOutline": { borderColor: error ? "#EF4444" : C.border },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: C.accent },
            }}
          >
            {DIAL_CODES.map((d) => <MenuItem key={d.code} value={d.code}>{d.label}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small" fullWidth placeholder="9876543210"
          value={localPhone}
          onChange={(e) => setLocalPhone(e.target.value.replace(/\D/g, ""))}
          error={!!error} helperText={error}
          inputProps={{ inputMode: "numeric", maxLength: 15 }}
          sx={error ? errorFieldSx : editFieldSx}
        />
      </Box>
    </Box>
  );
}

function ProfileInfoCard({ label, value, icon }) {
  return (
    <Box sx={{
      p: "12px 14px", borderRadius: "12px", background: C.white,
      border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 1.5,
      transition: "0.2s ease",
      "&:hover": { borderColor: "#FFB38A", boxShadow: "0 4px 14px rgba(255,95,31,0.07)" },
    }}>
      <Box sx={{ width: 36, height: 36, borderRadius: "9px", flexShrink: 0, background: "#F3F4F6",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ ...T.label, mb: "2px" }}>{label}</Typography>
        <Typography sx={{ ...T.value, whiteSpace: "nowrap", overflow: "hidden",
          textOverflow: "ellipsis", color: value ? C.primary : C.tertiary }}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════════
   ROOT
════════════════════════════════════════════ */
export default function AccountManagement() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ p: 1 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
        mb: "16px", minHeight: 36,
        "& .MuiTabs-indicator": { backgroundColor: C.accent, height: 2, borderRadius: 1 },
        "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: 13,
          minHeight: 36, px: "14px", color: C.secondary, "&.Mui-selected": { color: C.accent } },
      }}>
        <Tab icon={<Person2OutlinedIcon sx={{ fontSize: 15 }} />} iconPosition="start" label="My Profile" />
        <Tab icon={<GroupOutlinedIcon    sx={{ fontSize: 15 }} />} iconPosition="start" label="Users"      />
      </Tabs>
      {tab === 0 && <MyProfileTab />}
      {tab === 1 && <UsersTab />}
    </Box>
  );
}

/* ════════════════════════════════════════════
   MY PROFILE TAB  (unchanged)
════════════════════════════════════════════ */
function MyProfileTab() {
  const { data, isLoading, isError, refetch } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateMyProfileMutation();
  const profile = data?.data ?? {};
  const [editing, setEditing]     = useState(false);
  const [form, setForm]           = useState({});
  const [dialCode, setDialCode]   = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

  const startEdit = () => {
    const { dialCode: dc, local } = splitPhone(profile.phone);
    setDialCode(dc); setLocalPhone(local); setPhoneError("");
    setForm({
      first_name: profile.first_name ?? "", last_name: profile.last_name ?? "",
      emp_id: profile.emp_id ?? "", department: profile.department ?? "",
      emp_type: profile.emp_type ?? "", emp_status: profile.emp_status ?? "",
      gender: profile.gender ?? "", emp_designation: profile.emp_designation ?? "",
      time_zone: profile.time_zone ?? "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (localPhone && (localPhone.length < 7 || localPhone.length > 15)) {
      setPhoneError("Enter a valid phone number (7–15 digits)"); return;
    }
    setPhoneError("");
    const nn = (v) => (v === "" ? null : v);
    const payload = {
      first_name: nn(form.first_name), last_name: nn(form.last_name),
      phone: localPhone ? `${dialCode}${localPhone}` : null,
      emp_id: nn(form.emp_id), department: nn(form.department),
      emp_type: nn(form.emp_type), emp_status: nn(form.emp_status),
      gender: nn(form.gender), emp_designation: nn(form.emp_designation),
      time_zone: nn(form.time_zone),
    };
    try {
      await updateProfile(payload).unwrap();
      await refetch();
      setToast({ open: true, msg: "Profile updated successfully!", severity: "success" });
      setEditing(false);
    } catch (err) {
      setToast({ open: true, msg: err?.data?.message ?? "Failed to update profile.", severity: "error" });
    }
  };

  if (isLoading && !profile?.full_name)
    return <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: C.accent }} /></Box>;
  if (isError)
    return <Alert severity="error" sx={{ borderRadius: "10px" }}>Failed to load profile.</Alert>;

  const SecLabel = ({ children }) => <Typography sx={{ ...T.label, mb: "12px" }}>{children}</Typography>;

  return (
    <Box sx={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden" }}>
      <Box sx={{ p: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: C.accent, fontSize: 16, fontWeight: 700 }}>
            {getInitials(profile.full_name)}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.primary, lineHeight: 1.2 }}>{profile.full_name || "—"}</Typography>
            <Typography sx={T.meta}>{profile.email}</Typography>
          </Box>
        </Box>
        {!editing ? (
          <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 13 }} />} onClick={startEdit}
            sx={{ textTransform: "none", fontSize: 12, fontWeight: 600, color: C.accent,
              border: `1px solid ${C.accent}`, borderRadius: "8px", "&:hover": { backgroundColor: C.accentSoft } }}>
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button size="small" onClick={() => { setEditing(false); setPhoneError(""); }}
              sx={{ textTransform: "none", fontSize: 12, fontWeight: 600, color: C.secondary,
                border: `1px solid ${C.border}`, borderRadius: "8px", "&:hover": { backgroundColor: "#F9FAFB" } }}>
              Cancel
            </Button>
            <Button size="small" onClick={handleSave} disabled={saving}
              startIcon={saving ? <CircularProgress size={12} sx={{ color: "#fff" }} /> : <SaveOutlinedIcon sx={{ fontSize: 13 }} />}
              sx={{ textTransform: "none", fontSize: 12, fontWeight: 600, color: "#fff", backgroundColor: C.accent,
                borderRadius: "8px", "&:hover": { backgroundColor: "#E54E10" },
                "&:disabled": { backgroundColor: "#F3F4F6", color: C.tertiary } }}>
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ p: "20px 24px" }}>
        <SecLabel>Basic Information</SecLabel>
        <Grid container spacing={2} mb="20px">
          {editing ? (
            <>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="First Name" fieldKey="first_name" form={form} setForm={setForm} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Last Name"  fieldKey="last_name"  form={form} setForm={setForm} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><PhoneEditField dialCode={dialCode} setDialCode={setDialCode} localPhone={localPhone} setLocalPhone={setLocalPhone} error={phoneError} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Gender" fieldKey="gender" form={form} setForm={setForm} select options={GENDER_OPTIONS} /></Grid>
            </>
          ) : (
            <>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="First Name" value={profile.first_name} icon={<PersonOutlineOutlinedIcon sx={{ color: "#FF6B2C", fontSize: 18 }} />} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Last Name"  value={profile.last_name}  icon={<PersonOutlineOutlinedIcon sx={{ color: "#FF6B2C", fontSize: 18 }} />} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Phone"  value={profile.phone}  icon={<PhoneOutlinedIcon sx={{ color: "#10B981", fontSize: 18 }} />} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Gender" value={profile.gender} icon={<WcOutlinedIcon     sx={{ color: "#8B5CF6", fontSize: 18 }} />} /></Grid>
            </>
          )}
        </Grid>

        <Box sx={{ borderTop: `1px solid ${C.border}`, mb: "20px" }} />
        <SecLabel>Employment Details</SecLabel>
        <Grid container spacing={2}>
          {editing ? (
            <>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Employee ID"    fieldKey="emp_id"          form={form} setForm={setForm} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Department"     fieldKey="department"      form={form} setForm={setForm} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Designation"    fieldKey="emp_designation" form={form} setForm={setForm} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Employee Type"  fieldKey="emp_type"        form={form} setForm={setForm} select options={EMP_TYPE_OPTIONS}   /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Status"         fieldKey="emp_status"      form={form} setForm={setForm} select options={EMP_STATUS_OPTIONS} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Time Zone"      fieldKey="time_zone"       form={form} setForm={setForm} select options={TZ_OPTIONS}         /></Grid>
            </>
          ) : (
            <>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Employee ID"   value={profile.emp_id}          icon={<BadgeOutlinedIcon        sx={{ color: "#3B82F6", fontSize: 18 }} />} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Department"    value={profile.department}      icon={<WorkOutlineOutlinedIcon  sx={{ color: "#F59E0B", fontSize: 18 }} />} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Designation"   value={profile.emp_designation} icon={<WorkOutlineOutlinedIcon  sx={{ color: "#EF4444", fontSize: 18 }} />} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Employee Type" value={profile.emp_type}        icon={<BadgeOutlinedIcon        sx={{ color: "#14B8A6", fontSize: 18 }} />} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Status"        value={profile.emp_status}      icon={<BadgeOutlinedIcon        sx={{ color: "#6366F1", fontSize: 18 }} />} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><ProfileInfoCard label="Time Zone"     value={profile.time_zone}       icon={<PublicOutlinedIcon       sx={{ color: "#EC4899", fontSize: 18 }} />} /></Grid>
            </>
          )}
        </Grid>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: "10px", fontSize: 13 }}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

/* ════════════════════════════════════════════
   USERS TAB
════════════════════════════════════════════ */
function UsersTab() {
  const [drawerUser,  setDrawerUser]  = useState(null);
  const [editUser,    setEditUser]    = useState(null); // ← new
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

  const { data, isLoading, isError, refetch: refetchUsers } = useGetAllInternalUsersQuery();
  const users = data?.data ?? [];

  if (isLoading)
    return <Box display="flex" justifyContent="center" py={10}><CircularProgress sx={{ color: C.accent }} /></Box>;
  if (isError)
    return <Alert severity="error">Failed to load users.</Alert>;

  const columnData = [
    {
      accessorKey: "full_name",
      header: "User",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: C.accent, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {getInitials(row.original.full_name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.primary,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {row.original.full_name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: C.tertiary,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {row.original.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      accessorKey: "user_role",
      header: "Role",
      Cell: ({ cell }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 13, color: C.accent, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.secondary, textTransform: "capitalize" }}>
            {roleLabel(cell.getValue() ?? "")}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: "organisations_count",
      header: "Organisations",
      size: 250,
      Cell: ({ row }) => {
        const orgs = row.original.organisations ?? [];
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mr: "3px" }}>
              <BusinessIcon sx={{ fontSize: 12, color: C.tertiary }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.secondary }}>
                {row.original.organisations_count}
              </Typography>
            </Box>
            {orgs.slice(0, 2).map((o) => (
              <Box key={o.organisation_id} sx={{ fontSize: 10, fontWeight: 600, px: "7px", py: "2px",
                borderRadius: "6px", backgroundColor: C.accentSoft, color: C.accent, whiteSpace: "nowrap" }}>
                {o.organisation_name}
              </Box>
            ))}
            <Tooltip title={orgs.slice(2).map((o) => o.organisation_name).join(", ")} placement="top">
            {orgs.length > 2 && (
              <Box sx={{ fontSize: 10, fontWeight: 600, px: "7px", py: "2px",
                borderRadius: "6px", backgroundColor: "#F3F4F6", color: C.tertiary }}>
                +{orgs.length - 2}
              </Box>
            )}
            </Tooltip>
          </Box>
        );
      },
    },
    {
      id: "assign",
      header: "Assign Org",
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ row }) => (
        <Button size="small"
          startIcon={<Person2OutlinedIcon sx={{ fontSize: 12 }} />}
          onClick={(e) => { e.stopPropagation(); setDrawerUser(row.original); }}
          sx={{ textTransform: "none", fontSize: 11, fontWeight: 600, color: C.accent,
            border: `1px solid ${C.accent}`, borderRadius: "8px",
            "&:hover": { backgroundColor: C.accentSoft } }}>
          Assign Org
        </Button>
      ),
    },
    {
      id: "update",
      header: "Update",
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ row }) => (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setEditUser(row.original); }}
          sx={{ color: C.accent, "&:hover": { backgroundColor: C.accentSoft, borderRadius: "8px" } }}
        >
          <EditOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center",mb:1,mt:-2 }}>
        <Button size="small" startIcon={<PersonAddOutlinedIcon sx={{ fontSize: 13 }} />}
          onClick={() => setAddUserOpen(true)}
          sx={{ textTransform: "none", fontSize: 12, fontWeight: 600, color: C.white,
            backgroundColor: C.accent, borderRadius: "8px", px: "14px",
            boxShadow: "0 2px 8px rgba(255,95,31,0.25)",
            "&:hover": { backgroundColor: "#E54E10", boxShadow: "0 4px 12px rgba(255,95,31,0.35)" } }}>
          Add User
        </Button>
      </Box>

      <Box sx={{ border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", backgroundColor: C.white }}>
        <ReusableMRT
          data={users}
          columnData={columnData}
          enableRowActions={false}
          enableRowClickModal={false}
          onRowClick={(row) => setDrawerUser(row)}
          height="calc(100vh - 175px)"
        />
      </Box>

      {/* Assign Org dialog */}
      <AssignOrgDialog user={drawerUser} onClose={() => setDrawerUser(null)} />

      {/* ── NEW: Edit User dialog ── */}
      <EditUserDialog
        user={editUser}
        onClose={() => setEditUser(null)}
        onSuccess={(msg) => {
          setToast({ open: true, msg, severity: "success" });
          refetchUsers();
        }}
        onError={(msg) => setToast({ open: true, msg, severity: "error" })}
      />

      <AddUserDialog
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onSuccess={(msg) => { setToast({ open: true, msg, severity: "success" }); refetchUsers(); }}
        onError={(msg) => setToast({ open: true, msg, severity: "error" })}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={toast.severity} sx={{ borderRadius: "10px", fontSize: 13 }}>{toast.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

/* ════════════════════════════════════════════
   EDIT USER DIALOG
   PUT /acc/update_user_details_by_admin/{user_id}
════════════════════════════════════════════ */
function EditUserDialog({ user, onClose, onSuccess, onError }) {
  const [form, setForm]             = useState({});
  const [dialCode, setDialCode]     = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [errors, setErrors]         = useState({});

  // ── RTK mutation — add this endpoint to your userManagement service ──
  const [updateUserByAdmin, { isLoading: saving }] = useUpdateUserByAdminMutation();

  /* Populate form when `user` changes */
  React.useEffect(() => {
    if (!user) return;

    const { dialCode: dc, local } = splitPhone(user.phone ?? "");
    setDialCode(dc);
    setLocalPhone(local);
    setPhoneError("");
    setErrors({});

    // ── Derive first/last name ──
    // API may return full_name only, or separate first_name/last_name
    let firstName = user.first_name ?? "";
    let lastName  = user.last_name  ?? "";
    if (!firstName && !lastName && user.full_name) {
      const parts = user.full_name.trim().split(/\s+/);
      firstName = parts[0] ?? "";
      lastName  = parts.slice(1).join(" ");
    }

    // ── Normalise user_role to match USER_ROLE_OPTIONS values ──
    // API may return "AccountManager", "account_manager", "accountmanager", "super_admin", "Super Admin" etc.
    const rawRole = (user.user_role ?? "").toLowerCase().replace(/[\s_-]/g, "");
    const normaliseRole = (raw) => {
      if (raw === "accountmanager") return "accountmanager";
      if (raw === "superadmin")     return "super_admin";
      return user.user_role ?? ""; // fallback: use as-is
    };

    setForm({
      first_name:      firstName,
      last_name:       lastName,
      user_role:       normaliseRole(rawRole),
      emp_id:          user.emp_id          ?? "",
      department:      user.department      ?? "",
      emp_type:        user.emp_type        ?? "",
      emp_status:      user.emp_status      ?? "",
      gender:          user.gender          ?? "",
      emp_designation: user.emp_designation ?? "",
      time_zone:       user.time_zone       ?? "",
    });
  }, [user]);

  const handleClose = () => {
    setErrors({});
    setPhoneError("");
    onClose();
  };

  const handleSave = async () => {
    /* Basic validation */
    const errs = {};
    if (!form.first_name) errs.first_name = "Required";
    if (!form.last_name)  errs.last_name  = "Required";
    if (!form.user_role)  errs.user_role  = "Required";
    if (localPhone && (localPhone.length < 7 || localPhone.length > 15))
      errs.phone = "Enter a valid phone number (7–15 digits)";

    if (Object.keys(errs).length) { setErrors(errs); if (errs.phone) setPhoneError(errs.phone); return; }

    const nn = (v) => (v === "" ? null : v);

    // API rejects phone with leading "+" — strip it before sending
    // stored: "+918877654467" → send: "918877654467"
    const buildPhone = () => {
      if (!localPhone) return null;
      const full = `${dialCode}${localPhone}`; // e.g. "+918877654467"
      return full.replace(/^\+/, "");           // → "918877654467"
    };

    const payload = {
      first_name:      nn(form.first_name),
      last_name:       nn(form.last_name),
      phone:           buildPhone(),
      user_role:       nn(form.user_role),
      emp_id:          nn(form.emp_id),
      department:      nn(form.department),
      emp_type:        nn(form.emp_type),
      emp_status:      nn(form.emp_status),
      gender:          nn(form.gender),
      emp_designation: nn(form.emp_designation),
      time_zone:       nn(form.time_zone),
    };

    try {
      await updateUserByAdmin({ userId: user.id, body: payload }).unwrap();
      onSuccess?.(`${form.first_name} ${form.last_name} updated successfully!`);
      handleClose();
    } catch (err) {
      onError?.(err?.data?.message ?? "Failed to update user.");
    }
  };

  return (
    <Dialog
      open={!!user}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}
    >
      {/* ── Header ── */}
      <DialogTitle sx={{ px: "24px", pt: "24px", pb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "10px", backgroundColor: C.accentSoft,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <EditOutlinedIcon sx={{ fontSize: 18, color: C.accent }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.primary }}>Edit User</Typography>
              <Typography sx={{ ...T.meta, mt: "1px" }}>Update details for {user?.full_name}</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose} sx={{ color: C.tertiary, mt: "-4px" }}>
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>

        {/* User identity pill */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: "10px 14px", mt: "14px",
          backgroundColor: C.accentSoft, borderRadius: "10px" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: C.accent, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            {getInitials(user?.full_name ?? "")}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={T.valueSm}>{user?.full_name}</Typography>
            <Typography sx={T.meta}>{user?.email}</Typography>
          </Box>
        </Box>
      </DialogTitle>

      {/* ── Content ── */}
      <DialogContent sx={{ px: "24px", pt: "20px", pb: 0 }}>

        {/* Role selector */}
        <Box sx={{ mb: "20px" }}>
          <Typography sx={{ ...T.label, mb: "8px" }}>User Role *</Typography>
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {USER_ROLE_OPTIONS.map((r) => {
              const active = form.user_role === r.value;
              return (
                <Box key={r.value} onClick={() => { setForm((p) => ({ ...p, user_role: r.value })); setErrors((e) => ({ ...e, user_role: "" })); }}
                  sx={{ display: "flex", alignItems: "center", gap: "6px", px: "12px", py: "8px",
                    borderRadius: "10px", cursor: "pointer",
                    border: `1.5px solid ${active ? C.accent : C.border}`,
                    backgroundColor: active ? C.accentSoft : C.white,
                    transition: "all 0.15s ease",
                    "&:hover": { borderColor: active ? C.accent : C.accentMid, backgroundColor: active ? C.accentSoft : "#FFFAF7" } }}>
                  <ShieldOutlinedIcon sx={{ fontSize: 13, color: active ? C.accent : C.tertiary }} />
                  <Typography sx={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? C.accent : C.secondary }}>
                    {r.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          {errors.user_role && <FormHelperText error sx={{ mt: "4px", ml: "2px", fontSize: 11 }}>{errors.user_role}</FormHelperText>}
        </Box>

        <Divider sx={{ mb: "16px", borderColor: C.border }} />

        {/* Basic info */}
        <Typography sx={{ ...T.label, mb: "12px" }}>Basic Information</Typography>
        <Grid container spacing={2} mb="16px">
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="First Name *" fieldKey="first_name" form={form} setForm={setForm} error={errors.first_name} />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="Last Name *"  fieldKey="last_name"  form={form} setForm={setForm} error={errors.last_name}  />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <PhoneEditField
              dialCode={dialCode} setDialCode={setDialCode}
              localPhone={localPhone} setLocalPhone={(v) => { setLocalPhone(v); setPhoneError(""); }}
              error={phoneError}
            />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="Gender" fieldKey="gender" form={form} setForm={setForm} select options={GENDER_OPTIONS} />
          </Grid>
        </Grid>

        <Divider sx={{ mb: "16px", borderColor: C.border }} />

        {/* Employment */}
        <Typography sx={{ ...T.label, mb: "12px" }}>Employment Details</Typography>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="Employee ID"   fieldKey="emp_id"          form={form} setForm={setForm} />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="Department"    fieldKey="department"      form={form} setForm={setForm} />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="Designation"   fieldKey="emp_designation" form={form} setForm={setForm} />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="Employee Type" fieldKey="emp_type"        form={form} setForm={setForm} select options={EMP_TYPE_OPTIONS}   />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="Status"        fieldKey="emp_status"      form={form} setForm={setForm} select options={EMP_STATUS_OPTIONS} />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <EditField label="Time Zone"     fieldKey="time_zone"       form={form} setForm={setForm} select options={TZ_OPTIONS}         />
          </Grid>
        </Grid>
      </DialogContent>

      {/* ── Actions ── */}
      <DialogActions sx={{ px: "24px", py: "20px", gap: 1.5 }}>
        <Button fullWidth variant="outlined" onClick={handleClose}
          sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, borderColor: C.border,
            color: C.secondary, borderRadius: "10px",
            "&:hover": { borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" } }}>
          Cancel
        </Button>
        <Button fullWidth variant="contained" onClick={handleSave} disabled={saving}
          startIcon={saving ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : <SaveOutlinedIcon sx={{ fontSize: 14 }} />}
          sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, backgroundColor: C.accent,
            borderRadius: "10px", boxShadow: "none",
            "&:hover": { backgroundColor: "#E54E10", boxShadow: "none" },
            "&:disabled": { backgroundColor: "#F3F4F6", color: C.tertiary } }}>
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ════════════════════════════════════════════
   ADD USER DIALOG  (2-step, unchanged)
════════════════════════════════════════════ */
const EMPTY_FORM = {
  user_role: "", first_name: "", last_name: "", email: "",
  emp_id: "", department: "", emp_type: "", emp_status: "",
  gender: "", emp_designation: "", timezone: "",
};

function validateStep(step, form, localPhone) {
  const errs = {};
  if (step === 0) {
    if (!form.user_role) errs.user_role = "Role is required";
    if (!form.first_name) errs.first_name = "First name is required";
    if (!form.last_name)  errs.last_name  = "Last name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (localPhone && (localPhone.length < 7 || localPhone.length > 15))
      errs.phone = "Enter a valid phone number (7–15 digits)";
  }
  return errs;
}

function AddUserDialog({ open, onClose, onSuccess, onError }) {
  const [step, setStep]             = useState(0);
  const [form, setForm]             = useState({ ...EMPTY_FORM });
  const [errors, setErrors]         = useState({});
  const [dialCode, setDialCode]     = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [done, setDone]             = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const [createUser, { isLoading: creating }] = useCreateUserMutation();

  const reset = () => { setStep(0); setForm({ ...EMPTY_FORM }); setErrors({}); setDialCode("+91"); setLocalPhone(""); setDone(false); setCreatedUser(null); };
  const handleClose = () => { reset(); onClose(); };

  const handleNext = () => {
    const errs = validateStep(step, form, localPhone);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep(1);
  };

  const handleSubmit = async () => {
    const nn = (v) => (v === "" ? null : v);
    const payload = {
      user_role: form.user_role, first_name: nn(form.first_name), last_name: nn(form.last_name),
      email: form.email, phone: localPhone ? `${dialCode}${localPhone}` : null,
      timezone: nn(form.timezone), emp_id: nn(form.emp_id), department: nn(form.department),
      emp_type: nn(form.emp_type), emp_status: nn(form.emp_status),
      gender: nn(form.gender), emp_designation: nn(form.emp_designation),
    };
    try {
      const res = await createUser(payload).unwrap();
      setCreatedUser(res?.data ?? payload);
      setDone(true);
    } catch (err) {
      onError(err?.data?.message ?? "Failed to create user. Please try again.");
    }
  };

  const stepLabels = ["Account & Role", "Employment Details"];

  if (done) {
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
        <Box sx={{ p: "40px 32px", textAlign: "center" }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: C.greenSoft,
            display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <CheckCircleOutlineOutlined sx={{ fontSize: 32, color: C.green }} />
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: C.primary, mb: "4px" }}>User Created!</Typography>
          <Typography sx={{ ...T.meta, fontSize: 12, mb: "16px" }}>
            {createdUser?.first_name} {createdUser?.last_name} has been added successfully.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: "10px 14px", borderRadius: "10px",
            backgroundColor: C.accentSoft, mb: "24px", textAlign: "left" }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: C.accent, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {getInitials(`${createdUser?.first_name ?? ""} ${createdUser?.last_name ?? ""}`)}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={T.valueSm}>{createdUser?.first_name} {createdUser?.last_name}</Typography>
              <Typography sx={T.meta}>{createdUser?.email}</Typography>
            </Box>
            <Box sx={{ fontSize: 10, fontWeight: 700, px: "8px", py: "3px", borderRadius: "6px",
              backgroundColor: C.accent, color: "#fff", whiteSpace: "nowrap", flexShrink: 0 }}>
              {roleLabel(createdUser?.user_role ?? "")}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button fullWidth variant="outlined" onClick={handleClose}
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, borderColor: C.border,
                color: C.secondary, borderRadius: "10px", "&:hover": { borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" } }}>
              Close
            </Button>
            <Button fullWidth variant="contained" onClick={reset}
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, backgroundColor: C.accent,
                borderRadius: "10px", boxShadow: "none", "&:hover": { backgroundColor: "#E54E10", boxShadow: "none" } }}>
              Add Another
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
      <DialogTitle sx={{ px: "24px", pt: "24px", pb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "10px", backgroundColor: C.accentSoft,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PersonAddOutlinedIcon sx={{ fontSize: 18, color: C.accent }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.primary }}>Add New User</Typography>
              <Typography sx={{ ...T.meta, mt: "1px" }}>Step {step + 1} of 2 — {stepLabels[step]}</Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleClose} sx={{ color: C.tertiary, mt: "-4px" }}>
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
        <Box sx={{ mt: "8px", display: "flex", gap: "6px" }}>
          {[0, 1].map((i) => (
            <Box key={i} sx={{ flex: 1, height: 3, borderRadius: 2,
              backgroundColor: i <= step ? C.accent : C.border, transition: "background-color 0.3s ease" }} />
          ))}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: "24px", pt: "20px", pb: 0 }}>
        {step === 0 && (
          <Box>
            <Box sx={{ mb: "20px" }}>
              <Typography sx={{ ...T.label, mb: "8px",mt:1 }}>User Role *</Typography>
              <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {USER_ROLE_OPTIONS.map((r) => {
                  const active = form.user_role === r.value;
                  return (
                    <Box key={r.value}
                      onClick={() => { setForm((p) => ({ ...p, user_role: r.value })); setErrors((e) => ({ ...e, user_role: "" })); }}
                      sx={{ display: "flex", alignItems: "center", gap: "6px", px: "12px", py: "8px",
                        borderRadius: "10px", cursor: "pointer",
                        border: `1.5px solid ${active ? C.accent : C.border}`,
                        backgroundColor: active ? C.accentSoft : C.white, transition: "all 0.15s ease",
                        "&:hover": { borderColor: active ? C.accent : C.accentMid, backgroundColor: active ? C.accentSoft : "#FFFAF7" } }}>
                      <ShieldOutlinedIcon sx={{ fontSize: 13, color: active ? C.accent : C.tertiary }} />
                      <Typography sx={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? C.accent : C.secondary }}>
                        {r.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              {errors.user_role && <FormHelperText error sx={{ mt: "4px", ml: "2px", fontSize: 11 }}>{errors.user_role}</FormHelperText>}
            </Box>
            <Divider sx={{ my: "16px", borderColor: C.border }} />
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="First Name *" fieldKey="first_name" form={form} setForm={setForm} error={errors.first_name} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Last Name *"  fieldKey="last_name"  form={form} setForm={setForm} error={errors.last_name}  /></Grid>
              <Grid item size={{ xs: 12 }}>
                <Box>
                  <Typography sx={{ ...T.label, mb: "5px" }}>Email Address *</Typography>
                  <TextField size="small" fullWidth type="email" placeholder="user@company.com"
                    value={form.email}
                    onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((er) => ({ ...er, email: "" })); }}
                    error={!!errors.email} helperText={errors.email}
                    sx={errors.email ? errorFieldSx : editFieldSx}
                    InputProps={{ startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ fontSize: 15, color: errors.email ? "#EF4444" : C.tertiary }} />
                      </InputAdornment>
                    )}}
                  />
                </Box>
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <PhoneEditField dialCode={dialCode} setDialCode={setDialCode} localPhone={localPhone} setLocalPhone={setLocalPhone} error={errors.phone} />
              </Grid>
            </Grid>
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: "10px 14px", borderRadius: "10px", backgroundColor: C.accentSoft, mb: "20px" }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: C.accent, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {getInitials(`${form.first_name} ${form.last_name}`)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={T.valueSm}>{form.first_name} {form.last_name}</Typography>
                <Typography sx={T.meta}>{form.email}</Typography>
              </Box>
              <Box sx={{ fontSize: 10, fontWeight: 700, px: "8px", py: "3px", borderRadius: "6px", backgroundColor: C.accent, color: "#fff", whiteSpace: "nowrap" }}>
                {roleLabel(form.user_role)}
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Employee ID"   fieldKey="emp_id"          form={form} setForm={setForm} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Department"    fieldKey="department"      form={form} setForm={setForm} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Designation"   fieldKey="emp_designation" form={form} setForm={setForm} /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Gender"        fieldKey="gender"          form={form} setForm={setForm} select options={GENDER_OPTIONS}     /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Employee Type" fieldKey="emp_type"        form={form} setForm={setForm} select options={EMP_TYPE_OPTIONS}   /></Grid>
              <Grid item size={{ xs: 12, sm: 6 }}><EditField label="Status"        fieldKey="emp_status"      form={form} setForm={setForm} select options={EMP_STATUS_OPTIONS} /></Grid>
              <Grid item size={{ xs: 12 }}>       <EditField label="Time Zone"     fieldKey="timezone"        form={form} setForm={setForm} select options={TZ_OPTIONS}         /></Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: "24px", py: "20px", gap: 1.5 }}>
        {step === 0 ? (
          <Button fullWidth variant="outlined" onClick={handleClose}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, borderColor: C.border,
              color: C.secondary, borderRadius: "10px", "&:hover": { borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" } }}>
            Cancel
          </Button>
        ) : (
          <Button fullWidth variant="outlined" startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />} onClick={() => setStep(0)}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, borderColor: C.border,
              color: C.secondary, borderRadius: "10px", "&:hover": { borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" } }}>
            Back
          </Button>
        )}
        {step === 0 ? (
          <Button fullWidth variant="contained" endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />} onClick={handleNext}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, backgroundColor: C.accent,
              borderRadius: "10px", boxShadow: "none", "&:hover": { backgroundColor: "#E54E10", boxShadow: "none" } }}>
            Next — Employment
          </Button>
        ) : (
          <Button fullWidth variant="contained" onClick={handleSubmit} disabled={creating}
            startIcon={creating ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : <PersonAddOutlinedIcon sx={{ fontSize: 14 }} />}
            sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, backgroundColor: C.accent,
              borderRadius: "10px", boxShadow: "none", "&:hover": { backgroundColor: "#E54E10", boxShadow: "none" },
              "&:disabled": { backgroundColor: "#F3F4F6", color: C.tertiary } }}>
            {creating ? "Creating…" : "Create User"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

/* ════════════════════════════════════════════
   ASSIGN ORG DIALOG  (unchanged)
════════════════════════════════════════════ */
function AssignOrgDialog({ user, onClose }) {
  const [orgSearch, setOrgSearch]   = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const { data: orgData, isLoading: orgsLoading } = useGetMyOrganisationsQuery(undefined, { skip: !user });
  const [assignOrg, { isLoading: assigning }] = useAssignOrganisationMutation();

  const orgs = orgData?.data ?? [];
  const orgName = (o) => o.organisation_name ?? o.name ?? "—";
  const orgId   = (o) => o.organisation_id   ?? o.id;
  const assignedIds = new Set((user?.organisations ?? []).map((o) => o.organisation_id));
  const filteredOrgs = orgs.filter((o) => orgName(o).toLowerCase().includes(orgSearch.toLowerCase()));

  const handleAssign = async () => {
    if (!selectedOrg || !user) return;
    try {
      await assignOrg({ user_id: user.id, organisation_id: orgId(selectedOrg) }).unwrap();
      setSuccessMsg(`Successfully assigned to ${orgName(selectedOrg)}`);
      setSelectedOrg(null);
      setTimeout(() => { setSuccessMsg(""); onClose(); }, 1800);
    } catch (err) { console.error("Assign failed:", err); }
  };

  const handleClose = () => { setOrgSearch(""); setSelectedOrg(null); setSuccessMsg(""); onClose(); };

  return (
    <Dialog open={!!user} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
      <DialogTitle sx={{ px: "24px", pt: "24px", pb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: C.primary }}>Assign Organisation</Typography>
            <Typography sx={{ ...T.meta, mt: "2px" }}>Select an organisation to assign to this user</Typography>
          </Box>
          <IconButton size="small" onClick={handleClose} sx={{ color: C.tertiary, mt: "-4px" }}>
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: "10px 12px", mt: "14px",
          backgroundColor: C.accentSoft, borderRadius: "10px" }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: C.accent, fontSize: 11, fontWeight: 700 }}>
            {getInitials(user?.full_name ?? "")}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={T.valueSm}>{user?.full_name}</Typography>
            <Typography sx={T.meta}>{user?.email}</Typography>
          </Box>
          <Typography sx={{ ...T.meta, whiteSpace: "nowrap" }}>
            {user?.organisations_count} org{user?.organisations_count !== 1 ? "s" : ""}
          </Typography>
        </Box>
        {user?.organisations?.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mt: "8px" }}>
            {user.organisations.map((o) => (
              <Box key={o.organisation_id} sx={{ fontSize: 10, fontWeight: 600, px: "7px", py: "2px",
                borderRadius: "6px", backgroundColor: "#F3F4F6", color: C.secondary }}>
                {o.organisation_name}
              </Box>
            ))}
          </Box>
        )}
      </DialogTitle>

      <DialogContent sx={{ px: "24px", pt: "18px", pb: 0 }}>
        {successMsg && <Alert severity="success" sx={{ mb: "12px", fontSize: 12, borderRadius: "8px" }}>{successMsg}</Alert>}
        <Typography sx={{ ...T.label, mb: "8px" }}>Select Organisation</Typography>
        <TextField size="small" fullWidth placeholder="Search organisations…" value={orgSearch}
          onChange={(e) => setOrgSearch(e.target.value)}
          sx={{ mb: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 13,
            "& fieldset": { borderColor: C.border }, "&.Mui-focused fieldset": { borderColor: C.accent } } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: C.tertiary }} /></InputAdornment> }}
        />
        <Box sx={{ border: `1px solid ${C.border}`, borderRadius: "10px", maxHeight: 260, overflowY: "auto" }}>
          {orgsLoading ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress size={20} sx={{ color: C.accent }} /></Box>
          ) : filteredOrgs.length === 0 ? (
            <Box py={4} textAlign="center"><Typography sx={T.meta}>No organisations found.</Typography></Box>
          ) : (
            filteredOrgs.map((org, idx) => {
              const id = orgId(org), name = orgName(org);
              const isSelected = selectedOrg && orgId(selectedOrg) === id;
              const isAssigned = assignedIds.has(id);
              return (
                <ListItemButton key={id} disabled={isAssigned} onClick={() => setSelectedOrg(isSelected ? null : org)}
                  sx={{ px: "14px", py: "9px",
                    borderBottom: idx < filteredOrgs.length - 1 ? "1px solid #F3F4F6" : "none",
                    backgroundColor: isSelected ? C.accentSoft : "transparent",
                    "&:hover": { backgroundColor: isSelected ? C.accentSoft : "#F9FAFB" },
                    opacity: isAssigned ? 0.5 : 1 }}>
                  <Checkbox checked={!!isSelected || isAssigned} disabled={isAssigned} size="small"
                    sx={{ p: 0, mr: "10px", color: "#D1D5DB", "&.Mui-checked": { color: C.accent } }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ ...T.valueSm, fontWeight: isSelected ? 600 : 400 }}>{name}</Typography>
                    <Typography sx={T.meta}>{id?.slice(0, 8)}…</Typography>
                  </Box>
                  {isAssigned && (
                    <Box sx={{ fontSize: 10, fontWeight: 600, px: "6px", py: "2px", borderRadius: "6px",
                      backgroundColor: C.greenSoft, color: C.green }}>Assigned</Box>
                  )}
                </ListItemButton>
              );
            })
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: "24px", py: "18px", gap: 1.5 }}>
        <Button fullWidth variant="outlined" onClick={handleClose}
          sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, borderColor: C.border,
            color: C.secondary, borderRadius: "10px", "&:hover": { borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" } }}>
          Cancel
        </Button>
        <Button fullWidth variant="contained" onClick={handleAssign} disabled={!selectedOrg || assigning}
          sx={{ textTransform: "none", fontWeight: 600, fontSize: 13, backgroundColor: C.accent,
            borderRadius: "10px", boxShadow: "none", "&:hover": { backgroundColor: "#E54E10", boxShadow: "none" },
            "&:disabled": { backgroundColor: "#F3F4F6", color: C.tertiary } }}>
          {assigning ? <CircularProgress size={15} sx={{ color: "#fff" }} />
            : `Assign${selectedOrg ? ` · ${orgName(selectedOrg).split(" ")[0]}` : ""}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
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

## File: pages/Dashboard/DashboardFilterBar.jsx

```javascript
import React from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { COLORS } from "../../../styles/theme";
import { useGetCountriesQuery, useGetSubFunctionsQuery } from "../../redux/services/dashboard/dashboardService";

const PERIOD_OPTIONS = [
  { value: 3, label: "Last 3 months" },
  { value: 6, label: "Last 6 months" },
  { value: "all", label: "All" },
  // { value: 12, label: "Last 12 months" },
];

const selectSx = {
  height: 28,
  fontSize: 11.5,
  borderRadius: "8px",
  bgcolor: "#F7F9FC",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.border },
  "& .MuiSelect-select": { py: "4px", pl: "10px" },
};

const menuPropsSx = { PaperProps: { sx: { "& .MuiMenuItem-root": { fontSize: 11.5 } } } };

// ── Period (monthly) selector — top-level dashboard filter bar ──────────────
const PeriodSelect = ({ value, onChange, disabled }) => (
  <FormControl size="small" sx={{ minWidth: 130 }} disabled={disabled}>
    <Select value={value} onChange={(e) => onChange(e.target.value)} sx={selectSx} MenuProps={menuPropsSx}>
      {PERIOD_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

// ── Country selector — top-level dashboard filter bar ───────────────────────
export const CountrySelect = ({ value, onChange, disabled }) => {
  const { data: countries = [], isLoading: countriesLoading } = useGetCountriesQuery();
  const options = [
    { value: "all", label: "All" },
    ...countries
      .map((country) => {
        const label = typeof country === "string" ? country : country?.name ?? country?.label ?? country?.country;
        return label ? { value: label, label } : null;
      })
      .filter(Boolean),
  ];

  return (
    <FormControl size="small" sx={{ minWidth: 140 }} disabled={disabled || countriesLoading}>
      <Select value={value ?? "all"} onChange={(e) => onChange(e.target.value)} sx={selectSx} MenuProps={menuPropsSx}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// ── Sub-function selector — top-level dashboard filter bar ──────────────────
export const SubFunctionSelect = ({ value, onChange, disabled }) => {
  const { data: subFnRes, isLoading: subFnLoading } = useGetSubFunctionsQuery();
  const options = subFnRes?.data ?? [];

  return (
    <FormControl size="small" sx={{ minWidth: 190 }} disabled={disabled || subFnLoading}>
      <Select value={value} onChange={(e) => onChange(e.target.value)} displayEmpty sx={selectSx} MenuProps={menuPropsSx}>
        <MenuItem value="">All Sub-functions</MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.key} value={opt.key}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PeriodSelect;

```

---

## File: pages/DemoRequests/AddDemoRequest.jsx

```javascript
import React, { useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { useCreateDemoRequestOnBehalfMutation } from "../../redux/services/demo/demo";

import { TOKENS } from "./demoRequestUi";

/* =========================================
   DESIGN
========================================= */

/* Orange sampled from the design (#FE9F43) */
const ACCENT = "#FE9F43";
const ACCENT_HOVER = "#EA923E";

const buttonBaseSx = {
  height: 34,
  px: 2,
  fontSize: 12.5,
  fontWeight: 500,
  textTransform: "none",
  borderRadius: "8px",
  boxShadow: "none",
};

const primaryButtonSx = {
  ...buttonBaseSx,
  color: "#FFFFFF",
  backgroundColor: ACCENT,
  "&:hover": {
    backgroundColor: ACCENT_HOVER,
    boxShadow: "none",
  },
  "&.Mui-disabled": {
    color: "#FFFFFF",
    backgroundColor: ACCENT,
    opacity: 0.6,
  },
};

const secondaryButtonSx = {
  ...buttonBaseSx,
  color: TOKENS.textPrimary,
  borderColor: TOKENS.border,
  backgroundColor: "#FFFFFF",
  "&:hover": {
    borderColor: TOKENS.border,
    backgroundColor: TOKENS.headerBg,
  },
};

const labelSx = {
  display: "block",
  mb: 0.75,
  fontSize: 12.5,
  fontWeight: 500,
  color: TOKENS.textSecondary,
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 13,
    color: TOKENS.textPrimary,
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
    "& fieldset": { borderColor: TOKENS.border },
    "&:hover fieldset": { borderColor: TOKENS.textMuted },
    "&.Mui-focused fieldset": {
      borderColor: ACCENT,
      borderWidth: "1px",
    },
    "&.Mui-error fieldset": { borderColor: "error.main" },
  },
  "& .MuiFormHelperText-root": {
    mx: 0,
    mt: 0.5,
    fontSize: 11.5,
  },
};

/* The portal renders outside the page, so set the font explicitly */
const formFontSx = {
  "& .MuiTypography-root, & .MuiInputBase-root, & .MuiButton-root, & .MuiAlert-root, & .MuiFormHelperText-root":
    {
      fontFamily: TOKENS.fontFamily,
    },
};

/* =========================================
   FORM CONFIG

   `name` matches the API payload keys, so the
   values can be sent as they are (after trim).
   Set `required: true/false` to change what
   the form enforces.
========================================= */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidPhone = (value) => {
  const digits = value.replace(/\D/g, "");

  return (
    /^\+?[\d\s\-()]+$/.test(value) &&
    digits.length >= 7 &&
    digits.length <= 15
  );
};

const FIELDS = [
  {
    name: "name",
    label: "Full name",
    placeholder: "Full name",
    required: true,
    requiredMessage: "Enter the customer's name",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "name@company.com",
    type: "email",
    required: true,
    requiredMessage: "Enter an email address",
    check: (value) =>
      EMAIL_PATTERN.test(value)
        ? ""
        : "Enter a valid email address",
  },
  {
    name: "phone_number",
    label: "Phone",
    placeholder: "+91 98765 43210",
    type: "tel",
    required: true,
    requiredMessage: "Enter a phone number",
    check: (value) =>
      isValidPhone(value)
        ? ""
        : "Enter a valid phone number (7–15 digits)",
  },
  {
    name: "company_name",
    label: "Company",
    placeholder: "Company name",
    required: true,
    requiredMessage: "Enter the company name",
  },
  {
    name: "message",
    label: "Message",
    placeholder: "Context for the team, e.g. how the customer reached out",
    multiline: true,
    required: false,
  },
];

const INITIAL_VALUES = Object.fromEntries(
  FIELDS.map(({ name }) => [name, ""])
);

/* =========================================
   HELPERS
========================================= */

const validate = (values) => {
  const errors = {};

  FIELDS.forEach(
    ({ name, required, requiredMessage, check }) => {
      const value = values[name].trim();

      if (!value) {
        if (required) {
          errors[name] = requiredMessage;
        }
        return;
      }

      const message = check?.(value);

      if (message) {
        errors[name] = message;
      }
    }
  );

  return errors;
};

const toPayload = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value.trim(),
    ])
  );

/*
 * RTK Query's unwrap() rejects with
 * { status, data } – read the API message
 * first, then fall back to a generic one.
 */

const getErrorMessage = (error) => {
  const data = error?.data;

  if (typeof data?.message === "string" && data.message) {
    return data.message;
  }

  if (typeof data?.detail === "string" && data.detail) {
    return data.detail;
  }

  if (typeof data?.detail?.[0]?.msg === "string") {
    return data.detail[0].msg;
  }

  if (error?.status === "FETCH_ERROR") {
    return "Couldn't reach the server. Check your connection and try again.";
  }

  return "Couldn't add the request. Check the details and try again.";
};

/* =========================================
   FORM

   Rendered inside the Dialog, so its state is
   thrown away when the dialog closes and the
   next open always starts with an empty form.
========================================= */

const RequestForm = ({
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");

  const errors = validate(values);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setServerError("");
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    /* Reveal every error on the first submit attempt */
    setTouched(
      Object.fromEntries(
        FIELDS.map(({ name }) => [name, true])
      )
    );

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await onSubmit(toPayload(values));
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 auto",
        minHeight: 0,
        ...formFontSx,
      }}
    >
      {/* Header */}

      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          borderBottom: `1px solid ${TOKENS.border}`,
        }}
      >
        <Typography
          id="add-demo-request-title"
          sx={{
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.3,
            color: TOKENS.textPrimary,
          }}
        >
          Add request manually
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: 12.5,
            color: TOKENS.textSecondary,
          }}
        >
          Create a request on behalf of a customer. It is
          added to the list with the status New.
        </Typography>
      </Box>

      {/* Fields */}

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {serverError && (
          <Alert
            severity="error"
            sx={{ mb: 2, fontSize: 12.5, borderRadius: "8px" }}
          >
            {serverError}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
          }}
        >
          {FIELDS.map((field, index) => {
            const inputId = `add-demo-request-${field.name}`;
            const error =
              touched[field.name] && errors[field.name];

            return (
              <Box
                key={field.name}
                sx={{
                  gridColumn: field.multiline
                    ? "1 / -1"
                    : "auto",
                }}
              >
                <Typography
                  component="label"
                  htmlFor={inputId}
                  sx={labelSx}
                >
                  {field.label}

                  {field.required && (
                    <Box
                      component="span"
                      sx={{ ml: 0.4, color: "error.main" }}
                    >
                      *
                    </Box>
                  )}
                </Typography>

                <TextField
                  id={inputId}
                  name={field.name}
                  type={field.type}
                  value={values[field.name]}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(error)}
                  helperText={error}
                  required={field.required}
                  multiline={field.multiline}
                  minRows={field.multiline ? 3 : undefined}
                  disabled={isSubmitting}
                  autoFocus={index === 0}
                  /* This is somebody else's data, so don't
                     let the browser autofill the admin's own */
                  autoComplete="off"
                  size="small"
                  fullWidth
                  sx={inputSx}
                />
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      {/* Actions */}

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${TOKENS.border}`,
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isSubmitting}
          sx={secondaryButtonSx}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={14} color="inherit" />
            ) : null
          }
          sx={primaryButtonSx}
        >
          {isSubmitting ? "Adding..." : "Add request"}
        </Button>
      </DialogActions>
    </Box>
  );
};

/* =========================================
   TRIGGER BUTTON + DIALOG + TOAST

   POST /acc/demo-requests/create-on-behalf
========================================= */

const AddDemoRequest = () => {
  const [open, setOpen] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);

  const [createDemoRequest, { isLoading }] =
    useCreateDemoRequestOnBehalfMutation();

  const handleClose = () => {
    /* Don't dismiss while the request is in flight */
    if (!isLoading) {
      setOpen(false);
    }
  };

  /*
   * Throws on failure (unwrap) so the form can show
   * the API error and keep what the user typed.
   *
   * The demo requests list refreshes through the
   * tag invalidated by the mutation.
   */

  const handleCreate = async (payload) => {
    await createDemoRequest(payload).unwrap();

    setOpen(false);
    setToastOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={primaryButtonSx}
      >
        Add request manually
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="add-demo-request-title"
        sx={{
          "& .MuiDialog-paper": { borderRadius: "12px" },
        }}
      >
        <RequestForm
          isSubmitting={isLoading}
          onSubmit={handleCreate}
          onCancel={handleClose}
        />
      </Dialog>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") {
            setToastOpen(false);
          }
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setToastOpen(false)}
          sx={{
            fontSize: 13,
            fontFamily: TOKENS.fontFamily,
          }}
        >
          Request added
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddDemoRequest;
```

---

## File: pages/DemoRequests/DemoRequestDetails.jsx

```javascript
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  Button,
  Menu,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Breadcrumbs,
  Link,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import {
  useGetDemoRequestsQuery,
  useGetDemoRequestStatusesQuery,
  useGetDemoRequestOnboardingStatusQuery,
  useResendDemoRequestInviteMutation,
  useGetAllInternalUsersQuery,
  useUpdateDemoRequestStatusMutation,
  useAssignDemoRequestMutation,
  useSendCustomerInviteMutation,
  useProvisionSignupMutation,
  useSendProvisionCredentialsMutation,
} from "../../redux/services/demo/demo";

import { toast } from "react-toastify";

import { TOKENS, DEMO_REQUESTS_PATH } from "./demoRequestUi";


/* =========================================
   SELECT WITH INLINE LOADER
========================================= */

const SelectWithLoader = ({ loading, children }) => (
  <Box sx={{ position: "relative", display: "inline-flex" }}>
    {children}

    {loading && (
      <CircularProgress
        size={16}
        thickness={5}
        sx={{
          position: "absolute",
          right: 36,
          top: "50%",
          mt: "-8px",
          pointerEvents: "none",
          color: TOKENS.accent,
        }}
      />
    )}
  </Box>
);

const getErrorMessage = (error, fallback) =>
  typeof error?.data?.message === "string"
    ? error.data.message
    : typeof error?.data?.detail === "string"
      ? error.data.detail
      : typeof error?.message === "string"
        ? error.message
        : fallback;
/* =========================================
   SHARED STYLES
========================================= */

const labelSx = {
  fontSize: 12,
  fontWeight: 600,
  color: TOKENS.textSecondary,
  mb: 0.5,
};

const valueSx = {
  fontSize: 14,
  fontWeight: 600,
  color: TOKENS.textPrimary,
  overflowWrap: "anywhere",
};

const dashedDividerSx = {
  borderTop: "1px dashed #D9D9DF",
  my: { xs: 1.75, md: 2 },
};

const selectSx = {
  minWidth: 170,
  height: 38,
  fontSize: 13,
  color: TOKENS.textPrimary,
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: TOKENS.border,
  },
};

const iconButtonSx = {
  width: 34,
  height: 34,
  border: `1px solid ${TOKENS.border}`,
  borderRadius: "8px",
  backgroundColor: "#FFFFFF",
  color: TOKENS.textSecondary,
};

const DemoRequestDetails = () => {
  const navigate = useNavigate();
  const { demoRequestId } = useParams();

  const [inviteMenuAnchor, setInviteMenuAnchor] = useState(null);
  const [inviteSent, setInviteSent] = useState(false);
  const [latestInviteResponse, setLatestInviteResponse] = useState(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [amProvisionedOpen, setAmProvisionedOpen] = useState(false);
  const [requestOverride, setRequestOverride] = useState(null);
  const [amProvisionedForm, setAmProvisionedForm] = useState({
    organisation_name: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    time_zone: "Asia/Kolkata",
    country: "",
    industry: "",
    website_url: "",
  });

  const { data, isLoading, isError, refetch, isFetching } =
    useGetDemoRequestsQuery({});

  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
  } = useGetDemoRequestStatusesQuery();

  const {
    data: onboardingData,
    isLoading: isOnboardingLoading,
    isError: isOnboardingError,
    refetch: refetchOnboarding,
  } = useGetDemoRequestOnboardingStatusQuery(demoRequestId, {
    skip: !demoRequestId,
  });

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetAllInternalUsersQuery();

  const [updateDemoRequestStatus, { isLoading: isUpdatingStatus }] =
    useUpdateDemoRequestStatusMutation();

  const [assignDemoRequest, { isLoading: isAssigning }] =
    useAssignDemoRequestMutation();

  const [sendCustomerInvite] = useSendCustomerInviteMutation();
  const [resendDemoRequestInvite, { isLoading: isResendingInvite }] =
    useResendDemoRequestInviteMutation();

  const [provisionSignup] = useProvisionSignupMutation();
  const [sendProvisionCredentials, { isLoading: isSendingProvisionCredentials }] =
    useSendProvisionCredentialsMutation();
  const [pendingCredentialsOnboardingId, setPendingCredentialsOnboardingId] = useState(null);

  const companies = data?.data ?? [];
  const statuses = statusData?.data ?? [];
  const users = usersData?.data ?? [];
  const onboarding = onboardingData?.data ?? null;
  const onboardingInfo = onboarding?.onboarding ?? null;
  const onboardingTracking = onboarding?.tracking ?? null;

  const requests = companies.flatMap((company) =>
    (company.requests || []).map((item) => ({
      ...item,
      company_name: company.company_name,
    }))
  );

  const requestFromApi = requests.find(
    (item) => String(item.demo_request_id) === String(demoRequestId)
  );
  const request = requestOverride || requestFromApi;

  useEffect(() => {
    const hasExistingInvite = Boolean(
      onboardingInfo?.invite_token_sent ||
        onboardingInfo?.registration_email_sent_at ||
        onboardingTracking?.is_invitation_sent ||
        onboardingTracking?.is_registration_completed ||
        onboardingTracking?.is_onboarding_completed
    );

    if (hasExistingInvite) setInviteSent(true);
  }, [onboardingInfo, onboardingTracking]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDemoRequestStatus({
        demo_request_id: request.demo_request_id,
        status: newStatus,
      }).unwrap();

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Failed to update demo request status:", error);
      toast.error(getErrorMessage(error, "Failed to update status"));
    }
  };

  const handleAssign = async (userId) => {
    if (!userId) return;

    try {
      const response = await assignDemoRequest({
        demo_request_id: request.demo_request_id,
        assigned_to: userId,
      }).unwrap();

      const assignment = response?.data ?? response;
      setRequestOverride({
        ...request,
        assigned_to: assignment?.assigned_to ?? userId,
        assigned_user_name: assignment?.assigned_user_name,
        status: assignment?.status ?? request.status,
        assigned_at: assignment?.assigned_at,
      });
      refetch();
      toast.success(response?.message || "Lead assigned successfully");
    } catch (error) {
      console.error("Failed to assign demo request:", error);
      toast.error(getErrorMessage(error, "Failed to assign lead"));
    }
  };

  const handleOpenInviteMenu = (event) => {
    if (inviteSent) return;
    setInviteMenuAnchor(event.currentTarget);
  };

  const handleCloseInviteMenu = () => {
    setInviteMenuAnchor(null);
  };

  const handleResendInvite = async () => {
    if (!demoRequestId) return;

    try {
      setIsSendingInvite(true);

      const response = await resendDemoRequestInvite(demoRequestId).unwrap();
      setLatestInviteResponse(response?.data ?? null);
      toast.success(response?.message || "Invitation resent successfully");

      setInviteSent(true);
      await refetchOnboarding();
    } catch (error) {
      console.error("Failed to resend customer invite:", error);
      toast.error(getErrorMessage(error, "Failed to resend invite"));
    } finally {
      setIsSendingInvite(false);
      handleCloseInviteMenu();
    }
  };

  const handleOpenAmProvisioned = () => {
    if (!request) return;

    const nameParts = (request.name || "").trim().split(/\s+/);

    setAmProvisionedForm({
      organisation_name: request.company_name || "",
      email: request.email || "",
      first_name: nameParts[0] || "",
      last_name: nameParts.slice(1).join(" ") || "",
      phone_number: request.phone_number || "",
      time_zone: "Asia/Kolkata",
      country: "",
      industry: "",
      website_url: "",
    });

    handleCloseInviteMenu();
    setAmProvisionedOpen(true);
  };

  const handleSendProvisionCredentials = async (onboardingId) => {
    try {
      const response = await sendProvisionCredentials(onboardingId).unwrap();
      setPendingCredentialsOnboardingId(null);
      toast.success(response?.message || "Customer login credentials sent successfully");
      await refetchOnboarding();
    } catch (error) {
      setPendingCredentialsOnboardingId(onboardingId);
      toast.error(getErrorMessage(error, "Account provisioned, but credentials could not be sent. Please retry."));
    }
  };

  const handleAmProvisionedChange = (event) => {
    const { name, value } = event.target;
    setAmProvisionedForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmitAmProvisioned = async () => {
    if (!request) return;

    const requiredFields = [
      "organisation_name",
      "email",
      "first_name",
      "last_name",
      "phone_number",
      "time_zone",
      "country",
      "industry",
    ];

    const hasMissingFields = requiredFields.some(
      (field) => !String(amProvisionedForm[field] || "").trim()
    );

    if (hasMissingFields) {
      console.error("Please fill all required AM provisioned fields.");
      return;
    }

    try {
      setIsSendingInvite(true);

      const invitationResponse = await provisionSignup({
        invite_type: "provision_signup",
        demo_request_id: request.demo_request_id,
        organisation_name: amProvisionedForm.organisation_name,
        email: amProvisionedForm.email,
        first_name: amProvisionedForm.first_name,
        last_name: amProvisionedForm.last_name,
        phone_number: amProvisionedForm.phone_number,
        time_zone: amProvisionedForm.time_zone,
        country: amProvisionedForm.country,
        industry: amProvisionedForm.industry,
        website_url: amProvisionedForm.website_url,
      }).unwrap();

      setInviteSent(true);
      setLatestInviteResponse(invitationResponse?.data ?? null);
      const onboardingId = invitationResponse?.data?.onboarding_id;
      setAmProvisionedOpen(false);
      await refetchOnboarding();

      if (onboardingId) {
        await handleSendProvisionCredentials(onboardingId);
      } else {
        toast.warning("Account provisioned, but credentials could not be sent because the onboarding ID was missing.");
      }
    } catch (error) {
      console.error("Failed to complete AM provisioned signup:", error);
      toast.error(getErrorMessage(error, "Failed to complete AM provisioned signup"));
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleSendInvite = async () => {
    if (!request) return;

    const nameParts = (request.name || "").trim().split(/\s+/);

    try {
      setIsSendingInvite(true);

      const response = await sendCustomerInvite({
        invite_type: "self_signup",
        demo_request_id: request.demo_request_id,
        organisation_name: request.company_name || "",
        email: request.email || "",
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        phone_number: request.phone_number || "",
        time_zone: "",
        country: "",
        Industry: "",
      }).unwrap();

      setInviteSent(true);
      setLatestInviteResponse(response?.data ?? null);
      toast.success(response?.message || "Invitation sent successfully");
      await refetchOnboarding();
    } catch (error) {
      console.error("Failed to send customer invite:", error);
      toast.error(getErrorMessage(error, "Failed to send invite"));
    } finally {
      setIsSendingInvite(false);
      handleCloseInviteMenu();
    }
  };

  const closeAmDialog = () => {
    if (!isSendingInvite) {
      setAmProvisionedOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Failed to load demo request.
      </Alert>
    );
  }

  if (!request) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="warning"
          action={
            <Button size="small" onClick={() => navigate(DEMO_REQUESTS_PATH)}>
              Back
            </Button>
          }
        >
          Demo request not found.
        </Alert>
      </Box>
    );
  }

  const isSubmitting = isSendingInvite || isResendingInvite || isSendingProvisionCredentials;
  const inviteButtonLabel = isSendingInvite
    ? "Sending..."
    : inviteSent
      ? "Resend Invite"
      : "Send Invite";

  const onboardingStatusLabel =
    onboardingInfo?.status ||
    onboardingTracking?.current_stage ||
    (onboardingData ? "Onboarding available" : "No invite sent");

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, lg: 2.5 },
        width: "100%",
        minHeight: "100%",
        background: "linear-gradient(180deg, #f5f7fb 0%, #eef3f9 100%)",
        fontFamily: TOKENS.fontFamily,
      }}
    >
      <Box sx={{ maxWidth: 1600, mx: "auto", width: "100%" }}>
        <Paper
          elevation={0}
          sx={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(247,250,255,0.98) 100%)",
            border: `1px solid ${TOKENS.border}`,
            borderRadius: { xs: "14px", md: "16px" },
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.045)",
            mb: 2,
            px: { xs: 1.5, sm: 2, md: 2.5 },
            py: { xs: 1.5, md: 1.75 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Tooltip title="Back to list">
                <IconButton
                  onClick={() => navigate(DEMO_REQUESTS_PATH)}
                  sx={{
                    ...iconButtonSx,
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 700,
                    color: TOKENS.textPrimary,
                    lineHeight: 1.2,
                    // letterSpacing: "-0.03em",
                  }}
                >
                  Lead Details
                </Typography>

                <Breadcrumbs separator="›" sx={{ mt: 0.5, fontSize: 13 }}>
                  <Link
                    component="button"
                    underline="hover"
                    onClick={() => navigate(DEMO_REQUESTS_PATH)}
                    sx={{
                      fontSize: 13,
                      color: TOKENS.textPrimary,
                      fontWeight: 600,
                    }}
                  >
                    Lead
                  </Link>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: TOKENS.textSecondary,
                      fontWeight: 600,
                    }}
                  >
                    {request.name}
                  </Typography>
                </Breadcrumbs>
              </Box>
            </Box>

            <Tooltip title="Refresh">
              <span>
                <IconButton
                  onClick={() => refetch()}
                  disabled={isFetching}
                  sx={{
                    ...iconButtonSx,
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <RefreshRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: `1px solid rgba(15, 23, 42, 0.08)`,
            borderRadius: { xs: "16px", md: "18px" },
            background: "rgba(255,255,255,0.96)",
            boxShadow: "0 10px 28px rgba(15, 23, 42, 0.055)",
            px: { xs: 1.5, sm: 2, md: 2.75 },
            py: { xs: 1.75, sm: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: { xs: 1.25, md: 1.5 },
            }}
          >
            {[
              { label: "Name", value: request.name },
              { label: "Email", value: request.email },
              { label: "Phone", value: request.phone_number },
              { label: "Company", value: request.company_name },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: { xs: 1.25, md: 1.5 },
                  minWidth: 0,
                  minHeight: 78,
                  borderRadius: "10px",
                  background: "#F9FAFB",
                  border: "1px solid #EEF0F3",
                }}
              >
                <Typography sx={labelSx}>{item.label}</Typography>
                <Typography sx={valueSx}>{item.value || "-"}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={dashedDividerSx} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "110px minmax(0, 1fr)",
              },
              gap: { xs: 0.5, md: 1.5 },
              alignItems: "start",
              p: { xs: 1.25, md: 1.5 },
              minHeight: 68,
              borderRadius: "10px",
              background: "#F9FAFB",
            }}
          >
            <Typography sx={{ ...labelSx, mb: 0, fontSize: 14 }}>
              Message
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                lineHeight: 1.55,
                color: TOKENS.textPrimary,
                whiteSpace: "pre-wrap",
                fontWeight: 500,
              }}
            >
              {request.message || "-"}
            </Typography>
          </Box>

          <Box sx={dashedDividerSx} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 1.25, md: 1.5 },
              mb: 1.5,
            }}
          >
            {[
              {
                label: "Onboarding status",
                value: isOnboardingLoading
                  ? "Checking..."
                  : isOnboardingError
                    ? "Status unavailable"
                    : onboardingStatusLabel,
              },
              {
                label: "Invite expiry",
                value: (onboardingInfo?.invite_token_expires_at || latestInviteResponse?.token_expires_at)
                  ? new Date(
                      onboardingInfo?.invite_token_expires_at ||
                        latestInviteResponse.token_expires_at
                    ).toLocaleString()
                  : "-",
              },
              {
                label: "Registration URL",
                value: latestInviteResponse?.registration_url
                  ? latestInviteResponse.registration_url
                  : onboardingInfo?.invite_token_sent
                    ? "Ready to send again"
                    : "-",
              },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: { xs: 1.25, md: 1.5 },
                  minWidth: 0,
                  minHeight: 78,
                  borderRadius: "10px",
                  background: "#F7FAFF",
                  border: "1px solid #E7EEF9",
                }}
              >
                <Typography sx={labelSx}>{item.label}</Typography>
                <Typography sx={{ ...valueSx, fontSize: 14 }}>{item.value}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={dashedDividerSx} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              pt: 0,
              p: { xs: 1.25, md: 1.5 },
              borderRadius: "12px",
              backgroundColor: "#F8FAFC",
              border: "1px solid #EEF0F3",
            }}
          >
            <SelectWithLoader loading={isUpdatingStatus}>
              <Select
                size="small"
                displayEmpty
                value={request.status || ""}
                onChange={(event) => handleStatusChange(event.target.value)}
                disabled={isStatusLoading || isStatusError || isUpdatingStatus}
                sx={{
                  ...selectSx,
                  minWidth: { xs: "100%", sm: 170 },
                  height: 40,
                  borderRadius: "9px",
                  background: "#f8fafc",
                  boxShadow: "inset 0 0 0 1px rgba(148,163,184,0.12)",
                }}
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>

                {statuses.map((item) => (
                  <MenuItem key={item.value} value={item.value} sx={{ fontSize: 13 }}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </SelectWithLoader>

            <SelectWithLoader loading={isAssigning}>
              <Select
                size="small"
                displayEmpty
                value={request.assigned_to || ""}
                onChange={(event) => handleAssign(event.target.value)}
                disabled={isUsersLoading || isUsersError || isAssigning}
                sx={{
                  ...selectSx,
                  minWidth: { xs: "100%", sm: 170 },
                  height: 40,
                  borderRadius: "9px",
                  background: "#f8fafc",
                  boxShadow: "inset 0 0 0 1px rgba(148,163,184,0.12)",
                }}
              >
                <MenuItem value="" disabled>
                  Assign to user
                </MenuItem>

                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id} sx={{ fontSize: 13 }}>
                    {user.full_name}
                  </MenuItem>
                ))}
              </Select>
            </SelectWithLoader>

            <Button
              variant="contained"
              disableElevation
              onClick={inviteSent ? handleResendInvite : handleOpenInviteMenu}
              disabled={isSubmitting}
              startIcon={
                inviteSent ? (
                  <CheckOutlinedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <SendOutlinedIcon sx={{ fontSize: 16 }} />
                )
              }
              sx={{
                height: 40,
                px: 2,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "9px",
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                boxShadow: "0 10px 20px rgba(249, 115, 22, 0.22)",
                "&:hover": {
                  background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                },
              }}
            >
              {inviteButtonLabel}
            </Button>
            {pendingCredentialsOnboardingId && (
              <Button
                variant="outlined"
                onClick={() => handleSendProvisionCredentials(pendingCredentialsOnboardingId)}
                disabled={isSubmitting}
                sx={{ height: 42, textTransform: "none", borderRadius: "12px" }}
              >
                Retry credential email
              </Button>
            )}
          </Box>
        </Paper>

        <Menu
          anchorEl={inviteMenuAnchor}
          open={Boolean(inviteMenuAnchor)}
          onClose={handleCloseInviteMenu}
        >
          <MenuItem onClick={handleSendInvite}>Self Signup</MenuItem>
          <MenuItem onClick={handleOpenAmProvisioned}>AM Provisioned</MenuItem>
        </Menu>

        <Dialog open={amProvisionedOpen} onClose={closeAmDialog} fullWidth maxWidth="md">
          <DialogTitle>AM Provisioned</DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Organisation Name"
                  name="organisation_name"
                  value={amProvisionedForm.organisation_name}
                  onChange={handleAmProvisionedChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={amProvisionedForm.email}
                  onChange={handleAmProvisionedChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  name="first_name"
                  value={amProvisionedForm.first_name}
                  onChange={handleAmProvisionedChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  name="last_name"
                  value={amProvisionedForm.last_name}
                  onChange={handleAmProvisionedChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Phone Number"
                  name="phone_number"
                  value={amProvisionedForm.phone_number}
                  onChange={handleAmProvisionedChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Time Zone"
                  name="time_zone"
                  value={amProvisionedForm.time_zone}
                  onChange={handleAmProvisionedChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Country"
                  name="country"
                  value={amProvisionedForm.country}
                  onChange={handleAmProvisionedChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Industry"
                  name="industry"
                  value={amProvisionedForm.industry}
                  onChange={handleAmProvisionedChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website URL"
                  name="website_url"
                  value={amProvisionedForm.website_url}
                  onChange={handleAmProvisionedChange}
                  placeholder="https://example.com"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeAmDialog} disabled={isSubmitting}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitAmProvisioned} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DemoRequestDetails;
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

## File: pages/OrgRequisitions/RequisitionDetail.jsx

```javascript
// src/pages/OrgRequisitions/RequisitionDetail.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// ── Safe core MUI icons (available in all MUI v5 installs) ──
import ArrowBack from "@mui/icons-material/ArrowBack";
import Business from "@mui/icons-material/Business";
import AccountTree from "@mui/icons-material/AccountTree";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Group from "@mui/icons-material/Group";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Person from "@mui/icons-material/Person";
import Security from "@mui/icons-material/Security";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import Cancel from "@mui/icons-material/Cancel";
import AccessTime from "@mui/icons-material/AccessTime";
import Event from "@mui/icons-material/Event";

import { useDispatch } from "react-redux";
import { setDynamicLabels } from "../../redux/slices/breadcrumbSlice";
import {
  useGetOrganisationJobsQuery,
  useGetJobMatchedCandidatesQuery,
  useGetOrganisationInterviewsQuery,
  useGetJobDetailsQuery,
  useGetJobInterviewsQuery,
  useLazyGetResumeViewQuery,
} from "../../redux/services/requisition/requisition";
import ReusableMRT from "../../components/table";
import ViewToggle from "../../components/table/ViewToggle";
import SearchFilter from "../../components/searchFilter";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { toast } from "react-toastify";
import { useUploadCandidateResumeMutation } from "../../redux/services/requisition/requisition";
import {
  BusinessCenterOutlined,
  PeopleOutlineOutlined,
  WorkOutlined,
} from "@mui/icons-material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import LaptopOutlinedIcon from "@mui/icons-material/LaptopOutlined";
// import WorkOutlineIcon             from "@mui/icons-material/WorkOutline";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import PersonOutlineOutlinedIcon   from "@mui/icons-material/PersonOutlineOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
// import PeopleOutlineIcon           from "@mui/icons-material/PeopleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Copy these constants from your CandidatesPage file:
const DOMAIN_OPTIONS = ["clinical"];
const FUNCTION_OPTIONS = ["biostatistics", "clinical_data_management"];
const SUB_FUNCTION_MAP = {
  biostatistics: [
    "statistical_programmer",
    "biostatistician",
    "sas_programmer",
  ],
  clinical_data_management: [
    "clinical_programmer",
    "crf_developer",
    "clinical_data_manager",
  ],
  // clinical_operations:      ["clinical_research_associate", "clinical_trial_manager", "site_coordinator"],
  // medical_writing:          ["medical_writer", "regulatory_writer"],
  // pharmacovigilance:        ["safety_associate", "pv_specialist"],
  // regulatory_affairs:       ["regulatory_specialist", "submissions_manager"],
};
// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  accent: "#FF5F1F",
  accentSoft: "#FFF5F0",
  accentBorder: "#FFD4BC",
  bg: "#F7F7F9",
  surface: "#FFFFFF",
  surfaceAlt: "#FAFAFA",
  border: "#EBEBF0",
  borderStrong: "#D8D8E4",
  text: "#0D0D12",
  textSub: "#4A4A5E",
  textMuted: "#8888A0",
  green: "#059669",
  greenSoft: "#ECFDF5",
  greenBorder: "#6EE7B7",
  blue: "#2563EB",
  blueSoft: "#EFF6FF",
  blueBorder: "#93C5FD",
  amber: "#D97706",
  amberSoft: "#FFFBEB",
  amberBorder: "#FCD34D",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  redBorder: "#FCA5A5",
  indigo: "#4F46E5",
  indigoSoft: "#EEF2FF",
  indigoBorder: "#C7D2FE",
  purple: "#7C3AED",
  purpleSoft: "#F5F3FF",
  purpleBorder: "#DDD6FE",
};

/* ═══════════════════════════════════════
   TINY HELPERS
═══════════════════════════════════════ */
function avatarColor(name = "") {
  const PALETTE = [
    "#FF5F1F",
    "#4F46E5",
    "#059669",
    "#7C3AED",
    "#0EA5E9",
    "#EC4899",
    "#F59E0B",
    "#14B8A6",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function normalizeArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter((s) => s && s.trim());
  if (typeof v === "string")
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export default function RequisitionDetail() {
  const { orgId, jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(location.state?.activeReqTab ?? 0);

  // ── List query (still needed for breadcrumb + fallback) ──
  const { data: jobsData, isLoading: jobsLoading } =
    useGetOrganisationJobsQuery({ orgId, status: "all" });

  // ── Detail query — rich data for Overview tab ──
  const { data: detailData, isLoading: detailLoading } =
    useGetJobDetailsQuery(jobId);

  const job =
    location.state?.job ??
    jobsData?.data?.find((j) => (j.job_id ?? j.id) === jobId);
  const jobDetail = detailData?.data ?? null;
  const orgName = location.state?.orgName ?? null;

  useEffect(() => {
    const labels = {};
    if (orgName) labels.orgId = orgName;
    if (job?.job_title) labels.jobId = job.job_title;
    if (Object.keys(labels).length) dispatch(setDynamicLabels(labels));
  }, [orgName, job?.job_title]);

  const isLoading = jobsLoading || detailLoading;

  if (isLoading || !job) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );
  }

  const TAB_SX = {
    borderBottom: "1px solid #E5E7EB",
    mb: "24px",
    "& .MuiTab-root": {
      textTransform: "none",
      fontSize: 13,
      fontWeight: 500,
      color: "#6B7280",
      minWidth: "auto",
      px: "4px",
      mr: "24px",
    },
    "& .Mui-selected": { color: `${C.accent} !important`, fontWeight: 600 },
    "& .MuiTabs-indicator": { backgroundColor: C.accent },
  };

  const STATUS_CHIP = {
    open: { bg: C.greenSoft, color: C.green },
    active: { bg: C.greenSoft, color: C.green },
    closed: { bg: "#F3F4F6", color: "#6B7280" },
    filled: { bg: C.indigoSoft, color: C.indigo },
    on_hold: { bg: C.amberSoft, color: C.amber },
  };
  const statusChip = (s = "") =>
    STATUS_CHIP[s.toLowerCase().replace(/\s+/g, "_")] ?? {
      bg: "#F3F4F6",
      color: "#6B7280",
    };
  const chip = statusChip(job.status ?? jobDetail?.status);
  return (
    <Box sx={{ p: 1 }}>
      {/* ── Header with background ── */}
      <Box
        sx={{
          background: "#fff",
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          px: "14px",
          py: "10px",
          mb: "5px",
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {/* Back Button */}
          <Box
            onClick={() =>
              navigate(`/account-manager/org/${orgId}`, {
                state: { activeTab: location.state?.previousTab ?? 1 },
              })
            }
            sx={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(232,72,12,0.12)",
                transform: "translateX(-2px)",
              },
            }}
          >
            <ArrowBack
              sx={{
                fontSize: 20,
                color: C.text,
              }}
            />
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                mb: "2px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.textPrimary,
                  lineHeight: 1.2,
                }}
              >
                {jobDetail?.jobTitle ?? job.job_title}
              </Typography>

              {/* Status Chip */}
              <Box
                component="span"
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  px: "8px",
                  py: "2px",
                  borderRadius: "6px",
                  backgroundColor: chip.bg,
                  color: chip.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  border: `1px solid ${chip.border ?? chip.bg}`,
                }}
              >
                {jobDetail?.status ?? job.status}
              </Box>

              {/* Priority Chip */}
              {jobDetail?.rolePriority && (
                <Box
                  component="span"
                  sx={{
                    fontSize: 10,
                    fontWeight: 700,
                    px: "8px",
                    py: "2px",
                    borderRadius: "6px",
                     textTransform: "uppercase",
                    backgroundColor:
                      jobDetail.rolePriority?.toLowerCase() === "high"
                        ? "#FEE2E2"
                        : "#FEF3C7",
                    color:
                      jobDetail.rolePriority?.toLowerCase() === "high"
                        ? C.red
                        : C.amber,
                    border: `1px solid ${
                      jobDetail.rolePriority?.toLowerCase() === "high"
                        ? "#FECACA"
                        : "#FDE68A"
                    }`,
                  }}
                  
                >
                  {jobDetail.rolePriority} Priority
                </Box>
              )}
            </Box>

            {/* Subtitle Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
                color: C.textSecondary,
              }}
            >
              {[
                jobDetail?.positionId ?? job.job_position_id,
                jobDetail?.jobType ?? job.job_type,
                jobDetail?.workMode,
              ]
                .filter(Boolean)
                .map((item, i, arr) => (
                  <React.Fragment key={i}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: C.textSecondary,
                      }}
                    >
                      {item}
                    </Typography>

                    {i < arr.length - 1 && (
                      <Box
                        sx={{
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          backgroundColor: "#D1D5DB",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={TAB_SX}>
        <Tab label="Overview" />
        <Tab label="Candidates" />
        <Tab label="Interviews" />
        <Tab label="Activity" />
      </Tabs>

      {/* Tab panels — unchanged */}
      {tab === 0 && <ReqOverviewTab job={job} jobDetail={jobDetail} />}
      {tab === 1 && (
        <ReqCandidatesTab
          jobId={jobId}
          orgId={orgId}
          navigate={navigate}
          orgName={orgName}
          jobTitle={jobDetail?.jobTitle ?? job.job_title}
        />
      )}
      {tab === 2 && (
        <ReqInterviewsTab
          orgId={orgId}
          jobId={jobId}
          jobPositionId={jobDetail?.positionId ?? job.job_position_id}
        />
      )}
      {tab === 3 && (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            backgroundColor: "#fff",
          }}
        >
          <Typography fontSize={15} fontWeight={600} color={C.textPrimary}>
            Activity
          </Typography>
          <Typography fontSize={13} color={C.textSecondary} mt={0.5}>
            Activity log coming soon.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/* ═══════════════════════════════════════
   MAIN: ReqOverviewTab
═══════════════════════════════════════ */
/* ── Shared card shell ── */
const CARD = {
  backgroundColor: "#fff",
  border: `0.5px solid ${C.border}`,
  borderRadius: "10px",
  p: "20px 22px",
};

const CARD_TITLE = {
  fontSize: 14,
  fontWeight: 600,
  color: C.textPrimary,
  mb: "16px",
  pb: "12px",
  borderBottom: `0.5px solid ${C.border}`,
};

/* ── Field: label above value ── */
function Field({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <Box sx={{ mb: "16px", "&:last-child": { mb: 0 } }}>
      <Typography
        sx={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: C.textMuted,
          mb: "3px",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 500,
          color:
            value === "Not specified" || value === "N/A"
              ? C.textMuted
              : C.textPrimary,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* ── Skill chip ── */
function SkillChip({ label, variant = "secondary" }) {
  const styles = {
    mandatory: {
      bg: "#FFF1F1",
      color: "#B42318",
      border: "#F7B5B5",
    },

    primary: {
      bg: "#EEF4FF",
      color: "#1849A9",
      border: "#B2CCFF",
    },

    secondary: {
      bg: "#F8F9FB",
      color: "#344054",
      border: "#E4E7EC",
    },
  };

  const s = styles[variant] ?? styles.secondary;

  return (
    <Box
      sx={{
        fontSize: 13,
        fontWeight: 600,
        px: "12px",
        py: "6px",
        borderRadius: "8px",
        border: `1px solid ${s.border}`,
        backgroundColor: s.bg,
        color: s.color,
        display: "inline-flex",
        alignItems: "center",
        lineHeight: 1.2,
        transition: "all 0.2s ease",

        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      }}
    >
      {label}
    </Box>
  );
}

/* ── Skill group ── */
function SkillGroup({ label, skills, variant }) {
  if (!skills?.length) return null;

  return (
    <Box
      sx={{
        mb: "18px",
        "&:last-child": { mb: 0 },
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#667085",
          mb: "10px",
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {skills.map((s) => (
          <SkillChip key={s} label={s} variant={variant} />
        ))}
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════
   ReqOverviewTab
══════════════════════════════════════════ */
export function ReqOverviewTab({ job = {}, jobDetail = null }) {
  const primarySkills = normalizeArray(jobDetail?.primary);
  const secondarySkills = normalizeArray(jobDetail?.secondary);
  const mandatorySkills = normalizeArray(jobDetail?.mandatory);
  const edcTools = normalizeArray(jobDetail?.edc_tools);
  const collaborators = jobDetail?.collaborators ?? [];
  const approvals = job?.approvals ?? [];

  const fallbackSkills = normalizeArray(job?.skills);
  const hasFallback = !jobDetail && fallbackSkills.length > 0;
  const fallbackPrimary = hasFallback
    ? fallbackSkills.slice(0, Math.ceil(fallbackSkills.length / 2))
    : [];
  const fallbackSecondary = hasFallback
    ? fallbackSkills.slice(Math.ceil(fallbackSkills.length / 2))
    : [];

  const hasSkills =
    mandatorySkills.length > 0 ||
    primarySkills.length > 0 ||
    secondarySkills.length > 0 ||
    hasFallback;
  const hasDesc = !!(
    jobDetail?.summary_final ??
    jobDetail?.summary_initial ??
    jobDetail?.jobDescription
  );
  const descText =
    jobDetail?.summary_final ??
    jobDetail?.summary_initial ??
    jobDetail?.jobDescription ??
    "";

  const expValue =
    (jobDetail?.min_years ?? job?.min_years) != null
      ? `${jobDetail?.min_years ?? job?.min_years} – ${jobDetail?.max_years ?? job?.max_years} years`
      : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* ── Row 1: Basic Info + Experience & Positions / Team ── */}
      {/* ── Row 1 ── */}
      <Grid container spacing="14px" sx={{ alignItems: "stretch" }}>
        {/* Basic Information — left */}
        {/* Basic Information — left */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          <Box sx={{ ...CARD, flex: 1 }}>
            <Typography sx={CARD_TITLE}>Basic Information</Typography>

            <Box
              sx={{
                display: "grid",
                textTransform: "capitalize",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: "14px",
                mt: 2,
              }}
            >
              <Field
                label="Function"
                value={jobDetail?.function ?? job?.function}
              />

              <Field
                label="Sub-function"
                value={jobDetail?.subFunction ?? job?.sub_function}
              />

              <Field label="Work mode" value={jobDetail?.workMode} />

              <Field
                label="Job type"
                value={jobDetail?.jobType ?? job?.job_type}
              />

              <Field label="Domain" value={jobDetail?.domain ?? job?.domain} />

              <Field
                label="Country"
                value={jobDetail?.country ?? job?.country}
              />

              {/* <Field
        label="Therapeutic area"
        value={jobDetail?.therapeutic_area}
      /> */}

              <Field
                label="EDC tools"
                value={edcTools.length ? edcTools.join(", ") : null}
              />

              <Field
                label="Job location"
                value={
                  jobDetail?.jobLocation ?? job?.location ?? "Not specified"
                }
              />
            </Box>
          </Box>
        </Grid>
        {/* Right column — Experience + Team + Approvals */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
          {/* ── Row 2: Required Skills ── */}
          {hasSkills && (
            <Box sx={{ flex: 1, ...CARD }}>
              <Typography sx={CARD_TITLE}>Required Skills</Typography>
              <Grid container spacing="20px">
                <Grid size={{ xs: 12, md: 6 }}>
                  <SkillGroup
                    label="Mandatory skills"
                    skills={mandatorySkills}
                    variant="mandatory"
                  />
                  <SkillGroup
                    label="Primary skills"
                    skills={
                      primarySkills.length ? primarySkills : fallbackPrimary
                    }
                    variant="primary"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SkillGroup
                    label="Secondary skills"
                    skills={
                      secondarySkills.length
                        ? secondarySkills
                        : fallbackSecondary
                    }
                    variant="secondary"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "14px", flex: 1 }}>
        <Box sx={{ flex: 1, ...CARD }}>
          <Typography sx={CARD_TITLE}>Experience &amp; Positions</Typography>

          <Box
            sx={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: "180px" }}>
              <Field
                label="Minimum years"
                value={jobDetail?.min_years ?? job?.min_years}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: "180px" }}>
              <Field
                label="Maximum years"
                value={jobDetail?.max_years ?? job?.max_years}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: "180px" }}>
              <Field
                label="Open positions"
                value={jobDetail?.openPositions ?? job?.no_of_positions}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, ...CARD }}>
          {/* Ownership & Team */}
          {(jobDetail?.creator ||
            jobDetail?.approver ||
            collaborators.length > 0) && (
            <Box>
              <Typography sx={CARD_TITLE}>Ownership &amp; Team</Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: "14px",
                  mt: 2,
                }}
              >
                <Field label="Created by" value={jobDetail?.creator?.name} />

                <Field label="Approver" value={jobDetail?.approver?.name} />

                <Field
                  label="Collaborators"
                  value={
                    collaborators.length > 0
                      ? collaborators.map((c) => c.name).join(", ")
                      : "N/A"
                  }
                />
              </Box>
            </Box>
          )}
        </Box>
        {/* Approvals */}
        {approvals.length > 0 && (
          <Box sx={CARD}>
            <Typography sx={CARD_TITLE}>Approvals</Typography>
            {approvals.map(({ stage, status }, i) => {
              const COLOR = {
                approved: {
                  color: C.green,
                  bg: C.greenSoft,
                  border: C.greenBorder,
                },
                pending: {
                  color: C.amber,
                  bg: C.amberSoft,
                  border: C.amberBorder,
                },
                rejected: { color: C.red, bg: C.redSoft, border: C.redBorder },
              };
              const ac = COLOR[status?.toLowerCase()] ?? {
                color: C.textMuted,
                bg: "#F3F4F6",
                border: C.border,
              };
              return (
                <Box
                  key={stage}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: i < approvals.length - 1 ? "12px" : 0,
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: C.textSub }}>
                    {stage}
                  </Typography>
                  <Box
                    sx={{
                      px: "10px",
                      py: "3px",
                      borderRadius: "20px",
                      backgroundColor: ac.bg,
                      border: `0.5px solid ${ac.border}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: ac.color,
                        textTransform: "capitalize",
                      }}
                    >
                      {status}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* ── Row 3: Job Description ── */}
      {hasDesc && (
        <Box sx={CARD}>
          <Typography sx={CARD_TITLE}>Job Description</Typography>
          <Typography
            sx={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.8 }}
          >
            {descText}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Tab 1: Candidates ────────────────────────────────────────────────────────
// ─── Add Candidate Dialog ─────────────────────────────────────────────────────
function AddCandidateToJobDialog({ open, onClose, jobId, onSuccess }) {
  const [form, setForm] = useState({
    domain: "",
    function: "",
    sub_function: "",
    availability: "",
    resume: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadCandidateResume] = useUploadCandidateResumeMutation();

  const handleClose = () => {
    setForm({
      domain: "",
      function: "",
      sub_function: "",
      availability: "",
      resume: null,
    });
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.resume) {
      toast.error("Resume is required");
      return;
    }
    if (!form.availability?.trim()) {
      toast.error("Availability is required");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("job_id", jobId);
      fd.append("availability", form.availability);
      // fd.append("domain", form.domain);
      // fd.append("function", form.function);
      // fd.append("sub_function", form.sub_function);
      fd.append("resume", form.resume);

      await uploadCandidateResume(fd).unwrap();
      toast.success("Candidate added successfully");
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(
        err?.data?.detail?.[0]?.msg || err?.data?.message || "Failed to upload",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: 18,
          color: C.textPrimary,
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              backgroundColor: "#FFF0E8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Person sx={{ fontSize: 18, color: C.accent }} />
          </Box>
          Add Candidate
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "#9CA3AF" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: "14px", mt: 1 }}
        >
          {/* Domain
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 13 }}>Domain</InputLabel>
            <Select
              value={form.domain}
              label="Domain"
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              sx={{ borderRadius: "10px", fontSize: 13 }}
            >
              {DOMAIN_OPTIONS.map((d) => (
                <MenuItem
                  key={d}
                  value={d}
                  sx={{ fontSize: 13, textTransform: "capitalize" }}
                >
                  {d.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* Function
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 13 }}>Function</InputLabel>
            <Select
              value={form.function}
              label="Function"
              onChange={(e) =>
                setForm({ ...form, function: e.target.value, sub_function: "" })
              }
              sx={{ borderRadius: "10px", fontSize: 13 }}
            >
              {FUNCTION_OPTIONS.map((f) => (
                <MenuItem
                  key={f}
                  value={f}
                  sx={{ fontSize: 13, textTransform: "capitalize" }}
                >
                  {f.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* Sub-function
          <FormControl fullWidth size="small" disabled={!form.function}>
            <InputLabel sx={{ fontSize: 13 }}>Sub-function</InputLabel>
            <Select
              value={form.sub_function}
              label="Sub-function"
              onChange={(e) =>
                setForm({ ...form, sub_function: e.target.value })
              }
              sx={{ borderRadius: "10px", fontSize: 13 }}
            >
              {(SUB_FUNCTION_MAP[form.function] ?? []).map((s) => (
                <MenuItem
                  key={s}
                  value={s}
                  sx={{ fontSize: 13, textTransform: "capitalize" }}
                >
                  {s.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* Availability */}
          <TextField
            label="Availability (days)"
            required
            fullWidth
            size="small"
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
            placeholder="e.g. 30"
            InputProps={{ sx: { borderRadius: "10px", fontSize: 13 } }}
            InputLabelProps={{ sx: { fontSize: 13 } }}
          />

          {/* Resume upload */}
          <Box
            sx={{
              border: `2px dashed ${form.resume ? C.accent : "#E5E7EB"}`,
              borderRadius: "14px",
              py: "28px",
              px: 2,
              textAlign: "center",
              backgroundColor: form.resume ? "#FFF0E8" : "#FAFAFA",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            <Button
              component="label"
              disableRipple
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                width: "100%",
                textTransform: "none",
                color: C.textPrimary,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <CloudUploadOutlinedIcon
                sx={{ fontSize: 36, color: form.resume ? C.accent : "#9CA3AF" }}
              />
              {form.resume ? (
                <>
                  <Typography fontSize={13} fontWeight={700} color={C.accent}>
                    {form.resume.name}
                  </Typography>
                  <Typography fontSize={11} color={C.textSecondary}>
                    Click to replace
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    fontSize={13}
                    fontWeight={600}
                    color={C.textPrimary}
                  >
                    Browse Resume
                  </Typography>
                  <Typography fontSize={11} color={C.textSecondary}>
                    PDF, DOC, DOCX supported
                  </Typography>
                </>
              )}
              <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setForm({ ...form, resume: e.target.files[0] })
                }
              />
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: "20px", pb: "20px", gap: "8px" }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            fontSize: 13,
            color: C.textSecondary,
            borderRadius: "10px",
            px: "16px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={uploading}
          onClick={handleSubmit}
          startIcon={
            uploading ? (
              <CircularProgress size={14} sx={{ color: "#fff" }} />
            ) : null
          }
          sx={{
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: "10px",
            backgroundColor: C.accent,
            px: "24px",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#E5541B", boxShadow: "none" },
            "&:disabled": { backgroundColor: "#FFCFB3", color: "#fff" },
          }}
        >
          {uploading ? "Uploading…" : "Add Candidate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Tab 1: Candidates ────────────────────────────────────────────────────────
function ReqCandidatesTab({ jobId, orgId, navigate, orgName, jobTitle }) {
  const [stageFilter, setStageFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } =
    useGetJobMatchedCandidatesQuery(jobId);

  const all = data?.data ?? [];

  const stages = React.useMemo(
    () => [...new Set(all.map((c) => c.current_stage))],
    [all],
  );

  const filtered =
    stageFilter === "all"
      ? all
      : all.filter((c) => c.current_stage === stageFilter);

  const searchedCandidates = filtered.filter((candidate) => {
    const value = search.toLowerCase();
    return (
      candidate.full_name?.toLowerCase().includes(value) ||
      candidate.email?.toLowerCase().includes(value) ||
      candidate.phone_number?.toLowerCase().includes(value) ||
      candidate.current_stage?.toLowerCase().includes(value) ||
      String(candidate.match_score)?.toLowerCase().includes(value)
    );
  });

  const candidateColumns = React.useMemo(
    () => [
      {
        accessorKey: "full_name",
        header: "Candidate",
        size: 250,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: C.accent,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {row.original.full_name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: 14 }}
                fontWeight={600}
                color={C.textPrimary}
                noWrap
              >
                {row.original.full_name}
              </Typography>
              <Typography sx={{ fontSize: 12 }} color={C.textSecondary} noWrap>
                {row.original.email}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "current_stage",
        header: "Stage",
        size: 140,
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              px: "8px",
              py: "3px",
              borderRadius: "8px",
              backgroundColor: C.indigoSoft,
              color: C.indigo,
              textTransform: "capitalize",
            }}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "match_score",
        header: "Match %",
        size: 100,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const color = value >= 80 ? C.green : value >= 60 ? C.amber : C.red;
          return (
            <Typography sx={{ fontSize: 12 }} fontWeight={700} color={color}>
              {value}%
            </Typography>
          );
        },
      },
      {
        accessorKey: "availability",
        header: "Availability",
        size: 120,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12 }}>
            {cell.getValue() === 0 ? "Immediate" : `${cell.getValue()} days`}
          </Typography>
        ),
      },
      {
        accessorKey: "total_experience",
        header: "Experience",
        size: 120,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12 }}>{cell.getValue()}</Typography>
        ),
      },
      {
        accessorKey: "phone_number",
        header: "Phone",
        size: 150,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12 }}>{cell.getValue()}</Typography>
        ),
      },
    ],
    [],
  );

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );

  if (isError)
    return (
      <Alert severity="error">
        Failed to load candidates: {error?.data?.message}
      </Alert>
    );

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: "20px",
          mt: -2,
          flexWrap: "wrap",
        }}
      >
        {/* Count badge */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 1.8,
            borderRadius: "8px",
            background: "rgba(255, 95, 31, 0.08)",
            border: "1px solid rgba(255, 95, 31, 0.2)",
            transition: "0.3s ease",
            "&:hover": {
              background: "rgba(255, 95, 31, 0.14)",
              transform: "translateY(-1px)",
            },
          }}
        >
          <Box
            sx={{
              minWidth: 28,
              height: 28,
              borderRadius: "8px",
              background: "#FF5F1F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              boxShadow: "0 4px 12px rgba(255,95,31,0.35)",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {searchedCandidates.length}
            </Typography>
          </Box>
          <Box sx={{ padding: 1, borderRadius: 0 }}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: "#FF5F1F",
                textTransform: "uppercase",
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              Total
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: C.textPrimary,
                lineHeight: 1,
              }}
            >
              Candidate{searchedCandidates.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>

        {/* Stage Filter */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ fontSize: 12 }}>Filter by stage</InputLabel>
          <Select
            value={stageFilter}
            label="Filter by stage"
            onChange={(e) => setStageFilter(e.target.value)}
            sx={{ fontSize: 12, borderRadius: "8px" }}
          >
            <MenuItem value="all">All Stages</MenuItem>
            {stages.map((s) => (
              <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Right side */}
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <SearchFilter
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
          />
          <ViewToggle view={view} onChange={setView} />

          {/* ── Add Candidate button ── */}
          <Button
            variant="contained"
            onClick={() => setAddDialogOpen(true)}
            sx={{
              textTransform: "none",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: "8px",
              px: "14px",
              height: 36,
              backgroundColor: C.accent,
              boxShadow: "none",
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "#E5541B", boxShadow: "none" },
            }}
          >
            + Add Candidate
          </Button>
        </Box>
      </Box>

      {/* Empty State */}
      {searchedCandidates.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography fontSize={13} color={C.textSecondary}>
            No candidates match the filters.
          </Typography>
        </Box>
      ) : view === "grid" ? (
        <Grid container spacing={2.5}>
          {searchedCandidates.map((candidate) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
              key={candidate.matched_candidate_id}
            >
              <CandidateCard
                candidate={candidate}
                onView={() =>
                  navigate(
                    `/account-manager/candidate/${candidate.matched_candidate_id}`,
                    {
                      state: {
                        orgName,
                        jobTitle,
                        previousTab: 1,
                        orgId,
                        jobId,
                      },
                    },
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <ReusableMRT
          data={searchedCandidates}
          columnData={candidateColumns}
          enableRowActions={false}
          enableRowSelection={false}
          enableGlobalFilter={false}
          height="calc(100vh - 268px)"
          onRowClick={(row) =>
            navigate(`/account-manager/candidate/${row.matched_candidate_id}`, {
              state: { orgName, jobTitle, previousTab: 1, orgId, jobId },
            })
          }
        />
      )}

      {/* ── Add Candidate Dialog ── */}
      <AddCandidateToJobDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        jobId={jobId}
        onSuccess={refetch}
      />
    </Box>
  );
}

// ─── Tab 2: Interviews ────────────────────────────────────────────────────────
function ReqInterviewsTab({ orgId, jobPositionId, jobId }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, isError } = useGetJobInterviewsQuery(jobId);
  console.log("iNTERVIEWSdata", data);
  const all = (data?.data ?? []).filter(
    (iv) => iv.job_position_id === jobPositionId,
  );
  console.log("all",all, "jobPositionId", jobPositionId);
  

  const interviewStatuses = [
    { key: "scheduled", value: "Scheduled" },
    { key: "completed", value: "Completed" },
    { key: "cancelled", value: "Cancelled" },
    { key: "rescheduled", value: "Rescheduled" },
    { key: "no_show", value: "No Show" },
    { key: "not_conducted", value: "Not Conducted" },
  ];

  const filtered =
    statusFilter === "all"
      ? all
      : all.filter((iv) => (iv.status ?? "scheduled") === statusFilter);
  console.log("filtered interviews", filtered);
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );
  if (isError)
    return <Alert severity="error">Failed to load interviews.</Alert>;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: "20px",
          flexWrap: "wrap",
        }}
      >
        <Typography fontSize={13} color={C.textSecondary}>
          {filtered.length} interview{filtered.length !== 1 ? "s" : ""}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ fontSize: 12 }}>Filter by status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by status"
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ fontSize: 12, borderRadius: "8px" }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {interviewStatuses.map(({ key, value }) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography fontSize={13} color={C.textSecondary}>
            No interviews found for this requisition.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((iv) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={iv.interview_id}>
              <ReqInterviewCard interview={iv} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

function ReqInterviewCard({ interview }) {
  const typeColor =
    interview.interview_type?.toLowerCase() === "technical"
      ? { bg: C.indigoSoft, color: C.indigo }
      : { bg: C.amberSoft, color: C.amber };

  const formattedDate = interview.interview_date
    ? new Date(interview.interview_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <Card
      sx={{
        borderRadius: "12px",
        border: `1px solid ${C.border}`,
        height: "100%",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "10px",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              backgroundColor: C.accentSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Event sx={{ color: C.accent, fontSize: 18 }} />
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: 10,
              fontWeight: 700,
              px: "8px",
              py: "3px",
              borderRadius: "10px",
              backgroundColor: typeColor.bg,
              color: typeColor.color,
              textTransform: "capitalize",
              letterSpacing: "0.05em",
            }}
          >
            {interview.interview_type}
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: C.textPrimary,
            mb: "2px",
          }}
        >
          {interview.interview_step_name}
        </Typography>
        <Typography sx={{ fontSize: 11, color: C.textSecondary, mb: "10px" }}>
          Step {interview.interview_step_number}
        </Typography>

        <Divider sx={{ mb: "10px" }} />

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: "6px" }}
        >
          <CalendarToday sx={{ fontSize: 13, color: C.textSecondary }} />
          <Typography
            sx={{ fontSize: 11, color: C.textPrimary, fontWeight: 500 }}
          >
            {formattedDate}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: "6px" }}
        >
          <AccessTime sx={{ fontSize: 13, color: C.textSecondary }} />
          <Typography
            sx={{ fontSize: 11, color: C.textPrimary, fontWeight: 500 }}
          >
            {interview.start_time} – {interview.end_time} · {interview.duration}{" "}
            min
          </Typography>
        </Box>

        {interview.created_by && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 11, color: C.textSecondary }}>
              Created by
            </Typography>
            <Typography
              sx={{ fontSize: 11, fontWeight: 500, color: C.textPrimary }}
            >
              {interview.created_by}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ─── CandidateCard ────────────────────────────────────────────────────────────
function CandidateCard({ candidate, onView }) {
  const [hovered, setHovered] = React.useState(false);
  const matchColor =
    candidate?.match_score >= 80
      ? { bg: "#E7F8EE", color: "#0F6E56" }
      : candidate?.match_score >= 60
        ? { bg: "#FFF8E1", color: "#B45309" }
        : { bg: "#FEE2E2", color: "#B91C1C" };
  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case "matched":
        return "#3B82F6"; // Blue

      case "shortlisted":
        return "#8B5CF6"; // Purple

      case "interview_scheduled":
      case "interviewing":
        return "#F59E0B"; // Amber

      case "interview_completed":
        return "#06B6D4"; // Cyan

      case "interview_passed":
        return "#10B981"; // Green

      case "interview_failed":
        return "#EF4444"; // Red

      case "selected":
        return "#14B8A6"; // Teal

      case "offer":
      case "offer_released":
        return "#F97316"; // Orange

      case "offer_accepted":
        return "#22C55E"; // Green

      case "offer_declined":
      case "offer_revoked":
        return "#DC2626"; // Dark Red

      case "hired":
        return "#059669"; // Dark Green

      default:
        return "#6B7280"; // Gray
    }
  };
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

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        height: "100%",
        borderRadius: "12px",
        border: `1px solid ${hovered ? C.accent : C.border}`,
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
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: "12px" }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              fontWeight: 700,
              fontSize: 16,
              bgcolor: C.accent,
              flexShrink: 0,
            }}
          >
            {candidate.full_name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
             
            >
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
              
            </Box>
            <Box  sx={{ display: "flex", alignItems: "center"}}>
              <Typography sx={{ fontSize: 11, color: C.textSecondary }}>
              CLIN{candidate.clin_id}
            </Typography>
            <DescriptionOutlinedIcon
                onClick={() => {
                  viewResume(candidate.candidate_id);
                }}
                sx={{
                  fontSize: 14,
                  color: "#FF5F1F",
                  ml: 1,
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>
          <Chip
            label={`SkillIntel ${candidate?.match_score}%`}
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

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            mb: "6px",
          }}
        >
          <Typography sx={{ fontSize: 11, color: C.textSecondary, mb: "2px" }}>
            Stage
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: getStageColor(candidate.current_stage),
              textTransform: "capitalize",
            }}
          >
            {candidate.current_stage?.replace(/_/g, " ")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: "6px",
          }}
        >
          <Typography sx={{ fontSize: 11, color: C.textSecondary, mb: "0px" }}>
            Availability
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color:
                candidate.availability === 0 ? C.textPrimary : C.textPrimary,
            }}
          >
            {candidate.availability === 0
              ? "Immediate"
              : `${candidate.availability} days`}
          </Typography>
        </Box>

        {[
          { label: "Experience", value: candidate.total_experience },
          { label: "Email", value: candidate.email },
          { label: "Phone", value: candidate.phone_number },
        ].map(({ label, value }) => (
          <Box
            key={label}
            sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}
          >
            <Typography sx={{ fontSize: 11, color: C.textSecondary }}>
              {label}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: C.textPrimary,
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

        <Box sx={{ mt: "6px" }}>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={onView}
            sx={{
              borderColor: C.accent,
              color: C.accent,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              fontSize: 12,
              "&:hover": {
                backgroundColor: C.accentSoft,
                borderColor: C.accent,
              },
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

## File: pages/Organizations/orgDetails.jsx

```javascript
// src/pages/Organizations/OrgDetail.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Switch,
} from "@mui/material";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  AccessTimeOutlined,
  Business,
  LocationOnOutlined,
  PeopleOutlineOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useDispatch } from "react-redux";
import {
  setDynamicLabels,
  clearDynamicLabels,
} from "../../redux/slices/breadcrumbSlice";
import {
  useGetMyOrganisationsQuery,
  useGetOrganisationJobsQuery,
  useGetOrganisationInterviewsQuery,
  useGetOrganisationJobAnalyticsQuery,
  useGetOrganisationCandidatesQuery,
  useLazyGetResumeViewQuery,
  useUpdateOrganisationUpdatedScoresMutation,
} from "../../redux/services/requisition/requisition";
import { useGetEmployeeDetailsQuery } from "../../redux/services/orgEmployees/orgEmployees";

import ReusableMRT from "../../components/table/index";
import ViewToggle from "../../components/table/ViewToggle";
import SearchIcon from "@mui/icons-material/Search";
import SearchFilter from "../../components/searchFilter";
import LayersIcon from "@mui/icons-material/Layers";

// ─── Add this import at the top of your file ───────────────────────────────
import { useGetInterviewDetailsQuery } from "../../redux/services/requisition/requisition";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
// import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import CustomSelect from "../../components/Select/index";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CandidatePipelineFunnel from "./CandidatePipeline";
import { toast } from "react-toastify";
import OrganizationOverview from "../1dashboard1";
import Billing from "./BIlling";

const LABEL_SX = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#9696A6",
};
const CARD_SX = {
  backgroundColor: "#fff",
  borderRadius: "14px",
  border: "1px solid #E8E8EC",
  p: "14px 16px",
};

/* ── Helpers ── */
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "—";

const fmtTime = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};

const slugToTitle = (s = "") =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const STATUS_MAP = {
  scheduled: { bg: "#EEF2FF", color: "#3C3489", border: "#AFA9EC" },
  completed: { bg: "#E1F5EE", color: "#085041", border: "#5DCAA5" },
  cancelled: { bg: "#F3F4F6", color: "#5F5E5A", border: "#D3D1C7" },
  rescheduled: { bg: "#FAEEDA", color: "#633806", border: "#EF9F27" },
  no_show: { bg: "#FCEBEB", color: "#791F1F", border: "#F09595" },
  not_conducted: { bg: "#F3F4F6", color: "#5F5E5A", border: "#D3D1C7" },
};

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const AVATAR_COLORS = [
  { bg: "#FFF0E8", color: "#993C1D" },
  { bg: "#EEF2FF", color: "#3C3489" },
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#FAEEDA", color: "#633806" },
  { bg: "#F5F3FF", color: "#534AB7" },
];
function avatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

/* ── Section heading ── */
function SectionIcon({ icon: Icon, label }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "12px" }}>
      <Icon sx={{ fontSize: 14, color: "#9696A6" }} />
      <Typography sx={LABEL_SX}>{label}</Typography>
    </Box>
  );
}

/* ── Person row ── */
function PersonRow({ name, subtitle, size = 36 }) {
  const ac = avatarColor(name);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Avatar
        sx={{
          width: size,
          height: size,
          fontSize: size * 0.35,
          fontWeight: 700,
          bgcolor: ac.bg,
          color: ac.color,
        }}
      >
        {initials(name)}
      </Avatar>
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111118" }}>
          {name}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 11, color: "#5C5C70", mt: "1px" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* ── Meta key-value row ── */
function MetaRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: "6px",
        borderBottom: "1px solid #F3F4F6",
        "&:last-child": { borderBottom: "none", pb: 0 },
        "&:first-of-type": { pt: 0 },
      }}
    >
      <Typography sx={{ fontSize: 12, color: "#9696A6" }}>{label}</Typography>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: "#111118",
          textTransform: "capitalize",
        }}
      >
        {value ?? "—"}
      </Typography>
    </Box>
  );
}
function InterviewDetailDialog({ open, onClose, interviewId }) {
  const { data, isLoading, isError } = useGetInterviewDetailsQuery(
    interviewId,
    { skip: !interviewId },
  );
  const iv = data?.data ?? null;

  const statusKey = (iv?.status ?? "").toLowerCase();
  const statusCfg = STATUS_MAP[statusKey] ?? STATUS_MAP.scheduled;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.14)",
          maxHeight: "92vh",
        },
      }}
    >
      {/* ══ Header band ══ */}
      <Box
        sx={{ backgroundColor: "#FF5F1F", px: "24px", pt: "22px", pb: "52px" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                mb: "5px",
              }}
            >
              Interview details
            </Typography>
            {isLoading ? (
              <Box
                sx={{
                  width: 240,
                  height: 26,
                  borderRadius: "6px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.25,
                }}
              >
                {iv?.interview_step_name ?? "—"}
              </Typography>
            )}
            {iv && (
              <Typography
                sx={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.65)",
                  mt: "4px",
                }}
              >
                Step {iv.interview_step_number} · {iv.interview_step_type}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              pt: "2px",
            }}
          >
            {iv?.status && (
              <Box
                sx={{
                  px: "11px",
                  py: "4px",
                  borderRadius: "99px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#fff",
                    textTransform: "capitalize",
                  }}
                >
                  {iv.status}
                </Typography>
              </Box>
            )}
            {iv?.is_final && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  px: "11px",
                  py: "4px",
                  borderRadius: "99px",
                  backgroundColor: "#FBBF24",
                }}
              >
                <EmojiEventsOutlinedIcon
                  sx={{ fontSize: 12, color: "#1F2937" }}
                />
                <Typography
                  sx={{ fontSize: 11, fontWeight: 700, color: "#1F2937" }}
                >
                  Final round
                </Typography>
              </Box>
            )}
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: "rgba(255,255,255,0.8)",
                backgroundColor: "rgba(255,255,255,0.12)",
                borderRadius: "8px",
                width: 28,
                height: 28,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* ══ Scrollable body ══ */}
      <DialogContent
        sx={{
          backgroundColor: "#F7F7F9",
          p: "0 20px 20px",
          mt: "-30px",
          overflowY: "auto",
          maxHeight: "calc(92vh - 180px)",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              ...CARD_SX,
              mt: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#FF5F1F" }} size={28} />
            <Typography sx={{ fontSize: 13, color: "#5C5C70" }}>
              Loading interview details…
            </Typography>
          </Box>
        ) : isError || !iv ? (
          <Box sx={{ ...CARD_SX, mt: "30px", py: 8, textAlign: "center" }}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, color: "#B91C1C" }}
            >
              Failed to load details
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              mt: "30px",
            }}
          >
            {/* ── Candidate strip ── */}
            <Box
              sx={{
                ...CARD_SX,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <PersonRow
                name={iv.candidate_name ?? ""}
                subtitle={`${iv.candidate_experience} experience`}
                size={42}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    px: "11px",
                    py: "5px",
                    borderRadius: "10px",
                    backgroundColor: "#E1F5EE",
                    border: "1px solid #5DCAA5",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 700, color: "#085041" }}
                  >
                    {iv.skill_intel_score}% match
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: "11px",
                    py: "5px",
                    borderRadius: "10px",
                    backgroundColor: statusCfg.bg,
                    border: `1px solid ${statusCfg.border}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: statusCfg.color,
                      textTransform: "capitalize",
                    }}
                  >
                    {iv.status}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* ── Date / Time / Platform ── */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
              }}
            >
              {/* Date */}
              <Box sx={CARD_SX}>
                <SectionIcon icon={CalendarMonthOutlinedIcon} label="Date" />
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "#111118" }}
                >
                  {fmtDate(iv.date)}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#9696A6", mt: "2px" }}>
                  {iv.date
                    ? new Date(iv.date).toLocaleDateString("en-GB", {
                      weekday: "long",
                    })
                    : ""}
                </Typography>
              </Box>

              {/* Time */}
              <Box sx={CARD_SX}>
                <SectionIcon icon={AccessTimeOutlinedIcon} label="Time" />
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "#111118" }}
                >
                  {fmtTime(iv.start_time)} – {fmtTime(iv.end_time)}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#9696A6", mt: "2px" }}>
                  {iv.duration} minutes
                </Typography>
              </Box>

              {/* Platform */}
              <Box sx={CARD_SX}>
                <SectionIcon icon={VideocamOutlinedIcon} label="Platform" />
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "#111118" }}
                >
                  {iv.platform ?? "—"}
                </Typography>
                {iv.meeting_url && (
                  <Box
                    component="a"
                    href={iv.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: 11,
                      color: "#185FA5",
                      textDecoration: "none",
                      mt: "3px",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Join meeting <OpenInNewIcon sx={{ fontSize: 11 }} />
                  </Box>
                )}
              </Box>
            </Box>

            {/* ── Interviewers ── */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {/* Primary */}
              <Box sx={CARD_SX}>
                <SectionIcon
                  icon={PersonOutlineOutlined}
                  label="Primary interviewer"
                />
                {iv.primary_interviewer?.name ? (
                  <PersonRow
                    name={iv.primary_interviewer.name}
                    subtitle={iv.primary_interviewer.designation ?? ""}
                  />
                ) : (
                  <Typography sx={{ fontSize: 12, color: "#9696A6" }}>
                    Not assigned
                  </Typography>
                )}
              </Box>

              {/* Panel */}
              <Box sx={CARD_SX}>
                <SectionIcon icon={GroupOutlinedIcon} label="Panel members" />
                {iv.panel_members?.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {iv.panel_members.map((p) => (
                      <PersonRow key={p.id} name={p.name} size={28} />
                    ))}
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: 12, color: "#9696A6" }}>
                    No panel members
                  </Typography>
                )}
              </Box>
            </Box>

            {/* ── Skills + Job meta ── */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              {/* Skills */}
              <Box sx={CARD_SX}>
                <SectionIcon
                  icon={PsychologyOutlinedIcon}
                  label="Required skills"
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {(iv.skills ?? "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <Box
                        key={skill}
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          px: "8px",
                          py: "3px",
                          borderRadius: "6px",
                          backgroundColor: "#F3F4F6",
                          border: "1px solid #E8E8EC",
                          color: "#5C5C70",
                          textTransform: "capitalize",
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                </Box>
              </Box>

              {/* Job meta */}
              <Box sx={CARD_SX}>
                <SectionIcon
                  icon={WorkOutlineRoundedIcon}
                  label="Job details"
                />
                <MetaRow
                  label="Function"
                  value={slugToTitle(iv.function ?? "")}
                />
                <MetaRow
                  label="Sub-function"
                  value={slugToTitle(iv.sub_function ?? "")}
                />
                <MetaRow
                  label="Experience"
                  value={`${iv.min_years}–${iv.max_years} years`}
                />
                <MetaRow label="Work mode" value={iv.mode_of_work} />
                <MetaRow label="Location" value={iv.country} />
              </Box>
            </Box>

            {/* ── Feedback banner (conditional) ── */}
            {!iv.feedback_submitted && statusKey === "completed" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  px: "16px",
                  py: "13px",
                  borderRadius: "12px",
                  backgroundColor: "#FAEEDA",
                  border: "1px solid #EF9F27",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <WarningAmberOutlinedIcon
                    sx={{ fontSize: 16, color: "#633806", flexShrink: 0 }}
                  />
                  <Box>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 600, color: "#633806" }}
                    >
                      Feedback not submitted
                    </Typography>
                    <Typography
                      sx={{ fontSize: 11, color: "#854F0B", mt: "1px" }}
                    >
                      Interview completed — awaiting interviewer feedback
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#633806",
                    borderColor: "#EF9F27",
                    border: "1px solid",
                    borderRadius: "8px",
                    px: "14px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    "&:hover": { backgroundColor: "#FCD34D22" },
                  }}
                >
                  Submit feedback
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      {/* ══ Footer ══ */}
      <Box
        sx={{
          px: "20px",
          py: "14px",
          borderTop: "1px solid #E8E8EC",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
        }}
      >
        <Typography sx={{ fontSize: 11, color: "#9696A6" }}>
          ID #{iv?.id?.slice(0, 8).toUpperCase() ?? "—"}
        </Typography>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <Button
            onClick={onClose}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: 13,
              color: "#5C5C70",
              border: "1px solid #E8E8EC",
              borderRadius: "10px",
              px: "18px",
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 13,
              backgroundColor: "#111118",
              borderRadius: "10px",
              px: "18px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#222", boxShadow: "none" },
            }}
          >
            Reschedule
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  accent: "#FF5F1F",
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

const STATUS_CHIP = {
  open: { bg: C.greenSoft, color: C.green },
  active: { bg: C.greenSoft, color: C.green },
  closed: { bg: "#F3F4F6", color: "#6B7280" },
  filled: { bg: C.indigoSoft, color: C.indigo },
  on_hold: { bg: C.amberSoft, color: C.amber },
};
const statusChip = (s = "") =>
  STATUS_CHIP[s.toLowerCase().replace(/\s+/g, "_")] ?? {
    bg: "#F3F4F6",
    color: "#6B7280",
  };

const TAB_SX = {
  borderBottom: "1px solid #E5E7EB",
  mb: "5px",
  "& .MuiTab-root": {
    textTransform: "none",
    fontSize: 13,
    fontWeight: 500,
    color: "#6B7280",
    minWidth: "auto",
    px: "4px",
    mr: "24px",
  },
  "& .Mui-selected": { color: `${C.accent} !important`, fontWeight: 600 },
  "& .MuiTabs-indicator": { backgroundColor: C.accent },
};

function getAnalyticsCount(value) {
  if (value == null) return 0;
  if (typeof value === "number" || typeof value === "string") return value;

  if (typeof value === "object") {
    return (
      value.count ??
      value.value ??
      value.job_details_count ??
      value.unique_candidates_count ??
      value.matched_candidates_count ??
      0
    );
  }

  return 0;
}

// ─── Status badge (inline) ────────────────────────────────────────────────────
function StatusPill({ status }) {
  const chip = statusChip(status);
  return (
    <Box
      component="span"
      sx={{
        fontSize: 10,
        fontWeight: 700,
        px: "8px",
        py: "3px",
        borderRadius: "10px",
        backgroundColor: chip.bg,
        color: chip.color,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </Box>
  );
}
function OrgHeroHeader({ org, analytics, orgId }) {
  const initials = org.organisation_name
    ? org.organisation_name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "?";
  const [updatedScores, setUpdatedScores] = useState(false);
  const [updateOrganisationUpdatedScores] =
    useUpdateOrganisationUpdatedScoresMutation();
  const handleToggle = async (event) => {
    const checked = event.target.checked;

    try {
      const response = await updateOrganisationUpdatedScores({
        organisationId: orgId,
        updated_scores: checked,
      }).unwrap();

      setUpdatedScores(checked);

      toast.success(response.updated_scores ? "Switched to updated scores." : "Switched to original scores.");
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to update organisation."
      );
      console.error(err);
    }
  };

  const statPills = [
    {
      label: "Total Jobs",
      value: getAnalyticsCount(
        analytics?.job_overview?.total_jobs ?? org.total_jobs,
      ),
      accent: C.accent,
      soft: C.accentSoft,
      border: C.accentBorder,
    },
    {
      label: "Candidates",
      value: getAnalyticsCount(analytics?.total_candidates),
      accent: C.indigo,
      soft: C.indigoSoft,
      border: C.indigoBorder,
    },
    {
      label: "Hires",
      value: getAnalyticsCount(
        analytics?.candidate_stage_breakdown?.onboarded ?? org.total_hires,
      ),
      accent: C.green,
      soft: C.greenSoft,
      border: C.greenBorder,
    },
  ];
  const metaItems = [
    org.industry && {
      label: org.industry,
      icon: <Business sx={{ fontSize: 16 }} />,
    },
    org.country && {
      label: org.country,
      icon: <LocationOnOutlined sx={{ fontSize: 16 }} />,
    },
    org.time_zone && {
      label: org.time_zone,
      icon: <AccessTimeOutlined sx={{ fontSize: 16 }} />,
    },
  ].filter(Boolean);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        mb: "0px",
        pb: "20px",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {/* ── Left: avatar + name + meta ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Avatar tile */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "14px",
            backgroundColor: C.accentSoft,
            border: `1.5px solid ${C.accentBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 800,
              color: C.accent,
              lineHeight: 1,
            }}
          >
            {initials}
          </Typography>
        </Box>

        <Box>
          {/* Name row + active badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              mb: "6px",
            }}
          >
            <Typography
              sx={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}
            >
              {org.organisation_name}
            </Typography>
            <Box
              component="span"
              sx={{
                fontSize: 10,
                fontWeight: 700,
                px: "10px",
                py: "3px",
                borderRadius: "20px",
                backgroundColor: C.greenSoft,
                color: C.green,
                border: `1px solid ${C.greenBorder}`,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Active
            </Box>
          </Box>

          {/* Meta row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {/* Org ID — monospace pill */}
            <Box
              sx={{
                fontSize: 11,
                fontFamily: "monospace",
                px: "8px",
                py: "3px",
                borderRadius: "6px",
                backgroundColor: "#F3F4F6",
                color: C.textSecondary,
                border: `1px solid ${C.border}`,
                letterSpacing: "0.03em",
              }}
            >
              {org.clin_org_id}
            </Box>

            {metaItems.map(({ label, icon }, index) => (
              <React.Fragment key={label}>
                {index > 0 && (
                  <Box
                    sx={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      backgroundColor: "#D1D5DB",
                      flexShrink: 0,
                    }}
                  />
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {icon}
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: C.textSecondary,
                      textTransform: "capitalize",
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </React.Fragment>
            ))}
            {org.website_url && (
              <>
                <Box
                  sx={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    backgroundColor: "#D1D5DB",
                    flexShrink: 0,
                  }}
                />
                <Box
                  component="a"
                  href={org.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: 12,
                    color: C.accent,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  🌐 {org.website_url}
                  <OpenInNewIcon sx={{ fontSize: 11 }} />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Right: stat pills ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >{/* Updated Scores pill */}
        <Box
          onClick={() => handleToggle({ target: { checked: !updatedScores } })}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            px: "14px",
            py: "8px",
            borderRadius: "10px",
            backgroundColor: updatedScores ? C.greenSoft : "#F3F4F6",
            border: `1px solid ${updatedScores ? C.greenBorder : C.border}`,
            cursor: "pointer",
            transition: "background-color 0.15s, border-color 0.15s",
            userSelect: "none",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: updatedScores ? C.green : C.textSecondary,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              Score Mode
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: updatedScores ? C.green : C.textTertiary,
                opacity: 0.8,
                mt: "3px",
              }}
            >
              {updatedScores ? "Enabled" : "Disabled"}
            </Typography>
          </Box>

          {/* Custom switch */}
          <Box
            sx={{
              width: 36,
              height: 20,
              borderRadius: "999px",
              backgroundColor: updatedScores ? C.green : "#D1D5DB",
              position: "relative",
              transition: "background-color 0.2s ease",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#fff",
                position: "absolute",
                top: 2,
                left: updatedScores ? 18 : 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                transition: "left 0.2s ease",
              }}
            />
          </Box>
        </Box>
        {statPills.map(({ label, value, accent, soft, border }) => (
          <Box
            key={label}
            sx={{
              px: "16px",
              py: "8px",
              borderRadius: "10px",
              backgroundColor: soft,
              border: `1px solid ${border}`,
              textAlign: "center",
              minWidth: 76,
            }}
          >
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                color: accent,
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: accent,
                opacity: 0.8,
                mt: "3px",
                letterSpacing: "0.03em",
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OrgDetail() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState(location.state?.activeTab ?? 0);

  const { data: orgsData, isLoading } = useGetMyOrganisationsQuery();
  console.log("orgsData", orgsData)
  const org =
    location.state?.org ??
    orgsData?.data?.find((o) => String(o.id) === String(orgId));
  const { data: analyticsData } = useGetOrganisationJobAnalyticsQuery(
    { organisationId: orgId, groupBy: "month", status: "all" },
    { skip: !orgId },
  );
  useEffect(() => {
    if (org?.organisation_name)
      dispatch(setDynamicLabels({ orgId: org.organisation_name }));
    return () => dispatch(clearDynamicLabels());
  }, [org?.organisation_name]);

  if (isLoading || !org)
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress sx={{ color: C.accent }} />
      </Box>
    );

  return (
    <Box sx={{ p: 0, height: "100%" }}>
      <OrgHeroHeader org={org} analytics={analyticsData?.data} orgId={orgId} />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={TAB_SX}>
        <Tab label="Overview" />
        <Tab label="Requisitions" />
        <Tab label="Candidates" />
        <Tab label="Interviews" />
        <Tab label="Org Employees" />
        <Tab label="Billing" />
      </Tabs>

      {/* {tab === 0 && <OrgOverviewTab org={org} orgId={orgId} />} */}
      {tab === 0 && <OrganizationOverview orgId={orgId}/>}
      {tab === 1 && (
        <OrgRequisitionsTab
          orgId={orgId}
          orgName={org.organisation_name}
          navigate={navigate}
        />
      )}
      {tab === 2 && (
        <OrgCandidatesTab
          orgId={orgId}
          navigate={navigate}
          orgName={org.organisation_name}
        />
      )}
      {tab === 3 && <OrgInterviewsTab orgId={orgId} />}
      {tab === 4 && <OrgEmployeesTab orgId={orgId} />}
      {tab === 5 && <Billing orgId={orgId} />}
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   TAB 0 — Overview
═══════════════════════════════════════════════ */
function OrgOverviewTab({ org, orgId }) {
  const [groupBy, setGroupBy] = useState("month");
  const [chartType, setChartType] = useState({
    funnel: "line",
    offer: "bar",
    job: "bar",
    stage: "pie",
  });

  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetOrganisationJobAnalyticsQuery({
      organisationId: orgId,
      groupBy,
      status: "all",
    });

  const analytics = analyticsData?.data;

  const profileRows = [
    { label: "Company name", value: org.organisation_name },
    { label: "Location", value: org.country ?? "—" },
    { label: "Website", value: org.website_url ?? "—" },
    { label: "Industry", value: org.industry ?? "—" },
    { label: "Timezone", value: org.time_zone ?? "—" },
  ];
  const pipelineData = useMemo(() => {
    const stage = analytics?.candidate_stage_breakdown;

    if (!stage) return {};

    return {
      matched: stage.matched ?? 0,
      shortlisted: stage.shortlisted ?? 0,

      // Interview stage
      interviewing: stage.interviewing?.total ?? 0,

      selected: stage.selected ?? 0,

      // Offer stage
      offer_released: stage.offers?.offer_released?.total ?? 0,
      offer_accepted: stage.offers?.offer_released?.offer_accepted ?? 0,
      offer_rejected: stage.offers?.offer_released?.offer_rejected ?? 0,
      offer_revoked: stage.offers?.offer_released?.offer_revoked ?? 0,

      onboarded: stage.onboarded ?? 0,
      rejected: stage.rejected ?? 0,
    };
  }, [analytics]);

  /* ── Derived chart data ── */
  const jobTrendData =
    analytics?.job_status_trend?.labels?.map((label, i) => ({
      label,
      Open: analytics.job_status_trend.open[i] ?? 0,
      Closed: analytics.job_status_trend.closed[i] ?? 0,
    })) ?? [];

  const funnelData = analytics
    ? [
      { name: "Matched", value: analytics.candidate_stage_breakdown.matched },
      {
        name: "Shortlisted",
        value: analytics.candidate_stage_breakdown.shortlisted,
      },
      {
        name: "Interviewing",
        value:
          analytics.candidate_stage_breakdown.interview_scheduled +
          analytics.candidate_stage_breakdown.interview_rescheduled,
      },
      {
        name: "Selected",
        value: analytics.candidate_stage_breakdown.selected,
      },
      {
        name: "Rejected",
        value: analytics.candidate_stage_breakdown.rejected,
      },
      {
        name: "Onboarded",
        value: analytics.candidate_stage_breakdown.onboarded,
      },
    ].filter((d) => d.value > 0)
    : [];

  const candidateTrendData =
    analytics?.candidate_funnel_trend?.labels?.map((label, i) => ({
      label,
      Matched: analytics.candidate_funnel_trend.matched[i] ?? 0,
      Shortlisted: analytics.candidate_funnel_trend.shortlisted[i] ?? 0,
      Rejected: analytics.candidate_funnel_trend.rejected[i] ?? 0,
      Onboarded: analytics.candidate_funnel_trend.onboarded[i] ?? 0,
    })) ?? [];

  const offerTrendData =
    analytics?.offer_analysis_trend?.labels?.map((label, i) => ({
      label,
      Released: analytics.offer_analysis_trend.offer_released[i] ?? 0,
      Accepted: analytics.offer_analysis_trend.offer_accepted[i] ?? 0,
      Rejected: analytics.offer_analysis_trend.offer_rejected[i] ?? 0,
      Revoked: analytics.offer_analysis_trend.offer_revoked[i] ?? 0,
    })) ?? [];

  const PIE_COLORS = [C.accent, C.green, C.indigo, "#F59E0B", C.red, "#8B5CF6"];

  const overviewCards = [
    {
      label: "Total Jobs",
      value: analytics?.job_overview.total_jobs?.value ?? 0,
      color: C.accent,
      soft: C.accentSoft,
    },
    {
      label: "Open Jobs",
      value: analytics?.job_overview.open_jobs?.value ?? 0,
      color: C.green,
      soft: C.greenSoft,
    },
    {
      label: "Closed Jobs",
      value: analytics?.job_overview.closed_jobs?.value ?? 0,
      color: "#6B7280",
      soft: "#F3F4F6",
    },
    {
      label: "Total Candidates",
      value: analytics?.total_candidates ?? 0,
      color: C.indigo,
      soft: C.indigoSoft,
    },
  ];

  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Grid size={{ xs: 12, md: 12 }}>
        {/* Group-by toggle */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "16px",
          }}
        >
          {/* <SectionLabel>Job Analytics</SectionLabel> */}
          <CustomSelect
            value={groupBy}
            onChange={setGroupBy}
            options={["month", "week", "day"]}
            placeholder="Group By"
            width={120}
            height={120}
          />
        </Box>

        {analyticsLoading ? (
          <Loader />
        ) : !analytics ? (
          <ErrAlert msg="Could not load analytics" />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* ── KPI cards ── */}
            <Grid container spacing={1.5}>
              {overviewCards.map(({ label, value, color, soft }) => (
                <Grid size={{ xs: 6, sm: 3 }} key={label}>

                  <Box
                    sx={{
                      borderRadius: "10px",
                      border: `1px solid ${C.border}`,
                      p: "14px",
                      backgroundColor: soft,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 11, color, fontWeight: 600, mb: "4px" }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 26,
                        fontWeight: 800,
                        color,
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {/* <CandidatePipelineFunnel/> */}
            <CandidatePipelineFunnel
              data={pipelineData}
              totalCount={analytics?.total_candidates ?? 0}
            />
            {/* ── Candidate funnel trend ── */}
            <ChartCard
              title={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Candidate Funnel Trend
                  </Typography>
                  <Tabs
                    value={chartType.funnel}
                    onChange={(e, val) =>
                      setChartType({ ...chartType, funnel: val })
                    }
                    sx={{
                      minHeight: "32px",
                      "& .MuiTabs-indicator": {
                        backgroundColor: C.accent,
                        height: "3px",
                        borderRadius: "10px",
                      },
                      "& .MuiTab-root": {
                        minHeight: "32px",
                        minWidth: "70px",
                        fontSize: "11px",
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#888",
                        padding: "6px 12px",
                      },
                      "& .Mui-selected": { color: `${C.accent} !important` },
                    }}
                  >
                    <Tab label="Bar" value="bar" />
                    <Tab label="Line" value="line" />
                  </Tabs>
                </Box>
              }
            >
              <ResponsiveContainer width="100%" height={220}>
                {chartType.funnel === "line" ? (
                  <LineChart data={candidateTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 14,
                      }}
                    />
                    <YAxis
                      tick={{
                        fontSize: 14,
                      }}
                    />
                    <Tooltip />
                    <Legend
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: 14,
                      }}
                    />
                    <Line type="monotone" dataKey="Matched" stroke={C.accent} />
                    <Line
                      type="monotone"
                      dataKey="Shortlisted"
                      stroke={C.green}
                    />
                    <Line type="monotone" dataKey="Rejected" stroke={C.red} />
                    <Line
                      type="monotone"
                      dataKey="Onboarded"
                      stroke={C.indigo}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={candidateTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 14,
                      }}
                    />
                    <YAxis
                      tick={{
                        fontSize: 14,
                      }}
                    />
                    <Tooltip />
                    <Legend
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: 14,
                      }}
                    />
                    <Bar dataKey="Matched" fill={C.accent} />
                    <Bar dataKey="Shortlisted" fill={C.green} />
                    <Bar dataKey="Rejected" fill={C.red} />
                    <Bar dataKey="Onboarded" fill={C.indigo} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </ChartCard>

            {/* ── Stage breakdown (Pie) + Offer trend side by side ── */}
            <Grid container spacing={2}>
              {/* LEFT CHART */}
              <Grid
                size={{ xs: 12, sm: 6 }}
                sx={{
                  display: "flex",
                }}
              >
                <ChartCard
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  title={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: C.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        Candidate Stage Breakdown
                      </Typography>

                      <Tabs
                        value={chartType.stage}
                        onChange={(e, val) =>
                          setChartType({
                            ...chartType,
                            stage: val,
                          })
                        }
                        sx={{
                          minHeight: "32px",

                          "& .MuiTabs-indicator": {
                            backgroundColor: C.accent,
                            height: "3px",
                            borderRadius: "10px",
                          },

                          "& .MuiTab-root": {
                            minHeight: "32px",
                            minWidth: "70px",
                            fontSize: "11px",
                            textTransform: "none",
                            fontWeight: 600,
                            color: "#888",
                            padding: "6px 12px",
                          },

                          "& .Mui-selected": {
                            color: `${C.accent} !important`,
                          },
                        }}
                      >
                        <Tab label="Pie" value="pie" />
                        <Tab label="Line" value="line" />
                      </Tabs>
                    </Box>
                  }
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {funnelData.length === 0 ? (
                      <NoData />
                    ) : chartType.stage === "pie" ? (
                      <Box>
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart
                            margin={{
                              top: 20,
                              right: 40,
                              bottom: 20,
                              left: 40,
                            }}
                          >
                            <Pie
                              data={funnelData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={3}
                              label={false}
                            >
                              {funnelData.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                                />
                              ))}
                            </Pie>

                            <Tooltip
                              contentStyle={{
                                fontSize: 11,
                                borderRadius: 8,
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: 1.5,
                            mt: 1,
                            px: 1,
                          }}
                        >
                          {funnelData.map((item, index) => (
                            <Box
                              key={item.name}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                background: "#fff",
                                px: 1.2,
                                py: 0.6,
                                borderRadius: "999px",
                                border: "1px solid #F1F5F9",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor:
                                    PIE_COLORS[index % PIE_COLORS.length],
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: C.textSecondary,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.name}:{" "}
                                <Box
                                  component="span"
                                  sx={{
                                    fontWeight: 700,
                                    color: C.textPrimary,
                                  }}
                                >
                                  {item.value}
                                </Box>
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height={360}>
                        <LineChart data={funnelData}>
                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis
                            dataKey="name"
                            tick={{
                              fontSize: 14,
                            }}
                          />

                          <YAxis
                            tick={{
                              fontSize: 14,
                            }}
                          />

                          <Tooltip />

                          <Legend />

                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={C.accent}
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </ChartCard>
              </Grid>

              {/* RIGHT CHART */}
              <Grid
                size={{ xs: 12, sm: 6 }}
                sx={{
                  display: "flex",
                }}
              >
                <ChartCard
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  title={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: C.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        Offer Analysis Trend
                      </Typography>

                      <Tabs
                        value={chartType.offer}
                        onChange={(e, val) =>
                          setChartType({
                            ...chartType,
                            offer: val,
                          })
                        }
                        sx={{
                          minHeight: "32px",

                          "& .MuiTabs-indicator": {
                            backgroundColor: C.accent,
                            height: "3px",
                            borderRadius: "10px",
                          },

                          "& .MuiTab-root": {
                            minHeight: "32px",
                            minWidth: "70px",
                            fontSize: "11px",
                            textTransform: "none",
                            fontWeight: 600,
                          },
                        }}
                      >
                        <Tab label="Bar" value="bar" />
                        <Tab label="Line" value="line" />
                      </Tabs>
                    </Box>
                  }
                >
                  <Box
                    sx={{
                      flex: 1,
                      width: "100%",
                      minHeight: 360,
                      display: "flex",
                      flexDirection: "column",
                      // overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    {chartType.offer === "bar" ? (
                      <ResponsiveContainer width="100%" height={360}>
                        <BarChart
                          data={offerTrendData}
                          margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#F3F4F6"
                          />

                          <XAxis
                            dataKey="label"
                            tick={{
                              fontSize: 14,
                            }}
                          />

                          <YAxis
                            tick={{
                              fontSize: 14,
                            }}
                            allowDecimals={false}
                          />

                          <Tooltip
                            contentStyle={{
                              fontSize: 11,
                              borderRadius: 8,
                            }}
                          />

                          <Legend
                            iconSize={8}
                            wrapperStyle={{
                              fontSize: 14,
                            }}
                          />

                          <Bar
                            dataKey="Released"
                            fill={C.green}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                          />

                          <Bar
                            dataKey="Accepted"
                            fill={C.indigo}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                          />

                          <Bar
                            dataKey="Rejected"
                            fill={C.red}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                          />

                          <Bar
                            dataKey="Revoked"
                            fill={C.amber}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height={360}>
                        <LineChart
                          data={offerTrendData}
                          margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis
                            dataKey="label"
                            tick={{
                              fontSize: 14,
                            }}
                          />

                          <YAxis
                            tick={{
                              fontSize: 14,
                            }}
                          />

                          <Tooltip />

                          <Legend
                            iconSize={8}
                            wrapperStyle={{
                              fontSize: 14,
                            }}
                          />

                          <Line
                            type="monotone"
                            dataKey="Released"
                            stroke={C.green}
                            strokeWidth={3}
                          />

                          <Line
                            type="monotone"
                            dataKey="Accepted"
                            stroke={C.indigo}
                            strokeWidth={3}
                          />

                          <Line
                            type="monotone"
                            dataKey="Rejected"
                            stroke={C.red}
                            strokeWidth={3}
                          />

                          <Line
                            type="monotone"
                            dataKey="Revoked"
                            stroke={C.amber}
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </ChartCard>
              </Grid>
            </Grid>

            {/* ── Job status trend ── */}
            <ChartCard
              title={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.textSecondary,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Job Status Trend
                  </Typography>
                  <Tabs
                    value={chartType.job}
                    onChange={(e, val) =>
                      setChartType({ ...chartType, job: val })
                    }
                    sx={{
                      minHeight: "32px",
                      "& .MuiTabs-indicator": {
                        backgroundColor: C.accent,
                        height: "3px",
                        borderRadius: "10px",
                      },
                      "& .MuiTab-root": {
                        minHeight: "32px",
                        minWidth: "70px",
                        fontSize: "11px",
                        textTransform: "none",
                        fontWeight: 600,
                      },
                    }}
                  >
                    <Tab label="Bar" value="bar" />
                    <Tab label="Line" value="line" />
                  </Tabs>
                </Box>
              }
            >
              <ResponsiveContainer width="100%" height={180}>
                {chartType.job === "bar" ? (
                  <BarChart
                    data={jobTrendData}
                    margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="label" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 14 }} />
                    <Bar dataKey="Open" fill={C.green} radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="Closed"
                      fill="#9CA3AF"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={jobTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 14 }} />
                    <Line type="monotone" dataKey="Open" stroke={C.green} />
                    <Line type="monotone" dataKey="Closed" stroke="#9CA3AF" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </ChartCard>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

/* ═══════════════════════════════════════════════
   TAB 1 — Requisitions  (grid + list toggle)
═══════════════════════════════════════════════ */
function OrgRequisitionsTab({ orgId, orgName, navigate }) {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useGetOrganisationJobsQuery({
    orgId,
    status: "all",
  });

  console.log("orgId", orgId);
  const reqColumns = useMemo(
    () => [
      {
        accessorKey: "job_title",
        header: "Job Title",
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
              <WorkOutlineRoundedIcon sx={{ color: C.accent, fontSize: 18 }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
              >
                {row.original.job_title}
              </Typography>
              <Typography sx={{ fontSize: 11 }} color={C.textSecondary}>
                {row.original.job_position_id}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => <StatusPill status={cell.getValue()} />,
      },
      {
        accessorKey: "function",
        header: "Function",
        size: 200,
        Cell: ({ cell }) => (
          <Typography
            color={C.textSecondary}
            sx={{ textTransform: "capitalize", fontSize: 12 }}
          >
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "sub_function",
        header: "Sub-function",
        size: 200,
        Cell: ({ cell }) => (
          <Typography
            color={C.textSecondary}
            sx={{ textTransform: "capitalize", fontSize: 12 }}
          >
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
      {
        id: "experience",
        header: "Experience",
        size: 110,
        Cell: ({ row }) => {
          const { min_years, max_years } = row.original;
          return (
            <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
              {min_years != null && max_years != null
                ? `${min_years}–${max_years} yrs`
                : "—"}
            </Typography>
          );
        },
      },
      {
        accessorKey: "no_of_positions",
        header: "Positions",
        size: 90,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created",
        size: 120,
        Cell: ({ cell }) => {
          const v = cell.getValue();
          return (
            <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
              {v
                ? new Date(v).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </Typography>
          );
        },
      },
      {
        accessorKey: "closing_date",
        header: "Closing Date",
        size: 120,
        Cell: ({ cell }) => {
          const v = cell.getValue();
          return (
            <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
              {v
                ? new Date(v).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </Typography>
          );
        },
      },
      {
        accessorKey: "job_type",
        header: "Type",
        size: 100,
        Cell: ({ cell }) => (
          <Typography
            color={C.textSecondary}
            sx={{ textTransform: "capitalize", fontSize: 12 }}
          >
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
    ],
    [],
  );
  const jobs = data?.data ?? [];

  // Global Search Filter
  const filteredJobs = jobs.filter((job) => {
    const searchValue = search.toLowerCase();

    return (
      job.job_title?.toLowerCase().includes(searchValue) ||
      job.job_position_id?.toLowerCase().includes(searchValue) ||
      job.function?.toLowerCase().includes(searchValue) ||
      job.sub_function?.toLowerCase().includes(searchValue) ||
      job.job_type?.toLowerCase().includes(searchValue) ||
      job.status?.toLowerCase().includes(searchValue)
    );
  });
  const goToReq = (job) =>
    navigate(
      `/account-manager/org/${orgId}/requisitions/${job.job_id ?? job.id}`,
      {
        state: {
          jobTitle: job.job_title,
          orgName,
          job,
          previousTab: 1, // Requisitions tab index
        },
      },
    );

  return (
    <Box>
      {/* Top Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          mb: "18px",
          gap: 2,
          // border:2
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: C.accent,
            p: 1,
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/account-manager/create-requisition", {
              state: { orgId },
            })
          }
        >
          <ControlPointIcon sx={{ fontSize: 16, color: "#fff" }} />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
            Add Requisition
          </Typography>
        </Box>

        <SearchFilter
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees..."
        />

        <ViewToggle view={view} onChange={setView} />
      </Box>

      {view === "grid" ? (
        <Grid container spacing={2}>
          {filteredJobs.map((job) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={job.job_id}>
              <RequisitionCard job={job} onOpen={() => goToReq(job)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ mt: -2 }}>
          <ReusableMRT
            data={filteredJobs}
            columnData={reqColumns}
            enableRowActions={false}
            enableRowSelection={false}
            enableGlobalFilter={false}
            height="calc(100vh - 240px)"
            onRowClick={goToReq}
          />
        </Box>
      )}
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   TAB 2 — Candidates  (grid + list toggle)
═══════════════════════════════════════════════ */
function OrgCandidatesTab({ orgId, navigate, orgName }) {
  const [view, setView] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError } = useGetOrganisationCandidatesQuery(orgId);
  const candidates = data?.data ?? [];
  const [search, setSearch] = useState("");

  const statusOptions = useMemo(() => {
    const set = new Set();
    candidates.forEach((c) => c.jobs?.forEach((j) => set.add(j.current_stage)));
    return Array.from(set);
  }, [candidates]);

  const filtered =
    statusFilter === "all"
      ? candidates
      : candidates.filter((c) =>
        c.jobs?.some((j) => j.current_stage === statusFilter),
      );

  const goToCandidate = (candidate, matchedCandidateId, job) =>
    navigate(`/account-manager/candidate/${candidate.candidate_id}`, {
      state: {
        orgId,
        orgName,
        matched_candidate_id: matchedCandidateId,
        previousTab: 2,

        // important
        from: "org-candidates",
        previousPath: location.pathname,

        // modal/job context
        jobId: job?.job_id,
        jobTitle: job?.job_title,
      },
    });

  const candColumns = useMemo(
    () => [
      {
        accessorKey: "candidate_name",
        header: "Candidate",
        size: 200,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: C.accent,
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {row.original.candidate_name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
              >
                {row.original.candidate_name}
              </Typography>
              <Typography sx={{ fontSize: 12 }} color={C.textSecondary} noWrap>
                {row.original.email}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "phone_number",
        header: "Phone",
        size: 200,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
      {
        id: "current_stage",
        header: "Stage",
        size: 130,
        accessorFn: (row) => row.jobs?.[0]?.current_stage ?? "—",
        Cell: ({ cell }) => {
          const stage = cell.getValue();
          const s = stage.toLowerCase();
          const color = s.includes("reject")
            ? C.red
            : s.includes("shortlist")
              ? C.green
              : s.includes("interview")
                ? C.amber
                : s.includes("select") || s.includes("onboard")
                  ? C.indigo
                  : C.textSecondary;
          const bg = s.includes("reject")
            ? C.redSoft
            : s.includes("shortlist")
              ? C.greenSoft
              : s.includes("interview")
                ? C.amberSoft
                : s.includes("select") || s.includes("onboard")
                  ? C.indigoSoft
                  : "#F3F4F6";
          return (
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                px: "8px",
                py: "3px",
                borderRadius: "8px",
                backgroundColor: bg,
                color,
                textTransform: "capitalize",
              }}
            >
              {stage}
            </Box>
          );
        },
      },
      {
        id: "jobs_count",
        header: "Jobs Here",
        size: 90,
        accessorFn: (row) => row.jobs?.length ?? 0,
        Cell: ({ cell }) => (
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}
          >
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "matched_count",
        header: "Matched",
        size: 90,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
            {cell.getValue() ?? 0}
          </Typography>
        ),
      },
      {
        accessorKey: "shortlisted_count",
        header: "Shortlisted",
        size: 100,
        Cell: ({ cell }) => (
          <Typography
            sx={{ fontSize: 12 }}
            color={cell.getValue() > 0 ? C.green : C.textSecondary}
            fontWeight={cell.getValue() > 0 ? 700 : 400}
          >
            {cell.getValue() ?? 0}
          </Typography>
        ),
      },
      {
        accessorKey: "interviewing_count",
        header: "Interviewing",
        size: 100,
        Cell: ({ cell }) => (
          <Typography
            sx={{ fontSize: 12 }}
            color={cell.getValue() > 0 ? C.amber : C.textSecondary}
            fontWeight={cell.getValue() > 0 ? 700 : 400}
          >
            {cell.getValue() ?? 0}
          </Typography>
        ),
      },
      {
        accessorKey: "selected_count",
        header: "Selected",
        size: 90,
        Cell: ({ cell }) => (
          <Typography
            sx={{ fontSize: 12 }}
            color={cell.getValue() > 0 ? C.indigo : C.textSecondary}
            fontWeight={cell.getValue() > 0 ? 700 : 400}
          >
            {cell.getValue() ?? 0}
          </Typography>
        ),
      },
    ],
    [],
  );
  const searchedCandidates = filtered.filter((candidate) => {
    const value = search.toLowerCase();

    return (
      candidate.candidate_name?.toLowerCase().includes(value) ||
      candidate.email?.toLowerCase().includes(value) ||
      candidate.phone_number?.toLowerCase().includes(value) ||
      candidate.jobs?.some((job) =>
        job.current_stage?.toLowerCase().includes(value),
      )
    );
  });
  if (isLoading) return <Loader />;
  if (isError || !candidates.length)
    return (
      <StaticPlaceholder
        label="No Candidates"
        description="No matched candidates found for this organization."
      />
    );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: "16px",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 1.8,
            // py: 0.8,
            borderRadius: "8px",
            background: "rgba(255, 95, 31, 0.08)",
            border: "1px solid rgba(255, 95, 31, 0.2)",
            transition: "0.3s ease",
            "&:hover": {
              background: "rgba(255, 95, 31, 0.14)",
              transform: "translateY(-1px)",
            },
          }}
        >
          <Box
            sx={{
              minWidth: 28,
              height: 28,
              borderRadius: "8px",
              background: "#FF5F1F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              boxShadow: "0 4px 12px rgba(255,95,31,0.35)",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {filtered.length}
            </Typography>
          </Box>

          <Box sx={{ padding: 1, borderRadius: 0 }}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: "#FF5F1F",
                textTransform: "uppercase",
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              Total
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: C.textPrimary,
                lineHeight: 1,
              }}
            >
              Candidate{filtered.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          {/* <InputLabel sx={{ fontSize: 12 }}>Filter by stage</InputLabel> */}

          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="All Stages"
            width={160}
            height={300}
          />
        </FormControl>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <SearchFilter
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees..."
          />
          <ViewToggle view={view} onChange={setView} />
        </Box>
      </Box>

      {view === "grid" && (
        <Grid container spacing={2}>
          {searchedCandidates.map((candidate) => {
            const orgJobs = candidate.jobs ?? [];
            const primaryJob = orgJobs[0];
            return (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, xl: 3 }}
                key={candidate.candidate_id}
              >
                <AssignedCandidateCard
                  candidate={candidate}
                  primaryJob={primaryJob}
                  orgJobCount={orgJobs.length}
                  onView={(matchedId) => goToCandidate(candidate, matchedId)}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      {view === "list" && (
        <ReusableMRT
          data={searchedCandidates}
          columnData={candColumns}
          enableRowActions={false}
          enableRowSelection={false}
          enableGlobalFilter={true}
          height="calc(100vh - 260px)"
          onRowClick={(row) =>
            goToCandidate(row, row.jobs?.[0]?.matched_candidate_id)
          }
        />
      )}
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   TAB 3 — Interviews  (grid + list toggle)
═══════════════════════════════════════════════ */
function OrgInterviewsTab({ orgId }) {
  const [view, setView] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedInterviewId, setSelectedInterviewId] = useState(null); // ← NEW

  const { data, isLoading, isError } = useGetOrganisationInterviewsQuery(orgId);
  const interviews = data?.data ?? [];

  console.log("interviews", interviews);
  const interviewStatuses = [
    { key: "scheduled", value: "Scheduled" },
    { key: "completed", value: "Completed" },
    { key: "cancelled", value: "Cancelled" },
    { key: "rescheduled", value: "Rescheduled" },
    { key: "no_show", value: "No Show" },
    { key: "not_conducted", value: "Not Conducted" },
  ];

  const filtered =
    statusFilter === "all"
      ? interviews
      : interviews.filter(
        (iv) => (iv.interview_status ?? "scheduled") === statusFilter,
      );

  const searchedInterviews = filtered.filter((iv) => {
    const value = search.toLowerCase();
    return (
      iv.job_title?.toLowerCase().includes(value) ||
      iv.job_position_id?.toLowerCase().includes(value) ||
      iv.interview_step_name?.toLowerCase().includes(value) ||
      iv.interview_type?.toLowerCase().includes(value) ||
      iv.sub_function?.toLowerCase().includes(value) ||
      iv.created_by?.toLowerCase().includes(value) ||
      iv.interview_status?.toLowerCase().includes(value)
    );
  });

  // ivColumns stays exactly the same as your existing code — no changes needed
  const ivColumns = useMemo(
    () => [
      {
        accessorKey: "job_title",
        header: "Job",
        size: 240,
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
              <WorkOutlineRoundedIcon sx={{ color: C.accent, fontSize: 18 }} />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
              >
                {row.original.job_title}
              </Typography>
              <Typography sx={{ fontSize: 12 }} color={C.textSecondary}>
                {row.original.job_position_id}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "interview_step_name",
        header: "Round",
        size: 150,
        Cell: ({ row }) => (
          <Box>
            <Typography sx={{ fontSize: 14 }} color={C.textPrimary}>
              {row.original.interview_step_name}
            </Typography>
            {/* <Typography sx={{ fontSize: 14 }} color={C.textSecondary}>
              Step {row.original.interview_step_number}
            </Typography> */}
          </Box>
        ),
      },
      {
        accessorKey: "interview_type",
        header: "Type",
        size: 110,
        Cell: ({ cell }) => {
          const t = cell.getValue()?.toLowerCase();
          const isT = t === "technical";
          return (
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                px: "8px",
                py: "3px",
                borderRadius: "8px",
                backgroundColor: isT ? C.indigoSoft : C.amberSoft,
                color: isT ? C.indigo : C.amber,
                textTransform: "capitalize",
              }}
            >
              {cell.getValue() ?? "—"}
            </Box>
          );
        },
      },
      {
        accessorKey: "interview_date",
        header: "Date",
        size: 150,
        Cell: ({ cell }) => {
          const v = cell.getValue();
          return (
            <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
              {v
                ? new Date(v).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </Typography>
          );
        },
      },
      {
        id: "time_slot",
        header: "Time",
        size: 200,
        Cell: ({ row }) => (
          <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
            {row.original.start_time} – {row.original.end_time} ·{" "}
            {row.original.duration} min
          </Typography>
        ),
      },
      {
        accessorKey: "sub_function",
        header: "Sub-function",
        size: 200,
        Cell: ({ cell }) => (
          <Typography
            color={C.textSecondary}
            sx={{ textTransform: "capitalize", fontSize: 12 }}
          >
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "created_by",
        header: "Created by",
        size: 130,
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "interview_status",
        header: "Status",
        size: 110,
        Cell: ({ cell }) => {
          const s = cell.getValue() ?? "scheduled";
          const colorMap = {
            scheduled: { bg: C.indigoSoft, color: C.indigo },
            completed: { bg: C.greenSoft, color: C.green },
            cancelled: { bg: "#F3F4F6", color: "#6B7280" },
            rescheduled: { bg: C.amberSoft, color: C.amber },
            no_show: { bg: C.redSoft, color: C.red },
            not_conducted: { bg: "#F3F4F6", color: "#6B7280" },
          };
          const cfg = colorMap[s] ?? colorMap.scheduled;
          return (
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                px: "8px",
                py: "3px",
                borderRadius: "8px",
                backgroundColor: cfg.bg,
                color: cfg.color,
                textTransform: "capitalize",
              }}
            >
              {s.replace(/_/g, " ")}
            </Box>
          );
        },
      },
    ],
    [],
  );

  if (isLoading) return <Loader />;
  if (isError) return <ErrAlert msg="Failed to load interviews" />;

  return (
    <Box>
      {/* ...your existing toolbar JSX unchanged... */}

      {searchedInterviews.length === 0 ? (
        <StaticPlaceholder
          label="No Interviews"
          description="No interviews match the selected filter."
        />
      ) : view === "grid" ? (
        <Grid container spacing={2}>
          {searchedInterviews.map((iv) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={iv.interview_id}>
              <InterviewCard
                interview={iv}
                onClick={() => setSelectedInterviewId(iv.interview_id)} // ← NEW
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <ReusableMRT
          data={searchedInterviews}
          columnData={ivColumns}
          enableRowActions={false}
          enableRowSelection={false}
          enableGlobalFilter={true}
          height="calc(100vh - 200px)"
          onRowClick={(row) => setSelectedInterviewId(row.interview_id)} // ← NEW
        />
      )}

      {/* ── Detail Dialog ── */}
      <InterviewDetailDialog
        open={!!selectedInterviewId}
        onClose={() => setSelectedInterviewId(null)}
        interviewId={selectedInterviewId}
      />
    </Box>
  );
}
/* ═══════════════════════════════════════════════
   TAB 4 — Employees
═══════════════════════════════════════════════ */
function OrgEmployeesTab({ orgId }) {
  const { data, isLoading, isError } = useGetEmployeeDetailsQuery(orgId);

  const employees = data?.data ?? [];

  const [search, setSearch] = useState("");

  // ── Search Filter ─────────────────────────────────────
  const filteredEmployees = employees.filter((emp) => {
    const value = search.toLowerCase();

    return (
      emp.full_name?.toLowerCase().includes(value) ||
      emp.email_id?.toLowerCase().includes(value) ||
      emp.phone_number?.toLowerCase().includes(value) ||
      emp.designation?.toLowerCase().includes(value) ||
      emp.department?.toLowerCase().includes(value) ||
      emp.user_role?.toLowerCase().includes(value) ||
      emp.employee_type?.toLowerCase().includes(value) ||
      emp.employee_status?.toLowerCase().includes(value)
    );
  });

  // ── Employee status color helper ─────────────────────
  const empStatusColor = (status = "") => {
    const s = status.toLowerCase();

    if (s === "active")
      return {
        bg: C.greenSoft,
        color: C.green,
      };

    if (s === "inactive")
      return {
        bg: C.redSoft,
        color: C.red,
      };

    return {
      bg: "#F3F4F6",
      color: "#6B7280",
    };
  };

  // ── Role color helper ─────────────────────────────────
  const roleColor = (role = "") => {
    const r = role.toLowerCase();

    if (r.includes("super_admin") || r.includes("admin")) {
      return {
        bg: C.indigoSoft,
        color: C.indigo,
      };
    }

    if (r.includes("hm_user") || r.includes("user")) {
      return {
        bg: C.amberSoft,
        color: C.amber,
      };
    }

    return {
      bg: "#F3F4F6",
      color: "#6B7280",
    };
  };

  // ── MRT Columns ───────────────────────────────────────
  const empColumns = useMemo(
    () => [
      {
        accessorKey: "full_name",
        header: "Employee",
        size: 350,

        Cell: ({ row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: C.accent,
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {row.original.full_name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
              >
                {row.original.full_name}
              </Typography>

              <Typography sx={{ fontSize: 12 }} color={C.textSecondary} noWrap>
                {row.original.email_id}
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
          <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },

      {
        accessorKey: "designation",
        header: "Designation",
        size: 150,

        Cell: ({ cell }) => (
          <Typography
            color={C.textPrimary}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
            }}
          >
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },

      {
        accessorKey: "department",
        header: "Department",
        size: 140,

        Cell: ({ cell }) => (
          <Typography
            color={C.textSecondary}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
            }}
          >
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },

      {
        accessorKey: "user_role",
        header: "Role",
        size: 130,

        Cell: ({ cell }) => {
          const val = cell.getValue() ?? "—";

          const rc = roleColor(val);

          return (
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                px: "8px",
                py: "3px",
                borderRadius: "8px",
                backgroundColor: rc.bg,
                color: rc.color,
                textTransform: "capitalize",
                whiteSpace: "nowrap",
              }}
            >
              {val.replace(/_/g, " ")}
            </Box>
          );
        },
      },

      {
        accessorKey: "employee_type",
        header: "Type",
        size: 110,

        Cell: ({ cell }) => (
          <Typography
            color={C.textSecondary}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
            }}
          >
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },

      {
        accessorKey: "employee_status",
        header: "Status",
        size: 100,

        Cell: ({ cell }) => {
          const val = cell.getValue() ?? "—";

          const sc = empStatusColor(val);

          return (
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                px: "8px",
                py: "3px",
                borderRadius: "8px",
                backgroundColor: sc.bg,
                color: sc.color,
                textTransform: "capitalize",
              }}
            >
              {val}
            </Box>
          );
        },
      },

      {
        accessorKey: "gender",
        header: "Gender",
        size: 90,

        Cell: ({ cell }) => (
          <Typography
            color={C.textSecondary}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
            }}
          >
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },

      {
        accessorKey: "time_zone",
        header: "Timezone",
        size: 140,

        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 12 }} color={C.textSecondary}>
            {cell.getValue() ?? "—"}
          </Typography>
        ),
      },

      {
        accessorKey: "active_from",
        header: "Active From",
        size: 120,

        Cell: ({ cell }) => {
          const v = cell.getValue();

          return (
            <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
              {v
                ? new Date(v).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </Typography>
          );
        },
      },

      {
        accessorKey: "active_to",
        header: "Active To",
        size: 120,

        Cell: ({ cell }) => {
          const v = cell.getValue();

          return (
            <Typography sx={{ fontSize: 12 }} color={C.textPrimary}>
              {v
                ? new Date(v).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </Typography>
          );
        },
      },

      {
        accessorKey: "created_at",
        header: "Created At",
        size: 130,

        Cell: ({ cell }) => {
          const v = cell.getValue();

          return (
            <Typography sx={{ fontSize: 12 }} color={C.textSecondary}>
              {v
                ? new Date(v).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </Typography>
          );
        },
      },
    ],
    [],
  );

  if (isLoading) return <Loader />;

  if (isError) return <ErrAlert msg="Failed to load employee details" />;

  if (!employees.length)
    return (
      <StaticPlaceholder
        label="No Employees"
        description="No employees found for this organization."
      />
    );

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "16px",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 1.8,
            // py: 0.8,
            borderRadius: "8px",
            background: "rgba(255, 95, 31, 0.08)",
            border: "1px solid rgba(255, 95, 31, 0.2)",
            transition: "0.3s ease",
            "&:hover": {
              background: "rgba(255, 95, 31, 0.14)",
              transform: "translateY(-1px)",
            },
          }}
        >
          <Box
            sx={{
              minWidth: 28,
              height: 28,
              borderRadius: "8px",
              background: "#FF5F1F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              boxShadow: "0 4px 12px rgba(255,95,31,0.35)",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {filteredEmployees.length}
            </Typography>
          </Box>

          <Box sx={{ padding: 1, borderRadius: 0 }}>
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: "#FF5F1F",
                textTransform: "uppercase",
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              Total
            </Typography>

            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: C.textPrimary,
                lineHeight: 1,
              }}
            >
              Candidate{filteredEmployees.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>

        <SearchFilter
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employees..."
        />
      </Box>

      {/* MRT */}
      <ReusableMRT
        data={filteredEmployees}
        columnData={empColumns}
        enableRowActions={false}
        enableRowSelection={false}
        enableGlobalFilter={false}
        height="calc(100vh - 260px)"
      />
    </Box>
  );
}

/* ═══════════════════════════════════════════════
   RequisitionCard
═══════════════════════════════════════════════ */
const CARD_THEMES = [
  {
    iconBg: "#EEF2FF",
    iconColor: "#4F46E5",
    chipBg: "#EEF2FF",
    chipColor: "#4338CA",
  },
  {
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    chipBg: "#ECFDF5",
    chipColor: "#047857",
  },
  {
    iconBg: "#FFF7ED",
    iconColor: "#EA580C",
    chipBg: "#FFF7ED",
    chipColor: "#C2410C",
  },
  {
    iconBg: "#FDF2F8",
    iconColor: "#DB2777",
    chipBg: "#FDF2F8",
    chipColor: "#BE185D",
  },
  {
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    chipBg: "#EFF6FF",
    chipColor: "#1D4ED8",
  },
];

const getCardTheme = (title = "") => {
  let hash = 0;

  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  return CARD_THEMES[Math.abs(hash) % CARD_THEMES.length];
};
function RequisitionCard({ job, onOpen }) {
  const [hovered, setHovered] = React.useState(false);
  const title = job.job_title ?? "Untitled";
  const jobId = job.job_position_id ?? job.job_id ?? "—";
  const empType = job.job_type ?? "Full Time";
  const func = job.function ?? null;
  const subFunc = job.sub_function ?? null;
  const minYrs = job.min_years ?? null;
  const maxYrs = job.max_years ?? null;
  const positions = job.no_of_positions ?? null;
  const skills = job.skills ? job.skills.split(",").map((s) => s.trim()) : [];
  const status = job.status ?? "open";
  const chip = statusChip(status);
  const Created = job.created_at
    ? new Date(job.created_at).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : null;
  const closingDate = job.closing_date
    ? new Date(job.closing_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : null;
  const theme = getCardTheme(title);

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      sx={{
        borderRadius: "12px",
        border: `1px solid ${hovered ? C.accent : C.border}`,
        boxShadow: hovered ? "0 0 0 3px rgba(255,95,31,0.07)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        cursor: "pointer",
        height: "100%",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "12px",
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "50px",
              backgroundColor: "#FF5722",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WorkOutlineRoundedIcon
              sx={{
                color: "#fff",
                fontSize: 20,
              }}
            />
          </Box>
          <Box sx={{ flex: 1, px: "10px" }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}
            >
              {title}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              {jobId} · {empType}
            </Typography>
          </Box>
          <StatusPill status={status} />
        </Box>

        <Divider sx={{ mb: "10px" }} />

        {(func || subFunc) && (
          <Box sx={{ display: "flex", gap: 0.6, mb: "10px", flexWrap: "wrap" }}>
            {[func, subFunc].filter(Boolean).map((l) => (
              <Chip
                key={l}
                label={l}
                size="small"
                sx={{
                  fontSize: 11,
                  height: 22,
                  fontWeight: 500,
                  textTransform: "capitalize",
                  backgroundColor: theme.chipBg,
                  color: theme.chipColor,
                  border: "none",

                  "& .MuiChip-label": {
                    px: "8px",
                  },
                }}
              />
            ))}
          </Box>
        )}

        {minYrs !== null && maxYrs !== null && (
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}
          >
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              Experience
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              {minYrs}–{maxYrs} yrs
            </Typography>
          </Box>
        )}
        {positions && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: "6px",
            }}
          >
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              Positions
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              {positions}
            </Typography>
          </Box>
        )}

        {Created && (
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}
          >
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              Created
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              {Created}
            </Typography>
          </Box>
        )}
        {closingDate && (
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}
          >
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              Closing date
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#000" }}>
              {closingDate}
            </Typography>
          </Box>
        )}

        {/* {skills.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: "0px" }}>
            {skills.slice(0, 3).map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: 11,
                  height: 20,
                  textTransform: "capitalize",
                  borderColor: C.border,
                  color: C.textSecondary,
                  "& .MuiChip-label": { px: "7px" },
                }}
              />
            ))}
            {skills.length > 3 && (
              <Chip
                label={`+${skills.length - 3} more`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: 10,
                  height: 20,
                  borderColor: C.border,
                  color: C.textSecondary,
                  "& .MuiChip-label": { px: "7px" },
                }}
              />
            )}
          </Box>
        )} */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.4,
            mt: 2,
            p: 0.9,
            borderRadius: "8px",
            border: "1px solid #FF5722",
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#FF5722",
              transition: "color 0.15s",
              textAlign: "center",
            }}
          >
            See full details
          </Typography>
          <ArrowForwardIcon
            sx={{
              fontSize: 11,
              color: "#FF5722",
              transition: "color 0.15s, transform 0.15s",
              transform: hovered ? "translateX(3px)" : "none",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════
   AssignedCandidateCard
═══════════════════════════════════════════════ */
function AssignedCandidateCard({ candidate, primaryJob, orgJobCount, onView }) {
  const [hovered, setHovered] = React.useState(false);
  const [jobsDialogOpen, setJobsDialogOpen] = React.useState(false);

  const stageColor = (stage = "") => {
    const s = stage.toLowerCase();
    if (s.includes("reject")) return { bg: C.redSoft, color: C.red };
    if (s.includes("shortlist")) return { bg: C.greenSoft, color: C.green };
    if (s.includes("onboard")) return { bg: C.indigoSoft, color: C.indigo };
    if (s.includes("interview")) return { bg: C.amberSoft, color: C.amber };
    if (s.includes("select")) return { bg: C.indigoSoft, color: C.indigo };
    return { bg: "#F3F4F6", color: "#6B7280" };
  };

  const sc = stageColor(primaryJob?.current_stage);
  const orgJobs = candidate.jobs ?? [];
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

  return (
    <>
      <Card
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          borderRadius: "12px",
          border: `1px solid ${hovered ? C.accent : C.border}`,
          boxShadow: hovered ? "0 0 0 3px rgba(255,95,31,0.07)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          height: "100%",
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
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: "12px" }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: C.accent,
                fontWeight: 700,
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              {candidate.candidate_name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  {candidate.candidate_name}
                </Typography>
                <DescriptionOutlinedIcon
                  onClick={() => {
                    viewResume(candidate?.candidate_id);
                  }}
                  sx={{
                    fontSize: 14,
                    color: "#FF5F1F",
                    ml: 0,
                    cursor: "pointer",
                  }}
                />
              </Box>
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
          </Box>
          <Divider sx={{ mb: "10px" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: "6px",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 10, sm: 11 },
                color: "#000",
                mb: "2px",
              }}
            >
              Current Stage
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: sc.color }}>
              {primaryJob?.current_stage ?? "—"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: "6px",
            }}
          >
            <Typography sx={{ fontSize: 11, color: "#000", mb: "2px" }}>
              Jobs Here
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#000" }}>
              {orgJobCount}
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}
          >
            <Typography sx={{ fontSize: 11, color: "#000" }}>Phone</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: "#000" }}>
              {candidate.phone_number}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mt: "4px",
              mb: "12px",
            }}
          >
            {[
              {
                label: "Matched",
                value: candidate.matched_count,
                color: C.accent,
              },
              {
                label: "Shortlisted",
                value: candidate.shortlisted_count,
                color: C.green,
              },
              {
                label: "Interviewing",
                value: candidate.interviewing_count,
                color: C.amber,
              },
              {
                label: "Selected",
                value: candidate.selected_count,
                color: C.indigo,
              },
            ].map(
              ({ label, value, color }) =>
                value > 0 && (
                  <Box
                    key={label}
                    sx={{
                      fontSize: 11,
                      fontFamily: "Helvetica",
                      fontWeight: 600,
                      px: "6px",
                      py: "2px",
                      borderRadius: "6px",
                      backgroundColor: "#F3F4F6",
                      color,
                    }}
                  >
                    {label}: {value}
                  </Box>
                ),
            )}
          </Box>
          <Box sx={{ mt: "6px" }}>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() => setJobsDialogOpen(true)}
              sx={{
                borderColor: C.accent,
                color: C.accent,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                fontSize: 12,
                "&:hover": {
                  backgroundColor: C.accentSoft,
                  borderColor: C.accent,
                },
              }}
            >
              View Jobs ({orgJobCount})
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Jobs Dialog */}
      <Dialog
        open={jobsDialogOpen}
        onClose={() => setJobsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              "linear-gradient(180deg, rgba(255,95,31,0.04), rgba(255,95,31,0.01))",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#FF5F1F",
                fontWeight: 700,
                fontSize: 16,
                boxShadow: "0 4px 14px rgba(255,95,31,0.35)",
              }}
            >
              {candidate.candidate_name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.textPrimary,
                  lineHeight: 1.2,
                }}
              >
                {candidate.candidate_name}
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#FF5F1F",
                  mt: 0.4,
                  textTransform: "uppercase",
                  letterSpacing: 0.7,
                }}
              >
                {orgJobCount} Job{orgJobCount !== 1 ? "s" : ""} Matched
              </Typography>
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={() => setJobsDialogOpen(false)}
            sx={{
              color: "#9CA3AF",
              background: "#F9FAFB",
              border: "1px solid #F3F4F6",
              "&:hover": {
                backgroundColor: "#F3F4F6",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* BODY */}
        <DialogContent sx={{ p: 0 }}>
          {orgJobs.map((job, idx) => {
            const jsc = stageColor(job.current_stage);
            const isLast = idx === orgJobs.length - 1;

            return (
              <Box
                key={job.matched_candidate_id}
                sx={{
                  px: 2.5,
                  py: 2,
                  borderBottom: isLast ? "none" : `1px solid ${C.border}`,
                  backgroundColor: idx % 2 === 0 ? "#fff" : "#FCFCFC",
                  transition: "0.2s ease",
                  "&:hover": {
                    backgroundColor: "#FFF8F5",
                  },
                }}
              >
                {/* TOP */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: C.textPrimary,
                        lineHeight: 1.4,
                        mb: 1,
                      }}
                    >
                      {job.job_title}
                    </Typography>

                    {/* FUNCTION */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        mb: 0.7,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#FF5F1F",
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          minWidth: 65,
                        }}
                      >
                        Function
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: C.textPrimary,
                        }}
                      >
                        {job.function} · {job.sub_function}
                      </Typography>
                    </Box>

                    {/* DATE */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#FF5F1F",
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          minWidth: 65,
                        }}
                      >
                        Matched
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: C.textSecondary,
                        }}
                      >
                        {new Date(job.matched_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Box>

                  {/* SCORE */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 1.5,
                      py: 1,
                      minWidth: 70,
                      borderRadius: "14px",
                      background: "rgba(255,95,31,0.08)",
                      border: "1px solid rgba(255,95,31,0.15)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#FF5F1F",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        mb: 0.2,
                      }}
                    >
                      Score
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: C.textPrimary,
                        lineHeight: 1,
                      }}
                    >
                      {job.match_score}
                    </Typography>
                  </Box>
                </Box>

                {/* BOTTOM */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {/* STAGE */}
                  <Box
                    component="span"
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      px: "10px",
                      py: "5px",
                      borderRadius: "999px",
                      backgroundColor: jsc.bg,
                      color: jsc.color,
                      textTransform: "capitalize",
                      letterSpacing: 0.3,
                    }}
                  >
                    {job.current_stage}
                  </Box>

                  {/* BUTTON */}
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => {
                      setJobsDialogOpen(false);
                      onView(job.matched_candidate_id);
                    }}
                    sx={{
                      background: "#FF5F1F",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: "10px",
                      px: 2,
                      py: 0.7,
                      fontSize: 11,
                      boxShadow: "0 4px 14px rgba(255,95,31,0.3)",
                      "&:hover": {
                        background: "#E65317",
                        boxShadow: "0 6px 18px rgba(255,95,31,0.4)",
                      },
                    }}
                  >
                    View Profile
                  </Button>
                </Box>
              </Box>
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ═══════════════════════════════════════════════
   InterviewCard
═══════════════════════════════════════════════ */
function InterviewCard({ interview }) {
  const typeColor =
    interview.interview_type?.toLowerCase() === "technical"
      ? { bg: C.indigoSoft, color: C.indigo }
      : { bg: C.amberSoft, color: C.amber };

  const formattedDate = interview.interview_date
    ? new Date(interview.interview_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "—";

  return (
    <Card
      sx={{
        borderRadius: "12px",
        border: `1px solid ${C.border}`,
        height: "100%",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "10px",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              backgroundColor: C.accentSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarMonthOutlinedIcon sx={{ color: C.accent, fontSize: 18 }} />
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: 10,
              fontWeight: 700,
              px: "8px",
              py: "3px",
              borderRadius: "10px",
              backgroundColor: typeColor.bg,
              color: typeColor.color,
              textTransform: "capitalize",
              letterSpacing: "0.05em",
            }}
          >
            {interview.interview_type ?? "Interview"}
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: C.textPrimary,
            mb: "2px",
            lineHeight: 1.3,
          }}
        >
          {interview.job_title}
        </Typography>
        <Typography sx={{ fontSize: 11, color: C.textSecondary, mb: "10px" }}>
          {interview.job_position_id} · {interview.sub_function}
        </Typography>
        <Divider sx={{ mb: "10px" }} />
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: "6px" }}
        >
          <CalendarMonthOutlinedIcon
            sx={{ fontSize: 13, color: C.textSecondary }}
          />
          <Typography
            sx={{ fontSize: 11, color: C.textPrimary, fontWeight: 500 }}
          >
            {formattedDate}
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: "6px" }}
        >
          <AccessTimeIcon sx={{ fontSize: 13, color: C.textSecondary }} />
          <Typography
            sx={{ fontSize: 11, color: C.textPrimary, fontWeight: 500 }}
          >
            {interview.start_time} – {interview.end_time} · {interview.duration}{" "}
            min
          </Typography>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}
        >
          <Typography sx={{ fontSize: 11, color: C.textSecondary }}>
            Round
          </Typography>
          <Typography
            sx={{ fontSize: 11, fontWeight: 500, color: C.textPrimary }}
          >
            {interview.interview_step_name} (Step{" "}
            {interview.interview_step_number})
          </Typography>
        </Box>
        {interview.created_by && (
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}
          >
            <Typography sx={{ fontSize: 11, color: C.textSecondary }}>
              Created by
            </Typography>
            <Typography
              sx={{ fontSize: 11, fontWeight: 500, color: C.textPrimary }}
            >
              {interview.created_by}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Shared helpers ──────────────────────────────────────────────────────────*/
function ChartCard({ title, children }) {
  return (
    <Box
      sx={{
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        p: "16px",
        backgroundColor: "#fff",
        width: "100%",
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: C.textSecondary,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          mb: "12px",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function NoData() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
      }}
    >
      <Typography sx={{ fontSize: 12, color: C.textTertiary }}>
        No data available
      </Typography>
    </Box>
  );
}

function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 700,
        color: C.textSecondary,
        letterSpacing: "0.08em",
        mb: "12px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  );
}

function StaticPlaceholder({ label, description }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 10,
        border: `1px solid ${C.border}`,
        borderRadius: "12px",
        backgroundColor: "#fff",
      }}
    >
      <WorkOutlineRoundedIcon
        sx={{ fontSize: 42, color: C.textTertiary, mb: 1.5 }}
      />
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>
        {label}
      </Typography>
      {description && (
        <Typography sx={{ fontSize: 13, color: C.textSecondary, mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

function Loader() {
  return (
    <Box display="flex" justifyContent="center" py={6}>
      <CircularProgress sx={{ color: C.accent }} />
    </Box>
  );
}

function ErrAlert({ msg }) {
  return (
    <Alert severity="error" sx={{ borderRadius: "10px" }}>
      Failed to load: {msg ?? "Unknown error"}
    </Alert>
  );
}

```

---

## File: pages/ProvisionSignup/index.jsx

```javascript
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import {
  useGetProvisionSignupQuery,
  useSubmitProvisionSignupDetailsMutation,
} from "../../redux/services/demo/demo";

const ProvisionSignup = () => {
  /* =========================================
     URL
  ========================================= */

  const [searchParams] = useSearchParams();

  const onboardingId =
    searchParams.get("onboarding_id");

  /* =========================================
     FORM
  ========================================= */

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    organisation_name: "",
    country: "",
    industry: "",
    website_url: "",
    time_zone: "Asia/Kolkata",
  });

  /* =========================================
     GET PROVISION SIGNUP
  ========================================= */

  const {
    data,
    isLoading,
    isError,
  } = useGetProvisionSignupQuery(
    onboardingId,
    {
      skip: !onboardingId,
    }
  );

  /* =========================================
     POST DETAILS
  ========================================= */

  const [
    submitProvisionSignupDetails,
    {
      isLoading: isSubmitting,
      isSuccess,
      isError: isSubmitError,
    },
  ] =
    useSubmitProvisionSignupDetailsMutation();

  /* =========================================
     PREFILL FORM
  ========================================= */

  useEffect(() => {
    if (!data) {
      return;
    }

    console.log(
      "Provision signup GET response:",
      data
    );

    const details =
      data?.data || data;

    setForm({
      first_name:
        details?.first_name || "",

      last_name:
        details?.last_name || "",

      phone_number:
        details?.phone_number || "",

      organisation_name:
        details?.organisation_name || "",

      country:
        details?.country || "",

      industry:
        details?.industry || "",

      website_url:
        details?.website_url || "",

      time_zone:
        details?.time_zone ||
        "Asia/Kolkata",
    });
  }, [data]);

  /* =========================================
     CHANGE
  ========================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!onboardingId) {
      return;
    }

    try {
      const response =
        await submitProvisionSignupDetails({
          onboarding_id:
            onboardingId,

          first_name:
            form.first_name,

          last_name:
            form.last_name,

          phone_number:
            form.phone_number,

          organisation_name:
            form.organisation_name,

          country:
            form.country,

          industry:
            form.industry,

          website_url:
            form.website_url,

          time_zone:
            form.time_zone,
        }).unwrap();

      console.log(
        "Provision signup submitted:",
        response
      );

    } catch (error) {
      console.error(
        "Failed to submit provision signup:",
        error
      );
    }
  };

  /* =========================================
     NO ONBOARDING ID
  ========================================= */

  if (!onboardingId) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Alert severity="error">
          Invalid provision signup link.
        </Alert>
      </Box>
    );
  }

  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* =========================================
     GET ERROR
  ========================================= */

  if (isError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Alert severity="error">
          Unable to load your signup details.
        </Alert>
      </Box>
    );
  }

  /* =========================================
     FORM
  ========================================= */

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F7F7F8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 850,
          borderRadius: 3,
          border: "1px solid #E5E5E8",
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={1}
        >
          Complete Your Account
        </Typography>

        <Typography
          sx={{
            color: "#777",
            fontSize: 14,
            mb: 3,
          }}
        >
          Please review and complete your
          organisation details.
        </Typography>

        {isSuccess && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
          >
            Your details have been submitted
            successfully.
          </Alert>
        )}

        {isSubmitError && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            Failed to submit your details.
            Please try again.
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Grid
            container
            spacing={2}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Organisation Name"
                name="organisation_name"
                value={
                  form.organisation_name
                }
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Industry"
                name="industry"
                value={form.industry}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website URL"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Time Zone"
                name="time_zone"
                value={form.time_zone}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                minWidth: 150,
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Details"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProvisionSignup;
```

---

## File: pages/Settings/ChangePasswordPage.jsx

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../redux/services/auth/auth";

function getStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];

const strengthColor = [
  "",
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
  "#22c55e",
];

const styles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .cp-page {
    min-height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
  }

  .cp-container {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 22px 16px;
  }

  .cp-card {
    width: 100%;
    max-width: 520px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    padding: 36px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }

  .cp-card-icon-wrap {
    width: 64px;
    height: 64px;
    margin: 0 auto 18px;
    border-radius: 16px;
    background: #fff1eb;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cp-title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
    font-family: sans-serif;
  }

  .cp-sub {
    text-align: center;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 28px;
    font-family: sans-serif;
  }

  .cp-error {
    background: #fff5f5;
    border: 1px solid #fecaca;
    color: #b91c1c;
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 20px;
    font-family: sans-serif;
  }

  .field-group {
    margin-bottom: 20px;
  }

  .field-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    font-family: sans-serif;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 0 14px;
    background: #fafafa;
    transition: all 0.2s ease;
  }

  .input-wrap:focus-within {
    border-color: #ff5722;
    background: #fff;
  }

  .field-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 13px 0;
    font-size: 14px;
    color: #111827;
    font-family: sans-serif;
  }

  .field-input::placeholder {
    color: #9ca3af;
  }

  .eye-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
  }

  .strength-wrap {
    margin-top: 10px;
  }

  .strength-bars {
    display: flex;
    gap: 5px;
  }

  .strength-bar {
    flex: 1;
    height: 5px;
    border-radius: 999px;
    background: #e5e7eb;
  }

  .strength-text {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 600;
    font-family: sans-serif;
  }

  .match-text {
    margin-top: 6px;
    font-size: 12px;
    font-family: sans-serif;
  }

  .cp-actions {
    display: flex;
    gap: 12px;
    margin-top: 10px;
  }

  .cancel-btn {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    color: #555;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .cancel-btn:hover {
    border-color: #cfcfcf;
  }

  .submit-btn {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: none;
    background: #ff5722;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .submit-btn:hover {
    background: #e64a19;
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .success-box {
    width: 100%;
    max-width: 450px;
    margin: auto;
    background: #fff;
    border-radius: 18px;
    padding: 50px 40px;
    text-align: center;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }

  .success-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #111827;
    font-family: sans-serif;
  }

  .success-sub {
    font-size: 14px;
    line-height: 1.7;
    color: #6b7280;
    margin-bottom: 28px;
    font-family: sans-serif;
  }

  @media (max-width: 600px) {
    .cp-card {
      padding: 24px 20px;
    }

    .cp-actions {
      flex-direction: column;
    }
  }
`;

const PasswordField = ({
  label,
  value,
  setValue,
  show,
  setShow,
  placeholder,
  borderColor,
}) => {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>

      <div
        className="input-wrap"
        style={{ borderColor }}
      >
        <span>🔒</span>

        <input
          className="field-input"
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          type="button"
          className="eye-btn"
          onClick={() => setShow((v) => !v)}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
};

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const strength = getStrength(newPw);

  const match =
    newPw &&
    confirmPw &&
    newPw === confirmPw;

  const mismatch =
    confirmPw &&
    newPw !== confirmPw;

  const handleSubmit = async () => {
    if (!oldPw || !newPw || !confirmPw) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPw !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }

    if (newPw.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    try {
      setError("");

      await changePassword({
        old_password: oldPw,
        new_password: newPw,
      }).unwrap();

      toast.success(
        "Password updated successfully ✅"
      );

      setSubmitted(true);
    } catch (err) {
      setError(
        err?.data?.detail ||
          err?.data?.message ||
          "Failed to update password"
      );
    }
  };

  if (submitted) {
    return (
      <div className="cp-page">
        <style>{styles}</style>

        <div className="success-box">
          <div
            style={{
              fontSize: 60,
              marginBottom: 20,
            }}
          >
            ✅
          </div>

          <h2 className="success-title">
            Password Updated
          </h2>

          <p className="success-sub">
            Your password has been updated
            successfully.
          </p>

          <button
            className="submit-btn"
            onClick={() =>
              navigate(
                "/account-manager/settings"
              )
            }
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-page">
      <style>{styles}</style>

      <div className="cp-container">
        <div className="cp-card">
          <div className="cp-card-icon-wrap">
            <span style={{ fontSize: 28 }}>
              🔐
            </span>
          </div>

          <h1 className="cp-title">
            Change Password
          </h1>

          <p className="cp-sub">
            Update your password to keep your
            account secure.
          </p>

          {error && (
            <div className="cp-error">
              ⚠️ {error}
            </div>
          )}

          {/* Current Password */}
          <PasswordField
            label="Current Password"
            value={oldPw}
            setValue={setOldPw}
            show={showOld}
            setShow={setShowOld}
            placeholder="Enter current password"
          />

          {/* New Password */}
          <PasswordField
            label="New Password"
            value={newPw}
            setValue={setNewPw}
            show={showNew}
            setShow={setShowNew}
            placeholder="Enter new password"
          />

          {/* Strength */}
          {newPw.length > 0 && (
            <div className="strength-wrap">
              <div className="strength-bars">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="strength-bar"
                    style={{
                      background:
                        i <= strength
                          ? strengthColor[
                              strength
                            ]
                          : "#e5e7eb",
                    }}
                  />
                ))}
              </div>

              <div
                className="strength-text"
                style={{
                  color:
                    strengthColor[
                      strength
                    ],
                }}
              >
                {
                  strengthLabel[
                    strength
                  ]
                }
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <PasswordField
            label="Confirm Password"
            value={confirmPw}
            setValue={setConfirmPw}
            show={showConfirm}
            setShow={setShowConfirm}
            placeholder="Confirm new password"
            borderColor={
              mismatch
                ? "#ef4444"
                : match
                  ? "#22c55e"
                  : undefined
            }
          />

          {mismatch && (
            <div
              className="match-text"
              style={{ color: "#ef4444" }}
            >
              Passwords do not match
            </div>
          )}

          {match && (
            <div
              className="match-text"
              style={{ color: "#22c55e" }}
            >
              ✓ Passwords match
            </div>
          )}

          <div className="cp-actions">
            <button
              className="cancel-btn"
              onClick={() =>
                navigate(
                  "/account-manager/settings"
                )
              }
            >
              Cancel
            </button>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading
                ? "Updating..."
                : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
```

---

## File: pages/Settings/index.jsx

```javascript
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
const settingsCards = [
  {
    title: "Profile Settings",
    description: "Manage and maintain your personal account information used across the Ri8Fit platform. Users can update details such as name, email address, phone number",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>),
  },
  {
    title: "Change Password",
    description: "Protect your account by updating your password whenever required. This section allows users to securely change their current password, create stronger credentials",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="16" r="1.5" fill="currentColor" /></svg>),
  },
  {
    title: "Organization Settings",
    description: "Configure and maintain core organizational information including company name, industry, business location, time zone, contact details, and organizational",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" rx="1" stroke="currentColor" strokeWidth="1.8" /><rect x="14" y="3" width="7" height="10" rx="1" stroke="currentColor" strokeWidth="1.8" /><rect x="14" y="17" width="7" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" /></svg>),
  },
  {
    title: "User Management",
    description: "Manage employees and platform users from a centralized location. Administrators can invite new users, update employee information, activate or deactivate accounts",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" /><path d="M2 20c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M17 10l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  },
  {
    title: "Roles & Permissions",
    description: "Define and control access levels for different users within the platform. Administrators can assign permissions based on responsibilities, ensuring that users only have access",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2l2.5 4.5H20l-4 3.5 1.5 5L12 12.5 6.5 15l1.5-5L4 6.5h5.5L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>),
  },
  {
    title: "Notification Preferences",
    description: "Customize how and when notifications are received across the platform. Users can manage alerts related to job requisitions, candidate activities, interview schedules,",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="18" cy="5" r="3" fill="#ef4444" /></svg>),
  },
  {
    title: "Availability Management",
    description: "Set and manage working hours, interview availability, and scheduling preferences. Users can define available time slots, mark unavailable days, and configure time-zone-specific",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="18" cy="18" r="4" fill="#ef4444" /><path d="M16.5 18h3M18 16.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>),
  },
  {
    title: "Interview Integrations",
    description: "Connect and manage third-party video conferencing platforms used for conducting interviews. This section allows administrators and users to configure integrations",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M16 10.5l6-3.5v10l-6-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>),
  },
  {
    title: "Security & Access",
    description: "Strengthen account protection through advanced security controls. Users can manage active login sessions, review account activity, enable multi-factor authentication",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2l8 3v7c0 5-3.5 9-8 10C7.5 21 4 17 4 12V5l8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  },
  {
    title: "Billing & Subscription",
    description: "Access all subscription-related information in one place. Organizations can view current plans, monitor usage, manage payment methods, review invoices, track renewal dates",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" /><rect x="6" y="14" width="4" height="2" rx="0.5" fill="currentColor" /></svg>),
  },
  {
    title: "Audit Logs",
    description: "Maintain complete visibility into system activities and user actions. Audit logs provide a detailed history of changes made across jobs, candidates, interviews, permissions",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M17 13l1.5 1.5L21 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  },
  {
    title: "Data & Privacy",
    description: "Manage organizational data governance and privacy preferences. Users can configure data retention policies, export recruitment records, control access to sensitive information",
    icon: (<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 3v9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>),
  },
];

/* ─── Password strength helper ─── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

/* ─── Change Password Page ─── */
const ChangePasswordPage = ({ onBack }) => {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(newPw);
  const match = newPw && confirmPw && newPw === confirmPw;
  const mismatch = confirmPw && newPw !== confirmPw;

  const handleSubmit = () => {
    if (!newPw || !confirmPw) { setError("Please fill in all fields."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    if (newPw.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#ffff", display: "flex", flexDirection: "column" }}>
        <style>{sharedStyles}</style>
        <div className="cp-header">
          <button className="back-btn" onClick={onBack}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back to Settings
          </button>
          <div className="date-pill">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#555" strokeWidth="1.8" /><path d="M3 9h18M8 2v4M16 2v4" stroke="#555" strokeWidth="1.8" strokeLinecap="round" /></svg>
            01 Jan 2026 - 07 Jan 2026
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="success-box">
            <div className="success-icon">
              <svg width="38" height="38" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#000" /><path d="M7 12l3.5 3.5L17 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h2 className="success-title">Password Updated!</h2>
            <p className="success-sub">Your new password has been saved successfully. You can now use it to log in.</p>
            <button className="submit-btn" onClick={onBack}>Back to Settings</button>
          </div>
        </div>
        <div className="footer">
          <span>2025-2026 © Ri8Fit. All Right Reserved</span>
          <span>Designed &amp; Developed By <span className="footer-brand">Ri8Fit</span></span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffff", display: "flex", flexDirection: "column" }}>
      <style>{sharedStyles}</style>
      {/* Form card */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px 32px" }}>
        <div className="cp-card">
          {/* Lock icon header */}
          <div className="cp-card-icon-wrap">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#2d6a4f" strokeWidth="1.8" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="16" r="1.5" fill="#2d6a4f" /></svg>
          </div>
          <h2 className="cp-card-title">Set New Password</h2>
          <p className="cp-card-sub">Choose a strong password to keep your account safe.</p>

          {error && (
            <div className="cp-error">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#b91c1c" strokeWidth="1.8" /><path d="M12 8v4M12 16h.01" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" /></svg>
              {error}
            </div>
          )}

          {/* New Password */}
          <div className="field-group">
            <label className="field-label">New Password</label>
            <div className="input-wrap">
              <svg className="input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#999" strokeWidth="1.8" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#999" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <input
                className="field-input"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
              />
              <button className="eye-btn" onClick={() => setShowNew(v => !v)} tabIndex={-1}>
                {showNew
                  ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#999" strokeWidth="1.8" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="#999" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#999" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="1.8" /></svg>
                }
              </button>
            </div>
            {/* Strength bar */}
            {newPw.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= strength ? strengthColor[strength] : "#e5e7eb", transition: "background 0.3s" }} />
                  ))}
                </div>
                <div style={{ fontSize: 11.5, marginTop: 4, color: strengthColor[strength], fontFamily: "sans-serif", fontWeight: 600 }}>
                  {strengthLabel[strength]}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="field-group">
            <label className="field-label">Confirm New Password</label>
            <div className="input-wrap" style={{ borderColor: mismatch ? "#ef4444" : match ? "#22c55e" : undefined }}>
              <svg className="input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" stroke="#999" strokeWidth="1.8" /><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#999" strokeWidth="1.8" strokeLinecap="round" /></svg>
              <input
                className="field-input"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
              />
              <button className="eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                {showConfirm
                  ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#999" strokeWidth="1.8" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" stroke="#999" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  : <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#999" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="1.8" /></svg>
                }
              </button>
            </div>
            {mismatch && <div style={{ fontSize: 12, color: "#ef4444", marginTop: 5, fontFamily: "sans-serif" }}>Passwords do not match</div>}
            {match && <div style={{ fontSize: 12, color: "#22c55e", marginTop: 5, fontFamily: "sans-serif" }}>✓ Passwords match</div>}
          </div>
          {/* Actions */}
          <div className="cp-actions">
            <button className="cancel-btn" onClick={onBack}>Cancel</button>
            <button className="submit-btn" onClick={handleSubmit}>Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Shared CSS ─── */
const sharedStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0;background:"#fff" }
  .settings-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 28px 32px 20px; background: #fff;
  }
  .settings-title { font-size: 28px; font-weight: 700; color: #000; font-family: 'Georgia', serif; letter-spacing: -0.5px; }
  .settings-subtitle { font-size: 13.5px; color: #666; margin-top: 4px; font-family: sans-serif; }
  .date-pill {
    display: flex; align-items: center; gap: 8px; border: 1.5px solid #ccc;
    border-radius: 8px; padding: 8px 16px; background: #fff;
    font-size: 13px; color: #333; font-family: sans-serif; white-space: nowrap;
  }
  .alert-banner {
    margin: 0 32px 16px; background: #fff5f5; border: 1.5px solid #fca5a5;
    border-radius: 8px; padding: 12px 16px; display: flex; align-items: center;
    gap: 10px; font-size: 13.5px; color: #b91c1c; font-family: sans-serif;
  }
  .alert-close { margin-left: auto; background: none; border: none; cursor: pointer; color: #b91c1c; font-size: 18px; line-height: 1; padding: 0 4px; }
  .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 0 32px 24px; }
  .card {
    background: #fff; border-radius: 10px; padding: 22px 22px 28px;
    border: 1.5px solid #e8e8e3; cursor: pointer;
    transition: box-shadow 0.18s ease, transform 0.15s ease, border-color 0.18s ease;
  }
  .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.10); transform: translateY(-2px); border-color: #c5c5bb; }
  .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
  .card-title { font-size: 15.5px; font-weight: 700; color: #1a1a1a; font-family: sans-serif; letter-spacing: -0.2px; }
  .card-icon { color: #1a1a1a; flex-shrink: 0; margin-top: 1px; }
  .card-desc { font-size: 12.8px; color: #666; line-height: 1.6; font-family: sans-serif; }
  .footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 32px; border-top: 1px solid #e0e0db; background: #f5f5f0;
    font-size: 12.5px; color: #888; font-family: sans-serif;
  }
  .footer-brand { color: #FF5722; font-weight: 600; }

  /* Change password page */
  .cp-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 32px 14px; background: #f5f5f0;
  }
  .back-btn {
    display: flex; align-items: center; gap: 7px;
    background: #fff; border: 1.5px solid #e0e0db; border-radius: 8px;
    padding: 8px 16px; font-size: 13.5px; font-family: sans-serif;
    color: #333; cursor: pointer; font-weight: 500;
    transition: border-color 0.15s, background 0.15s;
  }
  .back-btn:hover { border-color: #FF5722; color: #FF5722; background: #f0faf5; }
  .breadcrumb {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 32px 16px; font-size: 12.5px; font-family: sans-serif; color: #888;
  }
  .breadcrumb-link { color: #FF5722; cursor: pointer; font-weight: 500; }
  .breadcrumb-link:hover { text-decoration: underline; }
  .breadcrumb-current { color: #555; }
  .cp-card {
    background: #fff; border-radius: 14px; border: 1.5px solid #e8e8e3;
    padding: 36px 40px; width: 100%; max-width: 480px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  }
  .cp-card-icon-wrap {
    width: 56px; height: 56px; background: #f0faf5; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
  }
  .cp-card-title { font-size: 20px; font-weight: 700; color: #1a1a1a; font-family: sans-serif; margin-bottom: 6px; }
  .cp-card-sub { font-size: 13px; color: #888; font-family: sans-serif; margin-bottom: 24px; line-height: 1.5; }
  .cp-error {
    display: flex; align-items: center; gap: 8px;
    background: #fff5f5; border: 1.5px solid #fca5a5; border-radius: 8px;
    padding: 10px 14px; font-size: 13px; color: #b91c1c; font-family: sans-serif;
    margin-bottom: 18px;
  }
  .field-group { margin-bottom: 20px; }
  .field-label { display: block; font-size: 13px; font-weight: 600; color: #374151; font-family: sans-serif; margin-bottom: 7px; }
  .input-wrap {
    display: flex; align-items: center; gap: 10px;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    padding: 0 14px; background: #fafafa; transition: border-color 0.2s;
  }
  .input-wrap:focus-within { border-color: #FF5722; background: #fff; }
  .input-icon { flex-shrink: 0; }
  .field-input {
    flex: 1; border: none; background: transparent; outline: none;
    font-size: 14px; color: #1a1a1a; font-family: sans-serif;
    padding: 11px 0; min-width: 0;
  }
  .field-input::placeholder { color: #bbb; }
  .eye-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
  .requirements {
    background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 8px;
    padding: 14px 16px; margin-bottom: 24px;
  }
  .req-title { font-size: 12px; font-weight: 600; color: #555; font-family: sans-serif; margin-bottom: 10px; }
  .req-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-family: sans-serif; margin-bottom: 6px; }
  .req-item:last-child { margin-bottom: 0; }
  .cp-actions { display: flex; gap: 12px; }
  .cancel-btn {
    flex: 1; padding: 11px; border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #fff; font-size: 14px; font-family: sans-serif; font-weight: 600;
    color: #555; cursor: pointer; transition: border-color 0.15s, color 0.15s;
  }
  .cancel-btn:hover { border-color: #aaa; color: #333; }
  .submit-btn {
    flex: 1; padding: 11px; border: none; border-radius: 8px;
    background: #FF5722; font-size: 14px; font-family: sans-serif; font-weight: 600;
    color: #fff; cursor: pointer; transition: background 0.15s;
  }
  .submit-btn:hover { background: #FF5722; }
  .success-box {
    background: #fff; border-radius: 14px; border: 1.5px solid #e8e8e3;
    padding: 48px 44px; width: 100%; max-width: 420px; text-align: center;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  }
  .success-icon { display: flex; justify-content: center; margin-bottom: 18px; }
  .success-title { font-size: 22px; font-weight: 700; color: #1a1a1a; font-family: sans-serif; margin-bottom: 10px; }
  .success-sub { font-size: 13.5px; color: #888; font-family: sans-serif; line-height: 1.6; margin-bottom: 28px; }
  @media (max-width: 900px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) {
    .cards-grid { grid-template-columns: 1fr; padding: 0 16px 20px; }
    .settings-header, .cp-header { padding: 20px 16px 14px; flex-direction: column; gap: 12px; }
    .alert-banner { margin: 0 16px 12px; }
    .footer { padding: 14px 16px; flex-direction: column; gap: 4px; text-align: center; }
    .cp-card { padding: 24px 20px; }
    .breadcrumb { padding: 4px 16px 12px; }
  }
`;

/* ─── Main Settings Component ─── */
const Settings = () => {
  const [alertVisible, setAlertVisible] = useState(true);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", fontFamily: "'Georgia', serif" }}>
      <style>{sharedStyles}</style>

      <div className="settings-header">
        <div>
          <div className="settings-title">Settings</div>
          <div className="settings-subtitle">Here's the latest on your team's hires, shifts, and top performers</div>
        </div>
      </div>

      <div className="cards-grid">
        {settingsCards.map((card) => (
          <div
            className="card"
            key={card.title}
           onClick={() => {
  if (card.title === "Change Password") {
    navigate("/account-manager/settings/change-password");
  }
}}
          >
            <div className="card-top">
              <div className="card-title">{card.title}</div>
              <div className="card-icon">{card.icon}</div>
            </div>
            <div className="card-desc">{card.description}</div>
          </div>
        ))}
      </div>

      <div className="footer">
        <span>2025-2026 © Ri8Fit. All Right Reserved</span>
        <span>Designed &amp; Developed By <span className="footer-brand">Ri8Fit</span></span>
      </div>
    </div>
  );
};

export default Settings;
```

---

## File: redux/services/createRequesition/createRequesition.js

```javascript
import { api } from "../api/api";

export const createRequisitionService = api.injectEndpoints({
    endpoints: (builder) => ({
        getCountries: builder.query({
            query: () => ({
                url: "/acc/dropdown/countries",
                method: "GET",
            }),
        }),

        getCitiesByCountry: builder.query({
            query: (country) => ({
                url: `/acc/dropdown/locations?country=${country}`,
                method: "GET",
            }),
        }),

        getHiringManagers: builder.query({
            query: () => ({
                url: "/acc/hiring-managers",
                method: "GET",
            }),
        }),

        getSubFunctions: builder.query({
            query: (functionKey) => ({
                url: `/acc/dropdown/${functionKey}`,
                method: "GET",
            }),
        }),

        getNormalSkills: builder.query({
            query: (subFunction) =>
                `/normal_skill/by-sub_function?sub_function=${subFunction}`,
            transformResponse: (response) => response.data,
        }),

        getPrimarySkills: builder.query({
            query: (subFunction) => ({
                url: `/acc/skills/${subFunction}`,
                method: "GET",
            }),
        }),

        getMandatorySkills: builder.query({
            query: ({ subFunction, primarySelected }) => ({
                url: `/acc/mandatory_skill/by-primary?sub_function=${encodeURIComponent(
                    subFunction
                )}&primary_selected=${encodeURIComponent(primarySelected)}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),

        getApprovers: builder.query({
            query: ({ orgID }) => ({
                url: `/acc/get_employee_details_by_organisation/${orgID}`,
                method: "GET",
            }),
        }),

        getSecondarySkills: builder.query({
            query: ({ subFunction, primarySelected, mandatorySelected }) => ({
                url: `/acc/secondary_skill/by-mandatory?sub_function=${encodeURIComponent(
                    subFunction
                )}&primary_selected=${encodeURIComponent(
                    primarySelected
                )}&mandatory_selected=${encodeURIComponent(
                    mandatorySelected
                )}`,
                method: "POST",
                body: "",
            }),
            transformResponse: (response) => response.data,
        }),

        getEdcTools: builder.query({
            query: () => ({
                url: "/acc/edc-tools",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),

        getTherapeuticAreas: builder.query({
            query: () => ({
                url: "/acc/therapeutic-areas",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),

        getCPSkills: builder.query({
            query: (mode = "normal") => ({
                url: "/acc/raveprogrammer/skills",
                method: "GET",
                params: { mode },
            }),
            transformResponse: (response) => response.data,
        }),

        getCPRemainingSkills: builder.query({
            query: ({ mode = "advanced", selectedSkills = [] }) => ({
                url: `/acc/raveprogrammerskills/remaining`,
                method: "POST",
                params: { mode },
                body: { selected_skill_keys: selectedSkills },
            }),
            transformResponse: (response) => response.data,
        }),

        getTemplates: builder.query({
            query: ({ orgID }) => ({
                url: `/acc/job-templates?organisation_id=${orgID}`,
                method: "GET",
            }),
        }),
        // ── KEY FIX: pass FormData directly, no Content-Type header ──
        createRequisition: builder.mutation({
            query: (formData) => ({
                url: "/acc/account_manager/create-new-job",
                method: "POST",
                body: formData,
                // fetchBaseQuery detects FormData and skips JSON serialization
                // DO NOT set headers here — browser sets multipart/form-data + boundary
            }),
        }),
        editJob: builder.mutation({
            query: ({ jobId, formData }) => ({
                url: `/acc/edit-job_v1/${jobId}`,
                method: "PUT",
                body: formData,
            }),
        }),
        getMatchingCandidates: builder.mutation({
            query: ({ jobId, orgEmpId }) => ({
                url: `/acc/get_matching_candidates/${jobId}?org_emp_id=${orgEmpId}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    org_emp_id: orgEmpId,
                }).toString(),
            }),
        }),
        getMatchedCandidateDetails: builder.query({
            query: (candidateId) => ({
                url: `/acc/get_matched_candidates_details/${candidateId}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getThreeMatchedCandidateDetails: builder.query({
            query: ({ jobId, orgEmpId }) => ({
                url: `/acc/get_three_matched_candidates/${jobId}?org_emp_id=${orgEmpId}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),

        updateCandidateStatus: builder.mutation({
            query: ({ candidateId, status, reason }) => ({
                url: `/acc/matched_candidates/update_status_v1?candidate_id=${candidateId}&new_status=${status}&reason=${encodeURIComponent(reason)}`,
                method: "POST",
                body: "",
            }),
        }),
        deleteTemplate: builder.mutation({
            query: ({ templateId, organisationId }) => ({
                url: `/acc/job-templates/${templateId}`,
                method: "DELETE",
                params: {
                    organisation_id: organisationId,
                },
            }),
        }),
    }),
});

export const {
    useGetCountriesQuery,
    useGetCitiesByCountryQuery,
    useGetHiringManagersQuery,
    useGetSubFunctionsQuery,
    useGetNormalSkillsQuery,
    useGetPrimarySkillsQuery,
    useGetMandatorySkillsQuery,
    useGetSecondarySkillsQuery,
    useGetEdcToolsQuery,
    useGetTherapeuticAreasQuery,
    useGetCPMandatorySkillsQuery,
    useGetCPSecondarySkillsQuery,
    useGetCPRemainingSkillsQuery,
    useGetTemplatesQuery,
    useDeleteTemplateMutation,
    useGetCPSkillsQuery,
    useGetApproversQuery,
    useCreateRequisitionMutation,
    useGetMatchingCandidatesMutation,
    useGetMatchedCandidateDetailsQuery,
    useLazyGetMatchedCandidateDetailsQuery,
    useUpdateCandidateStatusMutation,
    useEditJobMutation,
    useGetThreeMatchedCandidateDetailsQuery,
    useLazyGetThreeMatchedCandidateDetailsQuery,
    
} = createRequisitionService;
```

---

