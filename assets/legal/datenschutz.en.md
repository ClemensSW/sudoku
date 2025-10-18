# Privacy Policy

**Last updated:** January 2025

## 1. Controller

Clemens Walther - AppVentures
Malzstraße 12
42119 Wuppertal
Germany
Email: info@playfusion-gate.de

## 2. General Information on Data Processing

### 2.1 Scope of Processing Personal Data

I generally process personal data of my users only to the extent necessary to provide a functional app and my content and services. The processing of personal data of my users is regularly carried out only with the user's consent. An exception applies in cases where prior consent cannot be obtained for factual reasons and the processing of data is permitted by law.

### 2.2 Legal Basis for Processing Personal Data

Where I obtain consent from the data subject for processing operations involving personal data, Article 6(1)(a) of the EU General Data Protection Regulation (GDPR) serves as the legal basis.

When processing personal data necessary for the performance of a contract to which the data subject is a party, Article 6(1)(b) GDPR serves as the legal basis. This also applies to processing operations necessary to carry out pre-contractual measures.

Where processing of personal data is necessary to comply with a legal obligation to which I am subject, Article 6(1)(c) GDPR serves as the legal basis.

In the event that vital interests of the data subject or another natural person require the processing of personal data, Article 6(1)(d) GDPR serves as the legal basis.

If processing is necessary to protect a legitimate interest of my company or a third party and the interests, fundamental rights, and freedoms of the data subject do not outweigh the first-mentioned interest, Article 6(1)(f) GDPR serves as the legal basis for processing.

## 3. Data Processing in Detail

### 3.1 Local Data Storage (without server transmission)

**Type of data:**
- Game progress and puzzle status
- Game statistics (solved games, best times, streaks)
- App settings (language, theme, help options)
- Experience points (XP) and level progress
- Unlocked content (colors, landscape segments, titles)
- Paused games
- Offline feedback queue

**Purpose:**
Local storage of your game progress and settings to ensure a seamless gaming experience.

**Legal basis:**
Art. 6(1)(b) GDPR (contract performance)

**Storage location:**
Exclusively local on your device (AsyncStorage). This data does **not** leave your device unless you create a user account.

**Storage duration:**
Until app uninstallation or manual deletion via app settings.

**Deletion:**
You can remove all local data at any time in the app under "Settings → Delete Data".

---

### 3.2 Cloud Synchronization (optional with user account)

**Requirement:**
You must actively sign in with Google or Apple to use cloud synchronization. Without signing in, all data remains local.

#### 3.2.1 Firebase Authentication (Sign-In)

**Type of data:**
- **Google Sign-In:** Email address, name, profile picture URL, unique user ID
- **Apple Sign-In:** Email address (optionally anonymized), name (optional), unique user ID

**Purpose:**
Authentication and management of your user account for cloud synchronization.

**Legal basis:**
Art. 6(1)(b) GDPR (contract performance - cloud sync service)

**Recipients:**
- Google Firebase Authentication (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland)
- For Google Sign-In: Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA)
- For Apple Sign-In: Apple Inc. (One Apple Park Way, Cupertino, CA 95014, USA)

**Server location:**
EU region (Frankfurt/Belgium) - **no third-country transfer for Firebase data**

**Storage duration:**
As long as your user account exists. All data will be permanently deleted upon account deletion.

#### 3.2.2 Firestore Cloud Database (Game Progress Synchronization)

**Type of data:**
- Game statistics (solved games, best times, XP, level, streaks)
- App settings (language, theme, help options)
- Unlocked colors
- Landscape progress
- Profile data (name, avatar, title)
- Timestamp of last synchronization

**Purpose:**
Automatic synchronization of your game progress across multiple devices. You can restore your data after reinstallation or on a new device.

**Legal basis:**
Art. 6(1)(b) GDPR (contract performance - cloud sync service)

**Recipient:**
Google Firestore (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland)

**Server location:**
EU region (Frankfurt/Belgium) - **no third-country transfer**

**Storage duration:**
As long as your user account exists. All data will be permanently deleted upon account deletion.

**Synchronization times:**
- When signing in (download + merge with local data)
- On app start (when signed in)
- When app goes to background (automatic backup)
- Manually via "Settings → Sync Now"

**Conflict resolution:**
If there are different data states between device and cloud, the newest version is automatically used (last-write-wins based on timestamps).

---

### 3.3 Feedback System

**Type of data:**
- Feedback rating (1-5 stars)
- Feedback category (problem, missing feature, idea, etc.)
- Feedback text (voluntary)
- Email address (optional, only if you want a response)
- **Automatically collected:** Platform (Android/iOS), app version, operating system version
- **When signed in:** Your user ID (for assignment, not identification)
- Timestamp of submission

**Purpose:**
Improvement of app quality, error analysis, feature development.

**Legal basis:**
Art. 6(1)(a) GDPR (consent by actively submitting feedback)

**Recipient:**
Google Firestore (Google Ireland Limited) - storage in EU region

**Access:**
Exclusively me personally (Clemens Walther) for evaluation

**Server location:**
EU region (Frankfurt/Belgium) - **no third-country transfer**

**Storage duration:**
- Feedback without email: Unlimited (anonymized)
- Feedback with email: Until deletion upon request or after 3 years

**Offline mode:**
If you submit feedback offline, it is stored locally and automatically transmitted once an internet connection is available.

**Anonymous feedback:**
You can also submit feedback without a user account. In this case, no user ID is stored.

---

### 3.4 In-App Purchases and Subscriptions

#### 3.4.1 RevenueCat (Payment Processing)

**Type of data:**
- Anonymized customer ID (generated by RevenueCat, not your email)
- Purchased products (one-time purchases: Coffee, Breakfast, Lunch, Feast / subscriptions: Monthly, Yearly)
- Purchase date and timestamp
- Platform (Android/iOS)
- Subscription status (active, expired, in grace period)
- Expiration date (for subscriptions)

**Purpose:**
Management and verification of your in-app purchases and subscriptions, provision of supporter features (2× EP bonus, image unlocks).

**Legal basis:**
Art. 6(1)(b) GDPR (contract performance)

**Recipient and processor:**
RevenueCat, Inc.
440 N Barranca Avenue #3601
Covina, CA 91723, USA
Privacy Policy: https://www.revenuecat.com/privacy

**⚠️ Third-Country Transfer (USA):**
RevenueCat hosts data on servers in the USA. Data transfer is based on **EU Standard Contractual Clauses (SCCs)** pursuant to Art. 46(2)(c) GDPR. RevenueCat has committed to complying with appropriate data protection standards.

More information: https://www.revenuecat.com/gdpr

**Storage duration:**
As long as the subscription is active or to fulfill legal retention obligations (tax law: 10 years from purchase date).

**No payment data:**
Your payment data (credit card, PayPal, etc.) is **not** shared with me or RevenueCat. Payment is processed directly through Google Play Store or Apple App Store.

#### 3.4.2 Google Play Store

For purchases via Google Play Store, Google's privacy policy additionally applies:
https://policies.google.com/privacy

**Recipient:**
Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland

**Type of data:**
- Google Account ID
- Purchase history
- Payment information (managed by Google)

#### 3.4.3 Apple App Store (planned for iOS version)

For purchases via Apple App Store, Apple's privacy policy additionally applies:
https://www.apple.com/legal/privacy/

**Recipient:**
Apple Inc., One Apple Park Way, Cupertino, CA 95014, USA

---

## 4. Processors and Third Parties

### 4.1 Google Firebase / Firestore

**Service provider:**
Google Ireland Limited
Gordon House, Barrow Street
Dublin 4, Ireland

**Services:**
- Firebase Authentication (user account management)
- Cloud Firestore (cloud database for game progress synchronization)

**Server location:**
EU region (europe-west1: Belgium / europe-west3: Frankfurt)

**Data processing agreement:**
Google Cloud Platform Data Processing Terms:
https://cloud.google.com/terms/data-processing-terms

**Privacy policy:**
https://policies.google.com/privacy

**No Analytics:**
Google Analytics is **intentionally disabled** in this app. **No** usage data is collected for tracking purposes.

### 4.2 RevenueCat

**Service provider:**
RevenueCat, Inc.
440 N Barranca Avenue #3601
Covina, CA 91723, USA

**Services:**
In-app purchase management, subscription management

**Server location:**
USA

**Third-country transfer:**
Based on EU Standard Contractual Clauses (SCCs) pursuant to Art. 46(2)(c) GDPR

**Privacy policy:**
https://www.revenuecat.com/privacy

**GDPR information:**
https://www.revenuecat.com/gdpr

---

## 5. Data Disclosure

Data is disclosed to third parties **only** in the following cases:

1. **Processors** (see Section 4): Firebase/Firestore (EU), RevenueCat (USA)
2. **Payment providers**: Google Play Store, Apple App Store (only for in-app purchases)
3. **Legal obligations**: When I am legally required to do so (e.g., official inquiries)

Your data is **never** sold or shared with third parties for advertising purposes.

---

## 6. Third-Country Transfer

### 6.1 RevenueCat (USA)

When purchasing in-app products or subscriptions, data is transmitted to RevenueCat in the USA. The USA is considered a third country without an adequate level of data protection according to GDPR.

**Legal basis:**
Art. 46(2)(c) GDPR - **EU Standard Contractual Clauses (SCCs)**

**Guarantees:**
RevenueCat has contractually committed to appropriate data protection standards. You can find the SCCs here:
https://www.revenuecat.com/gdpr

### 6.2 No Other Third-Country Transfers

Firebase/Firestore servers are located in the **EU** (Frankfurt/Belgium). There is **no** third-country transfer for cloud sync data.

---

## 7. Data Security

I implement technical and organizational security measures to protect your data against accidental or intentional manipulation, loss, destruction, or access by unauthorized persons:

- **Encryption:** All data transmissions are encrypted (HTTPS/TLS)
- **Firebase Security Rules:** Access to cloud data only with valid authentication
- **No cookies/trackers:** This app does not use cookies or tracking technologies
- **No Analytics:** No Google Analytics or similar tracking services

---

## 8. Storage Duration

| Data Type | Storage Duration |
|-----------|------------------|
| Local data (AsyncStorage) | Until app uninstallation or manual deletion |
| Firebase Auth (user account) | Until account deletion |
| Cloud sync data (Firestore) | Until account deletion |
| Feedback without email | Unlimited (anonymized) |
| Feedback with email | 3 years or until deletion upon request |
| RevenueCat purchase data | 10 years (tax retention obligation) |
| In-app purchases (active subscriptions) | As long as subscription is active |

---

## 9. Your Rights (Data Subject Rights)

You have the following rights regarding your personal data:

### 9.1 Right of Access (Art. 15 GDPR)

You have the right to request confirmation from me as to whether personal data concerning you is being processed. If this is the case, you have a right to information about this personal data.

**How to exercise your right:**
- Email: info@playfusion-gate.de
- In the app: Settings → Account → Export Data

### 9.2 Right to Rectification (Art. 16 GDPR)

You have the right to request the rectification of inaccurate personal data concerning you.

**How to exercise your right:**
- Profile name & avatar: In the app under "Settings → Profile"
- Other data: Email to info@playfusion-gate.de

### 9.3 Right to Erasure (Art. 17 GDPR)

You have the right to request the deletion of your personal data.

**How to exercise your right:**

**Option 1: Delete local data (without account):**
- Settings → Legal & Data → Delete All Local Data
- Deletes all game progress, statistics, and settings from your device

**Option 2: Complete account deletion (with account):**
- Settings → Account → Delete Account
- **Permanently deletes:**
  - Firebase Auth account
  - All cloud data (Firestore)
  - All local data
  - Google/Apple access is revoked

**⚠️ Important:** Purchase data (RevenueCat) is retained for 10 years for tax reasons. However, this data is anonymized and can no longer be associated with your account.

### 9.4 Right to Restriction of Processing (Art. 18 GDPR)

You have the right to request the restriction of processing of your personal data.

**How to exercise your right:**
Email: info@playfusion-gate.de

### 9.5 Right to Data Portability (Art. 20 GDPR)

You have the right to receive your data in a structured, commonly used, and machine-readable format.

**How to exercise your right:**
- In the app: Settings → Account → Export Data (JSON format)
- By email: info@playfusion-gate.de

### 9.6 Right to Object (Art. 21 GDPR)

You have the right to object to the processing of your personal data insofar as it is based on Art. 6(1)(f) GDPR (legitimate interests).

**How to exercise your right:**
Email: info@playfusion-gate.de

### 9.7 Right to Withdraw Consent (Art. 7(3) GDPR)

You have the right to withdraw your consent at any time. The lawfulness of processing carried out on the basis of consent until withdrawal is not affected.

**Example:**
- Disable cloud sync: Simply sign out (data remains on device)
- Withdraw feedback consent: Email to info@playfusion-gate.de

### 9.8 Right to Lodge a Complaint with a Supervisory Authority (Art. 77 GDPR)

You have the right to lodge a complaint with a data protection supervisory authority regarding the processing of your personal data by me.

**Responsible supervisory authority:**
State Commissioner for Data Protection and Freedom of Information North Rhine-Westphalia (LDI NRW)
Kavalleriestraße 2-4
40213 Düsseldorf, Germany
Phone: +49 211 38424-0
Email: poststelle@ldi.nrw.de
https://www.ldi.nrw.de/

---

## 10. No Cookies and Tracking

This app does **not** use **cookies**, **tracking technologies**, or **Google Analytics** or similar services. Your usage is **not** recorded for analysis purposes.

The only automatically collected data is:
- Device metadata for feedback (platform, OS version, app version) for error analysis
- Sync timestamps for conflict resolution in cloud sync

---

## 11. Changes to this Privacy Policy

I reserve the right to adapt this privacy policy to reflect changes in legislation or changes to the app and data processing. However, this only applies to statements about data processing. If the consent of users is required or components of the privacy policy contain regulations regarding the contractual relationship with users, changes will only be made with the consent of users.

Users are requested to regularly inform themselves about the content of the privacy policy. You can find the current version in the app under "Settings → Legal → Privacy".

---

## 12. Contact for Privacy Inquiries

For questions about data protection, exercising your rights, or complaints, you can contact me at any time:

**Email:** info@playfusion-gate.de

**Postal address:**
Clemens Walther - AppVentures
Malzstraße 12
42119 Wuppertal
Germany

I will respond to your inquiry within **30 days**.
