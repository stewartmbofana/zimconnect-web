# 05: Concealed Admin Authentication & Cloaked Routing

**What to build:**
Strict concealment of administrative features using dynamic code splitting (`React.lazy()`) to isolate admin chunks, 404 cloak route masking (rendering standard 404 Not Found to unauthorized visitors with zero login hints), unadvertised stealth footer trigger, and Firebase Auth with Custom Claims (`role: 'admin' | 'moderator'`).

**Blocked by:** 01: Project Scaffolding & Firebase Hosting Delivery

**Status:** ready-for-agent

- [ ] Dynamic code chunking isolating all admin components from the public bundle
- [ ] Route guard rendering standard 404 Not Found for unauthenticated / non-admin visits
- [ ] Stealth footer interaction trigger activating concealed moderator authentication modal
- [ ] Firebase Auth integration validating `role: 'admin' | 'moderator'` Custom Claims
