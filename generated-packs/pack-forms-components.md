# Reusable Form Components

Generated Date: 2026-11-03T09:30:42.961Z

Total Source Files: 6

---

## File: components/Breadcrumbs.jsx

```javascript
// src/layout/DrawerLayout.jsx

import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";                          // 👈
import {
  Box, Drawer, AppBar, Toolbar, IconButton,
  List, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Badge, Typography,
} from "@mui/material";
import {
  Dashboard, Business, People, Work,
  NotificationsNone, Menu as MenuIcon, Logout,
} from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNextRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { getTrailForPath, resolveTrail } from "./Breadcrumbconf";
import { selectDynamicLabels } from "../redux/slices/breadcrumbSlice"; // 👈

const drawerWidth = 220;
const collapsedWidth = 72;

const sidebarSections = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", icon: <Dashboard />, path: "/account-manager/dashboard" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Organization", icon: <Business />, path: "/account-manager/organization" },
      { label: "Requisitions", icon: <Work />, path: "/account-manager/requisitions" },
      { label: "Interviews", icon: <People />, path: "/account-manager/interviews" },
      { label: "Candidates", icon: <People />, path: "/account-manager/candidates", disabled: true },
      { label: "Upload Candidates", icon: <People />, path: "/account-manager/upload-candidates", disabled: true },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "Settings", icon: <Work />, path: "/account-manager/settings", disabled: true },
    ],
  },
];

/* ── TopBarBreadcrumb ─────────────────────────────────────────── */
function TopBarBreadcrumb() {                          // 👈 no props needed
  const location = useLocation();
  const navigate = useNavigate();
  const dynamicLabels = useSelector(selectDynamicLabels); // 👈 reads from Redux

  const rawTrail = getTrailForPath(location.pathname);
  if (!rawTrail) return null;

  const crumbs = resolveTrail(rawTrail, dynamicLabels);
  if (crumbs.length === 0) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0, overflow: "hidden", flexShrink: 1 }}>
      <Box
        onClick={() => navigate("/account-manager/dashboard")}
        sx={{
          display: "flex", alignItems: "center",
          cursor: "pointer", px: 0.8, py: 0.4, borderRadius: "6px",
          transition: "background 0.12s",
          "&:hover": { backgroundColor: "#f5f5f0" },
        }}
      >
        <HomeRoundedIcon sx={{ fontSize: 15, color: "#bbb" }} />
      </Box>

      {crumbs.map((c, idx) => {
        const IconComp = c.icon;
        return (
          <React.Fragment key={idx}>
            <NavigateNextIcon sx={{ fontSize: 15, color: "#ddd", flexShrink: 0 }} />
            <Box
              onClick={!c.isLast && c.path ? () => navigate(c.path) : undefined}
              sx={{
                display: "flex", alignItems: "center", gap: 0.5,
                px: 0.8, py: 0.4, borderRadius: "6px",
                cursor: c.isLast || !c.path ? "default" : "pointer",
                backgroundColor: c.isLast ? "#fff5f0" : "transparent",
                transition: "background 0.12s",
                "&:hover": !c.isLast && c.path ? { backgroundColor: "#f5f5f0" } : {},
              }}
            >
              {IconComp && (
                <IconComp sx={{ fontSize: 13, color: c.isLast ? "#FF5F1F" : "#aaa", opacity: 0.85 }} />
              )}
              <Typography sx={{
                fontSize: "12.5px",
                fontWeight: c.isLast ? 600 : 500,
                color: c.isLast ? "#FF5F1F" : "#888",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}>
                {c.label}
              </Typography>
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
}

/* ── DrawerLayout ─────────────────────────────────────────────── */
const DrawerLayout = () => {
  const [open, setOpen] = useState(true);


  return (
    <Box sx={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          transition: "width 0.3s",
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
            borderRight: "1px solid #e8e8e0",
            backgroundColor: "#fff",
          },
        }}
      >
        {/* Logo + toggle */}
        <Box sx={{ display: "flex", alignItems: "center", p: 2, borderBottom: "1px solid #f0f0e8", minHeight: 52 }}>
          <IconButton onClick={() => setOpen(!open)} sx={{ mr: open ? 1 : 0 }}>
            <MenuIcon />
          </IconButton>
          {open && (
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.5px", color: "#1a1a1a" }}>
              RI<span style={{ color: "#ff5722" }}>8</span>FIT
            </Typography>
          )}
        </Box>

        {/* Nav items */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", py: 1 }}>
          {sidebarSections.map((section, si) => (
            <Box key={si} sx={{ mb: 1.5 }}>
              {open && (
                <Typography sx={{ px: 3, py: 1, fontSize: "10.5px", fontWeight: 600, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  {section.title}
                </Typography>
              )}
              <List disablePadding>
                {section.items.map((item, idx) => (
                  <ListItemButton
                    key={idx}
                    component={NavLink}
                    to={item.path}
                    disabled={item.disabled}
                    sx={{
                      mx: 1.5, my: 0.3, borderRadius: "8px", color: "#555",
                      "&.active": { backgroundColor: "#fff0eb", color: "#ff5722", fontWeight: 500 },
                      "&:hover": { backgroundColor: "#fff5f0", color: "#ff5722" },
                    }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: 0, mr: open ? 2 : "auto", color: "inherit" }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {open && (
                      <ListItemText
                        primary={item.label}
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "13.5px",
                            fontWeight: 500,
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ))}
        </Box>

        {/* Logout */}
        <Box sx={{ p: 2, borderTop: "1px solid #f0f0e8" }}>
          <ListItemButton
            onClick={() => alert("Logout clicked")}
            sx={{ borderRadius: "8px", color: "#e03", "&:hover": { backgroundColor: "#fef0f0" } }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", color: "inherit" }}>
              <Logout />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Box>
      </Drawer>

      {/* MAIN COLUMN */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ backgroundColor: "#fff", color: "#000", borderBottom: "1px solid #e8e8e0", height: "52px" }}
        >
          <Toolbar disableGutters sx={{ px: 2, height: "52px", minHeight: "52px", gap: 2 }}>
            <TopBarBreadcrumb />     {/* 👈 no props — reads Redux internally */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <IconButton size="small">
                <Badge badgeContent={5} color="error">
                  <NotificationsNone sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
              <Avatar sx={{ bgcolor: "#ff5722", width: 32, height: 32, fontSize: 13, fontWeight: 600 }}>
                SK
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: 3, backgroundColor: "#f5f5f0", overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DrawerLayout;


```

---

## File: components/PageHeader.jsx

```javascript
// src/components/PageHeader.jsx
import React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';

const PageHeader = ({ 
  title, 
  subtitle, 
  tabs = [], 
  currentTab = 0, 
  onTabChange 
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumbs />

      {/* Title + Subtitle */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <Typography variant="h5" fontWeight={600} color="#111">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="#666" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Sub Tabs */}
      {tabs.length > 0 && (
        <Tabs 
          value={currentTab} 
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 500,
              minHeight: 48,
              color: '#555',
            },
            '& .Mui-selected': {
              color: '#ff5722 !important',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#ff5722',
              height: 3,
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </Tabs>
      )}
    </Box>
  );
};

export default PageHeader;
```

---

## File: components/Select/index.jsx

```javascript
import React, { useState } from "react";
import { Box, Typography, ClickAwayListener } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  width = 150,
  height = 200,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative", width }}>
        {/* Trigger */}
        <Box
          onClick={() => !disabled && setOpen((prev) => !prev)}
          sx={{
            height: 36,
            border: "1px solid #d0d5dd",
            borderRadius: "8px",
            px: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: disabled ? "not-allowed" : "pointer",
            background: disabled ? "#f5f5f5" : "#fff",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontFamily: "Helvetica",
              color: value ? "#333" : "#9CA3AF",
              textTransform: "capitalize",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {value ? value.replace(/_/g, " ") : placeholder}
          </Typography>

          <KeyboardArrowDownIcon
            sx={{
              fontSize: 18,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s",
            }}
          />
        </Box>

        {/* Dropdown */}
        {open && !disabled && (
          <Box
            sx={{
              position: "absolute",
              top: "42px",
              left: 0,
              width: "100%",
              bgcolor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 9999,
              maxHeight: height,
              overflowY: "auto",

              "&::-webkit-scrollbar": {
                width: 4,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: 10,
              },
            }}
          >
            {options.length > 0 ? (
              options.map((item) => (
                <Box
                  key={item}
                  onClick={() => handleSelect(item)}
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: 13,
                    fontFamily: "Helvetica",
                    textTransform: "capitalize",
                    cursor: "pointer",

                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  {item.replace(/_/g, " ")}
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: 12,
                  color: "#9CA3AF",
                }}
              >
                No options
              </Box>
            )}
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}
```

---

## File: components/autocomplete/index.jsx

```javascript
import React from "react";
import {
    Autocomplete,
    TextField,
    Checkbox,
    Chip,
    Paper,
    Tooltip,
    Box,
    Typography,
} from "@mui/material";
import { PRIMARY } from "../../theme/index";
import CloseIcon from "@mui/icons-material/Close";
const C = {
    primary: PRIMARY.primary,
    primaryLight: "#EBF0FB",
    border: "#E5E7EB",
    text: "#111827",
    textMuted: "#6B7280",
    tag: "#EBF0FB",
    tagText: "#1A4FB5",
    tagBorder: "#C7D8F8",
    selectedBg: "#EEF2FF",
    selectedCheck: "#E8532A",      // orange fill shown in screenshot
    selectedCheckBorder: "#E8532A",
};

export default function GroupedSkillAutocomplete({
    options = [],
    value = [],
    onChange,
    placeholder = "Select Skills",
    showTooltip = false,
}) {
    const hasGroups = options.some(
        (o) => o.primary_selected || o.mandatory_selected
    );
    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            options={options}
            // groupBy={(option) => option.primary_selected || "Skills"}
            groupBy={
                hasGroups
                    ? (option) =>
                        option.primary_selected ||
                        option.mandatory_selected
                    : undefined
            }
            getOptionLabel={(option) => option.label}
            value={options.filter((o) => value.includes(o.key))}
            onChange={(_, selected) => onChange(selected.map((s) => s.key))}
            sx={{
                "& .MuiAutocomplete-tag": {
                    height: "20px !important",
                    margin: "2px !important",
                    borderRadius: "10px !important",
                    fontSize: "11px !important",
                    "& .MuiChip-label": {
                        fontSize: "11px !important",
                        padding: "0 6px !important",
                    },
                    "& .MuiChip-deleteIcon": {
                        fontSize: "13px !important",
                        width: "13px !important",
                        height: "13px !important",
                        margin: "0 4px 0 -2px !important",
                    },
                },
                "& .MuiAutocomplete-inputRoot": {
                    gap: "2px",
                },
            }}
            PaperComponent={(props) => (
                <Paper
                    {...props}
                    elevation={3}
                    sx={{
                        borderRadius: "10px",
                        border: `1px solid ${C.border}`,
                        mt: "4px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        "& .MuiAutocomplete-listbox": {
                            padding: "4px 0",
                            maxHeight: 280,
                        },
                        // Group header
                        "& .MuiAutocomplete-groupLabel": {
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: PRIMARY.fontFamily,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            lineHeight: "32px",
                            padding: "0 14px",
                            background: "#fff",
                        },
                        // Every option row
                        "& .MuiAutocomplete-option": {
                            fontFamily: PRIMARY.fontFamily,
                            fontSize: PRIMARY.label.fontSize,
                            color: C.text,
                            padding: "7px 14px",
                            gap: 8,
                            minHeight: "unset",
                            '&[aria-selected="true"]': {
                                background: C.selectedBg,
                            },
                            '&[aria-selected="true"].Mui-focused': {
                                background: C.selectedBg,
                            },
                            "&.Mui-focused": {
                                background: "#F5F7FF",
                            },
                        },
                    }}
                />
            )}
            renderGroup={(params) => {
                // const groupOptions = options.filter(
                //     (o) => (o.primary_selected || "Skills") === params.group
                // );
                const groupOptions = options.filter(
                    (o) =>
                        (o.primary_selected || o.mandatory_selected) ===
                        params.group
                );
                const groupKeys = groupOptions.map((o) => o.key);
                const allSelected = groupKeys.every((k) => value.includes(k));
                const someSelected = groupKeys.some((k) => value.includes(k));

                const handleGroupToggle = (e) => {
                    e.stopPropagation();
                    if (allSelected) {
                        onChange(value.filter((k) => !groupKeys.includes(k)));
                    } else {
                        onChange([...new Set([...value, ...groupKeys])]);
                    }
                };

                return (
                    <div key={params.key}>
                        <div
                            onClick={handleGroupToggle}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 14px",
                                cursor: "pointer",
                                userSelect: "none",
                                backgroundColor: allSelected ? "#EEF2FF" : someSelected ? "#F5F7FF" : "#fff",
                                borderBottom: `1px solid ${C.border}`,
                            }}
                        >
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected && !allSelected}
                                size="small"
                                onChange={handleGroupToggle}
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                    padding: "2px 8px 2px 0",
                                    color: C.border,
                                    "&.Mui-checked": { color: C.selectedCheck },
                                    "&.MuiCheckbox-indeterminate": { color: C.selectedCheck },
                                    "& .MuiSvgIcon-root": { fontSize: 18 },
                                }}
                            />
                            <span style={{
                                fontFamily: PRIMARY.fontFamily,
                                fontSize: 12,
                                fontWeight: 700,
                                color: C.primary,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                            }}>
                                {params.group}
                            </span>
                        </div>
                        {params.children}
                    </div>
                );
            }}

            renderOption={(props, option, { selected }) => {
                const optionContent = (
                    <li {...props}>
                        <Checkbox
                            checked={selected}
                            size="small"
                            sx={{
                                padding: "2px 8px 2px 0",
                                color: C.border,
                                "&.Mui-checked": {
                                    color: C.selectedCheck,
                                },
                                "& .MuiSvgIcon-root": {
                                    fontSize: 18,
                                },
                            }}
                        />

                        <span
                            style={{
                                fontFamily: PRIMARY.fontFamily,
                                fontSize: PRIMARY.label.fontSize,
                                color: C.text,
                            }}
                        >
                            {option.label}
                        </span>
                    </li>
                );

                if (!showTooltip) return optionContent;

                return (
                    <Tooltip
                        placement="left"
                        arrow
                        enterDelay={300}
                        title={
                            <Box sx={{ p: 0.5 }}>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "#FF5722",
                                        mb: 0.5,
                                    }}
                                >
                                    {option.label}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color: "#222",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {option.description || "No description available"}
                                </Typography>
                            </Box>
                        }
                        slotProps={{
                            tooltip: {
                                sx: {
                                    backgroundColor: "#fff",
                                    color: "#111827",
                                    borderRadius: "8px",
                                    maxWidth: 320,
                                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                                },
                            },
                        }}
                    >
                        <div>{optionContent}</div>
                    </Tooltip>
                );
            }}

            // renderTags={(tagValue, getTagProps) =>
            //     tagValue.map((option, index) => (
            //         <Chip
            //             label={option.label}
            //             {...getTagProps({ index })}
            //             key={option.key}
            //             size="small"
            //             sx={{
            //                 fontFamily: PRIMARY.fontFamily,
            //                 fontSize: "5px",
            //                 fontWeight: 500,
            //                 color: C.tagText,
            //                 background: C.tag,
            //                 border: `1px solid ${C.tagBorder}`,
            //                 borderRadius: "14px",
            //                 height: 20,
            //                 margin: "1px !important",
            //                 "& .MuiChip-label": {
            //                     px: 0.75,
            //                     py: 0,
            //                 },
            //                 "& .MuiChip-deleteIcon": {
            //                     fontSize: 12,
            //                     marginRight: "2px",
            //                     marginLeft: "-2px",
            //                     color: C.tagText,
            //                 },
            //             }}
            //         />
            //     ))
            // }
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        label={option.label}
                        {...getTagProps({ index })}
                        key={option.key}
                        deleteIcon={<CloseIcon />}
                        sx={{
                            fontFamily: PRIMARY.fontFamily,
                            fontWeight: 500,
                            color: C.tagText,
                            background: C.tag,
                            border: `1px solid ${C.tagBorder}`,
                            margin: "2px !important",
                            "&.MuiChip-root": {
                                height: "20px !important",
                                borderRadius: "10px !important",
                            },
                            "& .MuiChip-label": {
                                fontSize: "11px !important",
                                padding: "0 6px !important",
                                lineHeight: "18px !important",
                            },
                            "& .MuiChip-deleteIcon": {
                                fontSize: "13px !important",
                                width: "13px !important",
                                height: "13px !important",
                                margin: "0 4px 0 -2px !important",
                                color: C.tagText,
                            },
                        }}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    size="small"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            padding: "0px 6px !important",
                            minHeight: "38px",
                            alignItems: "center",
                        },
                        "& .MuiAutocomplete-input": {
                            fontFamily: PRIMARY.fontFamily,
                            fontSize: PRIMARY.label.fontSize,
                            padding: "2px 4px !important",
                            "&::placeholder": {
                                color: "#9CA3AF",
                                opacity: 1,
                            },
                        },
                    }}
                />
            )}
        />
    );
}
```

---

## File: components/searchFilter/index.jsx

```javascript
import {
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

export default function SearchFilter({
  value,
  onChange,
  placeholder,
}) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size="small"
      sx={{
        width: 220,
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          fontSize: 13,
          background: "#fff",
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18 }} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
```

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

