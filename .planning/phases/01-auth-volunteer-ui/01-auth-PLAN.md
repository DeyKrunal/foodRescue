# Plan: Authentication Fixes

## Frontmatter
- wave: 1
- files_modified:
  - f:/KrunalDey/foodRescue/frontend/src/pages/Login.jsx
  - f:/KrunalDey/foodRescue/frontend/src/pages/Register.jsx
- autonomous: true

## Tasks
<task>
<read_first>f:/KrunalDey/foodRescue/frontend/src/pages/Login.jsx</read_first>
<action>Import `Swal` from `sweetalert2` in `Login.jsx` and ensure it is available for all `Swal.fire` calls.</action>
<acceptance_criteria>
- `Login.jsx` contains `import Swal from 'sweetalert2';`
- Login page does not crash when `Swal.fire` is called.
</acceptance_criteria>
</task>

<task>
<read_first>f:/KrunalDey/foodRescue/frontend/src/pages/Register.jsx</read_first>
<action>Check `Register.jsx` for missing `Swal` imports and add them if necessary.</action>
<acceptance_criteria>
- `Register.jsx` contains `import Swal from 'sweetalert2';` if `Swal` is used.
</acceptance_criteria>
</task>
