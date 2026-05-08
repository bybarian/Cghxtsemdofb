# Security Specification - Clinical Coaching Digital Handbook

## 1. Data Invariants
- A `FeedbackResult` must be created by an authenticated user who is the `evaluatorId`.
- `totalScore` and `maxScore` must be non-negative numbers.
- `createdAt` must be the server time.
- `facilitator` and `trainee` names are required and must be strings of reasonable length.
- `scores` and `categoryScores` must be objects.

## 2. The "Dirty Dozen" Payloads (Denial Expected)
1. **Identity Spoofing**: Create a result with `evaluatorId` set to another user's UID.
2. **Anonymous Write**: Attempt to create a result without being signed in.
3. **Ghost Field Injection**: Add `isAdmin: true` to the result payload.
4. **Timestamp Manipulation**: Provide a client-side `createdAt` date instead of `serverTimestamp()`.
5. **Score Overload**: `totalScore` set to a massive value or negative number.
6. **Type Mismatch**: `facilitator` sent as a number.
7. **Resource Poisoning**: `trainee` name string larger than 1KB.
8. **Orphaned Write**: (N/A for this structure as it's a top-level collection).
9. **Update Hijack**: Attempt to update an existing result (updates should be forbidden).
10. **Delete Attempt**: Attempt to delete a result.
11. **Blanket Read Breach**: Attempt to list results without being signed in.
12. **Metadata Tampering**: Attempting to change `evaluatorEmail` during an update (if updates were allowed).

## 3. Test Runner (Conceptual)
All the above operations must return `PERMISSION_DENIED`.
