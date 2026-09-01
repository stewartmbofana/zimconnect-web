# 04: Community Submission Intake with Client WebP Compression

**What to build:**
Public listing submission wizard enabling users to post community notices and marketplace items with on-device `<200KB` WebP photo compression, phone binding, and transactional writes to the Firestore pending moderation queue.

**Blocked by:** 02: Location Scoping & Public Directory Feeds

**Status:** ready-for-agent

- [ ] Multi-step submission wizard (category, details, pricing, location)
- [ ] Client-side photo compression converting uploads to `<200KB` WebP images
- [ ] Submitter phone verification and Zimbabwean contact format normalization
- [ ] Successful submission writes to `locations/{locationId}/submissions/{id}` with `pending` status and optimistic success confirmation
