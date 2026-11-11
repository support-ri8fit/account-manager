# User and Role Management Forms

Generated Date: 2026-11-03T09:30:42.959Z

Total Source Files: 2

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

