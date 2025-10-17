# Firestore Security Rules

This document contains the Firestore Security Rules for the Sudoku Duo app.

## Overview

The app uses Firestore for:
1. **User Data Sync** - Game stats, settings, color unlocks (users/{userId}/data)
2. **User Profile** - Display name, avatar, title (users/{userId}/profile)
3. **Feedback System** - Anonymous feedback collection (feedback/{feedbackId})

## Security Principles

- ✅ Users can only read/write their own data
- ✅ Anonymous feedback is allowed (write-only)
- ✅ Feedback is read-only for admins
- ✅ Data validation enforced server-side
- ✅ No analytics/tracking data stored

## Complete Security Rules

Copy and paste these rules into the Firebase Console → Firestore Database → Rules:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ===== Helper Functions =====

    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Check if user is accessing their own data
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Check if request contains valid timestamp
    function hasValidTimestamp() {
      return request.resource.data.updatedAt is timestamp
        || request.resource.data.updatedAt is int;
    }

    // ===== User Data Collection =====

    // Main user document (contains profile)
    match /users/{userId} {
      // Users can read/write their own profile
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);

      // User data sub-collection (stats, settings, landscapes, colorUnlock)
      match /data/{document=**} {
        // Users can read/write their own data
        allow read: if isOwner(userId);
        allow write: if isOwner(userId) && hasValidTimestamp();
      }
    }

    // ===== Feedback Collection =====

    // Feedback documents (anonymous allowed)
    match /feedback/{feedbackId} {
      // Allow anonymous writes (create only, no updates/deletes)
      allow create: if validateFeedback();

      // No public read access (only admins via Firebase Console)
      allow read: if false;
      allow update: if false;
      allow delete: if false;

      // Validation function for feedback
      function validateFeedback() {
        let data = request.resource.data;

        return (
          // Required fields
          data.rating is int &&
          data.rating >= 1 &&
          data.rating <= 5 &&

          data.details is string &&
          data.details.size() >= 1 &&
          data.details.size() <= 5000 &&

          data.platform is string &&
          data.platform in ['android', 'ios', 'web'] &&

          data.appVersion is string &&
          data.appVersion.size() >= 1 &&
          data.appVersion.size() <= 50 &&

          data.createdAt is timestamp &&

          data.status == 'new' &&

          // Optional fields (validate if present)
          (!('category' in data) || data.category in ['problem', 'missing', 'idea', 'complicated', 'other']) &&
          (!('userId' in data) || data.userId is string || data.userId == null) &&
          (!('userEmail' in data) || data.userEmail is string || data.userEmail == null) &&
          (!('deviceInfo' in data) || data.deviceInfo is string) &&
          (!('sentViaEmail' in data) || data.sentViaEmail is bool) &&
          (!('emailSentAt' in data) || data.emailSentAt is timestamp)
        );
      }
    }

    // ===== Deny all other access =====

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Rule Breakdown

### 1. User Data Rules

**Path:** `users/{userId}` and `users/{userId}/data/{document}`

**Permissions:**
- ✅ Read/Write: Only the authenticated user (owner)
- ❌ Public access: Denied
- ⚠️ Validation: `updatedAt` timestamp required on writes

**What's protected:**
- Profile (displayName, email, avatar, title, etc.)
- Stats (gamesPlayed, totalXP, dailyStreak, etc.)
- Settings (darkMode, language, vibration, etc.)
- Landscapes (unlocked segments, favorites)
- ColorUnlock (selected color, unlocked colors)

### 2. Feedback Rules

**Path:** `feedback/{feedbackId}`

**Permissions:**
- ✅ Create: Anyone (anonymous allowed)
- ❌ Read: Denied (admin-only via Console)
- ❌ Update: Denied (immutable)
- ❌ Delete: Denied (permanent)

**Validation:**
- `rating`: Must be 1-5
- `details`: Required, 1-5000 characters
- `platform`: Must be 'android', 'ios', or 'web'
- `appVersion`: Required, max 50 characters
- `createdAt`: Required timestamp
- `status`: Must be 'new' on creation
- `category`: Optional, must be valid category
- `userId`: Optional (can be null for anonymous)
- `userEmail`: Optional (can be null)
- `deviceInfo`: Optional string
- `sentViaEmail`: Optional boolean
- `emailSentAt`: Optional timestamp

**Why anonymous write is safe:**
- ✅ Write-only (no reads = no data leakage)
- ✅ Strict validation prevents abuse
- ✅ Cannot modify/delete after creation
- ✅ Rate limiting handled by app logic
- ✅ Admin can review via Firebase Console

### 3. Default Deny

All other paths are denied by default for security.

## Deployment Instructions

### Step 1: Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** in the sidebar

### Step 2: Update Rules

1. Click on the **Rules** tab
2. Copy the complete rules from above
3. Paste into the editor
4. Click **Publish**

### Step 3: Verify Rules

After publishing, you should see:
- ✅ Rules published successfully
- ✅ No syntax errors

### Step 4: Test Rules

You can test the rules using the Firebase Console's **Rules Playground**:

**Test Case 1: User can read own data**
```
Operation: get
Path: /users/{your-test-uid}/data/stats
Auth: Firebase Auth (your-test-uid)
Result: ✅ Allow
```

**Test Case 2: User cannot read other user's data**
```
Operation: get
Path: /users/other-uid/data/stats
Auth: Firebase Auth (your-test-uid)
Result: ❌ Deny
```

**Test Case 3: Anonymous can create feedback**
```
Operation: create
Path: /feedback/test-feedback-id
Auth: None (unauthenticated)
Data: { rating: 5, details: "Great app!", platform: "android", ... }
Result: ✅ Allow
```

**Test Case 4: Cannot read feedback**
```
Operation: get
Path: /feedback/test-feedback-id
Auth: Any
Result: ❌ Deny
```

## Admin Access

### Viewing Feedback

Admins can view feedback via the Firebase Console:

1. Go to **Firestore Database** → **Data** tab
2. Navigate to `feedback` collection
3. View all feedback documents
4. Filter by `status`, `rating`, `platform`, etc.

### Feedback Management

You can manually update feedback status in the Console:

- `new` → User just submitted
- `reviewed` → Admin has reviewed
- `resolved` → Issue has been addressed

### Exporting Feedback

To export feedback for analysis:

1. Use Firebase Console → Firestore → Export/Import
2. Or use Firebase Admin SDK to query and export
3. Or use a Cloud Function to periodically export to Google Sheets

## Rate Limiting

**Client-side protection:**
- App should limit feedback submissions (e.g., 1 per hour)
- Implemented in ReviewManager.tsx
- Tracked via AsyncStorage

**Server-side protection (optional):**
- Firebase App Check can prevent abuse
- Cloud Functions can add rate limiting
- Consider implementing if spam becomes an issue

## Privacy Considerations

### Anonymous Feedback
- `userId` is optional (can be null)
- `userEmail` is optional (only if user provides it)
- No tracking of IP addresses or device IDs
- Complies with GDPR and privacy laws

### Data Retention
- Feedback is stored indefinitely by default
- Consider implementing auto-deletion after X months
- Can be done via Cloud Functions scheduled task

### User Data Deletion
- When user deletes account, all user data is deleted
- Feedback is NOT deleted (anonymous feedback is preserved)
- If feedback contains userEmail, it should be anonymized

## Troubleshooting

### "Missing or insufficient permissions" error

**Cause:** User trying to access data they don't own

**Fix:** Ensure `request.auth.uid` matches the document path

### "PERMISSION_DENIED: Missing or insufficient permissions"

**Cause:** Security rules not published or incorrect

**Fix:**
1. Verify rules are published in Firebase Console
2. Check for syntax errors in rules
3. Test rules using Rules Playground

### Feedback submission fails

**Cause:** Validation error in feedback data

**Fix:**
1. Check all required fields are present
2. Verify data types match rules
3. Check `createdAt` is a valid timestamp
4. Ensure `rating` is between 1-5

## Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Rules Playground Guide](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-conditions)
