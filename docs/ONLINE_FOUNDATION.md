# Nexus Games — Online Foundation (2.5.0)

## Current implementation
- `GET /api/health` returns a no-store health document.
- `src/lib/online-contract.ts` defines versioned profile and save-envelope contracts.
- `/online` displays the API check and the capabilities that are not enabled.
- The Network Transfer action exports an allowlisted set of browser-local values to a versioned JSON file. It does not upload anything.

## Explicitly not implemented
There is no account registration, login, session, database, cloud save, public gallery, global leaderboard, or user-to-user messaging in 2.5.0. The health endpoint only confirms that this Next.js application can answer an HTTP request.

## Future backend requirements
Before enabling accounts or synchronization:
1. Select and provision a managed database.
2. Implement authentication with secure, HTTP-only session cookies and server-side authorization.
3. Enforce ownership checks on every profile, save, and creation operation.
4. Validate payload schemas and impose request size/rate limits.
5. Add privacy, account deletion, export, moderation, and abuse-reporting workflows.
6. Never expose service-role credentials or database secrets to browser code.
7. Add tests for cross-account access, invalid payloads, and backup compatibility.

## Data contract
All future network payloads carry a schema version and an ISO-8601 update timestamp. Game saves identify their game using a stable ID. Version 1 contracts are defined in `src/lib/online-contract.ts`.

## Local transfer format
The `nexus-games-network-transfer` JSON file is a local portability export, not a server backup. Only allowlisted localStorage keys are included. Import is intentionally not implemented in this release.
