# API Services and Form Payloads

Generated Date: 2026-11-03T09:30:42.965Z

Total Source Files: 14

---

## File: pages/ForgotPassword/forgotApi.js

```javascript

export const sendResetEmail = async (email) => {
  console.log("Sending reset email to", email);
  return new Promise((res) => setTimeout(res, 1000));
};

export const verifyOtp = async (otp) => {
  console.log("Verifying OTP", otp);
  return new Promise((res) => setTimeout(res, 1000));
};

export const resendOtp = async () => {
  console.log("Resending OTP");
};

export const resetPassword = async (password) => {
  console.log("Reset password", password);
  return new Promise((res) => setTimeout(res, 1000));
};
```

---

## File: redux/services/api/api.js

```javascript
// api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQuery/baseQuery";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
  "Auth",
  "Organisations",
  "Dashboard",
  "InternalUsers",
  "OrganisationJobs",
  "JobMatchedCandidates",
  "CandidateSkillInfo",
  "ImportedCandidates",
  "JobDetails",
  "DemoRequests",
  "CustomerOnboarding",
  "Subscriptions",
  "Candidates",
  "Invoices",
  "AssignedRequests",
  "CandidateScores",
],
  endpoints: () => ({}),
});
```

---

## File: redux/services/auth/auth.js

```javascript
import { api } from "../api/api";
import { getItem } from "../../../utils/constants";
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/acc/account_manager_login",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: body.email,
          password: body.password,
        }),
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "/acc/account_manager_signup",
        method: "POST",
        body: {
          first_name: body.first_name,
          last_name: body.last_name,
          phone_number: body.phone_number,
          email: body.email,
          password: body.password,
          confirm_password: body.confirm_password,
        },
      }),
    }),
    signupVerifyOTP: builder.mutation({
      query: (body) => ({
        url: "/acc/account_manager_verify_otp",
        method: "POST",
        body: {
          email: body.email,
          otp: body.otp,
        },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `/acc/forgot-password?email=${encodeURIComponent(body.email)}`,
        method: "POST",
      }),
    }),
    forgotVerifyOTP: builder.mutation({
      query: (body) => {
        return {
          url: "/acc/hiring_manager/aws_confirm-forgot-password",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            confirmation_code: body.otp, // ✅ FIXED
            new_password: body.password, // ✅ FIXED
            confirm_password: body.confirmPassword, // ✅ FIXED
          }),
        };
      },
    }),
    forgotResendOTP: builder.mutation({
      query: (body) => ({
        url: `/acc/resend-otp`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email: body.email,
        },
      }),
    }),
    logout: builder.query({
      query: () => ({
        url: "/acc/account_manager_logout",
        method: "GET",
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: `/acc/account_manager_change-password?old_password=${encodeURIComponent(body.old_password)}&new_password=${encodeURIComponent(body.new_password)}`,
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useForgotVerifyOTPMutation,
  useSignupVerifyOTPMutation,
  useForgotResendOTPMutation,
  useLazyLogoutQuery,
  useChangePasswordMutation,
} = authApi;

```

---

## File: redux/services/baseQuery/baseQuery.js

```javascript
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AC_ACCESS_TOKEN,
  AC_REFRESH_TOKEN,
  candidateClearLocalStorage,
  getItem,
  setItem,
} from "../../../utils/constants";

import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_BASE_URL;
console.log(window.location.origin);
// base query
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { endpoint }) => {
    const token = getItem(AC_ACCESS_TOKEN);
    if (endpoint !== "login" && endpoint !== "signup") {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  },
});

// custom base query with refresh logic
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error && [401, 403].includes(result.error.status)) {
    const refresh_token = getItem(AC_REFRESH_TOKEN);

    if (!refresh_token) {
      toast.error("Session expired, please login");
      candidateClearLocalStorage();
      window.location.href = "/login";
      return result;
    }

    // refresh call
    const refreshResult = await rawBaseQuery(
      {
        url: "/acc/account_manager_refresh-access-token",
        method: "POST",
        body: new URLSearchParams({ refresh_token }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
      api,
      extraOptions,
    );
    console.log("Refresh result:", refreshResult);
    if (refreshResult?.data) {
      const newAccessToken =
        refreshResult.data?.data?.access_token ||
        refreshResult.data?.access_token ||
        refreshResult.data?.token;

      if (newAccessToken) {
        //  store new token
        setItem(AC_ACCESS_TOKEN, newAccessToken);

        //  retry original request
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        return refreshResult;
      }
    } else {
      toast.error("Session expired, please login again");
      candidateClearLocalStorage();
      window.location.href = "/login";
      return refreshResult;
    }
  }

  return result;
};

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

## File: redux/services/dashboard/dashboardService.js

```javascript
// dashboardService.js
import { api } from "../api/api";

export const dashboardService = api.injectEndpoints({
    endpoints: (builder) => ({
        getCandidateListByStatus: builder.query({
            query: (status = "") => ({
                url: "/acc/candidate_list_by_status",
                params: { status },
            }),
        }),

        getJobAnalytics: builder.query({
            query: ({
                groupBy = "month",
                periodCount = 6,
                status = "all",
                scope = "user",
                countsType = "cumulative",
                filterBySubfunction = "",   // empty = All
                country = "all",
            } = {}) => {
                const isAllTime = periodCount === "all";
                return {
                    url: "/acc/organisations/job-analytics_v2",
                    params: {
                        group_by: groupBy,
                        status,
                        scope,
                        counts_type: countsType,
                        all_time: isAllTime,
                        ...(isAllTime ? {} : { period_count: periodCount }),
                        country,
                        ...(filterBySubfunction ? { filter_by_subfunction: filterBySubfunction } : {}),
                    },
                };
            },
        }),

        getStageDetails: builder.query({
            query: ({
                stage, period = "", status = "all", scope = "user",
                countsType = "cumulative", filterBySubfunction = "",
                country = "all", page = 1, pageSize = 50,
            }) => ({
                url: "/acc/analytics/jobs/stage-details",
                params: {
                    stage, period, status, scope,
                    counts_type: countsType,
                    country,
                    ...(filterBySubfunction ? { filter_by_subfunction: filterBySubfunction } : {}),
                    page, page_size: pageSize,
                },
            }),
            // Stage dialogs are often reopened while reviewing candidates.
            // Keep their paginated results in the Redux RTK Query cache so
            // reopening a stage is immediate instead of making another call.
            keepUnusedDataFor: 300,
        }),

        getJobsList: builder.query({
            query: ({
                status = "all",
                country = "all",
                filterBySubfunction = "all",
                periodCount,   // 3 | 6 | "all"/undefined = leave empty (all time)
            } = {}) => ({
                url: "/acc/get_jobs_list_v1",
                params: {
                    status,
                    country,
                    // The sub-function filter key is underscored (e.g. "clinical_data_manager"),
                    // but this endpoint expects it space-separated (e.g. "clinical data manager").
                    sub_function: filterBySubfunction ? filterBySubfunction.replace(/_/g, " ") : "all",
                    ...(periodCount === 3 || periodCount === 6 ? { period: periodCount } : {}),
                },
            }),
        }),

        // ── org-wide stage drill-down — now filter-aware ─────────────────────
        // getStageDetails: builder.query({
        //     query: ({
        //         stage,
        //         period = "",
        //         status = "all",
        //         scope = "user",
        //         countsType = "cumulative",
        //         domain = "all",
        //         function: fn = "all",
        //         subFunction = "all",
        //         page = 1,
        //         pageSize = 50,
        //     }) => ({
        //         url: "/analytics/jobs/stage-details",
        //         params: {
        //             stage,
        //             period,            // leave blank to get all months, never force a specific month
        //             status,
        //             scope,
        //             counts_type: countsType,
        //             domain,
        //             function: fn,
        //             sub_function: subFunction,
        //             page,
        //             page_size: pageSize,
        //         },
        //     }),
        // }),

        // ── Job analytics by specific job ID ─────────────────────────────────
        getJobAnalyticsById: builder.query({
            query: ({
                jobId,
                groupBy = "month",
                periodCount = 6,
                status = "all",
                countsType = "cumulative",
            }) => ({
                url: "/acc/analytics/jobs/by-id",
                params: {
                    job_ids: jobId,
                    group_by: groupBy,
                    period_count: periodCount,
                    status,
                    counts_type: countsType,
                },
            }),
            keepUnusedDataFor: 60,
        }),

        // ── Stage-level candidate drill-down for a specific job ──────────────
        getJobStageDetails: builder.query({
            query: ({ jobId, stage }) => ({
                url: "/acc/analytics/jobs/by-id/stage-details",
                params: {
                    job_id: jobId,
                    stage,
                },
            }),
            keepUnusedDataFor: 30,
        }),
        getSubFunctions: builder.query({
            query: () => ({
                url: "/acc/dropdown/job-analytics/sub-functions",
            }),
            keepUnusedDataFor: 300,
        }),

        getCountries: builder.query({
            query: () => ({
                url: "/dropdown/countries",
                method: "GET",
            }),
            transformResponse: (response) => {
                if (Array.isArray(response)) return response;
                if (Array.isArray(response?.data)) return response.data;
                return [];
            },
            keepUnusedDataFor: 300,
        }),
    }),
});

// ── Export hooks ──
export const {
    useGetCandidateListByStatusQuery,
    useGetJobAnalyticsQuery,
    useGetJobsListQuery,
    useLazyGetStageDetailsQuery,
    useGetJobAnalyticsByIdQuery,
    useLazyGetJobStageDetailsQuery,
    useGetSubFunctionsQuery,
    useGetCountriesQuery,
} = dashboardService;
```

---

## File: redux/services/demo/demo.js

```javascript
import { api } from "../api/api";

export const demoApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================
    // DEMO REQUESTS
    // =========================================

    getDemoRequests: builder.query({
      query: ({ status } = {}) => ({
        url: "/acc/demo-requests",
        method: "GET",
        params: status ? { status } : undefined,
      }),
      providesTags: ["DemoRequests"],
    }),

    // =========================================
    // DEMO REQUEST STATUSES
    // =========================================

    getDemoRequestStatuses: builder.query({
      query: () => ({
        url: "/acc/demo-request-statuses",
        method: "GET",
      }),
    }),

    // =========================================
    // DEMO REQUEST ONBOARDING STATUS
    // =========================================

    getDemoRequestOnboardingStatus: builder.query({
      query: (demo_request_id) => ({
        url: `/acc/demo-requests/${demo_request_id}/onboarding-status`,
        method: "GET",
      }),
      providesTags: (result, error, demo_request_id) => [
        { type: "DemoRequests", id: demo_request_id },
      ],
    }),

    // =========================================
    // RESEND DEMO REQUEST INVITE
    // =========================================

    resendDemoRequestInvite: builder.mutation({
      query: (demo_request_id) => ({
        url: `/acc/demo-requests/${demo_request_id}/resend-invite`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["DemoRequests"],
    }),

    // =========================================
    // INTERNAL USERS
    // =========================================

    getAllInternalUsers: builder.query({
      query: () => ({
        url: "/acc/get_all_internal_users",
        method: "GET",
      }),
    }),

    // =========================================
    // UPDATE DEMO REQUEST STATUS
    // =========================================

    updateDemoRequestStatus: builder.mutation({
      query: ({ demo_request_id, status }) => ({
        url: `/acc/demo-requests/${demo_request_id}/status`,
        method: "PATCH",
        body: {
          status,
        },
      }),
      invalidatesTags: ["DemoRequests"],
    }),

    // =========================================
    // ASSIGN DEMO REQUEST
    // =========================================

    assignDemoRequest: builder.mutation({
      query: ({ demo_request_id, assigned_to }) => ({
        url: `/acc/demo-requests/${demo_request_id}/assign`,
        method: "POST",
        body: {
          assigned_to,
        },
      }),
      invalidatesTags: ["DemoRequests"],
    }),

    // =========================================
    // SEND CUSTOMER INVITATION
    // =========================================

    sendCustomerInvite: builder.mutation({
      query: ({
        invite_type,
        demo_request_id,
        organisation_name,
        email,
        first_name,
        last_name,
        phone_number,
        time_zone,
        country,
        Industry,
      }) => ({
        url: "/acc/send-invitation",
        method: "POST",
        body: {
          invite_type,
          demo_request_id,
          organisation_name,
          email,
          first_name,
          last_name,
          phone_number,
          time_zone,
          country,
          Industry,
        },
      }),
      invalidatesTags: ["DemoRequests"],
    }),

    provisionSignup: builder.mutation({
      query: (body) => ({
        url: "/acc/account-manager/provision-signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DemoRequests"],
    }),

    sendProvisionCredentials: builder.mutation({
      query: (onboardingId) => ({
        url: `/acc/account-manager/send-provision-credentials/${onboardingId}`,
        method: "POST",
      }),
      invalidatesTags: ["DemoRequests"],
    }),

    // =========================================
    // GET PROVISION SIGNUP DETAILS
    // =========================================

    getProvisionSignup: builder.query({
      query: (onboarding_id) => ({
        url: `/acc/account-manager/provision-signup/${onboarding_id}`,
        method: "GET",
      }),
    }),

    createDemoRequestOnBehalf: builder.mutation({
  query: (body) => ({
    url: "/acc/demo-requests/create-on-behalf",
    method: "POST",
    body,
  }),
  invalidatesTags: ["DemoRequests"], 
}),

    // =========================================
    // SUBMIT PROVISION SIGNUP DETAILS
    // =========================================

    submitProvisionSignupDetails: builder.mutation({
      query: ({
        onboarding_id,
        first_name,
        last_name,
        phone_number,
        organisation_name,
        country,
        industry,
        website_url,
        time_zone,
      }) => ({
        url: "/acc/provision-signup/submit-details",
        method: "POST",
        body: {
          onboarding_id,
          first_name,
          last_name,
          phone_number,
          organisation_name,
          country,
          industry,
          website_url,
          time_zone,
        },
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
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
  useGetProvisionSignupQuery,
  useSubmitProvisionSignupDetailsMutation,
  useCreateDemoRequestOnBehalfMutation,
} = demoApi;
```

---

## File: redux/services/drawerService/drawerService.js

```javascript
// drawerService.js
import { api } from "../api/api";

export const drawerService = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyAssignedRequests: builder.query({
      query: () => ({
        url: "/acc/my-assigned-requests",
        method: "GET",
      }),
      providesTags: ["AssignedRequests"],
    }),

    getRequestCandidateScores: builder.query({
      query: (requestUuid) =>
        `/acc/get-request-candidate-scores/${requestUuid}`,
      providesTags: (result, error, requestUuid) => [
        { type: "CandidateScores", id: requestUuid },
      ],
    }),

    closeRequestAndAddCandidates: builder.mutation({
      query: ({ requestUuid, candidateIds }) => ({
        url: `/acc/close-request-and-add-candidates?request_id=${requestUuid}`,
        method: "POST",
        body: candidateIds, // string[]
      }),
      invalidatesTags: ["AssignedRequests"],
    }),
  }),
});

// ── Export hooks ──
export const {
  useGetMyAssignedRequestsQuery,
  useGetRequestCandidateScoresQuery,
  useCloseRequestAndAddCandidatesMutation,
} = drawerService;
```

---

## File: redux/services/orgEmployees/orgEmployees.js

```javascript
// src/redux/services/orgEmplyeeService.js
import { api } from "../api/api";

export const orgEmplyeeService = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeDetails: builder.query({
      query: (organisationId) => ({
        url: `/acc/get_employee_details_by_organisation/${organisationId}`,
        method: "GET",
      }),
      providesTags: ["EmployeeDetails"],
    }),
  }),
});

// ── Export hooks ──
export const { useGetEmployeeDetailsQuery } = orgEmplyeeService;
```

---

## File: redux/services/organizationOverview/organizationOverview.js

```javascript
import { api } from "../api/api.js";

export const OrganizationOverviewService = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================================
    // TOTAL JOBS / JOB OVERVIEW
    // ==========================================================
    getJobOverview: builder.query({
      query: ({
        organisationId,
        groupBy = "month",
        periodCount = 6,
        status = "all",
        filterBySubfunction,
        country = "all",
        allTime = false,
      }) => {
        const params = new URLSearchParams({
          organisation_id: organisationId,
          group_by: groupBy,
          period_count: String(periodCount),
          status,
          country:
            !country || country === "all"
              ? "all_locations"
              : country,
          all_time: String(allTime),
        });

        if (filterBySubfunction) {
          params.append(
            "filter_by_subfunction",
            filterBySubfunction
          );
        }

        return `/acc/analytics/jobs/overview?${params.toString()}`;
      },

      providesTags: ["JobAnalytics"],
    }),

    // ==========================================================
    // JOB COUNTS BY SUB-FUNCTION
    // ==========================================================
    getJobsCountBySubFunction: builder.query({
      query: ({
        organisationId,
        status = "open",
        country = "all",
      }) => {
        const params = new URLSearchParams({
          organisation_id: organisationId,
          status,
          country:
            !country || country === "all"
              ? "all"
              : country,
        });

        return `/acc/get_jobs_count_by_sub_function?${params.toString()}`;
      },

      providesTags: ["JobAnalytics"],
    }),

    // ==========================================================
    // CANDIDATE SUMMARY
    // ==========================================================
    getCandidateSummary: builder.query({
      query: ({
        organisationId,
        groupBy = "month",
        periodCount = 6,
        status = "all",
        countsType = "cumulative",
        filterBySubfunction,
        country = "all",
        allTime = true,
      }) => {
        const params = new URLSearchParams({
          organisation_id: organisationId,
          group_by: groupBy,
          period_count: String(periodCount),
          status,
          counts_type: countsType,
          country:
            !country || country === "all"
              ? "all_locations"
              : country,
          all_time: String(allTime),
        });

        if (filterBySubfunction) {
          params.append(
            "filter_by_subfunction",
            filterBySubfunction
          );
        }

        return `/acc/analytics/jobs/candidate-summary?${params.toString()}`;
      },

      providesTags: ["CandidateSummary"],
    }),

    // ==========================================================
    // TOTAL POSITIONS
    // ==========================================================
    getTotalPositions: builder.query({
      query: ({
        organisationId,
        groupBy = "month",
        periodCount = 6,
        status = "all",
        countsType = "cumulative",
        filterBySubfunction,
        country = "all",
        allTime = false,
      }) => {
        const params = new URLSearchParams({
          organisation_id: organisationId,
          group_by: groupBy,
          period_count: String(periodCount),
          status,
          counts_type: countsType,
          country:
            !country || country === "all"
              ? "all_locations"
              : country,
          all_time: String(allTime),
        });

        if (filterBySubfunction) {
          params.append(
            "filter_by_subfunction",
            filterBySubfunction
          );
        }

        return `/acc/analytics/jobs/total-positions?${params.toString()}`;
      },

      providesTags: ["TotalPositions"],
    }),

    // ==========================================================
    // CANDIDATE FUNNEL TREND
    // ==========================================================
    getCandidateFunnelTrend: builder.query({
      query: ({
        organisationId,
        groupBy = "month",
        periodCount = 6,
        status = "all",
        countsType = "cumulative",
        filterBySubfunction,
        country = "all",
        allTime = false,
      }) => {
        const params = new URLSearchParams({
          organisation_id: organisationId,
          group_by: groupBy,
          period_count: String(periodCount),
          status,
          counts_type: countsType,
          country:
            !country || country === "all"
              ? "all_locations"
              : country,
          all_time: String(allTime),
        });

        if (filterBySubfunction) {
          params.append(
            "filter_by_subfunction",
            filterBySubfunction
          );
        }

        return `/acc/analytics/jobs/funnel-trend?${params.toString()}`;
      },

      providesTags: ["CandidateFunnelTrend"],
    }),

    // ==========================================================
    // INTERVIEW TREND
    // ==========================================================
    getInterviewTrend: builder.query({
      query: ({
        organisationId,
        groupBy = "month",
        periodCount = 6,
        status = "all",
        countsType = "current",
        filterBySubfunction,
        country = "all",
        allTime = true,
      }) => {
        const params = new URLSearchParams({
          organisation_id: organisationId,
          group_by: groupBy,
          period_count: String(periodCount),
          status,
          counts_type: countsType,
          country:
            !country || country === "all"
              ? "all_locations"
              : country,
          all_time: String(allTime),
        });

        if (filterBySubfunction) {
          params.append(
            "filter_by_subfunction",
            filterBySubfunction
          );
        }

        return `/acc/analytics/jobs/interview-trend?${params.toString()}`;
      },

      providesTags: ["InterviewTrend"],
    }),

    // ==========================================================
    // CANDIDATES EXPERIENCE
    // ==========================================================
    getCandidatesExperience: builder.query({
      query: ({
        organisationId,
        groupBy = "month",
        periodCount = 6,
        status = "all",
        filterBySubfunction,
        country = "all",
        allTime = true,
      }) => {
        const params = new URLSearchParams({
          organisation_id: organisationId,
          group_by: groupBy,
          period_count: String(periodCount),
          status,
          country:
            !country || country === "all"
              ? "all_locations"
              : country,
          all_time: String(allTime),
        });

        if (filterBySubfunction) {
          params.append(
            "filter_by_subfunction",
            filterBySubfunction
          );
        }

        return `/acc/analytics/jobs/candidates-experience?${params.toString()}`;
      },

      providesTags: ["CandidatesExperience"],
    }),

    // ==========================================================
    // OFFER TREND
    // ==========================================================
    getOfferTrend: builder.query({
      query: ({
        organisationId,
        groupBy = "month",
        periodCount = 6,
        status = "all",
        countsType = "cumulative",
        filterBySubfunction,
        country = "all",
        allTime = true,
      }) => {
        const params = new URLSearchParams({
          organisation_id: organisationId,
          group_by: groupBy,
          period_count: String(periodCount),
          status,
          counts_type: countsType,
          country:
            !country || country === "all"
              ? "all_locations"
              : country,
          all_time: String(allTime),
        });

        if (filterBySubfunction) {
          params.append(
            "filter_by_subfunction",
            filterBySubfunction
          );
        }

        return `/acc/analytics/jobs/offer-trend?${params.toString()}`;
      },

      providesTags: ["OfferTrend"],
    }),

    // ==========================================================
    // STAGE DETAILS
    // ==========================================================
    getStageDetails: builder.query({
      query: ({
        organisationId,
        stage,
        status = "all",
        countsType = "current",
        country = "all_locations",
        filterBySubfunction,
        page = 1,
        pageSize = 10,
      }) => ({
        url: "/acc/analytics/jobs/stage-details",
        method: "GET",
        params: {
          organisation_id: organisationId,
          stage,
          status,
          counts_type: countsType,
          country:
            country === "all"
              ? "all_locations"
              : country,
          page,
          page_size: pageSize,

          ...(filterBySubfunction
            ? {
                sub_function: filterBySubfunction,
              }
            : {}),
        },
      }),

      providesTags: ["StageDetails"],
    }),
  }),

  overrideExisting: false,
});

// ============================================================
// EXPORT ALL HOOKS
// ============================================================

export const {
  useGetJobOverviewQuery,
  useGetJobsCountBySubFunctionQuery,
  useGetCandidateSummaryQuery,
  useGetTotalPositionsQuery,
  useGetCandidateFunnelTrendQuery,
  useGetInterviewTrendQuery,
  useGetCandidatesExperienceQuery,
  useGetOfferTrendQuery,
  useGetStageDetailsQuery,
} = OrganizationOverviewService;
```

---

## File: redux/services/requisition/requisition.js

```javascript
import { api } from "../api/api"; // base api

export const requisitionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrganisations: builder.query({
      query: () => ({
        url: "/acc/get_assigned_organisations",
        method: "GET",
      }),
      providesTags: ["Organisations"],
    }),

    getOrganisationJobs: builder.query({
      query: ({ orgId, status = "all" }) => ({
        url: `/acc/get_organisation_requisitions/${orgId}`,
        params: { status },
        method: "GET",
      }),
      providesTags: (result, error, { orgId }) => [
        { type: "OrganisationJobs", id: orgId },
      ],
    }),
    updateOrganisationUpdatedScores: builder.mutation({
      query: ({ organisationId, updated_scores }) => ({
        url: `/acc/organisations/${organisationId}/updated-scores`,
        method: "PUT",
        body: {
          updated_scores,
        },
      }),
      invalidatesTags: (result, error, { organisationId }) => [
        { type: "Organisation", id: organisationId },
      ],
    }),

    getJobMatchedCandidates: builder.query({
      query: (jobId) => ({
        url: `/acc/get_job_matched_candidates/${jobId}`,
        method: "GET",
      }),
      providesTags: (result, error, jobId) => [
        { type: "JobMatchedCandidates", id: jobId },
      ],
    }),
    // Add inside the `endpoints: (builder) => ({ ... })` block
    updateCandidateStatus: builder.mutation({
      query: ({ candidateId, newStatus, reason }) => ({
        url: `/acc/matched_candidates/update_status_v1`,
        method: "POST",
        params: {
          candidate_id: candidateId,
          new_status: newStatus,
          reason: reason
        },
        invalidatesTags: (result, error, arg) => [
          { type: "CandidateDetail", id: arg.candidateId },
          { type: "CandidateStageTimeline", id: arg.candidateId },
        ],
      }),
      // if you tag candidate detail queries, invalidate here so the page refetches
      invalidatesTags: (result, error, arg) => [
        { type: "CandidateDetail", id: arg.candidateId },
        { type: "CandidateStageTimeline", id: arg.candidateId },
      ]
    }),
    updateInterviewRoundStatus: builder.mutation({
      query: ({ interviewId, status, reason }) => ({
        url: `/acc/interviews/${interviewId}/status_v1`,
        method: "PUT",
        params: { new_status: status, reason },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CandidateDetail", id: arg.candidateId },
        { type: "CandidateStageTimeline", id: arg.candidateId },
      ],
    }),

    updateInterviewResult: builder.mutation({
      query: ({ interviewId, result }) => ({
        url: `/acc/interviews/${interviewId}/status_v1`,
        method: "PUT",
        params: { result },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CandidateDetail", id: arg.candidateId },
        { type: "CandidateStageTimeline", id: arg.candidateId },
      ],
    }),
    rescheduleInterview: builder.mutation({
      query: ({ interviewId, body }) => ({
        url: `/acc/interview/${interviewId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CandidateDetail", id: arg.candidateId },
        { type: "CandidateStageTimeline", id: arg.candidateId },
      ],
    }),
    scheduleInterview: builder.mutation({
      query: ({ candidateId, payload }) => ({
        url: `/acc/matched_candidates/${candidateId}/schedule_interview`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CandidateDetail", id: arg.candidateId },
      ],
    }),
    getInterviewFullDetails: builder.query({
      query: (interviewId) => `/acc/interviews_details/${interviewId}`,
    }),
    getInterviewFeedback: builder.query({
      query: (interviewId) => `/acc/interview/${interviewId}/feedback`,
      providesTags: (result, error, interviewId) => [
        { type: "InterviewFeedback", id: interviewId },
      ],
    }),
    getEmployeesByRole: builder.query({
      query: ({ organisationId, employeeExcludeIds }) => ({
        url: "/acc/user-employees/by-role_v1",
        method: "GET",
        params: {
          organisation_id: organisationId,
          ...(employeeExcludeIds && {
            employee_exclude_ids: employeeExcludeIds,
          }),
        },
      }),
      providesTags: ["EmployeesByRole"],
    }),
    scheduleInterviewInCandidates: builder.mutation({
      query: (payload) => ({
        url: "/acc/schedule_interview",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CandidateStageTimeline", id: arg.matched_candidate_id },
        { type: "CandidateDetail", id: arg.matched_candidate_id },
      ],
    }),
    getCandidateDetail: builder.query({
      query: (matched_candidate_id) => ({
        url: `/acc/get_matched_candidates_details/${matched_candidate_id}`,
        method: "GET",
      }),
      providesTags: (result, error, matched_candidate_id) => [
        { type: "CandidateDetail", id: matched_candidate_id },
      ],
    }),

    getCandidateStageTimeline: builder.query({
      query: (candidateId) => ({
        url: `/acc/timeline/${candidateId}`,
        method: "GET",
      }),
      providesTags: (result, error, candidateId) => [
        { type: "CandidateStageTimeline", id: candidateId },
      ],
    }),

    getOrganisationCandidates: builder.query({
      query: (organisationId) => ({
        url: `/acc/get_candidates_by_organisation`,
        params: { organisation_id: organisationId },
      }),
    }),

    getOrganisationInterviews: builder.query({
      query: (jobId) => ({
        url: `/acc/get_organisation_interviews/${jobId}`,
        method: "GET",
      }),
    }),
    getJobInterviews: builder.query({
      query: (jobId) => ({
        url: `/acc/interviews/by-job/${jobId}`,
        method: "GET",
      }),
    }),

    getInterviewStatusDropdown: builder.query({
      query: () => ({
        url: "/acc/get_interview-status-dropdown",
        method: "GET",
      }),
    }),

    getAllInternalUsers: builder.query({
      query: () => ({ url: "/acc/get_all_internal_users", method: "GET" }),
      providesTags: ["InternalUsers"],
    }),

    assignOrganisation: builder.mutation({
      query: ({ user_id, organisation_id }) => ({
        url: "/acc/assign_organisation",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_id, organisation_id }).toString(),
      }),
      invalidatesTags: ["InternalUsers"],
    }),

    getOrganisationJobAnalytics: builder.query({
      query: ({ organisationId, groupBy = "month", status = "all" }) => ({
        url: `/acc/organisations/job-analytics_v2`,
        params: {
          organisation_id: organisationId,
          group_by: groupBy,
          status,
        },
      }),
    }),

    getMyProfile: builder.query({
      query: () => ({
        url: `/acc/get_my_profile`,
        method: "GET",
      }),
    }),

    updateMyProfile: builder.mutation({
      query: (body) => ({
        url: `/acc/update_my_profile`,
        method: "PUT",
        body,
      }),
    }),

    // ── Imported candidates with cursor pagination + filters ──
    getImportedCandidates: builder.query({
      query: (params) => ({
        url: `/acc/get_all_imported_candidates_with_pagination`,
        params: {
          limit: params.limit ?? 100,
          ...(params.cursor_created_at && {
            cursor_created_at: params.cursor_created_at,
          }),
          ...(params.cursor_id && { cursor_id: params.cursor_id }),
          ...(params.search && { search: params.search }),
          ...(params.domain && { domain: params.domain }),
          ...(params.function && { function: params.function }),
          ...(params.sub_function && { sub_function: params.sub_function }),
        },
      }),

    }),

    updateCandidateActiveStatus: builder.mutation({
      query: ({ candidate_id, is_active }) => ({
        url: `/acc/update_candidate_active_status`,
        method: "PUT",
        params: { candidate_id, is_active },
      }),
    }),

    uploadCandidateResume: builder.mutation({
      query: (formData) => ({
        url: "/acc/upload-resume-with-subfunction-or-job_id/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ImportedCandidates"],
    }),


    getCandidateDetails: builder.query({
      query: (candidateId) =>
        `/acc/get_candidate_complete_details/${candidateId}`,
    }),

    searchCandidates: builder.query({
      query: (search) => ({
        url: `/acc/search_candidates`,
        params: { search },
        method: "GET",
      }),
      // No providesTags — purely on-demand, managed by lazy query
    }),
    getResumeView: builder.query({
      query: (candidateId) => ({
        url: `/acc/resume_view_by_input/`,
        params: { candidate_id: candidateId },
        method: "GET",
      }),
    }),
    getJobDetails: builder.query({
      query: (jobId) => ({
        url: `/acc/account_manager/get_job_details/${jobId}`,
        method: "GET",
      }),
      providesTags: (result, error, jobId) => [
        { type: "JobDetails", id: jobId },
      ],
    }),
    getInterviewDetails: builder.query({
      query: (interviewId) => `/acc/get_interview-details/${interviewId}`,
    }),
    getCandidateSkillInfo: builder.query({
      query: (candidateId) => ({
        url: `/acc/get_candidate_skills/${candidateId}/skills`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,  // gives { candidate_id, sub_function, skills }
      providesTags: (result, error, candidateId) => [
        { type: "CandidateSkillInfo", id: candidateId }
      ],
    }),
    updateCandidateSkills: builder.mutation({
      query: ({ candidateId, body }) => ({
        url: `/acc/update_candidate_skills/${candidateId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { candidateId }) => [
        { type: "CandidateSkillInfo", id: candidateId }
      ],
    }),
  }),
});

// ── Export hooks ──
export const {
  useGetMyOrganisationsQuery,
  useGetOrganisationJobsQuery,
  useGetJobMatchedCandidatesQuery,
  useGetCandidateStageTimelineQuery,
  useGetCandidateDetailQuery,
  useGetOrganisationCandidatesQuery,
  useGetOrganisationInterviewsQuery,
  useGetJobInterviewsQuery,
  useGetInterviewStatusDropdownQuery,
  useAssignOrganisationMutation,
  useGetAllInternalUsersQuery,
  useGetOrganisationJobAnalyticsQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetImportedCandidatesQuery,
  useLazyGetImportedCandidatesQuery, //  lazy version for manual "Show More" fetching
  useUpdateCandidateActiveStatusMutation,
  useGetCandidateDetailsQuery,
  useUploadCandidateResumeMutation,
  useLazySearchCandidatesQuery,
  useLazyGetResumeViewQuery,
  useGetJobDetailsQuery,
  useGetInterviewDetailsQuery,
  useLazyGetInterviewDetailsQuery,
  useGetCandidateSkillInfoQuery,
  useUpdateCandidateSkillsMutation,
  useUpdateOrganisationUpdatedScoresMutation,
  useUpdateCandidateStatusMutation,
  useScheduleInterviewMutation,
  useGetEmployeesByRoleQuery,
  useLazyGetEmployeesByRoleQuery,
  useScheduleInterviewInCandidatesMutation,
  useRescheduleInterviewMutation,
  useUpdateInterviewRoundStatusMutation,
  useUpdateInterviewResultMutation,
  useLazyGetInterviewFullDetailsQuery,
  useLazyGetInterviewFeedbackQuery
} = requisitionApi;

```

---

## File: redux/services/subscriptions/subscriptions.js

```javascript
import { api } from "../api/api";

export const subscriptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrganisationSubscriptions: builder.query({
      query: () => ({
        url: "/acc/organisations/subscriptions",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),
    getOrganisationUsage: builder.query({
      query: (organisationId) => ({
        url: "/subscriptions/account-manager/organisations/" + organisationId + "/usage",
        method: "GET",
      }),
      providesTags: (result, error, organisationId) => [
        { type: "Subscriptions", id: organisationId },
      ],
    }),
    getOrganisationCurrentBilling: builder.query({
      query: (organisationId) => ({
        url: "/subscriptions/account-manager/organisations/" + organisationId + "/billing/current",
        method: "GET",
      }),
      providesTags: (result, error, organisationId) => [
        { type: "Subscriptions", id: organisationId },
      ],
    }),
    getOrganisationBillingEstimate: builder.query({
      query: (organisationId) => ({
        url: "/subscriptions/account-manager/organisations/" + organisationId + "/billing/estimate",
        method: "GET",
      }),
      providesTags: (result, error, organisationId) => [
        { type: "Subscriptions", id: organisationId },
      ],
    }),
    getOrganisationInvoices: builder.query({
      query: ({ organisationId, page = 1, pageSize = 12 }) => ({
        url: "/subscriptions/account-manager/organisations/" + organisationId + "/invoices",
        method: "GET",
        params: { page, page_size: pageSize },
      }),
      providesTags: (result, error, { organisationId }) => [
        { type: "Subscriptions", id: organisationId },
        { type: "Invoices", id: organisationId },
      ],
    }),
    cancelOrganisationSubscription: builder.mutation({
      query: (organisationId) => ({
        url: `/subscriptions/account-manager/organisations/${organisationId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    resumeOrganisationSubscription: builder.mutation({
      query: (organisationId) => ({
        url: `/subscriptions/account-manager/organisations/${organisationId}/resume-payg`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    reinitiateOrganisationTrial: builder.mutation({
      query: (organisationId) => ({
        url: `/subscriptions/account-manager/organisations/${organisationId}/reinitiate-trial`,
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    extendOrganisationTrial: builder.mutation({
      query: ({ organisationId, extension_days }) => ({
        url: `/acc/account-manager/organisations/${organisationId}/trial-extension`,
        method: "PUT",
        body: { extension_days },
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    getUpgradeRequests: builder.query({
      query: (status = "pending") => ({
        url: "/subscriptions/account-manager/upgrade-requests",
        method: "GET",
        params: status ? { status } : undefined,
      }),
      providesTags: ["Subscriptions"],
    }),
    reviewUpgradeRequest: builder.mutation({
      query: ({ requestId, decision, rejectionReason }) => ({
        url: "/subscriptions/account-manager/upgrade-requests/" + requestId + "/" + decision,
        method: "POST",
        ...(decision === "reject" ? { body: { rejection_reason: rejectionReason } } : {}),
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    upgradeOrganisationToPayg: builder.mutation({
      query: (body) => ({
        url: "/acc/superadmin_upgrade_payg",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useGetOrganisationSubscriptionsQuery,
  useGetOrganisationUsageQuery,
  useGetOrganisationCurrentBillingQuery,
  useGetOrganisationBillingEstimateQuery,
  useGetOrganisationInvoicesQuery,
  useCancelOrganisationSubscriptionMutation,
  useResumeOrganisationSubscriptionMutation,
  useReinitiateOrganisationTrialMutation,
  useExtendOrganisationTrialMutation,
  useGetUpgradeRequestsQuery,
  useReviewUpgradeRequestMutation,
  useUpgradeOrganisationToPaygMutation,
} = subscriptionsApi;

```

---

## File: redux/services/userManagement/userManagement.js

```javascript
// src/redux/services/userManagement.js
import { api } from "../api/api";

export const userManagement = api.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (body) => ({
        url: "/acc/create_internal_user",
        method: "POST",
        body,
      }),
      //   providesTags: ["EmployeeDetails"],
      invalidatesTags: ["InternalUsers"],
    }),
    updateUserByAdmin: builder.mutation({
      query: ({ userId, body }) => ({
        url: `/acc/update_user_details_by_admin/${userId}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

// ── Export hooks ──
export const { useCreateUserMutation, useUpdateUserByAdminMutation } = userManagement;

```

---

