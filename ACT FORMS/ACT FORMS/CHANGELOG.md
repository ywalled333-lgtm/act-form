# Changelog

## v2025.09.10-hr-users-fixes

- Fix supervisor routes and redirects to match actual filenames:
  - Use `supervisorrr_home_page.html`, `supervisorrr_employee_list.html`, `supervisorrr_evaluation_page.html`, and `maneger_supervisor_list.html`.
- Harden DOM event bindings in `app.js` (email/username/phone) with existence checks to avoid runtime errors on pages missing those inputs.
- HR Users Evaluation page (`hr_users_evaluation.html`):
  - Change table headers from Status to Department for all three lists.
  - Implement dynamic Department filter populated from users.
  - Update filtering to work by Role + Department + Search.
  - Ensure counts (Employees/Managers/HR) update safely.
- README updates to reflect correct supervisor page filenames.

Tag: `v2025.09.10-hr-users-fixes`