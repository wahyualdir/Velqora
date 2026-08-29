# FASE 35: Security Architecture & Tenant Isolation Report

## 1. Threat Model & Defense Mechanisms

### 1.1 Insecure Direct Object References (IDOR) & Forged User IDs
* **Risk**: Malicious client sends a forged `user_id` inside JSON payload to read or mutate another student's schedule or outcomes.
* **Defense Layer**:
  1. `scheduleBatchSaveRequestSchema` and other Zod validation schemas strictly omit or strip client-supplied `user_id`.
  2. Server actions (`src/actions/schedule-actions.ts`) authenticate the user via `supabase.auth.getUser()`.
  3. The database mutation strictly binds `user_id: user.id` from the verified session token.

### 1.2 Multi-Tenant Data Isolation & Row-Level Security (RLS)
* All tables (`schedules`, `schedule_snapshots`, `optimization_proposals`, `session_outcomes`, `recommendation_outcomes`, `schedule_preferences`) have RLS policies configured:
  ```sql
  CREATE POLICY "Users can only access own schedules"
  ON schedules FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
  ```

### 1.3 Path Traversal & Malicious File Uploads
* **Filename Sanitization**: `sanitizeFileName()` strips all directory traversal sequences (`..`), null bytes (`\0`), backslashes, and forward slashes.
* **Upload Size Hard Cap**: File uploads $> 15$ MB (`ACADEMIC_CONSTANTS.MAX_SCHEDULE_UPLOAD_SIZE_BYTES`) are rejected immediately before parser execution.

### 1.4 Sensitive Metadata Scrubbing in Telemetry & Observability
* `sanitizeMetadata()` recursively redacts keys matching sensitive patterns (`password`, `token`, `secret`, `api_key`, `cookie`, `gemini_api_key`, `service_role_key`).
* Log output never leaks authentication tokens or database connection strings.

### 1.5 Optimistic Concurrency & Replay Attack Protection
* Mutations via `APPLY_OPTIMIZATION` must provide a valid `parentSnapshotHash`.
* If database state changed in the interim, the proposal is marked `STALE` and the mutation is rejected by `evaluateApprovalGate()`, preventing overwriting concurrent edits.
