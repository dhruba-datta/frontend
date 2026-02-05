# MVP Flows

## Public job discovery

1. Guest visits /jobs
2. Search filters results
3. Click job card -> /jobs/:id
4. Apply button visible
5. If guest clicks Apply -> redirect to /login with returnUrl
6. After login -> return to /jobs/:id and proceed to apply

## Employer flow

1. Employer logs in
2. Creates job
   - backend calls AI to generate JD
3. Employer views applicants for job
4. Employer views matched talents list
5. Employer sends invitation to a talent

## Talent flow

1. Talent logs in
2. Views AI-ranked job feed
3. Applies to job
   - backend increments applications_count
   - backend stores source manual|invitation
4. Talent views invitations and accepts/declines
5. Talent views application history

## Deadline rule

- If deadline passed: backend rejects apply; frontend disables Apply button
