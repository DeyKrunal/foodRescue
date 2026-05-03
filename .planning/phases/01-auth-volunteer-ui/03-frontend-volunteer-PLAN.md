# Plan: Frontend Volunteer & Sidebar

## Frontmatter
- wave: 2
- depends_on: [01-auth-PLAN.md, 02-backend-PLAN.md]
- files_modified:
  - f:/KrunalDey/foodRescue/frontend/src/pages/dashboard/volunteer/VolunteerDashboard.jsx
  - f:/KrunalDey/foodRescue/frontend/src/components/Sidebar.jsx
- autonomous: true

## Tasks
<task>
<read_first>f:/KrunalDey/foodRescue/frontend/src/pages/dashboard/volunteer/VolunteerDashboard.jsx</read_first>
<action>Implement the "Available Tasks" tab and the "Active Task" view with OTP verification and live tracking (simulated or real).</action>
<acceptance_criteria>
- `VolunteerDashboard.jsx` shows available deliveries.
- Volunteer can enter OTP and it calls `/api/deliveries/{id}/verify-otp`.
</acceptance_criteria>
</task>

<task>
<read_first>f:/KrunalDey/foodRescue/frontend/src/components/Sidebar.jsx</read_first>
<action>Ensure the Volunteer sidebar has all relevant links (Dashboard, My Tasks, Available Tasks, Profile) and highlight active link.</action>
<acceptance_criteria>
- `Sidebar.jsx` contains role-specific links for `VOLUNTEER`.
</acceptance_criteria>
</task>
