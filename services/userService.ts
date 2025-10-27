// This mock service is no longer needed.
// User profile data is now sourced directly from the Firebase Authentication context,
// which is the single source of truth for the authenticated user's identity.
// For more extensive user profile information (e.g., bio, preferences),
// a dedicated user profile microservice would be created, and its API
// would be called from a new version of this file using the apiClient.
