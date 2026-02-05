# PRD: TalentX MVP (Assessment Build)

## Objective

Build a simplified AI job marketplace connecting Employers with AI/Data Talents under time pressure.

## Roles

- Guest: browse jobs, view details, cannot apply
- Employer: create jobs, view applicants, view matched talents, invite talent
- Talent: apply to jobs, see invitations, accept/decline, see application history

## Must-have features (MVP)

Public

- Job listing page (public)
  - Search by title/role
  - Each card shows: title, company, application count
- Job detail page (public deep link)
  - Apply button
  - If deadline passed: apply disabled
  - If guest clicks apply: redirect to login, then return to same job and continue application

Auth + onboarding

- Signup/login
- Role selection during onboarding (Employer or Talent)
- Role persisted in DB and enforced by backend
- UI changes based on role

Employer flow

- Create job (title, tech stack CSV, deadline)
- Use AI to generate job description
- View applicants for a job
  - Applicant name
  - Source: manual or invitation
- View top matched talents list
  - Name
  - Match score (0-100)
- Invite talent
  - Status: Pending, Accepted, Declined

Talent flow

- AI job match feed: jobs ranked by relevance score
- Invitations list with accept/decline
  - Shows: company, job title, deadline
- Application history
  - Job, company, source (manual/invitation)

Critical data rules

- Application counter increments immediately after successful application
- Store application source: manual | invitation

## Nice to have

- Invitation badge count indicator (not realtime required)

## Out of scope

- Realtime sockets
- Advanced admin panels
- Payments
- Complex messaging system
