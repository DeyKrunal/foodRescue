# Plan: Volunteer Pages & Navigation Refinement

## Frontmatter
- wave: 1
- files_modified:
  - f:/KrunalDey/foodRescue/frontend/src/App.jsx
  - f:/KrunalDey/foodRescue/frontend/src/components/layout/Sidebar.jsx
- new_files:
  - f:/KrunalDey/foodRescue/frontend/src/pages/dashboard/volunteer/AvailableMissions.jsx
  - f:/KrunalDey/foodRescue/frontend/src/pages/dashboard/volunteer/MyDeliveries.jsx
- autonomous: true

## Tasks
<task>
<read_first>f:/KrunalDey/foodRescue/frontend/src/pages/dashboard/volunteer/VolunteerDashboard.jsx</read_first>
<action>Create `AvailableMissions.jsx` by extracting the "Available Near You" logic from `VolunteerDashboard.jsx`. Apply a clean, card-based grid layout.</action>
<acceptance_criteria>
- `AvailableMissions.jsx` displays available rescues.
- Missions can be accepted from this page.
</acceptance_criteria>
</task>

<task>
<read_first>f:/KrunalDey/foodRescue/frontend/src/pages/dashboard/volunteer/VolunteerDashboard.jsx</read_first>
<action>Create `MyDeliveries.jsx` by extracting the "My Active Missions" logic from `VolunteerDashboard.jsx`. Include the OTP verification and tracking features.</action>
<acceptance_criteria>
- `MyDeliveries.jsx` displays assigned tasks.
- Tracking and OTP verification work as implemented in the previous phase.
</acceptance_criteria>
</task>

<task>
<read_first>f:/KrunalDey/foodRescue/frontend/src/App.jsx</read_first>
<action>Register the new routes in `App.jsx`: `/volunteer/available` and `/volunteer/deliveries`.</action>
<acceptance_criteria>
- New routes are accessible and protected.
</acceptance_criteria>
</task>

<task>
<read_first>f:/KrunalDey/foodRescue/frontend/src/components/layout/Sidebar.jsx</read_first>
<action>Update volunteer links to point to the new dedicated pages.</action>
<acceptance_criteria>
- Sidebar links to `/volunteer/available` and `/volunteer/deliveries`.
- Active state is maintained correctly.
</acceptance_criteria>
</task>
