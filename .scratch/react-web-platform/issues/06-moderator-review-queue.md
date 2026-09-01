# 06: Moderator Review Queue & Editorial Publishing Engine

**What to build:**
Desktop moderation interface for authorized moderators: full photo inspection, 1-click Approve & Publish to active publications, Reject with reason archive, and Request Revision feedback notes.

**Blocked by:** 04: Community Submission Intake with Client WebP Compression, 05: Concealed Admin Authentication & Cloaked Routing

**Status:** ready-for-agent

- [ ] Real-time queue of pending submissions across all Zimbabwean locations
- [ ] Submission inspector with photo viewer, seller contact details, and price verification
- [ ] 1-click Approve action atomically writing active publication to `locations/{locationId}/publications/{id}`
- [ ] Reject modal requiring rejection rationale and updating submission status
- [ ] Request Revision modal capturing moderator feedback note for submitter updates
