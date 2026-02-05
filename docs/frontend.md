# Frontend Plan (Next.js)

## Design system (AIT aligned)

Colors:

- bg: #0B1220
- surface: #FFFFFF
- primary: #2563EB
- text: #0F172A
- muted: #64748B
- border: #E5E7EB

Typography:

- Inter via next/font
- Headings medium weight
- Body regular weight

UI rules:

- Simple navbar
- Card-based layout
- Clean forms with labels
- No fancy effects

## Pages (minimum)

Public

- /jobs (listing + search)
- /jobs/[id] (detail + apply gate)

Auth

- /login
- /signup (includes role selection)

Employer

- /employer/jobs/new
- /employer/jobs (list)
- /employer/jobs/[id]/applicants
- /employer/matches
- /employer/invitations (optional)

Talent

- /talent/feed (ranked jobs)
- /talent/invitations
- /talent/applications

## Auth gate behavior

- Guest clicks Apply:
  - store returnUrl=/jobs/[id]
  - redirect to /login
  - after login, redirect back and continue apply

## Frontend API usage

- All data comes from backend REST API
- Store JWT in httpOnly cookie (preferred) or localStorage (only if needed quickly)
