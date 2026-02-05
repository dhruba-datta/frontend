# Requirements

## Architecture requirements (mandatory)

- Two separate projects: frontend + backend REST API
- All core logic handled by backend
- Frontend communicates only via REST

## Security requirements (mandatory)

- Backend enforces authentication and authorization (role-based)
- Users cannot access data for other users
- Employer endpoints restricted to Employer role
- Talent endpoints restricted to Talent role

## AI requirements (mandatory)

- Use AI for job description generation
- Use AI (or prompt-based logic) for matching score 0-100

## Data requirements (critical)

- Application counter increments on successful apply
- Store application source: manual | invitation
- Invitation status: Pending/Accepted/Declined
- Deadline check disables apply after passed

## Design requirements

- Follow AIT style: corporate, clean, minimal
- Inter font
- Dark navy + white + blue palette
- No animations beyond hover
